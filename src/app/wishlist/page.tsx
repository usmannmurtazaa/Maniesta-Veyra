import { requireAuth } from '@/lib/auth/guards';
import { wishlistService } from '@/lib/services/wishlist-service';
import { ProductCardClient } from '@/components/product/product-card-client';
import { Container } from '@/components/layout';
import { EmptyState } from '@/components/shared/empty-state';

export default async function WishlistPage() {
  const session = await requireAuth();
  const products = await wishlistService.getWishlist(session.user.id);

  return (
    <Container className="py-8">
      <h1 className="font-display text-3xl font-bold mb-6">Your Wishlist</h1>
      {products.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          description="Save items you love to your wishlist and they'll appear here."
          actionLabel="Browse products"
          onAction={() => {}}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product: any) => (
  <ProductCardClient
    key={product.id}
    id={product.id}
    slug={product.slug}
    name={product.name}
    price={Number(product.basePrice)}
    compareAtPrice={product.compareAtPrice ? Number(product.compareAtPrice) : undefined}
    imageUrl={product.images[0]?.url}
    isWishlisted
  />
))}
        </div>
      )}
    </Container>
  );
}