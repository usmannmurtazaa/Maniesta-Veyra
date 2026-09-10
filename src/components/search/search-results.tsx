'use client';

import { ProductCardClient } from '@/components/product/product-card-client';

interface SearchResultProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
}

interface SearchResultsProps {
  products: SearchResultProduct[];
}

export function SearchResults({ products }: SearchResultsProps) {
  if (products.length === 0) {
    return <p className="text-mv-muted">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCardClient
          key={product.id}
          id={product.id}
          slug={product.slug}
          name={product.name}
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          imageUrl={product.imageUrl}
        />
      ))}
    </div>
  );
}