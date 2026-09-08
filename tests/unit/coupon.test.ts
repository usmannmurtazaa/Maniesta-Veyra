import { describe, it, expect } from 'vitest';
import { CouponService } from '@/lib/services/coupon-service';
import { Prisma, CouponType } from '@prisma/client';

vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    coupon: { findUnique: vi.fn() },
    couponUsage: { count: vi.fn() },
  },
}));

describe('CouponService', () => {
  it('validates percentage coupon and calculates discount', async () => {
    const { prisma } = await import('@/lib/db/prisma');
    (prisma.coupon.findUnique as any).mockResolvedValue({
      id: 'c1',
      code: 'SAVE10',
      type: CouponType.PERCENTAGE,
      value: new Prisma.Decimal(10),
      minOrderAmount: null,
      maxDiscountAmount: null,
      startsAt: null,
      expiresAt: null,
      usageLimit: null,
      perUserLimit: null,
      usageCount: 0,
      isActive: true,
    });
    (prisma.couponUsage.count as any).mockResolvedValue(0);

    const service = new CouponService();
    const result = await service.validateCoupon('SAVE10', new Prisma.Decimal(1000), 'user1');
    expect(result.discountAmount.toNumber()).toBe(100);
  });

  it('rejects expired coupon', async () => {
    const { prisma } = await import('@/lib/db/prisma');
    (prisma.coupon.findUnique as any).mockResolvedValue({
      id: 'c1',
      code: 'OLD',
      type: CouponType.FIXED_AMOUNT,
      value: new Prisma.Decimal(50),
      minOrderAmount: null,
      maxDiscountAmount: null,
      startsAt: null,
      expiresAt: new Date(Date.now() - 1000),
      usageLimit: null,
      perUserLimit: null,
      usageCount: 0,
      isActive: true,
    });

    const service = new CouponService();
    await expect(service.validateCoupon('OLD', new Prisma.Decimal(100))).rejects.toThrow('Coupon has expired');
  });
});