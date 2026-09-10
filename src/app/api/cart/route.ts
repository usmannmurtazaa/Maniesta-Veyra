import { NextRequest, NextResponse } from 'next/server';
import { cartService } from '@/lib/services/cart-service';
import { auth } from '@/lib/auth/auth';
import { getGuestSessionId, setGuestSessionCookie } from '@/lib/utils/cart-session';

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    let cart;

    if (session?.user?.id) {
      cart = await cartService.getOrCreateCart({ userId: session.user.id });
    } else {
      let guestSessionId = await getGuestSessionId();
      if (!guestSessionId) {
        cart = await cartService.getOrCreateCart({ guestSessionId: undefined });
        guestSessionId = cart.guestSessionId!;
        await setGuestSessionCookie(guestSessionId);
      } else {
        cart = await cartService.getOrCreateCart({ guestSessionId });
      }
    }

    const detailedCart = await cartService.getCart(cart.id);
    return NextResponse.json({ data: detailedCart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch cart' } },
      { status: 500 }
    );
  }
}