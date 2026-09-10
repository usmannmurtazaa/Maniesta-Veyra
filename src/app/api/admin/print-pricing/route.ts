import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { PrintLocation } from '@prisma/client';
import { z } from 'zod';

const pricingSchema = z.object({
  garmentId: z.string(),
  location: z.nativeEnum(PrintLocation),
  pricing: z.object({
    baseCost: z.number().nonnegative(),
    largePrintThresholdSqIn: z.number().optional(),
    largePrintSurcharge: z.number().nonnegative().default(0),
    quantityDiscountTiers: z.array(
      z.object({
        minQuantity: z.number().int(),
        discountPercent: z.number().min(0).max(100),
      })
    ),
    isActive: z.boolean().default(true),
  }),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const garmentId = request.nextUrl.searchParams.get('garmentId');
    if (!garmentId) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'garmentId required' } },
        { status: 400 }
      );
    }
    const pricing = await adminService.getPrintPricing(garmentId);
    return NextResponse.json({ data: pricing });
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch pricing' } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { garmentId, location, pricing } = pricingSchema.parse(body);
    const result = await adminService.updatePrintPricing(garmentId, location, pricing);
    return NextResponse.json({ data: result });
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
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to update pricing' } },
      { status: 500 }
    );
  }
}