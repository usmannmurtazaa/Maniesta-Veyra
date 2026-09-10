import { NextRequest, NextResponse } from 'next/server';
import { wishlistService } from '@/lib/services/wishlist-service';
import { requireAuth } from '@/lib/auth/guards';
import { AppError } from '@/lib/errors';

interface RouteContext {
  params: Promise<{ productId: string }>;
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const session = await requireAuth();
    const { productId } = await params;
    await wishlistService.removeItem(session.user.id, productId);
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.statusCode }
      );
    }
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to remove from wishlist' } },
      { status: 500 }
    );
  }
}