import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';

export class WishlistService {
  /**
   * Returns the products on the user's wishlist, shaped for the
   * `ProductCardClient` component (category, 2 images, variants).
   *
   * Inactive and soft-deleted products are filtered out so the wishlist
   * never shows products the customer cannot buy.
   */
  async getWishlist(userId: string) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          orderBy: { createdAt: 'desc' },
          include: {
            product: {
              include: {
                images: {
                  orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
                  take: 2,
                },
                category: { select: { name: true, slug: true } },
                variants: {
                  where: { isActive: true },
                  select: { stock: true },
                },
              },
            },
          },
        },
      },
    });

    if (!wishlist) return [];

    return wishlist.items
      .map((item) => item.product)
      .filter(
        (product) =>
          product.isActive === true && product.deletedAt === null
      );
  }

  /**
   * Adds a product to the user's wishlist.
   *
   * Idempotent: if the product is already on the wishlist, it returns
   * `true` without error. Only the Prisma unique-constraint error (P2002)
   * is swallowed — all other errors propagate so real failures are visible.
   */
  async addItem(userId: string, productId: string) {
    // Ensure a wishlist exists for this user
    const wishlist = await prisma.wishlist.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    // Verify the product exists and is purchasable
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, isActive: true, deletedAt: true },
    });
    if (!product || !product.isActive || product.deletedAt) {
      throw new Error('Product not found');
    }

    try {
      await prisma.wishlistItem.create({
        data: { wishlistId: wishlist.id, productId },
      });
    } catch (error) {
      // P2002 = unique constraint violation — already on the wishlist.
      // That's fine; treat as success.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return true;
      }
      // Any other error (connection lost, FK violation, etc.) should
      // surface so the caller knows the operation actually failed.
      throw error;
    }

    return true;
  }

  async removeItem(userId: string, productId: string) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!wishlist) return false;

    await prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id, productId },
    });
    return true;
  }

  async isInWishlist(userId: string, productId: string) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      select: {
        items: {
          where: { productId },
          select: { id: true },
          take: 1,
        },
      },
    });
    return (wishlist?.items?.length ?? 0) > 0;
  }
}

export const wishlistService = new WishlistService();