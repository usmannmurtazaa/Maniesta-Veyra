import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { z } from 'zod';

const updateProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  categoryId: z.string(),
  basePrice: z.number().positive(),
  compareAtPrice: z.number().positive().nullable().optional(),
  skuPrefix: z.string().min(1),
  tags: z.array(z.string()).default([]),
  material: z.string().optional(),
  careInstructions: z.string().optional(),

  // New optional arrays
  images: z
    .array(
      z.object({
        url: z.string().min(1),
        altText: z.string().optional(),
        isPrimary: z.boolean().optional(),
      })
    )
    .optional(),

  newColors: z
    .array(
      z.object({
        name: z.string().min(1),
        hexCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      })
    )
    .optional(),

  newSizes: z
    .array(
      z.object({
        label: z.string().min(1),
      })
    )
    .optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const product = await adminService.getProduct(params.id);
    if (!product) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Product not found' } },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: product });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'Unauthorized' || error.message === 'Forbidden')
    ) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch product' } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await request.json();
    const input = updateProductSchema.parse(body);

    const product = await adminService.updateProduct(params.id, input);

    return NextResponse.json({ data: product });
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
    if (
      error instanceof Error &&
      (error.message === 'Unauthorized' || error.message === 'Forbidden')
    ) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to update product' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    await adminService.softDeleteProduct(params.id);
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'Unauthorized' || error.message === 'Forbidden')
    ) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to delete product' } },
      { status: 500 }
    );
  }
}