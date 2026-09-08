import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { InventoryTable } from '@/components/admin/inventory-table';

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: { page?: string; lowStockOnly?: string };
}) {
  await requireAdmin();
  const page = Number(searchParams.page || 1);
  const lowStockOnly = searchParams.lowStockOnly === 'true';
  const { data: variants, pagination } = await adminService.listInventory(page, 20, lowStockOnly);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Inventory</h1>
      <InventoryTable variants={variants} />
    </div>
  );
}