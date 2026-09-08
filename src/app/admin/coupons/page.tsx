import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { CouponForm } from '@/components/admin/coupon-form';

export default async function AdminCouponsPage() {
  await requireAdmin();
  const coupons = await adminService.listCoupons();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Coupons</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Existing Coupons</h2>
          <div className="space-y-4">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="border border-mv-border rounded-lg p-4">
                <p className="font-medium">{coupon.code}</p>
                <p className="text-sm text-mv-muted">Type: {coupon.type} | Value: {Number(coupon.value)}</p>
                <p className="text-sm text-mv-muted">Used: {coupon.usageCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Create Coupon</h2>
          <CouponForm />
        </div>
      </div>
    </div>
  );
}