import { z } from 'zod';
import { PaymentMethod } from '@prisma/client';

export const checkoutAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone is required'),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().default('PK'),
});

export const createOrderSchema = z.object({
  cartId: z.string().optional(), // For guest carts, we may pass cartId
  shippingAddress: checkoutAddressSchema,
  billingAddress: checkoutAddressSchema.optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
  idempotencyKey: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CheckoutAddress = z.infer<typeof checkoutAddressSchema>;