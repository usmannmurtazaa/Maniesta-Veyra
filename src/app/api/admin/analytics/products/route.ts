import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    await requireAdmin();

    const productStats = await prisma.orderItem.groupBy({
      by: ['productVariantId'],
      where: {
        productVariantId: { not: null },
        order: { status: { not: 'CANCELLED' } },
      },
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { totalPrice: 'desc' } },
      take: 10,
    });

    const enhanced = await Promise.all(
      productStats.map(async (stat) => {
        if (!stat.productVariantId) return null;
        const variant = await prisma.productVariant.findUnique({
          where: { id: stat.productVariantId },
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        });
        if (!variant) return null;
        return {
          productId: variant.productId,
          name: variant.product.name,
          slug: variant.product.slug,
          imageUrl: variant.product.images[0]?.url,
          totalQuantity: stat._sum.quantity,
          totalRevenue: stat._sum.totalPrice?.toNumber() ?? 0,
        };
      })
    );

    return NextResponse.json({ data: enhanced.filter(Boolean) });
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch product analytics' } },
      { status: 500 }
    );
  }
}