import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/lib/services/order-service';
import { auth } from '@/lib/auth/auth';

interface RouteContext {
  params: Promise<{ orderNumber: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { orderNumber } = await params;
    const session = await auth();
    const userId = session?.user?.id;
    const order = await orderService.getOrderByNumber(orderNumber, userId);
    return NextResponse.json({ data: order });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not your order') {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Not your order' } },
        { status: 403 }
      );
    }
    if (error instanceof Error && error.message === 'Order not found') {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Order not found' } },
        { status: 404 }
      );
    }
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch order' } },
      { status: 500 }
    );
  }
}