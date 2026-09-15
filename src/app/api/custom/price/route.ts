import { NextRequest, NextResponse } from 'next/server';
import { customPricingService } from '@/lib/services/custom-pricing-service';
import { rateLimiters } from '@/lib/security/rate-limit';
import { z } from 'zod';
import { PrintLocation } from '@prisma/client';

const PRINT_LOCATION_VALUES = Object.values(PrintLocation) as [
  PrintLocation,
  ...PrintLocation[],
];

const priceRequestSchema = z.object({
  garmentId: z.string().min(1, 'Garment ID is required'),
  printLocations: z
    .array(z.enum(PRINT_LOCATION_VALUES))
    .min(1, 'At least one print location is required')
    .max(4, 'Too many print locations'),
  quantity: z.number().int().positive().max(100),
  // Only allow the known print location keys — prevents arbitrary keys from
  // bloating the request and gives a clean 400 if the client sends junk.
  designSqInchesPerLocation: z
    .record(z.enum(PRINT_LOCATION_VALUES), z.number().nonnegative())
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    // ---- Rate limit (higher limit than upload since this is called often) ----
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      'anonymous';
    const limitResult = await rateLimiters.couponValidate.limit(`price:${ip}`);
    if (!limitResult.success) {
      return NextResponse.json(
        {
          error: {
            code: 'RATE_LIMITED',
            message: 'Too many pricing requests. Please slow down.',
          },
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const input = priceRequestSchema.parse(body);

    const result = await customPricingService.calculatePrice(input);

    return NextResponse.json(
      { data: result },
      {
        // Prices can be cached briefly at the CDN — a customer frequently
        // tweaks quantity/location; identical requests should hit cache.
        headers: {
          'Cache-Control':
            'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
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
    console.error('[custom/price] calculation failed:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to calculate price',
        },
      },
      { status: 500 }
    );
  }
}