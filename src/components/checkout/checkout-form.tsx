'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOrderSchema, type CreateOrderInput } from '@/lib/validation/order.schema';
import { AddressForm } from './address-form';
import { PaymentMethodSelector } from './payment-method-selector';
import { OrderSummary } from './order-summary';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import type { PaymentMethod } from '@prisma/client';

interface CheckoutCartItem {
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

interface CheckoutFormProps {
  cart: {
    id: string;
    items: CheckoutCartItem[];
    subtotal: number;
  };
  paymentMethods: string[];
}

export function CheckoutForm({ cart, paymentMethods }: CheckoutFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>(paymentMethods[0] || 'COD');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      paymentMethod: (paymentMethods[0] || 'COD') as PaymentMethod,
      shippingAddress: {
        country: 'PK',
        fullName: '',
        phone: '',
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
      },
    },
  });

  const onSubmit = async (data: CreateOrderInput) => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          paymentMethod,
          cartId: cart.id,
          couponCode: couponCode || undefined,
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast({ title: 'Order placed successfully!' });
        router.push(`/checkout/confirmation/${result.data.orderNumber}`);
      } else {
        toast({
          title: 'Error',
          description: result.error?.message || 'Failed to place order',
          variant: 'destructive',
        });
      }
    } catch {
      toast({ title: 'Error', description: 'Network error', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const validateCoupon = async () => {
    if (!couponCode) return;
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: couponCode, cartTotal: cart.subtotal }),
    });
    const result = await res.json();
    if (res.ok) {
      setDiscount(Number(result.data.discountAmount));
      toast({ title: 'Coupon applied' });
    } else {
      setDiscount(0);
      toast({
        title: 'Invalid coupon',
        description: result.error?.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 space-y-6">
        <AddressForm register={register} errors={errors} />
        <PaymentMethodSelector
          value={paymentMethod}
          onChange={setPaymentMethod}
          paymentMethods={paymentMethods}
        />
        <div className="space-y-2">
          <label className="text-sm font-medium">Coupon Code</label>
          <div className="flex gap-2">
            <input
              className="flex h-10 w-full rounded-md border border-mv-border bg-white px-3 py-2 text-sm"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
            />
            <Button type="button" variant="outline" onClick={validateCoupon}>
              Apply
            </Button>
          </div>
          {discount > 0 && (
            <p className="text-sm text-mv-success">
              Discount: -₨ {discount.toLocaleString()}
            </p>
          )}
        </div>
      </div>
      <div>
        <OrderSummary cart={cart} discount={discount} />
        <Button type="submit" className="w-full mt-4" size="lg" disabled={loading}>
          {loading ? 'Placing order...' : 'Place Order'}
        </Button>
      </div>
    </form>
  );
}