'use client';

import { useCartStore } from '@/stores/cart-store';

export function CartSummary() {
  const subtotal = useCartStore((s) => s.subtotal);
  const totalItems = useCartStore((s) => s.totalItems);

  // Free shipping for now. Change to a numeric value when you introduce
  // a shipping calculation. Explicit `number` prevents TS narrowing.
  const shipping: number = 0;
  const total = subtotal + shipping;

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-mv-text-secondary">
          Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </span>
        <span className="text-mv-text">₨ {subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-mv-text-secondary">Shipping</span>
        <span className="text-mv-text">
          {shipping === 0 ? 'Free' : `₨ ${shipping.toLocaleString()}`}
        </span>
      </div>
      <div className="border-t border-mv-border pt-3 flex justify-between">
        <span className="font-medium text-mv-text">Total</span>
        <span className="text-lg font-semibold text-mv-text">
          ₨ {total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}