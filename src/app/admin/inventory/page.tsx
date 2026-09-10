import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { InventoryTable } from '@/components/admin/inventory-table';

interface AdminInventoryPageProps {
  searchParams: Promise<{ page?: string; lowStockOnly?: string }>;
}

export default async function AdminInventoryPage({ searchParams }: AdminInventoryPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = Number(params.page || 1);
  const lowStockOnly = params.lowStockOnly === 'true';

  const { data: variants } = await adminService.listInventory(page, 20, lowStockOnly);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Inventory</h1>
      <InventoryTable variants={variants} />
    </div>
  );
}