'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AddToCartButtonProps {
  productVariantId: string;
  quantity?: number;
  className?: string;
  disabled?: boolean;
  customDesignId?: string;
}

export function AddToCartButton({
  productVariantId,
  quantity = 1,
  className,
  disabled = false,
  customDesignId,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!productVariantId && !customDesignId) {
      toast({ title: 'Error', description: 'Please select a variant', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productVariantId: productVariantId || undefined,
          customDesignId: customDesignId || undefined,
          quantity,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({ title: 'Added to cart', description: 'Your cart has been updated.' });
        router.refresh();
      } else {
        toast({
          title: 'Error',
          description: result.error?.message || 'Failed to add to cart',
          variant: 'destructive',
        });
      }
    } catch {
      toast({ title: 'Error', description: 'Network error. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || loading}
      className={className}
      aria-label="Add to cart"
    >
      <ShoppingBag className="h-4 w-4" />
      {loading ? 'Adding...' : 'Add to Cart'}
    </Button>
  );
}