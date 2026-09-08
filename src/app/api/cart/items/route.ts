import { NextRequest, NextResponse } from 'next/server';
import { cartService } from '@/lib/services/cart-service';
import { auth } from '@/lib/auth/auth';
import { addCartItemSchema } from '@/lib/validation/cart.schema';
import { getGuestSessionId, setGuestSessionCookie } from '@/lib/utils/cart-session';
import { prisma } from '@/lib/db/prisma';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    let cart;
    if (session?.user?.id) {
      cart = await cartService.getOrCreateCart({ userId: session.user.id });
    } else {
      let guestSessionId = getGuestSessionId();
      if (!guestSessionId) {
        cart = await cartService.getOrCreateCart({ guestSessionId: undefined });
        guestSessionId = cart.guestSessionId!;
        setGuestSessionCookie(guestSessionId);
      } else {
        cart = await cartService.getOrCreateCart({ guestSessionId });
      }
    }

    const body = await request.json();
    const input = addCartItemSchema.parse(body);

    if (input.customDesignId) {
      const design = await prisma.customDesign.findUnique({
        where: { id: input.customDesignId },
      });
      if (!design) {
        return NextResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Custom design not found' } },
          { status: 404 }
        );
      }
      if (session?.user?.id && design.userId && design.userId !== session.user.id) {
        return NextResponse.json(
          { error: { code: 'FORBIDDEN', message: 'Not your design' } },
          { status: 403 }
        );
      }
    }

    const item = await cartService.addItem(cart.id, input);
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues } },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message.includes('Only')) {
      return NextResponse.json(
        { error: { code: 'OUT_OF_STOCK', message: error.message } },
        { status: 409 }
      );
    }
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to add to cart' } },
      { status: 500 }
    );
  }
}