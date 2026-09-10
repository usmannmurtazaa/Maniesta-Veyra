'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/layout';
import { ProductCardClient } from '@/components/product/product-card-client';
import { EmptyState } from '@/components/shared/empty-state';
import { useRouter } from 'next/navigation';

interface WishlistProduct {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  compareAtPrice?: number | null;
  images: { id: string; url: string }[];
}

export function WishlistPage() {
  const router = useRouter();
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = () => {
    setLoading(true);
    fetch('/api/wishlist')
      .then((res) => res.json())
      .then((result) => {
        if (result.data) setProducts(result.data);
      })
      .catch(() => {
        // If unauthorized, redirect to login
        router.push('/auth/login?redirect=/wishlist');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Container className="py-16 text-center">
        <p className="text-mv-muted">Loading your wishlist...</p>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <h1 className="font-display text-3xl font-bold text-mv-text mb-6">
        Your Wishlist
      </h1>

      {products.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          description="Save items you love to your wishlist and they'll appear here."
          actionLabel="Browse products"
          actionHref="/shop"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCardClient
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              price={Number(product.basePrice)}
              compareAtPrice={
                product.compareAtPrice ? Number(product.compareAtPrice) : undefined
              }
              imageUrl={product.images[0]?.url}
              isWishlisted
            />
          ))}
        </div>
      )}
    </Container>
  );
}