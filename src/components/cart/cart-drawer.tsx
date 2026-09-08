'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CartItemList } from './cart-item-list';
import { CartSummary } from './cart-summary';
import { useCartStore } from '@/stores/cart-store';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, isLoading, setLoading, setCart } = useCartStore();

  useEffect(() => {
    if (open) {
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
    }
  }, [open, setLoading, setCart]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <p>Loading cart...</p>
          ) : items.length === 0 ? (
            <p className="text-mv-muted">Your cart is empty.</p>
          ) : (
            <CartItemList items={items} />
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-mv-border pt-4">
            <CartSummary />
            <Button className="w-full mt-4" size="lg">
              Proceed to Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}