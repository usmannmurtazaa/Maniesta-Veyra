import { PaymentMethod, PaymentStatus } from '@prisma/client';

export interface PaymentIntentResult {
  success: boolean;
  transactionId?: string;
  redirectUrl?: string;
  providerResponse?: Record<string, unknown>;
}

export interface PaymentVerification {
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: Date;
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  error?: string;
}

export interface PaymentProvider {
  name: PaymentMethod;
  createPaymentIntent(order: any, amount: number): Promise<PaymentIntentResult>;
  verifyPayment(paymentId: string): Promise<PaymentVerification>;
  refundPayment(paymentId: string, amount?: number): Promise<RefundResult>;
  isAvailable(): boolean;
}