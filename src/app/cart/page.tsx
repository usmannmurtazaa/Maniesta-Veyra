'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';
import { Container } from '@/components/layout';
import { CartItemList } from '@/components/cart/cart-item-list';
import { CartSummary } from '@/components/cart/cart-summary';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, isLoading, setCart, setLoading } = useCartStore();

  useEffect(() => {
    setLoading(true);
    fetch('/api/cart')
      .then((res) => res.json())
      .then((result) => {
        if (result.data) {
          const transformed = result.data.items.map((item: any) => ({
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
                  previewImageUrl: item.customDesign.previewImageUrl,
                }
              : undefined,
          }));
          setCart(transformed);
        }
      })
      .finally(() => setLoading(false));
  }, [setCart, setLoading]);

  const activeItems = items.filter((i) => !i.isSavedForLater);

  return (
    <Container className="py-8 md:py-12">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8 text-mv-text">
        Your Cart
      </h1>

      {isLoading ? (
        <p className="text-mv-muted">Loading cart…</p>
      ) : activeItems.length === 0 ? (
        <div className="text-center py-16 border border-mv-border rounded-lg bg-white">
          <ShoppingBag className="h-12 w-12 mx-auto text-mv-muted" />
          <h2 className="mt-4 text-lg font-medium text-mv-text">
            Your cart is empty
          </h2>
          <p className="mt-1 text-sm text-mv-muted">
            Browse the collection and add something you like.
          </p>
          <Link href="/shop" className="inline-block mt-6">
            <Button variant="accent">
              Continue shopping <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <CartItemList items={activeItems} />
          </div>
          <aside className="space-y-4">
            <div className="border border-mv-border rounded-lg p-6 bg-white sticky top-24">
              <h2 className="font-medium mb-4">Order Summary</h2>
              <CartSummary />
              <Link href="/checkout" className="block mt-6">
                <Button className="w-full" size="lg">
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/shop" className="block mt-3">
                <Button variant="ghost" className="w-full">
                  Continue shopping
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      )}
    </Container>
  );
}