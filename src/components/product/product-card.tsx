'use client';

import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProductCardProps {
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
  onQuickView?: () => void;
  onAddToCart?: () => void;
  onWishlist?: () => void;
}

export function ProductCard({
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
  onQuickView,
  onAddToCart,
  onWishlist,
  isWishlisted,
}: ProductCardProps) {
  const hasSale = compareAtPrice && compareAtPrice > price;
  const discountPct = hasSale
    ? Math.round(((compareAtPrice! - price) / compareAtPrice!) * 100)
    : 0;

  return (
    <Card
      className="group relative overflow-hidden rounded-lg border-mv-border bg-white transition-all duration-300 hover:shadow-md"
      onClick={onQuickView}
      role="article"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-mv-bg-alt overflow-hidden">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={name}
              fill
              className={cn(
                'object-cover transition-all duration-500',
                secondaryImageUrl
                  ? 'group-hover:opacity-0 group-hover:scale-105'
                  : 'group-hover:scale-105'
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {secondaryImageUrl && (
              <Image
                src={secondaryImageUrl}
                alt=""
                fill
                aria-hidden
                className="object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-mv-muted">
            <ShoppingBag className="h-10 w-10" strokeWidth={1.25} />
          </div>
        )}

        {/* Sale badge */}
        {hasSale && (
          <span className="absolute left-3 top-3 rounded-sm bg-mv-accent px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            −{discountPct}%
          </span>
        )}
        {badge && !hasSale && (
          <span className="absolute left-3 top-3 rounded-sm bg-mv-primary px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            {badge}
          </span>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <span className="rounded-sm bg-mv-text px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-white">
              Sold out
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onWishlist?.();
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition hover:bg-white md:opacity-0 md:group-hover:opacity-100"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-colors',
              isWishlisted ? 'fill-mv-accent text-mv-accent' : 'text-mv-text'
            )}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 md:p-4">
        {categoryName && (
          <p className="mb-1 text-[11px] uppercase tracking-wider text-mv-muted">
            {categoryName}
          </p>
        )}

        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-mv-text">
          {name}
        </h3>

        {/* Rating */}
        {rating !== undefined && ratingCount !== undefined && ratingCount > 0 && (
          <div className="mt-1.5 flex items-center gap-1 text-xs">
            <span className="text-mv-warning">★</span>
            <span className="text-mv-text-secondary">{rating.toFixed(1)}</span>
            <span className="text-mv-muted">({ratingCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold text-mv-text">
            ₨ {price.toLocaleString()}
          </span>
          {hasSale && (
            <span className="text-xs text-mv-muted line-through">
              ₨ {compareAtPrice!.toLocaleString()}
            </span>
          )}
        </div>

        {/* Availability */}
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'inline-block h-1.5 w-1.5 rounded-full',
              inStock ? 'bg-mv-success' : 'bg-mv-error'
            )}
            aria-hidden
          />
          <span className="text-mv-text-secondary">
            {inStock ? 'In stock' : 'Out of stock'}
          </span>
        </div>

        {/* CTA */}
        <Button
          variant="default"
          size="sm"
          className="mt-3 w-full"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.();
          }}
          disabled={!inStock}
          aria-label={`View ${name} and select size`}
        >
          {inStock ? 'Select Size' : 'Sold Out'}
        </Button>
      </div>
    </Card>
  );
}