import { Prisma, Order, OrderStatus, PaymentMethod, PaymentStatus, PrintLocation } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { cartService } from './cart-service';
import { couponService } from './coupon-service';
import { getPaymentProvider } from '@/lib/payments/factory';
import { NotFoundError, OutOfStockError, InvalidCouponError, ConflictError } from '@/lib/errors';
import type { CreateOrderInput } from '@/lib/validation/order.schema';
import { randomBytes } from 'crypto';
import { sendOrderConfirmationEmail, sendCustomOrderReceivedEmail } from '@/lib/email/send';

function generateOrderNumber(): string {
  const timestamp = new Date().getFullYear().toString().slice(-2) + (new Date().getMonth() + 1).toString().padStart(2, '0');
  const random = randomBytes(4).toString('hex').toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export class OrderService {
  async createOrder(input: CreateOrderInput, userId?: string) {
    // Idempotency check
    if (input.idempotencyKey) {
      const existing = await prisma.order.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (existing) {
        return existing; // Return existing order to prevent duplicate
      }
    }

    // Get cart
    const cart = await cartService.getCart(input.cartId!); // cartId must be provided
    if (!cart) throw new NotFoundError('Cart not found');

    const cartItems = cart.items.filter((item) => !item.isSavedForLater);
    if (cartItems.length === 0) {
      throw new NotFoundError('Cart is empty');
    }

    // Begin transaction
    return await prisma.$transaction(async (tx) => {
      // 1. Recalculate prices, validate stock, prepare order items
      let subtotal = new Prisma.Decimal(0);
      const orderItemsData = [];

      for (const item of cartItems) {
        let unitPrice: Prisma.Decimal;
        let snapshot: any = {};

        if (item.productVariantId && item.productVariant) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.productVariantId },
            include: {
              product: true,
              color: true,
              size: true,
            },
          });

          if (!variant || !variant.isActive || variant.product.deletedAt || !variant.product.isActive) {
            throw new NotFoundError(`Product variant ${item.productVariantId} is not available`);
          }

          // Check stock and deduct atomically
          const result = await tx.productVariant.updateMany({
            where: { id: variant.id, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (result.count === 0) {
            throw new OutOfStockError(`Insufficient stock for ${variant.product.name} (${variant.color.name} / ${variant.size.label})`);
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
            include: {
              garment: true,
              color: true,
              size: true,
              assets: true,
            },
          });

          if (!design) {
            throw new NotFoundError('Custom design not found');
          }

          // Check garment variant stock
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
            throw new OutOfStockError(`Insufficient garment stock for ${design.garment.name} (${design.color.name} / ${design.size.label})`);
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
              printLocations: design.printLocations,
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

        orderItemsData.push({
          productVariantId: item.productVariantId,
          customDesignId: item.customDesignId,
          productName: snapshot.productName,
          productSlug: snapshot.productSlug,
          variantSku: snapshot.variantSku,
          colorName: snapshot.colorName,
          sizeLabel: snapshot.sizeLabel,
          unitPrice,
          quantity: item.quantity,
          totalPrice: lineTotal,
          isCustomDesign: !!item.customDesignId,
          customDesignSnapshot: snapshot.customDesignSnapshot || undefined,
        });
      }

      // 2. Apply coupon if provided
      let discountAmount = new Prisma.Decimal(0);
      let couponId: string | null = null;
      if (input.couponCode) {
        const couponResult = await couponService.validateCoupon(input.couponCode, subtotal, userId);
        discountAmount = couponResult.discountAmount;
        couponId = couponResult.coupon.id;
      }

      // 3. Shipping cost (flat rate for now; can be adjusted via settings)
      const shippingCost = new Prisma.Decimal(0); // placeholder; real logic in later refinement

      // 4. Tax calculation (simplified; 0% for now)
      const taxAmount = new Prisma.Decimal(0);

      // 5. Total
      const total = subtotal.sub(discountAmount).add(shippingCost).add(taxAmount);

      // 6. Create order
      const orderNumber = generateOrderNumber();
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: userId || null,
          status: OrderStatus.PENDING,
          subtotal,
          discountAmount,
          shippingCost,
          taxAmount,
          total,
          currency: 'PKR',
          couponId,
          customerEmail: userId ? (await tx.user.findUnique({ where: { id: userId } }))?.email ?? '' : '',
          customerPhone: input.shippingAddress.phone,
          shippingAddressSnapshot: input.shippingAddress,
          billingAddressSnapshot: input.billingAddress,
          paymentMethod: input.paymentMethod,
          paymentStatus: PaymentStatus.PENDING,
          notes: input.notes,
          idempotencyKey: input.idempotencyKey,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      // 7. Create payment record using provider
      const provider = getPaymentProvider(input.paymentMethod);
      const paymentIntent = await provider.createPaymentIntent(order, Number(total));
      await tx.payment.create({
        data: {
          orderId: order.id,
          amount: total,
          currency: 'PKR',
          method: input.paymentMethod,
          status: PaymentStatus.PENDING,
          transactionId: paymentIntent.transactionId,
          providerResponse: paymentIntent.providerResponse as any,
        },
      });

      // 8. Create custom order tracking for custom items
      const customItems = orderItemsData.filter((item) => item.isCustomDesign);
      for (const customItem of customItems) {
        const orderItem = await tx.orderItem.findFirst({
          where: {
            orderId: order.id,
            productName: customItem.productName,
            // We need a better way to match; we'll use a unique match on customDesignId
            customDesignId: customItem.customDesignId,
          },
        });
        if (orderItem) {
          await tx.customOrderTracking.create({
            data: {
              orderItemId: orderItem.id,
              status: 'PENDING_REVIEW',
              customerNotes: customItem.customDesignSnapshot?.notes,
            },
          });
        }
      }

      // 9. Record coupon usage
      if (couponId && userId) {
        await tx.couponUsage.create({
          data: {
            couponId,
            userId,
            orderId: order.id,
          },
        });
        await tx.coupon.update({
          where: { id: couponId },
          data: { usageCount: { increment: 1 } },
        });
      }

      // 10. Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id, isSavedForLater: false },
      });

      // 11. Send confirmation emails (non-blocking; we'll call outside transaction)
      // We'll do it after commit.

      return order;
    }).then(async (order) => {
      // Send emails outside transaction
      try {
        if (userId) {
          const user = await prisma.user.findUnique({ where: { id: userId } });
          if (user) {
            await sendOrderConfirmationEmail(user.email, order);
          }
        }
        // Send custom order received emails if custom items
        const hasCustom = order.items.some((item) => item.isCustomDesign);
        if (hasCustom && userId) {
          const user = await prisma.user.findUnique({ where: { id: userId } });
          if (user) {
            await sendCustomOrderReceivedEmail(user.email, order);
          }
        }
      } catch (emailError) {
        console.error('Failed to send order email:', emailError);
      }
      return order;
    });
  }

  async getOrderByNumber(orderNumber: string, userId?: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            productVariant: {
              include: { product: { include: { images: true } }, color: true, size: true },
            },
            customDesign: {
              include: { garment: true, color: true, size: true, assets: true },
            },
            customOrderTracking: true,
          },
        },
        payments: true,
        statusHistory: true,
      },
    });
    if (!order) throw new NotFoundError('Order not found');
    if (userId && order.userId !== userId) {
      throw new ConflictError('Not your order');
    }
    return order;
  }

  async cancelOrder(orderNumber: string, userId?: string) {
    const order = await prisma.order.findUnique({ where: { orderNumber } });
    if (!order) throw new NotFoundError('Order not found');
    if (userId && order.userId !== userId) {
      throw new ConflictError('Not your order');
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new ConflictError('Only pending orders can be cancelled');
    }

    return await prisma.$transaction(async (tx) => {
      // Restore inventory
      const items = await tx.orderItem.findMany({ where: { orderId: order.id } });
      for (const item of items) {
        if (item.productVariantId) {
          await tx.productVariant.update({
            where: { id: item.productVariantId },
            data: { stock: { increment: item.quantity } },
          });
        } else if (item.customDesignId) {
          // Restore garment stock
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

      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.CANCELLED,
          cancelledAt: new Date(),
          statusHistory: {
            create: { status: OrderStatus.CANCELLED, notes: 'Order cancelled by customer' },
          },
        },
      });

      return updatedOrder;
    });
  }
}

export const orderService = new OrderService();