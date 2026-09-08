import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { z } from 'zod';

const garmentSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  basePrice: z.number().positive(),
  skuPrefix: z.string().min(1),
  supportedPrintLocations: z.array(z.enum(['FRONT', 'BACK', 'LEFT_SLEEVE', 'RIGHT_SLEEVE'])),
  printableAreaWidth: z.number().optional(),
  printableAreaHeight: z.number().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
  colors: z.array(z.object({ name: z.string(), hexCode: z.string(), sortOrder: z.number().optional() })),
  sizes: z.array(z.object({ label: z.string(), sortOrder: z.number().optional() })),
});

export async function GET() {
  try {
    await requireAdmin();
    const garments = await adminService.listGarments();
    return NextResponse.json({ data: garments });
  } catch (error: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch garments' } }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const input = garmentSchema.parse(body);
    const garment = await adminService.createGarment(input);
    return NextResponse.json({ data: garment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to create garment' } }, { status: 500 });
  }
}