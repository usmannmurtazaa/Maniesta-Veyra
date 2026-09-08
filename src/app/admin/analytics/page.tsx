import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { SalesChart } from '@/components/admin/sales-chart';

export default async function AdminAnalyticsPage() {
  await requireAdmin();
  const analytics = await adminService.getSalesAnalytics(30);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Sales Analytics</h1>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border border-mv-border rounded-lg p-4">
          <p className="text-sm text-mv-muted">Total Sales (30 days)</p>
          <p className="text-2xl font-bold">₨ {analytics.totalSales.toLocaleString()}</p>
        </div>
        <div className="border border-mv-border rounded-lg p-4">
          <p className="text-sm text-mv-muted">Orders (30 days)</p>
          <p className="text-2xl font-bold">{analytics.orderCount}</p>
        </div>
      </div>
      <SalesChart dailySales={analytics.dailySales} />
    </div>
  );
}