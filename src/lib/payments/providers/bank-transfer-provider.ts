import { PaymentMethod, PaymentStatus } from '@prisma/client';
import type { PaymentProvider, PaymentIntentResult, PaymentVerification, RefundResult } from '../types';

export class BankTransferProvider implements PaymentProvider {
  name = PaymentMethod.BANK_TRANSFER;

  async createPaymentIntent(order: any, amount: number): Promise<PaymentIntentResult> {
    // Bank details should come from admin settings/env, not hardcoded.
    // For now, return placeholder instructions; admin can replace via StoreSettings.
    return {
      success: true,
      providerResponse: {
        bankName: 'Bank Name',
        accountNumber: 'XXXX-XXXX-XXXX',
        accountHolder: 'Maniesta Veyra',
        instructions: 'Transfer the amount and share transaction ID with our support.',
      },
    };
  }

  async verifyPayment(paymentId: string): Promise<PaymentVerification> {
    return { status: PaymentStatus.PENDING }; // Manual verification by admin
  }

  async refundPayment(paymentId: string, amount?: number): Promise<RefundResult> {
    return { success: false, error: 'Manual refund process required' };
  }

  isAvailable(): boolean {
    return true;
  }
}