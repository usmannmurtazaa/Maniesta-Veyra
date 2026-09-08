import { NextRequest, NextResponse } from 'next/server';
import { wishlistService } from '@/lib/services/wishlist-service';
import { requireAuth } from '@/lib/auth/guards';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await requireAuth();
    await wishlistService.removeItem(session.user.id, params.productId);
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to remove from wishlist' } },
      { status: 500 }
    );
  }
}