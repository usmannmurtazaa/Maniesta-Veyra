import { prisma } from '@/lib/db/prisma';
import type { AddCartItemInput, UpdateCartItemInput } from '@/lib/validation/cart.schema';
import { NotFoundError, OutOfStockError } from '@/lib/errors';

export class CartService {
  async getOrCreateCart({ userId, guestSessionId }: { userId?: string; guestSessionId?: string }) {
    if (userId) {
      let cart = await prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        cart = await prisma.cart.create({ data: { userId } });
      }
      return cart;
    }
    if (guestSessionId) {
      let cart = await prisma.cart.findUnique({ where: { guestSessionId } });
      if (!cart) {
        cart = await prisma.cart.create({ data: { guestSessionId } });
      }
      return cart;
    }
    const cart = await prisma.cart.create({ data: { guestSessionId: crypto.randomUUID() } });
    return cart;
  }

  async getCart(cartId: string) {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    images: { where: { isPrimary: true }, take: 1 },
                  },
                },
                color: true,
                size: true,
              },
            },
            customDesign: {
              include: {
                garment: true,
                color: true,
                size: true,
                assets: true,
              },
            },
          },
        },
      },
    });
    if (!cart) throw new NotFoundError('Cart not found');
    return cart;
  }

  async addItem(cartId: string, input: AddCartItemInput) {
    if (input.productVariantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: input.productVariantId },
        include: { product: true },
      });
      if (!variant || !variant.isActive || variant.product.deletedAt || !variant.product.isActive) {
        throw new NotFoundError('Product variant not found');
      }
      const existingItem = await prisma.cartItem.findFirst({
        where: { cartId, productVariantId: input.productVariantId },
      });
      const totalQuantity = (existingItem?.quantity ?? 0) + input.quantity;
      if (totalQuantity > variant.stock) {
        throw new OutOfStockError(`Only ${variant.stock} available`);
      }
    }

    const existing = await prisma.cartItem.findFirst({
      where: {
        cartId,
        productVariantId: input.productVariantId ?? null,
        customDesignId: input.customDesignId ?? null,
      },
    });

    if (existing) {
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + input.quantity },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId,
        productVariantId: input.productVariantId,
        customDesignId: input.customDesignId,
        quantity: input.quantity,
      },
    });
  }

  async updateItem(cartItemId: string, input: UpdateCartItemInput) {
    const item = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
    if (!item) throw new NotFoundError('Cart item not found');

    if (input.quantity && item.productVariantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.productVariantId },
      });
      if (!variant) throw new NotFoundError('Product variant not found');
      if (input.quantity > variant.stock) {
        throw new OutOfStockError(`Only ${variant.stock} available`);
      }
    }

    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity: input.quantity ?? item.quantity,
        isSavedForLater: input.isSavedForLater ?? item.isSavedForLater,
      },
    });
  }

  async removeItem(cartItemId: string) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  async mergeGuestCart(userId: string, guestSessionId: string) {
    const guestCart = await prisma.cart.findUnique({
      where: { guestSessionId },
      include: { items: true },
    });
    if (!guestCart || guestCart.items.length === 0) {
      return this.getOrCreateCart({ userId });
    }

    const userCart = await this.getOrCreateCart({ userId });

    for (const item of guestCart.items) {
      const existing = await prisma.cartItem.findFirst({
        where: {
          cartId: userCart.id,
          productVariantId: item.productVariantId ?? null,
          customDesignId: item.customDesignId ?? null,
        },
      });
      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productVariantId: item.productVariantId,
            customDesignId: item.customDesignId,
            quantity: item.quantity,
            isSavedForLater: item.isSavedForLater,
          },
        });
      }
    }

    await prisma.cart.delete({ where: { id: guestCart.id } });

    return userCart;
  }
}

export const cartService = new CartService();