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
  secondaryImageUrl?: string;
  categoryName?: string;
  badge?: string;
  rating?: number;
  ratingCount?: number;
  inStock?: boolean;
  isWishlisted?: boolean;
}

export function ProductCardClient({
  id,
  slug,
  name,
  price,
  compareAtPrice,
  imageUrl,
  secondaryImageUrl,
  categoryName,
  badge,
  rating,
  ratingCount,
  inStock = true,
  isWishlisted = false,
}: ProductCardClientProps) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [isUpdating, setIsUpdating] = useState(false);

  async function toggleWishlist() {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const method = wishlisted ? 'DELETE' : 'POST';
      const url = wishlisted ? `/api/wishlist/${id}` : '/api/wishlist';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? JSON.stringify({ productId: id }) : undefined,
      });

      // Not logged in → redirect to login with a return URL
      if (res.status === 401) {
        toast({
          title: 'Sign in to save items',
          description: 'Create an account or sign in to use your wishlist.',
        });
        router.push(`/auth/login?redirect=/products/${slug}`);
        return;
      }

      if (res.ok) {
        setWishlisted(!wishlisted);
        toast({
          title: wishlisted ? 'Removed from wishlist' : 'Added to wishlist',
        });
        router.refresh();
      } else {
        const result = await res.json().catch(() => null);
        toast({
          title: 'Could not update wishlist',
          description: result?.error?.message ?? 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <ProductCard
      name={name}
      price={price}
      compareAtPrice={compareAtPrice}
      imageUrl={imageUrl}
      secondaryImageUrl={secondaryImageUrl}
      categoryName={categoryName}
      badge={badge}
      rating={rating}
      ratingCount={ratingCount}
      inStock={inStock}
      isWishlisted={wishlisted}
      onWishlist={toggleWishlist}
      onQuickView={() => router.push(`/products/${slug}`)}
      onAddToCart={() => router.push(`/products/${slug}`)}
    />
  );
}