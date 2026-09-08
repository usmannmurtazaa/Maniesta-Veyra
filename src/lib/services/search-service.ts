import { prisma } from '@/lib/db/prisma';
import type { SearchQuery } from '@/lib/validation/search.schema';

export class SearchService {
  async search(query: SearchQuery) {
    const where = {
      isActive: true,
      deletedAt: null,
      OR: [
        { name: { contains: query.q, mode: 'insensitive' as const } },
        { description: { contains: query.q, mode: 'insensitive' as const } },
        { skuPrefix: { contains: query.q, mode: 'insensitive' as const } },
        { tags: { has: query.q } },
        { variants: { some: { sku: { contains: query.q, mode: 'insensitive' as const } } } },
      ],
    };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: {
          colors: { orderBy: { sortOrder: 'asc' } },
          sizes: { orderBy: { sortOrder: 'asc' } },
          variants: {
            where: { isActive: true },
            select: { id: true, sku: true, price: true, stock: true },
          },
          images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
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
}

export const searchService = new SearchService();