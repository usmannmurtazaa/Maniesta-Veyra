import { prisma } from '@/lib/db/prisma';

export class WishlistService {
  async getWishlist(userId: string) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
      },
    });
    return wishlist?.items.map((item) => item.product) ?? [];
  }

  async addItem(userId: string, productId: string) {
    let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId } });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new Error('Product not found');
    }

    try {
      await prisma.wishlistItem.create({
        data: { wishlistId: wishlist.id, productId },
      });
    } catch {
      // Already exists, ignore
    }
    return true;
  }

  async removeItem(userId: string, productId: string) {
    const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) return false;

    await prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id, productId },
    });
    return true;
  }

  async isInWishlist(userId: string, productId: string) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: { items: { where: { productId } } },
    });
    return (wishlist?.items?.length ?? 0) > 0;
  }
}

export const wishlistService = new WishlistService();