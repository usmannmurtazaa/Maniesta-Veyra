import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/lib/services/order-service';
import { createOrderSchema } from '@/lib/validation/order.schema';
import { auth } from '@/lib/auth/auth';
import { rateLimiters } from '@/lib/security/rate-limit';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const limiter = rateLimiters.orderCreate;
    const result = await limiter.limit(request.headers.get('x-forwarded-for') || 'anonymous');
    if (!result.success) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMITED', message: 'Too many order attempts. Please try again later.' } },
        { status: 429 }
      );
    }

    const session = await auth();
    const userId = session?.user?.id;

    const body = await request.json();
    const input = createOrderSchema.parse(body);

    // For authenticated user, we need to ensure cartId matches their cart; for guest, we trust provided cartId.
    // In production, we should fetch cartId from cookie for guest.
    // For now, we assume cartId is provided.

    const order = await orderService.createOrder(input, userId);
    return NextResponse.json({ data: order }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues } },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message.includes('Insufficient')) {
      return NextResponse.json(
        { error: { code: 'OUT_OF_STOCK', message: error.message } },
        { status: 409 }
      );
    }
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create order' } },
      { status: 500 }
    );
  }
}