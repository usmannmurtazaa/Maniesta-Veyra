'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCartStore, type CartItem } from '@/stores/cart-store';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateItemQuantity, removeItem } = useCartStore();

  const productName = item.product?.name ?? item.customDesign?.garmentName ?? 'Item';
  const imageUrl = item.product?.imageUrl ?? item.customDesign?.previewImageUrl;
  const color = item.product?.color ?? item.customDesign?.color;
  const size = item.product?.size ?? item.customDesign?.size;
  const price = item.price;

  const increase = () => {
    const newQuantity = item.quantity + 1;
    updateItemQuantity(item.id, newQuantity);
    fetch(`/api/cart/items/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity }),
    });
  };

  const decrease = () => {
    if (item.quantity <= 1) return;
    const newQuantity = item.quantity - 1;
    updateItemQuantity(item.id, newQuantity);
    fetch(`/api/cart/items/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity }),
    });
  };

  const remove = () => {
    removeItem(item.id);
    fetch(`/api/cart/items/${item.id}`, { method: 'DELETE' });
  };

  return (
    <div className="flex gap-4 py-4 border-b border-mv-border last:border-0">
      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-mv-bg-alt">
        {imageUrl ? (
          <Image src={imageUrl} alt={productName} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-mv-muted">?</div>
        )}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium">{productName}</h4>
        {color && size && (
          <p className="text-xs text-mv-muted">
            {color} / {size}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={decrease} aria-label="Decrease quantity">
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm">{item.quantity}</span>
            <Button variant="outline" size="icon" onClick={increase} aria-label="Increase quantity">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">₨ {(price * item.quantity).toLocaleString()}</span>
            <Button variant="ghost" size="icon" onClick={remove} aria-label="Remove item">
              <Trash2 className="h-4 w-4 text-mv-muted" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}