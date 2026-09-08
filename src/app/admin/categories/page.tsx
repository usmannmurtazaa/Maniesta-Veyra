import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { CategoryForm } from '@/components/admin/category-form';

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await adminService.listCategories();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Categories</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="border border-mv-border rounded p-2 flex justify-between">
                <span>{cat.name}</span>
                <span className="text-mv-muted text-sm">{cat.slug}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Create Category</h2>
          <CategoryForm />
        </div>
      </div>
    </div>
  );
}