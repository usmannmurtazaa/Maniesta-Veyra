import { NextRequest, NextResponse } from 'next/server';
import { cartService } from '@/lib/services/cart-service';
import { auth } from '@/lib/auth/auth';
import { getGuestSessionId, clearGuestSessionCookie } from '@/lib/utils/cart-session';

export async function POST(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const guestSessionId = await getGuestSessionId();
    if (guestSessionId) {
      await cartService.mergeGuestCart(session.user.id, guestSessionId);
      await clearGuestSessionCookie();
    }

    return NextResponse.json({ data: { merged: true } });
  } catch (error) {
    console.error('Error merging cart:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to merge cart' } },
      { status: 500 }
    );
  }
}