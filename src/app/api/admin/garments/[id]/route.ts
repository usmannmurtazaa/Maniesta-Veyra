import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { z } from 'zod';

const updateGarmentSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  basePrice: z.number().positive(),
  skuPrefix: z.string().min(1),
  supportedPrintLocations: z.array(z.string()),
  printableAreaWidth: z.number().optional(),
  printableAreaHeight: z.number().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await request.json();
    const input = updateGarmentSchema.parse(body);
    const garment = await adminService.updateGarment(params.id, input);
    return NextResponse.json({ data: garment });
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
    console.error('Update garment error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to update garment' } },
      { status: 500 }
    );
  }
}