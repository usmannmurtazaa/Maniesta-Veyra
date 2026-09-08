import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { OrderStatusBadge } from '@/components/order/order-status-badge';
import Link from 'next/link';

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  await requireAdmin();
  const page = Number(searchParams.page || 1);
  const status = searchParams.status as any;
  const { data: orders, pagination } = await adminService.listOrders(page, 10, status);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Orders</h1>
      <div className="overflow-x-auto border border-mv-border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-mv-bg-alt">
            <tr>
              <th className="p-3 text-left">Order #</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-mv-border">
                <td className="p-3">{order.orderNumber}</td>
                <td className="p-3">{order.customerEmail}</td>
                <td className="p-3">₨ {Number(order.total).toLocaleString()}</td>
                <td className="p-3"><OrderStatusBadge status={order.status} /></td>
                <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <Link href={`/admin/orders/${order.id}`} className="text-mv-primary hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}