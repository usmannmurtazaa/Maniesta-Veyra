import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface AdminProductsPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = Number(params.page || 1);
  const search = params.search;

  const { data: products } = await adminService.listProducts(page, 10, search);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto border border-mv-border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-mv-bg-alt">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">SKU Prefix</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-mv-border">
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3">{product.skuPrefix}</td>
                <td className="p-3">₨ {Number(product.basePrice).toLocaleString()}</td>
                <td className="p-3">
                  <Badge variant={product.isActive ? 'success' : 'error'}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${product.id}`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <form
                      action={async () => {
                        'use server';
                        await adminService.softDeleteProduct(product.id);
                      }}
                    >
                      <Button type="submit" variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-mv-error" />
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}