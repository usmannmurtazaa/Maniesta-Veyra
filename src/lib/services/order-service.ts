import {
  Prisma,
  OrderStatus,
  PaymentStatus,
} from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { cartService } from './cart-service';
import { couponService } from './coupon-service';
import { getPaymentProvider } from '@/lib/payments/factory';
import { NotFoundError, OutOfStockError, ConflictError } from '@/lib/errors';
import type { CreateOrderInput } from '@/lib/validation/order.schema';
import { randomBytes } from 'crypto';
import {
  sendOrderConfirmationEmail,
  sendCustomOrderReceivedEmail,
} from '@/lib/email/send';

function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const random = randomBytes(4).toString('hex').toUpperCase();
  return `ORD-${year}${month}-${random}`;
}

interface OrderItemSnapshot {
  productName: string;
  productSlug: string | null;
  variantSku: string | null;
  colorName: string | null;
  sizeLabel: string | null;
  unitPrice: string;
  customDesignSnapshot?: {
    garmentId: string;
    garmentName: string;
    color: string;
    size: string;
    printLocations: string[];
    assets: Array<{
      printLocation: string;
      imageUrl: string;
      positionX: number;
      positionY: number;
      scale: number;
      rotation: number;
    }>;
    notes: string | null;
    previewImageUrl: string | null;
  };
}

export class OrderService {
  async createOrder(input: CreateOrderInput, userId?: string) {
    // ---- Idempotency: return existing order if the key was already used ----
    if (input.idempotencyKey) {
      const existing = await prisma.order.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
        include: { items: true },
      });
      if (existing) return existing;
    }

    if (!input.cartId) {
      throw new NotFoundError('Cart ID is required');
    }

    const cart = await cartService.getCart(input.cartId);
    if (!cart) throw new NotFoundError('Cart not found');

    const cartItems = cart.items.filter((item) => !item.isSavedForLater);
    if (cartItems.length === 0) {
      throw new NotFoundError('Cart is empty');
    }

    // ---- Run the entire order creation in a transaction ----
    const order = await prisma.$transaction(async (tx) => {
      let subtotal = new Prisma.Decimal(0);

      // ✅ Use the correct nested-create input type (relation syntax, not FK scalars)
      const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];

      for (const item of cartItems) {
        let unitPrice: Prisma.Decimal;
        let snapshot: OrderItemSnapshot;

        if (item.productVariantId && item.productVariant) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.productVariantId },
            include: { product: true, color: true, size: true },
          });

          if (
            !variant ||
            !variant.isActive ||
            variant.product.deletedAt ||
            !variant.product.isActive
          ) {
            throw new NotFoundError(
              `Product variant ${item.productVariantId} is no longer available`
            );
          }

          // Atomic stock deduction
          const result = await tx.productVariant.updateMany({
            where: { id: variant.id, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (result.count === 0) {
            throw new OutOfStockError(
              `Insufficient stock for ${variant.product.name} (${variant.color.name} / ${variant.size.label})`
            );
          }

          unitPrice = variant.price ?? variant.product.basePrice;
          snapshot = {
            productName: variant.product.name,
            productSlug: variant.product.slug,
            variantSku: variant.sku,
            colorName: variant.color.name,
            sizeLabel: variant.size.label,
            unitPrice: unitPrice.toString(),
          };
        } else if (item.customDesignId && item.customDesign) {
          const design = await tx.customDesign.findUnique({
            where: { id: item.customDesignId },
            include: { garment: true, color: true, size: true, assets: true },
          });
          if (!design) {
            throw new NotFoundError('Custom design not found');
          }

          const garmentVariant = await tx.garmentVariant.findFirst({
            where: {
              garmentId: design.garmentId,
              colorId: design.garmentColorId,
              sizeId: design.garmentSizeId,
              isActive: true,
            },
          });
          if (!garmentVariant) {
            throw new NotFoundError('Garment variant not found');
          }

          const result = await tx.garmentVariant.updateMany({
            where: { id: garmentVariant.id, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (result.count === 0) {
            throw new OutOfStockError(
              `Insufficient garment stock for ${design.garment.name} (${design.color.name} / ${design.size.label})`
            );
          }

          unitPrice = design.unitPrice;
          snapshot = {
            productName: `${design.garment.name} (Custom)`,
            productSlug: null,
            variantSku: garmentVariant.sku,
            colorName: design.color.name,
            sizeLabel: design.size.label,
            unitPrice: unitPrice.toString(),
            customDesignSnapshot: {
              garmentId: design.garmentId,
              garmentName: design.garment.name,
              color: design.color.name,
              size: design.size.label,
              printLocations: design.printLocations as string[],
              assets: design.assets.map((asset) => ({
                printLocation: asset.printLocation,
                imageUrl: asset.imageUrl,
                positionX: asset.positionX,
                positionY: asset.positionY,
                scale: asset.scale,
                rotation: asset.rotation,
              })),
              notes: design.notes,
              previewImageUrl: design.previewImageUrl,
            },
          };
        } else {
          throw new Error('Invalid cart item');
        }

        const lineTotal = unitPrice.mul(item.quantity);
        subtotal = subtotal.add(lineTotal);

        // ✅ Relation syntax (connect) instead of scalar FKs
        orderItemsData.push({
          productVariant: item.productVariantId
            ? { connect: { id: item.productVariantId } }
            : undefined,
          customDesign: item.customDesignId
            ? { connect: { id: item.customDesignId } }
            : undefined,
          productName: snapshot.productName,
          productSlug: snapshot.productSlug,
          variantSku: snapshot.variantSku,
          colorName: snapshot.colorName,
          sizeLabel: snapshot.sizeLabel,
          unitPrice,
          quantity: item.quantity,
          totalPrice: lineTotal,
          isCustomDesign: !!item.customDesignId,
          // ✅ Prisma's JSON null handling
          customDesignSnapshot: snapshot.customDesignSnapshot
            ? (snapshot.customDesignSnapshot as Prisma.InputJsonValue)
            : Prisma.DbNull,
        });
      }

      // ---- Coupon ----
      let discountAmount = new Prisma.Decimal(0);
      let couponId: string | null = null;
      if (input.couponCode) {
        const couponResult = await couponService.validateCoupon(
          input.couponCode,
          subtotal,
          userId
        );
        discountAmount = couponResult.discountAmount;
        couponId = couponResult.coupon.id;
      }

      const shippingCost = new Prisma.Decimal(0);
      const taxAmount = new Prisma.Decimal(0);
      const total = subtotal.sub(discountAmount).add(shippingCost).add(taxAmount);

      // ---- Resolve customer email ----
      let customerEmail = '';
      if (userId) {
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { email: true },
        });
        customerEmail = user?.email ?? '';
      } else if ('email' in input.shippingAddress) {
        customerEmail =
          (input.shippingAddress as { email?: string }).email ?? '';
      }

      // ---- Create order + items (include items so we can access them below) ----
      const createdOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: userId ?? null,
          status: OrderStatus.PENDING,
          subtotal,
          discountAmount,
          shippingCost,
          taxAmount,
          total,
          currency: 'PKR',
          couponId,
          customerEmail,
          customerPhone: input.shippingAddress.phone,
          shippingAddressSnapshot: input.shippingAddress as Prisma.InputJsonValue,
          // ✅ Prisma DbNull for empty JSON column
          billingAddressSnapshot: input.billingAddress
            ? (input.billingAddress as Prisma.InputJsonValue)
            : Prisma.DbNull,
          paymentMethod: input.paymentMethod,
          paymentStatus: PaymentStatus.PENDING,
          notes: input.notes ?? null,
          idempotencyKey: input.idempotencyKey ?? null,
          items: { create: orderItemsData },
        },
        include: { items: true },
      });

      // ---- Payment record ----
      const provider = getPaymentProvider(input.paymentMethod);
      const paymentIntent = await provider.createPaymentIntent(
        createdOrder,
        Number(total)
      );
      await tx.payment.create({
        data: {
          orderId: createdOrder.id,
          amount: total,
          currency: 'PKR',
          method: input.paymentMethod,
          status: PaymentStatus.PENDING,
          transactionId: paymentIntent.transactionId ?? null,
          // ✅ Prisma JSON null
          providerResponse: paymentIntent.providerResponse
            ? (paymentIntent.providerResponse as Prisma.InputJsonValue)
            : Prisma.DbNull,
        },
      });

      // ---- Custom order tracking ----
      // `createdOrder.items` is populated because we used include above
      const customItems = createdOrder.items.filter(
        (item) => item.isCustomDesign
      );
      for (const item of customItems) {
        await tx.customOrderTracking.create({
          data: {
            orderItemId: item.id,
            status: 'PENDING_REVIEW',
            customerNotes: input.notes ?? null,
          },
        });
      }

      // ---- Coupon usage ----
      if (couponId && userId) {
        await tx.couponUsage.create({
          data: { couponId, userId, orderId: createdOrder.id },
        });
        await tx.coupon.update({
          where: { id: couponId },
          data: { usageCount: { increment: 1 } },
        });
      }

      // ---- Clear purchased cart items ----
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id, isSavedForLater: false },
      });

      return createdOrder;
    });

    // ---- Confirmation emails (outside transaction) ----
    if (order.customerEmail) {
      try {
        await sendOrderConfirmationEmail(order.customerEmail, order);
      } catch (error) {
        console.error('[order] confirmation email failed:', error);
      }

      const hasCustom = order.items.some((item) => item.isCustomDesign);
      if (hasCustom) {
        try {
          await sendCustomOrderReceivedEmail(order.customerEmail, order);
        } catch (error) {
          console.error('[order] custom order email failed:', error);
        }
      }
    }

    return order;
  }

  async getOrderByNumber(orderNumber: string, userId?: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: { include: { images: true } },
                color: true,
                size: true,
              },
            },
            customDesign: {
              include: { garment: true, color: true, size: true, assets: true },
            },
            customOrderTracking: true,
          },
        },
        payments: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!order) throw new NotFoundError('Order not found');
    if (userId && order.userId !== userId) {
      throw new ConflictError('Not your order');
    }

    return order;
  }

  async cancelOrder(orderNumber: string, userId?: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });
    if (!order) throw new NotFoundError('Order not found');
    if (userId && order.userId !== userId) {
      throw new ConflictError('Not your order');
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new ConflictError('Only pending orders can be cancelled');
    }

    return await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        if (item.productVariantId) {
          await tx.productVariant.update({
            where: { id: item.productVariantId },
            data: { stock: { increment: item.quantity } },
          });
        } else if (item.customDesignId) {
          const design = await tx.customDesign.findUnique({
            where: { id: item.customDesignId },
          });
          if (design) {
            const garmentVariant = await tx.garmentVariant.findFirst({
              where: {
                garmentId: design.garmentId,
                colorId: design.garmentColorId,
                sizeId: design.garmentSizeId,
              },
            });
            if (garmentVariant) {
              await tx.garmentVariant.update({
                where: { id: garmentVariant.id },
                data: { stock: { increment: item.quantity } },
              });
            }
          }
        }
      }

      return tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.CANCELLED,
          cancelledAt: new Date(),
          statusHistory: {
            create: {
              status: OrderStatus.CANCELLED,
              notes: 'Order cancelled',
            },
          },
        },
      });
    });
  }
}

export const orderService = new OrderService();