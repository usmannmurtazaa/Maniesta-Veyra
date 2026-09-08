'use client';

import { useCartStore } from '@/stores/cart-store';

export function CartSummary() {
  const { items, subtotal } = useCartStore();

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>₨ {subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Shipping</span>
        <span>Calculated at checkout</span>
      </div>
      <div className="flex justify-between text-base font-semibold">
        <span>Total</span>
        <span>₨ {subtotal.toLocaleString()}</span>
      </div>
    </div>
  );
}