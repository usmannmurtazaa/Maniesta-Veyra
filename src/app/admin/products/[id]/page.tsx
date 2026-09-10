import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { ProductEditForm } from '@/components/admin/product-edit-form';
import { VariantManager } from '@/components/admin/variant-manager';
import { notFound } from 'next/navigation';

interface AdminProductEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProductEditPage({ params }: AdminProductEditPageProps) {
  await requireAdmin();
  const { id } = await params;

  const product = await adminService.getProduct(id);
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