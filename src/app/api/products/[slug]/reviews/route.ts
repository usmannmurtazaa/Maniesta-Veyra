import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/guards';
import { z } from 'zod';

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  content: z.string().optional(),
  orderItemId: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!product) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Product not found' } }, { status: 404 });
    }

    const reviews = await prisma.review.findMany({
      where: { productId: product.id, status: 'APPROVED' },
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: reviews });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch reviews' } },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await requireAuth();
    const { slug } = await params;
    const body = await request.json();
    const input = createReviewSchema.parse(body);

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!product) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Product not found' } }, { status: 404 });
    }

    const existing = await prisma.review.findUnique({
      where: { productId_userId: { productId: product.id, userId: session.user.id } },
    });
    if (existing) {
      return NextResponse.json(
        { error: { code: 'CONFLICT', message: 'You have already reviewed this product' } },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId: product.id,
        userId: session.user.id,
        rating: input.rating,
        title: input.title,
        content: input.content,
        status: 'PENDING',
        isVerifiedPurchase: false,
      },
    });

    return NextResponse.json({ data: review }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to submit review' } },
      { status: 500 }
    );
  }
}