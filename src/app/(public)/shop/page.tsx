import { Suspense } from 'react';
import { productService } from '@/lib/services/product-service';
import { categoryService } from '@/lib/services/category-service';
import { productQuerySchema } from '@/lib/validation/product.schema';
import { ProductCardClient } from '@/components/product/product-card-client';
import { Container } from '@/components/layout';
import { Pagination } from '@/components/ui/pagination';
import { ShopFilters } from '@/components/filters/shop-filters';
import { ProductGridSkeleton } from '@/components/shared/loading-skeleton';

export const metadata = {
  title: 'Shop | Maniesta Veyra',
  description: 'Browse premium clothing at Maniesta Veyra.',
};

interface ShopPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const parsed = productQuerySchema.parse(searchParams);
  const [productsResult, categories] = await Promise.all([
    productService.getProducts(parsed),
    categoryService.getCategories({
      includeInactive: false
    }),
  ]);

  const { data: products, pagination } = productsResult;

  return (
    <Container className="py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters (desktop) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <ShopFilters categories={categories} />
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {/* Mobile filter button - we'll add later */}
          <div className="mb-4 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold">Shop</h1>
            <span className="text-sm text-mv-muted">{pagination.total} products</span>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
  <ProductCardClient
    key={product.id}
    id={product.id}
    slug={product.slug}
    name={product.name}
    price={Number(product.basePrice)}
    compareAtPrice={product.compareAtPrice ? Number(product.compareAtPrice) : undefined}
    imageUrl={product.images[0]?.url}
  />
))}
            </div>
          </Suspense>

          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                basePath="/shop"
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}