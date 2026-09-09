import { notFound } from 'next/navigation';
import { orderService } from '@/lib/services/order-service';
import { requireAuth } from '@/lib/auth/guards';
import { Container } from '@/components/layout';
import { OrderStatusBadge } from '@/components/order/order-status-badge';

interface OrderDetailPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await requireAuth();
  const { orderNumber } = await params;

  let order;
  try {
    order = await orderService.getOrderByNumber(orderNumber, session.user.id);
  } catch {
    notFound();
  }

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold">Order #{order.orderNumber}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Items</h2>
          {order.items.map((item: any) => (
            <div key={item.id} className="border border-mv-border rounded-lg p-4">
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm text-mv-muted">
                {item.colorName} / {item.sizeLabel} × {item.quantity}
              </p>
              <p className="text-sm font-semibold">₨ {Number(item.totalPrice).toLocaleString()}</p>
              {item.isCustomDesign && (
                <p className="text-xs text-mv-warning mt-1">Custom design order</p>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="border border-mv-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <p>Subtotal: ₨ {Number(order.subtotal).toLocaleString()}</p>
            <p>Discount: -₨ {Number(order.discountAmount).toLocaleString()}</p>
            <p>Shipping: ₨ {Number(order.shippingCost).toLocaleString()}</p>
            <p className="font-bold">Total: ₨ {Number(order.total).toLocaleString()}</p>
          </div>

          <div className="border border-mv-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p className="text-sm">{order.shippingAddressSnapshot ? JSON.stringify(order.shippingAddressSnapshot) : 'N/A'}</p>
          </div>

          <div className="border border-mv-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Payment</h3>
            <p className="text-sm">Method: {order.paymentMethod.replace(/_/g, ' ')}</p>
            <p className="text-sm">Status: {order.paymentStatus.replace(/_/g, ' ')}</p>
          </div>
        </div>
      </div>
    </Container>
  );
}