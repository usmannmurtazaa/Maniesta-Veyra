import { requireAuth } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';
import { OrderStatusBadge } from '@/components/order/order-status-badge';
import Link from 'next/link';

export default async function OrdersPage() {
  const session = await requireAuth();
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          productVariant: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-mv-muted">You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.orderNumber}`} className="block border border-mv-border rounded-lg p-4 hover:shadow-sm">
              <div className="flex justify-between items-center">
                <p className="font-medium">Order #{order.orderNumber}</p>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-sm text-mv-muted mt-1">
                {order.items.length} item(s) · ₨ {Number(order.total).toLocaleString()}
              </p>
              <p className="text-xs text-mv-muted mt-1">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}