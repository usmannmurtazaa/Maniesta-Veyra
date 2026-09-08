import { productService } from '@/lib/services/product-service';
import { ProductCardClient } from './product-card-client';

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

export async function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const result = await productService.getProducts({
    page: 1,
    limit: 8,
    collections: 'featured',
    sort: 'newest',
  });
  const related = result.data.filter((p) => p.id !== currentProductId).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-bold mb-6">You may also like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((product) => (
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
    </section>
  );
}