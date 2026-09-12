import { productService } from '@/lib/services/product-service';
import { ProductCardClient } from './product-card-client';

interface RelatedProductsProps {
  categoryId: string;
  categorySlug: string;
  currentProductId: string;
}

export async function RelatedProducts({
  categorySlug,
  currentProductId,
}: RelatedProductsProps) {
  const result = await productService.getProducts({
    page: 1,
    limit: 8,
    category: categorySlug,
    sort: 'newest',
  });

  const related = result.data
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-bold mb-6 text-mv-text">
        You may also like
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {related.map((product) => (
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
            categoryName={product.category?.name}
            inStock={product.variants.some((v) => v.stock > 0)}
          />
        ))}
      </div>
    </section>
  );
}