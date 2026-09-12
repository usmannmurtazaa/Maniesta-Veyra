import { Suspense } from 'react';
import { productService } from '@/lib/services/product-service';
import { categoryService } from '@/lib/services/category-service';
import { productQuerySchema } from '@/lib/validation/product.schema';
import { ProductCardClient } from '@/components/product/product-card-client';
import { Container } from '@/components/layout';
import { Pagination } from '@/components/ui/pagination';
import { ShopFilters } from '@/components/filters/shop-filters';
import { FilterDrawer } from '@/components/filters/filter-drawer';
import { SortDropdown } from '@/components/filters/sort-dropdown';
import { ProductGridSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';

export const metadata = {
  title: 'Shop | Maniesta Veyra',
  description:
    'Browse premium drop shoulder shirts and ready-made clothing at Maniesta Veyra.',
};

interface ShopPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const parsed = productQuerySchema.parse(searchParams);
  const [productsResult, categories] = await Promise.all([
    productService.getProducts(parsed),
    categoryService.getCategories({}),
  ]);

  const { data: products, pagination } = productsResult;

  return (
    <Container className="py-8 md:py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-mv-text">
          Shop
        </h1>
        <p className="mt-1 text-sm text-mv-muted">
          {pagination.total} {pagination.total === 1 ? 'product' : 'products'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <ShopFilters categories={categories} />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile controls */}
          <div className="flex items-center gap-2 mb-4 lg:hidden">
            <FilterDrawer categories={categories} />
            <div className="flex-1">
              <SortDropdown />
            </div>
          </div>

          {/* Desktop sort (right-aligned) */}
          <div className="hidden lg:flex justify-end mb-6">
            <div className="w-56">
              <SortDropdown />
            </div>
          </div>

          {products.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or browse the full collection."
            />
          ) : (
            <Suspense fallback={<ProductGridSkeleton />}>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCardClient
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    name={product.name}
                    price={Number(product.basePrice)}
                    compareAtPrice={
                      product.compareAtPrice
                        ? Number(product.compareAtPrice)
                        : undefined
                    }
                    imageUrl={product.images[0]?.url}
                    rating={
                      product.ratingCount > 0
                        ? Number(product.ratingAvg)
                        : undefined
                    }
                    ratingCount={product.ratingCount || undefined}
                    badge={
                      product.compareAtPrice
                        ? 'Sale'
                        : product.isNewArrival
                          ? 'New'
                          : undefined
                    }
                  />
                ))}
              </div>
            </Suspense>
          )}

          {pagination.totalPages > 1 && (
            <div className="mt-8 md:mt-12">
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