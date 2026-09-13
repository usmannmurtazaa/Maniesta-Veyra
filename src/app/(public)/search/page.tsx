import type { Metadata } from 'next';
import { searchService } from '@/lib/services/search-service';
import { searchQuerySchema } from '@/lib/validation/search.schema';
import { ProductCardClient } from '@/components/product/product-card-client';
import { Container } from '@/components/layout';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState } from '@/components/shared/empty-state';

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q.trim() : '';

  return {
    title: q ? `Search: ${q} | Maniesta Veyra` : 'Search | Maniesta Veyra',
    description: q
      ? `Search results for "${q}" at Maniesta Veyra.`
      : 'Search our collection of premium clothing.',
    // Search result pages are dynamic and duplicate-heavy — don't index them.
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q.trim() : '';

  // No query → show empty prompt
  if (!q) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Search our collection"
          description="Use the search bar above to find products by name, category, or SKU."
          actionLabel="Browse all products"
          actionHref="/shop"
        />
      </Container>
    );
  }

  const query = searchQuerySchema.parse({
    q,
    page: params.page,
    limit: params.limit,
  });

  const result = await searchService.search(query);
  const { data: products, pagination } = result;

  return (
    <Container className="py-8 md:py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-mv-text">
          Results for &ldquo;{q}&rdquo;
        </h1>
        <p className="mt-1 text-sm text-mv-muted">
          {pagination.total} {pagination.total === 1 ? 'result' : 'results'}
        </p>
      </div>

      {products.length === 0 ? (
        <EmptyState
          title={`No results for "${q}"`}
          description="Try a different search term, or browse the full collection."
          actionLabel="Browse all products"
          actionHref="/shop"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
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
                secondaryImageUrl={product.images[1]?.url}
                categoryName={product.category?.name}
                rating={
                  product.ratingCount > 0
                    ? Number(product.ratingAvg)
                    : undefined
                }
                ratingCount={product.ratingCount || undefined}
                inStock={
                  product.variants?.some((v) => v.stock > 0) ?? true
                }
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

          {pagination.totalPages > 1 && (
            <div className="mt-8 md:mt-12">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                // basePath may contain `?q=…`; Pagination handles the `&page=` separator
                basePath={`/search?q=${encodeURIComponent(q)}`}
              />
            </div>
          )}
        </>
      )}
    </Container>
  );
}