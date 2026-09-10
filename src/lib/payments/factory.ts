import { PaymentMethod } from '@prisma/client';
import type { PaymentProvider } from './types';
import { CashOnDeliveryProvider } from './providers/cod-provider';
import { BankTransferProvider } from './providers/bank-transfer-provider';
import { StripeProvider } from './providers/stripe-provider';

export function getPaymentProvider(method: PaymentMethod): PaymentProvider {
  switch (method) {
    case PaymentMethod.COD:
      return new CashOnDeliveryProvider();
    case PaymentMethod.BANK_TRANSFER:
      return new BankTransferProvider();
    case PaymentMethod.ONLINE:
      try {
        return new StripeProvider();
      } catch {
        throw new Error('Online payment is not available at this time');
      }
    default:
      throw new Error(`Unknown payment method: ${method}`);
  }
}

export function getAvailablePaymentMethods(): PaymentMethod[] {
  const methods: PaymentMethod[] = [PaymentMethod.COD, PaymentMethod.BANK_TRANSFER];
  if (process.env.STRIPE_SECRET_KEY) {
    methods.push(PaymentMethod.ONLINE);
  }
  return methods;
}