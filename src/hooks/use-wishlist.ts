'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

export function useWishlist(productId: string, initialWishlisted = false) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);

  const toggleWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const method = isWishlisted ? 'DELETE' : 'POST';
      const url = isWishlisted ? `/api/wishlist/${productId}` : '/api/wishlist';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? JSON.stringify({ productId }) : undefined,
      });

      const result = await response.json();
      if (response.ok) {
        setIsWishlisted(!isWishlisted);
        toast({
          title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
        });
        router.refresh();
      } else {
        toast({
          title: 'Error',
          description: result.error?.message || 'Failed to update wishlist',
          variant: 'destructive',
        });
      }
    } catch {
      toast({ title: 'Error', description: 'Network error', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [isWishlisted, productId, router]);

  return {
    isWishlisted,
    toggleWishlist,
    loading,
  };
}