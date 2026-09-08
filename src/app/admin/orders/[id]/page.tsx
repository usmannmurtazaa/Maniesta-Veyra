import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { OrderStatusBadge } from '@/components/order/order-status-badge';
import { UpdateOrderStatusForm } from '@/components/admin/update-order-status-form';
import { notFound } from 'next/navigation';

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const order = await adminService.getOrder(params.id);
  if (!order) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-4">Order #{order.orderNumber}</h1>
      <div className="mb-6"><OrderStatusBadge status={order.status} /></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Items</h2>
          {order.items.map((item) => (
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
        <div className="space-y-4">
          <div className="border border-mv-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Customer</h3>
            <p>{order.customerEmail}</p>
            <p>{order.customerPhone}</p>
            <h4 className="font-medium mt-4">Shipping Address</h4>
            <p className="text-sm">{JSON.stringify(order.shippingAddressSnapshot)}</p>
          </div>
          <div className="border border-mv-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Totals</h3>
            <p>Subtotal: ₨ {Number(order.subtotal).toLocaleString()}</p>
            <p>Discount: -₨ {Number(order.discountAmount).toLocaleString()}</p>
            <p>Shipping: ₨ {Number(order.shippingCost).toLocaleString()}</p>
            <p className="font-bold">Total: ₨ {Number(order.total).toLocaleString()}</p>
          </div>
          <UpdateOrderStatusForm orderId={order.id} currentStatus={order.status} />
        </div>
      </div>
    </div>
  );
}