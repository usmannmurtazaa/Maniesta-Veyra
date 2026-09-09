import { searchService } from '@/lib/services/search-service';
import { searchQuerySchema } from '@/lib/validation/search.schema';
import { ProductCardClient } from '@/components/product/product-card-client';
import { Container } from '@/components/layout';
import { Pagination } from '@/components/ui/pagination';

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';

  if (!q) {
    return (
      <Container className="py-16 text-center">
        <h1 className="font-display text-3xl font-bold">Search</h1>
        <p className="text-mv-muted mt-2">Enter a search term to find products.</p>
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
    <Container className="py-8">
      <h1 className="font-display text-2xl font-bold mb-6">Search results for &quot;{query.q}&quot;</h1>
      {products.length === 0 ? (
        <p className="text-mv-muted">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                basePath={`/search?q=${query.q}`}
              />
            </div>
          )}
        </>
      )}
    </Container>
  );
}