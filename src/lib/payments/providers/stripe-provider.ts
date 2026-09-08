import { PaymentMethod, PaymentStatus } from '@prisma/client';
import type { PaymentProvider, PaymentIntentResult, PaymentVerification, RefundResult } from '../types';

export class StripeProvider implements PaymentProvider {
  name = PaymentMethod.ONLINE;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe is not configured');
    }
  }

  async createPaymentIntent(order: any, amount: number): Promise<PaymentIntentResult> {
    // Placeholder for actual Stripe integration; will be implemented when Stripe is available.
    throw new Error('Stripe integration not yet implemented');
  }

  async verifyPayment(paymentId: string): Promise<PaymentVerification> {
    throw new Error('Stripe integration not yet implemented');
  }

  async refundPayment(paymentId: string, amount?: number): Promise<RefundResult> {
    throw new Error('Stripe integration not yet implemented');
  }

  isAvailable(): boolean {
    return !!process.env.STRIPE_SECRET_KEY;
  }
}