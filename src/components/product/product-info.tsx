'use client';

import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PriceDisplay } from './price-display';
import { RatingStars } from '@/components/reviews/rating-stars';

interface ProductInfoProps {
  product: any; // Use proper type from service
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.id || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.id || '');
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants.find(
    (v: any) => v.colorId === selectedColor && v.sizeId === selectedSize
  );

  const handleAddToCart = () => {
    // Cart integration in Phase 6
    toast({
      title: 'Cart coming soon',
      description: 'Cart functionality will be available shortly.',
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">{product.name}</h1>
      <div className="flex items-center gap-2">
        <RatingStars rating={Number(product.ratingAvg)} />
        <span className="text-sm text-mv-muted">({product.ratingCount} reviews)</span>
      </div>
      <PriceDisplay
        price={Number(product.basePrice)}
        compareAtPrice={product.compareAtPrice ? Number(product.compareAtPrice) : undefined}
      />

      {/* Color selector */}
      <div>
        <Label className="mb-2">Color</Label>
        <div className="flex gap-2">
          {product.colors.map((color: any) => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(color.id)}
              className={`h-8 w-8 rounded-full border-2 ${
                selectedColor === color.id ? 'border-mv-primary' : 'border-mv-border'
              }`}
              style={{ backgroundColor: color.hexCode }}
              aria-label={color.name}
            />
          ))}
        </div>
      </div>

      {/* Size selector */}
      <div>
        <Label className="mb-2">Size</Label>
        <div className="flex gap-2">
          {product.sizes.map((size: any) => (
            <button
              key={size.id}
              onClick={() => setSelectedSize(size.id)}
              className={`h-10 min-w-10 px-3 rounded-md border text-sm font-medium ${
                selectedSize === size.id
                  ? 'bg-mv-primary text-white border-mv-primary'
                  : 'bg-white border-mv-border'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <Label>Quantity</Label>
        <Input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="w-20"
        />
      </div>

      {/* Stock status */}
      {selectedVariant ? (
        <p className="text-sm">
          {selectedVariant.stock > 0 ? (
            <span className="text-mv-success">In stock ({selectedVariant.stock} available)</span>
          ) : (
            <span className="text-mv-error">Out of stock</span>
          )}
        </p>
      ) : (
        <p className="text-sm text-mv-muted">Select a variant</p>
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={handleAddToCart}
        disabled={!selectedVariant || selectedVariant.stock === 0}
      >
        Add to Cart
      </Button>

      <div className="text-sm text-mv-muted">
        <p>{product.description}</p>
        {product.material && <p className="mt-2">Material: {product.material}</p>}
        {product.careInstructions && <p className="mt-1">Care: {product.careInstructions}</p>}
      </div>
    </div>
  );
}