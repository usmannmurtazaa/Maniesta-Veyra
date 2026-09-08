import { NextRequest, NextResponse } from 'next/server';
import { customDesignService } from '@/lib/services/custom-design-service';
import { auth } from '@/lib/auth/auth';
import { z } from 'zod';
import { PrintLocation } from '@prisma/client';

const createDesignSchema = z.object({
  garmentId: z.string(),
  garmentColorId: z.string(),
  garmentSizeId: z.string(),
  printLocations: z.array(z.nativeEnum(PrintLocation)),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
  unitPrice: z.number(),
  totalPrice: z.number(),
  previewImageUrl: z.string().optional(),
  assets: z.array(
    z.object({
      printLocation: z.nativeEnum(PrintLocation),
      imageUrl: z.string(),
      fileName: z.string(),
      fileSize: z.number(),
      mimeType: z.string(),
      imageWidth: z.number().optional(),
      imageHeight: z.number().optional(),
      positionX: z.number(),
      positionY: z.number(),
      scale: z.number(),
      rotation: z.number(),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const body = await request.json();
    const input = createDesignSchema.parse(body);

    const design = await customDesignService.createDesign({
      ...input,
      userId,
    });

    return NextResponse.json({ data: design }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues } },
        { status: 400 }
      );
    }
    console.error('Create design error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create design' } },
      { status: 500 }
    );
  }
}