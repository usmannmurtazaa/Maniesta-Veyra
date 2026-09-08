import { Prisma, type Product } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import type { ProductQuery } from '@/lib/validation/product.schema';

export interface ProductWithVariants extends Product {
  colors: { id: string; name: string; hexCode: string }[];
  sizes: { id: string; label: string }[];
  variants: {
    id: string;
    sku: string;
    price: Prisma.Decimal | null;
    stock: number;
    colorId: string;
    sizeId: string;
  }[];
  images: { id: string; url: string; altText: string | null; isPrimary: boolean }[];
  category: { name: string; slug: string };
}

export class ProductService {
  async getProducts(query: ProductQuery) {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      deletedAt: null,
    };

    // Category filter
    if (query.category) {
      where.category = { slug: query.category };
    }

    // Price range
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.basePrice = {};
      if (query.minPrice !== undefined) {
        where.basePrice.gte = new Prisma.Decimal(query.minPrice);
      }
      if (query.maxPrice !== undefined) {
        where.basePrice.lte = new Prisma.Decimal(query.maxPrice);
      }
    }

    // Collections
    if (query.collections) {
      const collections = query.collections.split(',');
      if (collections.includes('featured')) where.isFeatured = true;
      if (collections.includes('new')) where.isNewArrival = true;
      if (collections.includes('bestseller')) where.isBestSeller = true;
    }

    // Rating
    if (query.rating !== undefined) {
      where.ratingAvg = { gte: new Prisma.Decimal(query.rating) };
    }

    // Tags
    if (query.tags) {
      where.tags = { hasSome: query.tags.split(',') };
    }

    // Variant filters
    const variantFilters: Prisma.ProductVariantWhereInput[] = [];

    if (query.sizes) {
      variantFilters.push({
        size: { label: { in: query.sizes.split(',') } },
      });
    }
    if (query.colors) {
      variantFilters.push({
        color: { name: { in: query.colors.split(',') } },
      });
    }
    if (query.availability === 'in_stock') {
      variantFilters.push({ stock: { gt: 0 }, isActive: true });
    } else if (query.availability === 'out_of_stock') {
      variantFilters.push({ stock: 0 });
    }

    if (variantFilters.length > 0) {
      // Combine multiple variant filters with AND
      where.variants = {
        some: {
          AND: variantFilters,
        },
      };
    }

    // Search
    if (query.search) {
      const search = query.search.trim();
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    // Sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = {};
    switch (query.sort) {
      case 'price_asc':
        orderBy = { basePrice: 'asc' };
        break;
      case 'price_desc':
        orderBy = { basePrice: 'desc' };
        break;
      case 'popular':
        orderBy = { ratingCount: 'desc' };
        break;
      case 'rating':
        orderBy = { ratingAvg: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: {
          colors: { orderBy: { sortOrder: 'asc' } },
          sizes: { orderBy: { sortOrder: 'asc' } },
          variants: {
            where: { isActive: true },
            select: {
              id: true,
              sku: true,
              price: true,
              stock: true,
              colorId: true,
              sizeId: true,
            },
          },
          images: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
          },
          category: { select: { name: true, slug: true } },
        },
      }),
    ]);

    return {
      data: products,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async getProductBySlug(slug: string): Promise<ProductWithVariants | null> {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        colors: { orderBy: { sortOrder: 'asc' } },
        sizes: { orderBy: { sortOrder: 'asc' } },
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            sku: true,
            price: true,
            stock: true,
            colorId: true,
            sizeId: true,
          },
        },
        images: {
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
        },
        category: { select: { name: true, slug: true } },
      },
    });

    if (!product || !product.isActive || product.deletedAt) {
      return null;
    }

    return product;
  }
}

export const productService = new ProductService();