import { NextRequest, NextResponse } from 'next/server';
import { cartService } from '@/lib/services/cart-service';
import { updateCartItemSchema } from '@/lib/validation/cart.schema';
import { ZodError } from 'zod';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const input = updateCartItemSchema.parse(body);
    const item = await cartService.updateItem(params.id, input);
    return NextResponse.json({ data: item });
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
    if (error instanceof Error && error.message === 'Cart item not found') {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Cart item not found' } },
        { status: 404 }
      );
    }
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to update cart item' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await cartService.removeItem(params.id);
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to remove cart item' } },
      { status: 500 }
    );
  }
}