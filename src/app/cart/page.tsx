'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { Container } from '@/components/layout';
import { CartItemList } from '@/components/cart/cart-item-list';
import { CartSummary } from '@/components/cart/cart-summary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CartPage() {
  const { items, isLoading, setCart, setLoading } = useCartStore();

  useEffect(() => {
    setLoading(true);
    fetch('/api/cart')
      .then((res) => res.json())
      .then((result) => {
        if (result.data) {
          const transformedItems = result.data.items.map((item: any) => ({
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
                  imageUrl: item.productVariant.product.images[0]?.url,
                  color: item.productVariant.color.name,
                  size: item.productVariant.size.label,
                }
              : undefined,
            customDesign: item.customDesign
              ? {
                  garmentName: item.customDesign.garment.name,
                  color: item.customDesign.color.name,
                  size: item.customDesign.size.label,
                  previewImageUrl: item.customDesign.previewImageUrl,
                }
              : undefined,
          }));
          setCart(transformedItems);
        }
      })
      .finally(() => setLoading(false));
  }, [setCart, setLoading]);

  return (
    <Container className="py-8">
      <h1 className="font-display text-3xl font-bold mb-6">Your Cart</h1>
      {isLoading ? (
        <p>Loading cart...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-mv-muted">Your cart is empty.</p>
          <Link href="/shop">
            <Button className="mt-4">Continue shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CartItemList items={items} />
          </div>
          <div className="space-y-4">
            <div className="border border-mv-border rounded-lg p-6">
              <CartSummary />
              <Button className="w-full mt-4" size="lg">
                Proceed to Checkout
              </Button>
            </div>
            <Link href="/shop">
              <Button variant="outline" className="w-full">
                Continue shopping
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Container>
  );
}