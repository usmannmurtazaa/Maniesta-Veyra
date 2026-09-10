'use client';

import { useCartStore } from '@/stores/cart-store';
import { toast } from '@/components/ui/use-toast';

export function useCart() {
  const {
    items,
    totalItems,
    subtotal,
    isLoading,
    setCart,
    addItem,
    updateItemQuantity,
    removeItem,
    setLoading,
  } = useCartStore();

  const syncWithServer = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cart');
      const result = await res.json();
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
    } catch {
      toast({ title: 'Error', description: 'Failed to load cart', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    totalItems,
    subtotal,
    isLoading,
    syncWithServer,
    addItem,
    updateItemQuantity,
    removeItem,
    setLoading,
  };
}