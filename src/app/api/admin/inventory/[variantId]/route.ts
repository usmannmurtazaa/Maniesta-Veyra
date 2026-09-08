import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { z } from 'zod';

const updateStockSchema = z.object({ stock: z.number().int().nonnegative() });

export async function PATCH(
  request: NextRequest,
  { params }: { params: { variantId: string } }
) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { stock } = updateStockSchema.parse(body);
    const variant = await adminService.updateStock(params.variantId, stock);
    return NextResponse.json({ data: variant });
  } catch (error: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to update stock' } }, { status: 500 });
  }
}