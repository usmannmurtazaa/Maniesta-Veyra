import { NextRequest, NextResponse } from 'next/server';
import { customDesignService } from '@/lib/services/custom-design-service';
import { customPricingService } from '@/lib/services/custom-pricing-service';
import { auth } from '@/lib/auth/auth';
import { rateLimiters } from '@/lib/security/rate-limit';
import { z } from 'zod';
import { PrintLocation } from '@prisma/client';

const createDesignSchema = z.object({
  garmentId: z.string().min(1),
  garmentColorId: z.string().min(1),
  garmentSizeId: z.string().min(1),
  printLocations: z.array(z.nativeEnum(PrintLocation)).min(1, 'Select at least one print location'),
  quantity: z.number().int().positive().max(100),
  notes: z.string().max(500).optional(),
  previewImageUrl: z.string().url().optional(),
  // ✅ No unitPrice / totalPrice — the server computes them.
  assets: z
    .array(
      z.object({
        printLocation: z.nativeEnum(PrintLocation),
        imageUrl: z.string().url(),
        fileName: z.string().min(1),
        fileSize: z.number().int().nonnegative(),
        mimeType: z.string().min(1),
        imageWidth: z.number().int().positive().optional(),
        imageHeight: z.number().int().positive().optional(),
        positionX: z.number(),
        positionY: z.number(),
        scale: z.number(),
        rotation: z.number(),
      })
    )
    .min(1, 'At least one design asset is required'),
});

export async function POST(request: NextRequest) {
  try {
    // ---- Rate limit ----
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      'anonymous';
    const limitResult = await rateLimiters.upload.limit(`design:${ip}`);
    if (!limitResult.success) {
      return NextResponse.json(
        {
          error: {
            code: 'RATE_LIMITED',
            message: 'Too many design submissions. Please try again later.',
          },
        },
        { status: 429 }
      );
    }

    const session = await auth();
    const userId = session?.user?.id;

    const body = await request.json();
    const input = createDesignSchema.parse(body);

    // ---- Server-authoritative pricing ----
    // Client-submitted prices are ignored. We recalculate from the DB.
    const pricing = await customPricingService.calculatePrice({
      garmentId: input.garmentId,
      printLocations: input.printLocations,
      quantity: input.quantity,
    });

    const design = await customDesignService.createDesign({
      userId,
      garmentId: input.garmentId,
      garmentColorId: input.garmentColorId,
      garmentSizeId: input.garmentSizeId,
      printLocations: input.printLocations,
      quantity: input.quantity,
      notes: input.notes,
      previewImageUrl: input.previewImageUrl,
      unitPrice: Number(pricing.unitPrice),
      totalPrice: Number(pricing.totalPrice),
      assets: input.assets,
    });

    return NextResponse.json({ data: design }, { status: 201 });
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
    console.error('[custom/designs] create failed:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create design' } },
      { status: 500 }
    );
  }
}