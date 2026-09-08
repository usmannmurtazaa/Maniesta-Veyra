import { NextRequest, NextResponse } from 'next/server';
import { customPricingService } from '@/lib/services/custom-pricing-service';
import { z } from 'zod';
import { PrintLocation } from '@prisma/client';

const priceRequestSchema = z.object({
  garmentId: z.string(),
  printLocations: z.array(z.nativeEnum(PrintLocation)),
  quantity: z.number().int().positive(),
  designSqInchesPerLocation: z.record(z.number()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = priceRequestSchema.parse(body);
    const result = await customPricingService.calculatePrice(input);
    return NextResponse.json({ data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues } },
        { status: 400 }
      );
    }
    console.error('Price calculation error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to calculate price' } },
      { status: 500 }
    );
  }
}