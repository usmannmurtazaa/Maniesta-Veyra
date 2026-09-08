import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const addVariantSchema = z.object({
  colorId: z.string(),
  sizeId: z.string(),
  sku: z.string().min(1),
  price: z.number().positive().optional(),
  stock: z.number().int().nonnegative(),
  lowStockThreshold: z.number().int().nonnegative().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await request.json();
    const input = addVariantSchema.parse(body);

    const variant = await prisma.productVariant.create({
      data: {
        productId: params.id,
        colorId: input.colorId,
        sizeId: input.sizeId,
        sku: input.sku,
        price: input.price ? input.price : undefined,
        stock: input.stock,
        lowStockThreshold: input.lowStockThreshold ?? 5,
        isActive: true,
      },
    });
    return NextResponse.json({ data: variant }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues } }, { status: 400 });
    }
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to add variant' } }, { status: 500 });
  }
}