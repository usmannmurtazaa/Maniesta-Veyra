'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreateOrderInput } from '@/lib/validation/order.schema';

interface AddressFormProps {
  register: UseFormRegister<CreateOrderInput>;
  errors: FieldErrors<CreateOrderInput>;
}

export function AddressForm({ register, errors }: AddressFormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Shipping Address</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" {...register('shippingAddress.fullName')} />
          {errors.shippingAddress?.fullName && <p className="text-sm text-mv-error">{errors.shippingAddress.fullName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register('shippingAddress.phone')} />
          {errors.shippingAddress?.phone && <p className="text-sm text-mv-error">{errors.shippingAddress.phone.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="addressLine1">Address Line 1</Label>
        <Input id="addressLine1" {...register('shippingAddress.addressLine1')} />
        {errors.shippingAddress?.addressLine1 && <p className="text-sm text-mv-error">{errors.shippingAddress.addressLine1.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="addressLine2">Address Line 2 (optional)</Label>
        <Input id="addressLine2" {...register('shippingAddress.addressLine2')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register('shippingAddress.city')} />
          {errors.shippingAddress?.city && <p className="text-sm text-mv-error">{errors.shippingAddress.city.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" {...register('shippingAddress.state')} />
          {errors.shippingAddress?.state && <p className="text-sm text-mv-error">{errors.shippingAddress.state.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input id="postalCode" {...register('shippingAddress.postalCode')} />
          {errors.shippingAddress?.postalCode && <p className="text-sm text-mv-error">{errors.shippingAddress.postalCode.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" {...register('shippingAddress.country')} defaultValue="PK" />
        </div>
      </div>
    </div>
  );
}