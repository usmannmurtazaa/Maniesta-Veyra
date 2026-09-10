import { prisma } from '@/lib/db/prisma';

export class AnalyticsService {
  async getSalesSummary(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: startDate } },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const totalSales = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const orderCount = orders.length;

    const dailySales: Record<string, number> = {};
    orders.forEach((order) => {
      const day = order.createdAt.toISOString().slice(0, 10);
      dailySales[day] = (dailySales[day] || 0) + Number(order.total);
    });

    return {
      totalSales,
      orderCount,
      dailySales,
    };
  }

  async getTopProducts(limit: number = 5) {
    const items = await prisma.orderItem.groupBy({
      by: ['productVariantId'],
      where: {
        productVariantId: { not: null },
        order: { status: { not: 'CANCELLED' } },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    return Promise.all(
      items.map(async (item) => {
        if (!item.productVariantId) return null;
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.productVariantId },
          include: { product: { select: { name: true, slug: true } } },
        });
        if (!variant) return null;
        return {
          productId: variant.productId,
          productName: variant.product.name,
          slug: variant.product.slug,
          totalQuantity: item._sum.quantity,
        };
      })
    ).then((results) => results.filter(Boolean));
  }
}

export const analyticsService = new AnalyticsService();