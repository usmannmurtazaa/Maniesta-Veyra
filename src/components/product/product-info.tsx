'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PriceDisplay } from './price-display';
import { RatingStars } from '@/components/reviews/rating-stars';
import { useCartStore } from '@/stores/cart-store';

/**
 * Prisma returns Decimal for numeric columns. It's not directly
 * assignable to `number | string`, so we accept anything with a
 * toString/toNumber — which covers Decimal, number, and string alike.
 * Call sites use `Number(...)` to coerce safely.
 */
type NumericLike = number | string | { toString(): string };

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: NumericLike;
    compareAtPrice?: NumericLike | null;
    ratingAvg: NumericLike;
    ratingCount: number;
    material?: string | null;
    careInstructions?: string | null;
    colors: { id: string; name: string; hexCode: string }[];
    sizes: { id: string; label: string }[];
    variants: {
      id: string;
      sku: string;
      price: NumericLike | null;
      stock: number;
      colorId: string;
      sizeId: string;
    }[];
    images: { id: string; url: string; altText: string | null }[];
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.id ?? '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const selectedVariant = product.variants.find(
    (v) => v.colorId === selectedColor && v.sizeId === selectedSize
  );

  const unitPrice = Number(selectedVariant?.price ?? product.basePrice);

  function changeQuantity(delta: number) {
    setQuantity((q) => Math.max(1, Math.min(10, q + delta)));
  }

  async function handleAddToCart() {
    if (!selectedVariant || selectedVariant.stock === 0) return;
    setIsAdding(true);
    try {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productVariantId: selectedVariant.id,
          quantity,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: 'Could not add to cart',
          description: data?.error?.message ?? 'Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Hydrate the cart store so the navbar badge updates
      const cartRes = await fetch('/api/cart');
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        const items = (cartData?.data?.items ?? []).map(
          (item: {
            id: string;
            productVariantId: string | null;
            customDesignId: string | null;
            quantity: number;
            isSavedForLater: boolean;
            productVariant?: {
              id: string;
              sku: string;
              price: string | number | null;
              stock: number;
              color: { name: string };
              size: { label: string };
              product: {
                name: string;
                slug: string;
                basePrice: string | number;
                images: { url: string }[];
              };
            };
            customDesign?: {
              unitPrice: string | number;
              previewImageUrl: string | null;
              garment: { name: string };
              color: { name: string };
              size: { label: string };
            };
          }) => ({
            id: item.id,
            productVariantId: item.productVariantId,
            customDesignId: item.customDesignId,
            quantity: item.quantity,
            isSavedForLater: item.isSavedForLater,
            price: item.productVariant
              ? Number(item.productVariant.price ?? item.productVariant.product.basePrice)
              : Number(item.customDesign?.unitPrice ?? 0),
            product: item.productVariant
              ? {
                name: item.productVariant.product.name,
                slug: item.productVariant.product.slug,
                imageUrl: item.productVariant.product.images?.[0]?.url,
                color: item.productVariant.color?.name,
                size: item.productVariant.size?.label,
              }
              : undefined,
            customDesign: item.customDesign
              ? {
                garmentName: item.customDesign.garment?.name ?? 'Custom',
                color: item.customDesign.color?.name ?? '',
                size: item.customDesign.size?.label ?? '',
                previewImageUrl: item.customDesign.previewImageUrl ?? undefined,
              }
              : undefined,
          })
        );
        useCartStore.getState().setCart(items);
      }

      toast({
        title: 'Added to cart',
        description: `${product.name} — ${quantity} × ₨ ${unitPrice.toLocaleString()}`,
      });
      router.refresh();
    } catch {
      toast({
        title: 'Network error',
        description: 'Please check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  }

  const isOutOfStock = !selectedVariant || selectedVariant.stock === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-mv-text">
          {product.name}
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <RatingStars rating={Number(product.ratingAvg)} />
          <span className="text-sm text-mv-muted">
            {product.ratingCount > 0
              ? `(${product.ratingCount} review${product.ratingCount === 1 ? '' : 's'})`
              : 'No reviews yet'}
          </span>
        </div>
      </div>

      <PriceDisplay
        price={unitPrice}
        compareAtPrice={
          product.compareAtPrice ? Number(product.compareAtPrice) : undefined
        }
      />

      {product.colors.length > 1 && (
        <div>
          <Label className="mb-2 block">
            Color: <span className="font-normal text-mv-muted">{product.colors.find((c) => c.id === selectedColor)?.name}</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => {
              const isSelected = selectedColor === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColor(color.id)}
                  className={`h-9 w-9 rounded-full border-2 transition ${isSelected ? 'border-mv-primary ring-2 ring-mv-primary/20' : 'border-mv-border'
                    }`}
                  style={{ backgroundColor: color.hexCode }}
                  aria-label={color.name}
                  aria-pressed={isSelected}
                />
              );
            })}
          </div>
        </div>
      )}

      {product.sizes.length > 0 && (
        <div>
          <Label className="mb-2 block">Size</Label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const isSelected = selectedSize === size.id;
              const variant = product.variants.find(
                (v) => v.colorId === selectedColor && v.sizeId === size.id
              );
              const sizeOutOfStock = !variant || variant.stock === 0;
              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => !sizeOutOfStock && setSelectedSize(size.id)}
                  disabled={sizeOutOfStock}
                  className={`h-10 min-w-10 px-3 rounded-md border text-sm font-medium transition ${isSelected
                      ? 'bg-mv-primary text-white border-mv-primary'
                      : 'bg-white border-mv-border hover:border-mv-primary'
                    } ${sizeOutOfStock ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                  aria-pressed={isSelected}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Label>Quantity</Label>
        <div className="flex items-center border border-mv-border rounded-md">
          <button
            type="button"
            onClick={() => changeQuantity(-1)}
            disabled={quantity <= 1}
            className="h-10 w-10 flex items-center justify-center hover:bg-mv-bg-alt disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => changeQuantity(1)}
            disabled={quantity >= 10 || (selectedVariant?.stock ?? 0) <= quantity}
            className="h-10 w-10 flex items-center justify-center hover:bg-mv-bg-alt disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {selectedVariant && (
        <p className="text-sm">
          {selectedVariant.stock > 0 ? (
            selectedVariant.stock <= 5 ? (
              <span className="text-mv-warning">
                Only {selectedVariant.stock} left in stock
              </span>
            ) : (
              <span className="text-mv-success">In stock</span>
            )
          ) : (
            <span className="text-mv-error">Out of stock</span>
          )}
        </p>
      )}

      <div className="flex gap-3">
        <Button
          className="flex-1"
          size="lg"
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
        >
          <ShoppingBag className="h-4 w-4" />
          {isAdding ? 'Adding…' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>

      <div className="border-t border-mv-border pt-6 space-y-3 text-sm text-mv-text-secondary">
        <p>{product.description}</p>
        {product.material && (
          <p>
            <span className="font-medium text-mv-text">Material:</span>{' '}
            {product.material}
          </p>
        )}
        {product.careInstructions && (
          <p>
            <span className="font-medium text-mv-text">Care:</span>{' '}
            {product.careInstructions}
          </p>
        )}
        <p>
          <span className="font-medium text-mv-text">Shipping:</span> Delivery in
          3–5 business days within Pakistan.
        </p>
        <p>
          <span className="font-medium text-mv-text">Returns:</span> 14-day
          exchange on unworn items.
        </p>
      </div>
    </div>
  );
}