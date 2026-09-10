import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { z } from 'zod';

const couponUpdateSchema = z.object({
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const input = couponUpdateSchema.parse(body);
    const coupon = await adminService.updateCoupon(id, input);
    return NextResponse.json({ data: coupon });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to update coupon' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await adminService.deleteCoupon(id);
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to delete coupon' } },
      { status: 500 }
    );
  }
}