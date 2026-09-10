import { orderService } from '@/lib/services/order-service';
import { auth } from '@/lib/auth/auth';
import { Container } from '@/components/layout';
import { OrderStatusBadge } from '@/components/order/order-status-badge';
import { notFound } from 'next/navigation';

interface ConfirmationPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderConfirmationPage({ params }: ConfirmationPageProps) {
  const { orderNumber } = await params;
  const session = await auth();

  const order = await orderService.getOrderByNumber(orderNumber, session?.user?.id);
  if (!order) notFound();

  return (
    <Container className="py-16 text-center">
      <h1 className="font-display text-3xl font-bold mb-4">Order Confirmed</h1>
      <p className="text-mv-muted mb-6">
        Thank you for your order! Your order number is <strong>{order.orderNumber}</strong>.
      </p>
      <div className="inline-block">
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="mt-8 max-w-md mx-auto border border-mv-border rounded-lg p-6 text-left">
        <h2 className="font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.productName} × {item.quantity}
              </span>
              <span>₨ {Number(item.totalPrice).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-mv-border mt-4 pt-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₨ {Number(order.subtotal).toLocaleString()}</span>
          </div>
          {Number(order.discountAmount) > 0 && (
            <div className="flex justify-between text-sm text-mv-success">
              <span>Discount</span>
              <span>-₨ {Number(order.discountAmount).toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>₨ {Number(order.shippingCost).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>₨ {Number(order.total).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Container>
  );
}