import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { z } from 'zod';

const garmentUpdateSchema = z.object({
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
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const input = garmentUpdateSchema.parse(body);
    const garment = await adminService.updateGarment(id, input);
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
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to update garment' } },
      { status: 500 }
    );
  }
}