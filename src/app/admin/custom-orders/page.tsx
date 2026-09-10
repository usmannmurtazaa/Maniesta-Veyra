import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { Badge } from '@/components/ui/badge';
import { CustomOrderStatus } from '@prisma/client';
import Link from 'next/link';

interface AdminCustomOrdersPageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function AdminCustomOrdersPage({
  searchParams,
}: AdminCustomOrdersPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = Number(params.page || 1);
  const status = params.status as CustomOrderStatus | undefined;

  const { data: trackings } = await adminService.listCustomOrders(page, 10, status);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Custom Orders</h1>
      <div className="overflow-x-auto border border-mv-border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-mv-bg-alt">
            <tr>
              <th className="p-3 text-left">Tracking ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Garment</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trackings.map((tracking) => (
              <tr key={tracking.id} className="border-t border-mv-border">
                <td className="p-3">{tracking.id.slice(0, 8)}...</td>
                <td className="p-3">{tracking.orderItem.order.customerEmail}</td>
                <td className="p-3">{tracking.orderItem.customDesign?.garment.name}</td>
                <td className="p-3">
                  <Badge>{tracking.status.replace(/_/g, ' ')}</Badge>
                </td>
                <td className="p-3">
                  {new Date(tracking.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <Link
                    href={`/admin/custom-orders/${tracking.id}`}
                    className="text-mv-primary hover:underline"
                  >
                    Review
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