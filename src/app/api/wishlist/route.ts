import { NextRequest, NextResponse } from 'next/server';
import { wishlistService } from '@/lib/services/wishlist-service';
import { requireAuth } from '@/lib/auth/guards';
import { z } from 'zod';

const addWishlistSchema = z.object({
  productId: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const products = await wishlistService.getWishlist(session.user.id);
    return NextResponse.json({ data: products });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch wishlist' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { productId } = addWishlistSchema.parse(body);
    await wishlistService.addItem(session.user.id, productId);
    return NextResponse.json({ data: { success: true } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid product ID', details: error.issues } },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to add to wishlist' } },
      { status: 500 }
    );
  }
}