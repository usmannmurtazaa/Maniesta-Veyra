'use client';

import Image from 'next/image';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  id: string;
  slug?: string; // not used internally but may be useful
  name: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
  badge?: string;
  rating?: number;
  ratingCount?: number;
  onQuickView?: () => void;
  onAddToCart?: () => void;
  onWishlist?: () => void;
  isWishlisted?: boolean;
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  compareAtPrice,
  imageUrl,
  badge,
  rating,
  ratingCount,
  onQuickView,
  onAddToCart,
  onWishlist,
  isWishlisted,
}: ProductCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-shadow hover:shadow-md">
      {/* Image area */}
      <div className="relative aspect-[3/4] bg-mv-bg-alt">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-mv-muted">
            <ShoppingBag className="h-12 w-12" />
          </div>
        )}

        {badge && (
          <Badge variant="accent" className="absolute left-2 top-2">
            {badge}
          </Badge>
        )}

        <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={onWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-mv-accent text-mv-accent' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={onQuickView}
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-sans text-sm font-medium text-mv-text line-clamp-2">
          {name}
        </h3>

        {rating !== undefined && (
          <div className="mt-1 flex items-center gap-1">
            <span className="text-xs text-mv-warning">★</span>
            <span className="text-xs text-mv-text-secondary">{rating.toFixed(1)}</span>
            {ratingCount !== undefined && (
              <span className="text-xs text-mv-muted">({ratingCount})</span>
            )}
          </div>
        )}

        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-semibold text-mv-text">
            ₨ {price.toLocaleString()}
          </span>
          {compareAtPrice && (
            <span className="text-sm text-mv-muted line-through">
              ₨ {compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>

        <Button
          variant="default"
          size="sm"
          className="mt-3 w-full"
          onClick={onAddToCart}
        >
          <ShoppingBag className="h-4 w-4" /> Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}