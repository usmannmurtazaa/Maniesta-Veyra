import { z } from 'zod';

export const couponValidateSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  cartTotal: z.coerce.number().positive(),
});

export const couponCreateSchema = z.object({
  code: z.string().min(1),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING']),
  value: z.number().nonnegative(),
  minOrderAmount: z.number().optional(),
  maxDiscountAmount: z.number().optional(),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
  usageLimit: z.number().int().optional(),
  perUserLimit: z.number().int().optional(),
  isActive: z.boolean().default(true),
});

export type CouponValidateInput = z.infer<typeof couponValidateSchema>;
export type CouponCreateInput = z.infer<typeof couponCreateSchema>;