import { NextRequest, NextResponse } from 'next/server';
import { couponService } from '@/lib/services/coupon-service';
import { auth } from '@/lib/auth/auth';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { rateLimiters } from '@/lib/security/rate-limit';

const validateCouponSchema = z.object({
  code: z.string(),
  cartTotal: z.coerce.number().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const limiter = rateLimiters.couponValidate;
    const result = await limiter.limit(request.headers.get('x-forwarded-for') || 'anonymous');
    if (!result.success) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMITED', message: 'Too many attempts. Please try again later.' } },
        { status: 429 }
      );
    }

    const session = await auth();
    const userId = session?.user?.id;

    const body = await request.json();
    const { code, cartTotal } = validateCouponSchema.parse(body);

    const discount = await couponService.validateCoupon(code, new Prisma.Decimal(cartTotal), userId);
    return NextResponse.json({ data: discount });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues } },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message.includes('Invalid')) {
      return NextResponse.json(
        { error: { code: 'INVALID_COUPON', message: error.message } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to validate coupon' } },
      { status: 500 }
    );
  }
}