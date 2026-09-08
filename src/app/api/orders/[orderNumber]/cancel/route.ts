import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/lib/services/order-service';
import { auth } from '@/lib/auth/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const order = await orderService.cancelOrder(params.orderNumber, userId);
    return NextResponse.json({ data: order });
  } catch (error) {
    if (error instanceof Error && error.message === 'Only pending orders can be cancelled') {
      return NextResponse.json(
        { error: { code: 'CONFLICT', message: error.message } },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to cancel order' } },
      { status: 500 }
    );
  }
}