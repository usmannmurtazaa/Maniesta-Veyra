'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { ProductCard } from './product-card';

interface ProductCardClientProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
  badge?: string;
  rating?: number;
  ratingCount?: number;
  isWishlisted?: boolean;
}

export function ProductCardClient({
  id,
  slug,
  name,
  price,
  compareAtPrice,
  imageUrl,
  badge,
  rating,
  ratingCount,
  isWishlisted = false,
}: ProductCardClientProps) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [loading, setLoading] = useState(false);

  const toggleWishlist = async () => {
    setLoading(true);
    try {
      const method = wishlisted ? 'DELETE' : 'POST';
      const url = wishlisted ? `/api/wishlist/${id}` : '/api/wishlist';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? JSON.stringify({ productId: id }) : undefined,
      });
      if (response.ok) {
        setWishlisted(!wishlisted);
        toast({
          title: wishlisted ? 'Removed from wishlist' : 'Added to wishlist',
          variant: 'default',
        });
        router.refresh();
      } else {
        const result = await response.json();
        toast({
          title: 'Error',
          description: result.error?.message || 'Failed to update wishlist',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Network error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductCard
      id={id}
      slug={slug}
      name={name}
      price={price}
      compareAtPrice={compareAtPrice}
      imageUrl={imageUrl}
      badge={badge}
      rating={rating}
      ratingCount={ratingCount}
      isWishlisted={wishlisted}
      onWishlist={toggleWishlist}
      onQuickView={() => router.push(`/products/${slug}`)}
      onAddToCart={() => {
        // Cart functionality will be implemented in Phase 6
        toast({
          title: 'Cart coming soon',
          description: 'Cart functionality will be available shortly.',
        });
      }}
    />
  );
}