import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { ProductEditForm } from '@/components/admin/product-edit-form';
import { VariantManager } from '@/components/admin/variant-manager';
import { notFound } from 'next/navigation';

export default async function AdminProductEditPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const product = await adminService.getProduct(params.id);
  if (!product) notFound();
  const categories = await adminService.listCategories();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Edit Product</h1>
      <div className="space-y-8">
        <ProductEditForm product={product} categories={categories} />
        <VariantManager productId={product.id} variants={product.variants} />
      </div>
    </div>
  );
}