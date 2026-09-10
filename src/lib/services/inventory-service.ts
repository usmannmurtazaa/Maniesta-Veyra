import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';

export class InventoryService {
  async getVariantStock(variantId: string) {
    return prisma.productVariant.findUnique({
      where: { id: variantId },
      select: { stock: true, lowStockThreshold: true, sku: true },
    });
  }

  async updateStock(variantId: string, newStock: number) {
    return prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: Math.max(0, newStock) },
    });
  }

  async deductStock(tx: Prisma.TransactionClient, variantId: string, quantity: number) {
    const result = await tx.productVariant.updateMany({
      where: { id: variantId, stock: { gte: quantity } },
      data: { stock: { decrement: quantity } },
    });
    if (result.count === 0) {
      throw new Error('OUT_OF_STOCK');
    }
    return true;
  }

  async restoreStock(tx: Prisma.TransactionClient, variantId: string, quantity: number) {
    return tx.productVariant.update({
      where: { id: variantId },
      data: { stock: { increment: quantity } },
    });
  }

  async getLowStockItems(threshold: number = 5) {
    return prisma.productVariant.findMany({
      where: { stock: { lte: threshold } },
      include: { product: { select: { name: true } }, color: true, size: true },
      orderBy: { stock: 'asc' },
    });
  }
}

export const inventoryService = new InventoryService();