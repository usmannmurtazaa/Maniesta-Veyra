'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface WishlistButtonProps {
  productId: string;
  isWishlisted?: boolean;
  className?: string;
  size?: 'icon' | 'sm' | 'lg' | 'default';
}

export function WishlistButton({
  productId,
  isWishlisted = false,
  className,
  size = 'icon',
}: WishlistButtonProps) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [loading, setLoading] = useState(false);

  const toggleWishlist = async () => {
    setLoading(true);
    try {
      const method = wishlisted ? 'DELETE' : 'POST';
      const url = wishlisted ? `/api/wishlist/${productId}` : '/api/wishlist';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? JSON.stringify({ productId }) : undefined,
      });

      const result = await response.json();
      if (response.ok) {
        setWishlisted(!wishlisted);
        toast({
          title: wishlisted ? 'Removed from wishlist' : 'Added to wishlist',
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
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={toggleWishlist}
      disabled={loading}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={wishlisted}
      className={className}
    >
      <Heart
        className={`h-4 w-4 ${
          wishlisted ? 'fill-mv-accent text-mv-accent' : ''
        }`}
      />
    </Button>
  );
}