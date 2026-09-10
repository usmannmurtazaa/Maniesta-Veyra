'use client';

import { useEffect, useState } from 'react';
import { ProductCardClient } from './product-card-client';
import { ProductGrid } from './product-grid';

interface RecentlyViewedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
}

export function RecentlyViewed() {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);

  useEffect(() => {
    // This would be fetched from an API or localStorage in production.
    // For now, we leave it as an empty state that can be filled later.
    setProducts([]);
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-bold text-mv-text mb-6">
        Recently Viewed
      </h2>
      <ProductGrid
        products={products}
        onQuickView={() => {}}
        onAddToCart={() => {}}
        onWishlist={() => {}}
      />
    </section>
  );
}