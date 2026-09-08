import { Prisma, Coupon, CouponType } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { InvalidCouponError } from '@/lib/errors';

export interface CouponDiscountResult {
  coupon: Coupon;
  discountAmount: Prisma.Decimal;
}

export class CouponService {
  async validateCoupon(code: string, cartTotal: Prisma.Decimal, userId?: string): Promise<CouponDiscountResult> {
    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive) {
      throw new InvalidCouponError('Invalid coupon code');
    }

    // Check date range
    const now = new Date();
    if (coupon.startsAt && now < coupon.startsAt) {
      throw new InvalidCouponError('Coupon not yet active');
    }
    if (coupon.expiresAt && now > coupon.expiresAt) {
      throw new InvalidCouponError('Coupon has expired');
    }

    // Check usage limit
    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      throw new InvalidCouponError('Coupon usage limit reached');
    }

    // Check per-user limit
    if (userId && coupon.perUserLimit !== null) {
      const userUsageCount = await prisma.couponUsage.count({
        where: { couponId: coupon.id, userId },
      });
      if (userUsageCount >= coupon.perUserLimit) {
        throw new InvalidCouponError('You have already used this coupon');
      }
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      throw new InvalidCouponError(`Minimum order amount for this coupon is ₨ ${coupon.minOrderAmount}`);
    }

    // Calculate discount
    let discountAmount: Prisma.Decimal;
    if (coupon.type === CouponType.PERCENTAGE) {
      discountAmount = cartTotal.mul(coupon.value).div(100);
    } else if (coupon.type === CouponType.FIXED_AMOUNT) {
      discountAmount = coupon.value;
    } else {
      // FREE_SHIPPING – we'll treat as 0 for now; shipping discount applied separately
      discountAmount = new Prisma.Decimal(0);
    }

    // Apply max discount cap
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }

    // Ensure discount doesn't exceed cart total
    if (discountAmount > cartTotal) {
      discountAmount = cartTotal;
    }

    return { coupon, discountAmount };
  }

  async applyCouponUsage(couponId: string, userId: string, orderId?: string) {
    await prisma.$transaction([
      prisma.couponUsage.create({
        data: {
          couponId,
          userId,
          orderId,
        },
      }),
      prisma.coupon.update({
        where: { id: couponId },
        data: { usageCount: { increment: 1 } },
      }),
    ]);
  }
}

export const couponService = new CouponService();