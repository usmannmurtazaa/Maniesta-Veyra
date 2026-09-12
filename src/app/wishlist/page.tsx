import type { Metadata } from 'next';
import { requireAuth } from '@/lib/auth/guards';
import { wishlistService } from '@/lib/services/wishlist-service';
import { ProductCardClient } from '@/components/product/product-card-client';
import { Container } from '@/components/layout';
import { EmptyState } from '@/components/shared/empty-state';

export const metadata: Metadata = {
  title: 'Wishlist',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

/**
 * Minimal shape of what `wishlistService.getWishlist` returns. Prisma's
 * Decimal is structurally compatible with `{ toString(): string }`, so
 * price fields accept anything that can be coerced with `Number()`.
 */
type NumericLike = number | string | { toString(): string };

interface WishlistProduct {
  id: string;
  slug: string;
  name: string;
  basePrice: NumericLike;
  compareAtPrice: NumericLike | null;
  ratingAvg: NumericLike;
  ratingCount: number;
  isNewArrival: boolean;
  category?: { name: string } | null;
  images: { url: string; altText: string | null }[];
  variants?: { stock: number }[];
}

export default async function WishlistPage() {
  const session = await requireAuth();
  const products = (await wishlistService.getWishlist(
    session.user.id
  )) as unknown as WishlistProduct[];

  return (
    <Container className="py-8 md:py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-mv-text">
          Your Wishlist
        </h1>
        {products.length > 0 && (
          <p className="mt-1 text-sm text-mv-muted">
            {products.length} {products.length === 1 ? 'item' : 'items'} saved
          </p>
        )}
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          description="Save items you love and they will appear here. Browse the collection to get started."
          actionLabel="Browse products"
          actionHref="/shop"
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCardClient
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              price={Number(product.basePrice)}
              compareAtPrice={
                product.compareAtPrice
                  ? Number(product.compareAtPrice)
                  : undefined
              }
              imageUrl={product.images[0]?.url}
              secondaryImageUrl={product.images[1]?.url}
              categoryName={product.category?.name}
              rating={
                product.ratingCount > 0
                  ? Number(product.ratingAvg)
                  : undefined
              }
              ratingCount={product.ratingCount || undefined}
              inStock={
                product.variants
                  ? product.variants.some((v) => v.stock > 0)
                  : true
              }
              badge={product.isNewArrival ? 'New' : undefined}
              isWishlisted
            />
          ))}
        </div>
      )}
    </Container>
  );
}