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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await request.json();
    const input = garmentUpdateSchema.parse(body);
    const garment = await adminService.updateGarment(params.id, input);
    return NextResponse.json({ data: garment });
  } catch (error) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to update garment' } }, { status: 500 });
  }
}