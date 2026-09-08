import { productService } from '@/lib/services/product-service';
import { categoryService } from '@/lib/services/category-service';
import { productQuerySchema } from '@/lib/validation/product.schema';
import { ProductCardClient } from '@/components/product/product-card-client';
import { Container } from '@/components/layout';
import { Pagination } from '@/components/ui/pagination';
import { ShopFilters } from '@/components/filters/shop-filters';

interface CategoryPageProps {
  params: { categorySlug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const query = productQuerySchema.parse({
    ...searchParams,
    category: params.categorySlug,
  });

  const [productsResult, categories] = await Promise.all([
    productService.getProducts(query),
    categoryService.getCategories({}),
  ]);

  const { data: products, pagination } = productsResult;

  return (
    <Container className="py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <ShopFilters categories={categories} />
        </aside>

        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold capitalize mb-4">{params.categorySlug.replace(/-/g, ' ')}</h1>
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
          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                basePath={`/shop/${params.categorySlug}`}
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}