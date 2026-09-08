import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '@/lib/validation/user.schema';
import { createOrderSchema } from '@/lib/validation/order.schema';
import { PaymentMethod } from '@prisma/client';

describe('Validation schemas', () => {
  it('validates register input', () => {
    const valid = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    };
    expect(registerSchema.parse(valid)).toEqual(valid);
  });

  it('rejects invalid email', () => {
    expect(() => registerSchema.parse({ firstName: 'John', lastName: 'Doe', email: 'invalid', password: 'password123' })).toThrow();
  });

  it('validates create order with COD', () => {
    const validOrder = {
      cartId: 'cart1',
      shippingAddress: {
        fullName: 'John Doe',
        phone: '123456789',
        addressLine1: 'Street 1',
        city: 'Lahore',
        state: 'Punjab',
        postalCode: '54000',
        country: 'PK',
      },
      paymentMethod: PaymentMethod.COD,
    };
    expect(createOrderSchema.parse(validOrder)).toEqual(validOrder);
  });
});