import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { z } from 'zod';

const couponSchema = z.object({
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

export async function GET() {
  try {
    await requireAdmin();
    const coupons = await adminService.listCoupons();
    return NextResponse.json({ data: coupons });
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch coupons' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const input = couponSchema.parse(body);
    const coupon = await adminService.createCoupon(input);
    return NextResponse.json({ data: coupon }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create coupon' } },
      { status: 500 }
    );
  }
}