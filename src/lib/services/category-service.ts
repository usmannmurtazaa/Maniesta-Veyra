import { prisma } from '@/lib/db/prisma';
import type { CategoryQuery } from '@/lib/validation/category.schema';

export class CategoryService {
  async getCategories(query: Partial<CategoryQuery> = {}) {
    const { parent, includeInactive = false } = query;

    const categories = await prisma.category.findMany({
      where: {
        isActive: includeInactive ? undefined : true,
        parentId: parent ?? null,
      },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return categories;
  }

  async getCategoryTree() {
    return prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });
  }
}

export const categoryService = new CategoryService();