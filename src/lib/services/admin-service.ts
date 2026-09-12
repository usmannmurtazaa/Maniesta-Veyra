/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, OrderStatus, CustomOrderStatus, ReviewStatus, UserRole } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';

const LOW_STOCK_THRESHOLD = 5; // default threshold

export class AdminService {
  // ---------- DASHBOARD ----------
  async getDashboardStats() {
    const [
      totalSales,
      totalOrders,
      pendingOrders,
      totalCustomers,
      totalProducts,
      lowStockProducts,
      customOrdersPending,
    ] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
      prisma.product.count({ where: { isActive: true, deletedAt: null } }),
      prisma.productVariant.count({ where: { stock: { lte: LOW_STOCK_THRESHOLD } } }),
      prisma.customOrderTracking.count({ where: { status: CustomOrderStatus.PENDING_REVIEW } }),
    ]);

    return {
      totalSales: totalSales._sum.total?.toNumber() ?? 0,
      totalOrders,
      pendingOrders,
      totalCustomers,
      totalProducts,
      lowStockProducts,
      customOrdersPending,
    };
  }

  // ---------- PRODUCTS ----------
  async listProducts(page: number, limit: number, search?: string) {
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { skuPrefix: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: true,
          images: true,
          variants: {
            include: { color: true, size: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getProduct(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        colors: true,
        sizes: true,
        variants: { include: { color: true, size: true } },
        images: true,
      },
    });
  }

  async createProduct(input: any) {
    return prisma.product.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        categoryId: input.categoryId,
        basePrice: new Prisma.Decimal(input.basePrice),
        compareAtPrice: input.compareAtPrice ? new Prisma.Decimal(input.compareAtPrice) : null,
        skuPrefix: input.skuPrefix,
        tags: input.tags || [],
        material: input.material,
        careInstructions: input.careInstructions,
        colors: { create: input.colors.map((c: any) => ({ name: c.name, hexCode: c.hexCode, sortOrder: c.sortOrder || 0 })) },
        sizes: { create: input.sizes.map((s: any) => ({ label: s.label, sortOrder: s.sortOrder || 0 })) },
        images: { create: input.images.map((img: any) => ({ url: img.url, altText: img.altText, isPrimary: img.isPrimary || false, sortOrder: img.sortOrder || 0 })) },
      },
      include: { colors: true, sizes: true, images: true, category: true },
    });
  }

    async updateProduct(
    id: string,
    input: {
      name: string;
      slug: string;
      description: string;
      categoryId: string;
      basePrice: number;
      compareAtPrice?: number | null;
      skuPrefix: string;
      tags: string[];
      material?: string;
      careInstructions?: string;
      images?: { url: string; altText?: string; isPrimary?: boolean }[];
      newColors?: { name: string; hexCode: string }[];
      newSizes?: { label: string }[];
    }
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. Update scalar fields
      const product = await tx.product.update({
        where: { id },
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description,
          categoryId: input.categoryId,
          basePrice: new Prisma.Decimal(input.basePrice),
          compareAtPrice:
            input.compareAtPrice != null
              ? new Prisma.Decimal(input.compareAtPrice)
              : null,
          skuPrefix: input.skuPrefix,
          tags: input.tags,
          material: input.material,
          careInstructions: input.careInstructions,
        },
      });

      // 2. Replace images if provided (delete all + recreate).
      //    Images don't interact with variants, so this is safe.
      if (input.images !== undefined) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (input.images.length > 0) {
          await tx.productImage.createMany({
            data: input.images.map((img, i) => ({
              productId: id,
              url: img.url,
              altText: img.altText ?? null,
              isPrimary: img.isPrimary ?? i === 0,
              sortOrder: i,
            })),
          });
        }
      }

      // 3. Add new colors (skip duplicates by name) and create variants
      //    for all existing sizes with stock 0. Admin sets stock later via
      //    the inventory page.
      if (input.newColors && input.newColors.length > 0) {
        const existingColors = await tx.productColor.findMany({
          where: { productId: id },
          select: { name: true },
        });
        const existingNames = new Set(existingColors.map((c) => c.name));
        const existingSizes = await tx.productSize.findMany({
          where: { productId: id },
          orderBy: { sortOrder: 'asc' },
        });

        for (const newColor of input.newColors) {
          if (existingNames.has(newColor.name)) continue;

          const createdColor = await tx.productColor.create({
            data: {
              productId: id,
              name: newColor.name,
              hexCode: newColor.hexCode,
            },
          });

          // Create variants for each existing size
          for (const size of existingSizes) {
            const sku = `${input.skuPrefix}-${newColor.name.replace(/\s+/g, '').slice(0, 3).toUpperCase()}-${size.label}`;
            // Skip if SKU already exists (defensive)
            const existing = await tx.productVariant.findUnique({ where: { sku } });
            if (existing) continue;

            await tx.productVariant.create({
              data: {
                productId: id,
                colorId: createdColor.id,
                sizeId: size.id,
                sku,
                stock: 0,
                lowStockThreshold: 5,
                isActive: true,
              },
            });
          }
        }
      }

      // 4. Add new sizes (skip duplicates by label) and create variants
      //    for all existing colors with stock 0.
      if (input.newSizes && input.newSizes.length > 0) {
        const existingSizes = await tx.productSize.findMany({
          where: { productId: id },
          select: { label: true },
        });
        const existingLabels = new Set(existingSizes.map((s) => s.label));
        const existingColors = await tx.productColor.findMany({
          where: { productId: id },
          orderBy: { sortOrder: 'asc' },
        });

        for (const newSize of input.newSizes) {
          if (existingLabels.has(newSize.label)) continue;

          const createdSize = await tx.productSize.create({
            data: {
              productId: id,
              label: newSize.label,
            },
          });

          for (const color of existingColors) {
            const sku = `${input.skuPrefix}-${color.name.replace(/\s+/g, '').slice(0, 3).toUpperCase()}-${newSize.label}`;
            const existing = await tx.productVariant.findUnique({ where: { sku } });
            if (existing) continue;

            await tx.productVariant.create({
              data: {
                productId: id,
                colorId: color.id,
                sizeId: createdSize.id,
                sku,
                stock: 0,
                lowStockThreshold: 5,
                isActive: true,
              },
            });
          }
        }
      }

      return product;
    });
  }

  async softDeleteProduct(id: string) {
    return prisma.product.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() },
    });
  }

  async addProductVariant(productId: string, variant: any) {
    return prisma.productVariant.create({
      data: {
        productId,
        colorId: variant.colorId,
        sizeId: variant.sizeId,
        sku: variant.sku,
        price: variant.price ? new Prisma.Decimal(variant.price) : null,
        stock: variant.stock,
        lowStockThreshold: variant.lowStockThreshold || LOW_STOCK_THRESHOLD,
        isActive: true,
      },
    });
  }

  async updateProductVariant(variantId: string, data: any) {
    return prisma.productVariant.update({
      where: { id: variantId },
      data: {
        price: data.price !== undefined ? new Prisma.Decimal(data.price) : undefined,
        stock: data.stock !== undefined ? data.stock : undefined,
        lowStockThreshold: data.lowStockThreshold,
        isActive: data.isActive,
      },
    });
  }

  // ---------- CATEGORIES ----------
  async listCategories() {
    return prisma.category.findMany({
      include: { parent: true, children: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createCategory(input: any) {
    return prisma.category.create({ data: input });
  }

  async updateCategory(id: string, input: any) {
    return prisma.category.update({ where: { id }, data: input });
  }

  async deleteCategory(id: string) {
    return prisma.category.delete({ where: { id } });
  }

  // ---------- INVENTORY ----------
  async listInventory(page: number, limit: number, lowStockOnly: boolean) {
    const where = lowStockOnly ? { stock: { lte: LOW_STOCK_THRESHOLD } } : {};
    const [total, variants] = await Promise.all([
      prisma.productVariant.count({ where }),
      prisma.productVariant.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { product: true, color: true, size: true },
        orderBy: { stock: 'asc' },
      }),
    ]);
    return { data: variants, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async updateStock(variantId: string, stock: number) {
    return prisma.productVariant.update({
      where: { id: variantId },
      data: { stock },
    });
  }

  // ---------- ORDERS ----------
  async listOrders(page: number, limit: number, status?: OrderStatus) {
    const where = status ? { status } : {};
    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { email: true, firstName: true, lastName: true } },
          items: true,
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { data: orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getOrder(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            productVariant: { include: { product: true, color: true, size: true } },
            customDesign: { include: { garment: true, color: true, size: true, assets: true } },
            customOrderTracking: true,
          },
        },
        payments: true,
        statusHistory: true,
      },
    });
  }

  async updateOrderStatus(id: string, status: OrderStatus, notes?: string) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id },
        data: {
          status,
          ...(status === OrderStatus.SHIPPED ? { shippedAt: new Date() } : {}),
          ...(status === OrderStatus.DELIVERED ? { deliveredAt: new Date() } : {}),
          ...(status === OrderStatus.CANCELLED ? { cancelledAt: new Date() } : {}),
        },
      });
      await tx.orderStatusHistory.create({
        data: { orderId: id, status, notes },
      });
      return order;
    });
  }

  // ---------- CUSTOM ORDERS ----------
  async listCustomOrders(page: number, limit: number, status?: CustomOrderStatus) {
    const where = status ? { status } : {};
    const [total, trackings] = await Promise.all([
      prisma.customOrderTracking.count({ where }),
      prisma.customOrderTracking.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          orderItem: {
            include: {
              order: { include: { user: true } },
              customDesign: { include: { garment: true, color: true, size: true, assets: true } },
            },
          },
          statusHistory: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { data: trackings, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getCustomOrder(id: string) {
    return prisma.customOrderTracking.findUnique({
      where: { id },
      include: {
        orderItem: {
          include: {
            order: { include: { user: true } },
            customDesign: { include: { garment: true, color: true, size: true, assets: true } },
          },
        },
        statusHistory: true,
      },
    });
  }

  async updateCustomOrderStatus(id: string, status: CustomOrderStatus, notes?: string, createdBy?: string) {
    return prisma.$transaction(async (tx) => {
      const tracking = await tx.customOrderTracking.update({
        where: { id },
        data: { status, adminNotes: notes },
      });
      await tx.customOrderStatusHistory.create({
        data: { trackingId: id, status, notes, createdBy },
      });
      return tracking;
    });
  }

  // ---------- CUSTOMERS ----------
  async listCustomers(page: number, limit: number, search?: string) {
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [total, users] = await Promise.all([
      prisma.user.count({ where: { ...where, role: UserRole.CUSTOMER } }),
      prisma.user.findMany({
        where: { ...where, role: UserRole.CUSTOMER },
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { orders: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: users as Array<
        Prisma.UserGetPayload<{
          include: { _count: { select: { orders: true } } };
        }>
      >,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ---------- COUPONS ----------
  async listCoupons() {
    return prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async createCoupon(input: any) {
    return prisma.coupon.create({
      data: {
        code: input.code,
        type: input.type,
        value: new Prisma.Decimal(input.value),
        minOrderAmount: input.minOrderAmount ? new Prisma.Decimal(input.minOrderAmount) : null,
        maxDiscountAmount: input.maxDiscountAmount ? new Prisma.Decimal(input.maxDiscountAmount) : null,
        startsAt: input.startsAt ? new Date(input.startsAt) : null,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
        usageLimit: input.usageLimit,
        perUserLimit: input.perUserLimit,
        isActive: input.isActive,
      },
    });
  }

  async updateCoupon(id: string, input: any) {
    return prisma.coupon.update({
      where: { id },
      data: {
        code: input.code,
        type: input.type,
        value: new Prisma.Decimal(input.value),
        minOrderAmount: input.minOrderAmount ? new Prisma.Decimal(input.minOrderAmount) : null,
        maxDiscountAmount: input.maxDiscountAmount ? new Prisma.Decimal(input.maxDiscountAmount) : null,
        startsAt: input.startsAt ? new Date(input.startsAt) : null,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
        usageLimit: input.usageLimit,
        perUserLimit: input.perUserLimit,
        isActive: input.isActive,
      },
    });
  }

  async deleteCoupon(id: string) {
    return prisma.coupon.delete({ where: { id } });
  }

  // ---------- REVIEWS ----------
  async listReviews(page: number, limit: number, status?: ReviewStatus) {
    const where = status ? { status } : {};
    const [total, reviews] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { product: true, user: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { data: reviews, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async updateReviewStatus(id: string, status: ReviewStatus) {
    return prisma.review.update({
      where: { id },
      data: { status },
    });
  }

  // ---------- GARMENTS ----------
  async listGarments() {
    return prisma.garment.findMany({
      include: { colors: true, sizes: true, printPricings: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createGarment(input: any) {
    return prisma.garment.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        basePrice: new Prisma.Decimal(input.basePrice),
        skuPrefix: input.skuPrefix,
        supportedPrintLocations: input.supportedPrintLocations,
        printableAreaWidth: input.printableAreaWidth ? new Prisma.Decimal(input.printableAreaWidth) : null,
        printableAreaHeight: input.printableAreaHeight ? new Prisma.Decimal(input.printableAreaHeight) : null,
        sortOrder: input.sortOrder,
        isActive: input.isActive,
        colors: { create: input.colors.map((c: any) => ({ name: c.name, hexCode: c.hexCode, sortOrder: c.sortOrder || 0 })) },
        sizes: { create: input.sizes.map((s: any) => ({ label: s.label, sortOrder: s.sortOrder || 0 })) },
      },
      include: { colors: true, sizes: true },
    });
  }

    async updateGarment(
    id: string,
    input: {
      name: string;
      slug: string;
      description?: string;
      basePrice: number;
      skuPrefix: string;
      supportedPrintLocations: string[];
      printableAreaWidth?: number;
      printableAreaHeight?: number;
      sortOrder: number;
      isActive: boolean;
      newColors?: { name: string; hexCode: string }[];
      newSizes?: { label: string }[];
    }
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. Update scalar fields
      const garment = await tx.garment.update({
        where: { id },
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description,
          basePrice: new Prisma.Decimal(input.basePrice),
          skuPrefix: input.skuPrefix,
          supportedPrintLocations: input.supportedPrintLocations as any,
          printableAreaWidth:
            input.printableAreaWidth != null
              ? new Prisma.Decimal(input.printableAreaWidth)
              : null,
          printableAreaHeight:
            input.printableAreaHeight != null
              ? new Prisma.Decimal(input.printableAreaHeight)
              : null,
          sortOrder: input.sortOrder,
          isActive: input.isActive,
        },
      });

      // 2. Add new colors — skip duplicates by name, create variants
      //    for all existing sizes with stock 0.
      if (input.newColors && input.newColors.length > 0) {
        const existingColors = await tx.garmentColor.findMany({
          where: { garmentId: id },
          select: { name: true },
        });
        const existingNames = new Set(existingColors.map((c) => c.name));
        const existingSizes = await tx.garmentSize.findMany({
          where: { garmentId: id },
          orderBy: { sortOrder: 'asc' },
        });

        for (const newColor of input.newColors) {
          if (existingNames.has(newColor.name)) continue;

          const createdColor = await tx.garmentColor.create({
            data: {
              garmentId: id,
              name: newColor.name,
              hexCode: newColor.hexCode,
            },
          });

          for (const size of existingSizes) {
            const sku = `${input.skuPrefix}-${newColor.name.replace(/\s+/g, '').slice(0, 3).toUpperCase()}-${size.label}`;
            const existing = await tx.garmentVariant.findUnique({
              where: { sku },
            });
            if (existing) continue;

            await tx.garmentVariant.create({
              data: {
                garmentId: id,
                colorId: createdColor.id,
                sizeId: size.id,
                sku,
                stock: 0,
                lowStockThreshold: 5,
                isActive: true,
              },
            });
          }
        }
      }

      // 3. Add new sizes — same pattern.
      if (input.newSizes && input.newSizes.length > 0) {
        const existingSizes = await tx.garmentSize.findMany({
          where: { garmentId: id },
          select: { label: true },
        });
        const existingLabels = new Set(existingSizes.map((s) => s.label));
        const existingColors = await tx.garmentColor.findMany({
          where: { garmentId: id },
          orderBy: { sortOrder: 'asc' },
        });

        for (const newSize of input.newSizes) {
          if (existingLabels.has(newSize.label)) continue;

          const createdSize = await tx.garmentSize.create({
            data: {
              garmentId: id,
              label: newSize.label,
            },
          });

          for (const color of existingColors) {
            const sku = `${input.skuPrefix}-${color.name.replace(/\s+/g, '').slice(0, 3).toUpperCase()}-${newSize.label}`;
            const existing = await tx.garmentVariant.findUnique({
              where: { sku },
            });
            if (existing) continue;

            await tx.garmentVariant.create({
              data: {
                garmentId: id,
                colorId: color.id,
                sizeId: createdSize.id,
                sku,
                stock: 0,
                lowStockThreshold: 5,
                isActive: true,
              },
            });
          }
        }
      }

      return garment;
    });
  }
  
  // ---------- PRINT PRICING ----------
async getPrintPricing(garmentId: string) {
  return prisma.printPricing.findMany({
    where: { garmentId },
  });
}

async updatePrintPricing(
  garmentId: string,
  location: Prisma.PrintPricingCreateInput['location'],
  pricing: {
    baseCost: number;
    largePrintThresholdSqIn?: number | null;
    largePrintSurcharge?: number | null;
    quantityDiscountTiers: unknown;
    isActive: boolean;
  }
) {
  const baseCost = new Prisma.Decimal(pricing.baseCost);
  const largePrintThresholdSqIn =
    pricing.largePrintThresholdSqIn != null
      ? new Prisma.Decimal(pricing.largePrintThresholdSqIn)
      : null;
  // largePrintSurcharge is non-nullable with a DB default — always send a Decimal.
  const largePrintSurcharge = new Prisma.Decimal(pricing.largePrintSurcharge ?? 0);

  return prisma.printPricing.upsert({
    where: { garmentId_location: { garmentId, location } },
    update: {
      baseCost,
      largePrintThresholdSqIn,
      largePrintSurcharge,
      quantityDiscountTiers: pricing.quantityDiscountTiers as Prisma.InputJsonValue,
      isActive: pricing.isActive,
    },
    create: {
      garmentId,
      location,
      baseCost,
      largePrintThresholdSqIn,
      largePrintSurcharge,
      quantityDiscountTiers: pricing.quantityDiscountTiers as Prisma.InputJsonValue,
      isActive: pricing.isActive,
    },
  });
}

  // ---------- SETTINGS ----------
  async getSettings() {
    return prisma.storeSettings.findMany();
  }

  async updateSetting(key: string, value: any, description?: string) {
    return prisma.storeSettings.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
  }

  // ---------- ANALYTICS ----------
  async getSalesAnalytics(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: startDate } },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const dailySales: Record<string, number> = {};
    orders.forEach((order) => {
      const day = order.createdAt.toISOString().slice(0, 10);
      dailySales[day] = (dailySales[day] || 0) + Number(order.total);
    });

    return {
      totalSales: orders.reduce((sum, o) => sum + Number(o.total), 0),
      orderCount: orders.length,
      dailySales,
    };
  }
}

export const adminService = new AdminService();