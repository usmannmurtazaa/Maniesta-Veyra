import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { z } from 'zod';

const updateStockSchema = z.object({
  stock: z.number().int().nonnegative(),
});

interface RouteContext {
  params: Promise<{ variantId: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin();
    const { variantId } = await params;
    const body = await request.json();
    const { stock } = updateStockSchema.parse(body);
    const variant = await adminService.updateStock(variantId, stock);
    return NextResponse.json({ data: variant });
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
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to update stock' } },
      { status: 500 }
    );
  }
}