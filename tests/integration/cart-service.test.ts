import { describe, it, expect, vi } from 'vitest';
import { CartService } from '@/lib/services/cart-service';

vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    cart: { findUnique: vi.fn(), create: vi.fn() },
    cartItem: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    productVariant: { findUnique: vi.fn() },
    product: { findUnique: vi.fn() },
  },
}));

describe('CartService', () => {
  it('adds item to cart with stock check', async () => {
    const { prisma } = await import('@/lib/db/prisma');
    (prisma.productVariant.findUnique as any).mockResolvedValue({
      id: 'v1',
      stock: 10,
      isActive: true,
      product: { deletedAt: null, isActive: true },
    });
    (prisma.cartItem.findFirst as any).mockResolvedValue(null);
    (prisma.cartItem.create as any).mockResolvedValue({ id: 'item1', cartId: 'cart1', productVariantId: 'v1', quantity: 1 });

    const service = new CartService();
    const item = await service.addItem('cart1', { productVariantId: 'v1', quantity: 1 });
    expect(item.quantity).toBe(1);
  });

  it('throws OutOfStock when quantity exceeds stock', async () => {
    const { prisma } = await import('@/lib/db/prisma');
    (prisma.productVariant.findUnique as any).mockResolvedValue({
      id: 'v1',
      stock: 2,
      isActive: true,
      product: { deletedAt: null, isActive: true },
    });
    (prisma.cartItem.findFirst as any).mockResolvedValue({ quantity: 2 });

    const service = new CartService();
    await expect(service.addItem('cart1', { productVariantId: 'v1', quantity: 1 })).rejects.toThrow('Only 2 available');
  });
});