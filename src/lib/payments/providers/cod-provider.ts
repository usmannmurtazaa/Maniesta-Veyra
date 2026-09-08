import { PaymentMethod, PaymentStatus } from '@prisma/client';
import type { PaymentProvider, PaymentIntentResult, PaymentVerification, RefundResult } from '../types';

export class CashOnDeliveryProvider implements PaymentProvider {
  name = PaymentMethod.COD;

  async createPaymentIntent(order: any, amount: number): Promise<PaymentIntentResult> {
    return {
      success: true,
      providerResponse: { note: 'Cash on delivery. Payment expected upon delivery.' },
    };
  }

  async verifyPayment(paymentId: string): Promise<PaymentVerification> {
    return { status: PaymentStatus.PENDING }; // COD stays pending until manually confirmed
  }

  async refundPayment(paymentId: string, amount?: number): Promise<RefundResult> {
    return { success: false, error: 'Refunds not supported for COD' };
  }

  isAvailable(): boolean {
    return true;
  }
}