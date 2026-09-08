import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { ProductForm } from '@/components/admin/product-form';

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await adminService.listCategories();
  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Add Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}