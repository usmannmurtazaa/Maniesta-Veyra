import { ProductCard } from './product-card';

interface ProductGridProps {
  products: Array<{
    id: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    imageUrl?: string;
    badge?: string;
    rating?: number;
    ratingCount?: number;
  }>;
  onQuickView?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  onWishlist?: (id: string) => void;
}

export function ProductGrid({ products, onQuickView, onAddToCart, onWishlist }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          onQuickView={() => onQuickView?.(product.id)}
          onAddToCart={() => onAddToCart?.(product.id)}
          onWishlist={() => onWishlist?.(product.id)}
        />
      ))}
    </div>
  );
}