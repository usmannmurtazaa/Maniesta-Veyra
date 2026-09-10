import { prisma } from '@/lib/db/prisma';
import { getPaymentProvider } from '@/lib/payments/factory';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

export class PaymentService {
  async createPayment(orderId: string, method: PaymentMethod, amount: number) {
    const provider = getPaymentProvider(method);
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');

    const intent = await provider.createPaymentIntent(order, amount);
    return prisma.payment.create({
      data: {
        orderId,
        amount,
        currency: 'PKR',
        method,
        status: PaymentStatus.PENDING,
        transactionId: intent.transactionId,
        providerResponse: intent.providerResponse as any,
      },
    });
  }

  async verifyPayment(paymentId: string) {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new Error('Payment not found');

    const provider = getPaymentProvider(payment.method);
    const verification = await provider.verifyPayment(payment.transactionId || '');
    return prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: verification.status,
        paidAt: verification.paidAt,
        transactionId: verification.transactionId ?? payment.transactionId,
      },
    });
  }
}

export const paymentService = new PaymentService();