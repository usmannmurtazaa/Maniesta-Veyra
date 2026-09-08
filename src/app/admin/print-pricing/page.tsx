import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { PrintPricingForm } from '@/components/admin/print-pricing-form';

export default async function AdminPrintPricingPage() {
  await requireAdmin();
  // We'll need garments list to select
  const garments = await adminService.listGarments();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Print Pricing</h1>
      <PrintPricingForm garments={garments} />
    </div>
  );
}