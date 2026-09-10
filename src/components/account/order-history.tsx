'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { OrderStatusBadge } from '@/components/order/order-status-badge';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data.data || []));
  }, []);

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p className="text-mv-muted">No orders yet.</p>
      ) : (
        orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.orderNumber}`}
            className="block border border-mv-border rounded-lg p-4 hover:shadow-sm"
          >
            <div className="flex justify-between items-center">
              <p className="font-medium">Order #{order.orderNumber}</p>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-mv-muted mt-1">₨ {order.total.toLocaleString()}</p>
            <p className="text-xs text-mv-muted mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
          </Link>
        ))
      )}
    </div>
  );
}