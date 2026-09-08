import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const updateVariantSchema = z.object({
  price: z.number().positive().optional(),
  stock: z.number().int().nonnegative().optional(),
  lowStockThreshold: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { variantId: string } }
) {
  try {
    await requireAdmin();
    const body = await request.json();
    const input = updateVariantSchema.parse(body);
    const variant = await prisma.productVariant.update({
      where: { id: params.variantId },
      data: input,
    });
    return NextResponse.json({ data: variant });
  } catch (error) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to update variant' } }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { variantId: string } }
) {
  try {
    await requireAdmin();
    await prisma.productVariant.delete({ where: { id: params.variantId } });
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to delete variant' } }, { status: 500 });
  }
}