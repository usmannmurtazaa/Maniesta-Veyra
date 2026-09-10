'use client';

interface OrderSummaryItem {
  id: string;
  productVariantId: string | null;
  customDesignId: string | null;
  quantity: number;
  unitPrice: number;
  name: string;
  imageUrl?: string | null;
  color?: string | null;
  size?: string | null;
}

interface OrderSummaryProps {
  cart: {
    id: string;
    items: OrderSummaryItem[];
    subtotal: number;
  };
  discount: number;
}

export function OrderSummary({ cart, discount }: OrderSummaryProps) {
  const subtotal = cart.subtotal;
  const total = subtotal - discount;

  return (
    <div className="border border-mv-border rounded-lg p-6">
      <h2 className="font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2">
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₨ {(item.unitPrice * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-mv-border mt-4 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₨ {subtotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-mv-success">
            <span>Discount</span>
            <span>-₨ {discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>₨ {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}