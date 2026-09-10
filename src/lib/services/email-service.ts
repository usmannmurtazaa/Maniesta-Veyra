import { Resend } from 'resend';
import { getServerEnv, getPublicEnv } from '@/lib/env';

const publicEnv = getPublicEnv();

export class EmailService {
  private resend: Resend | null;
  private from: string;

  constructor() {
    const env = getServerEnv();
    this.resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
    this.from = env.EMAIL_FROM || 'no-reply@maniestaveyra.com';
  }

  async sendVerificationEmail(to: string, token: string) {
    if (!this.resend) return;
    const verificationUrl = `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
    await this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Verify your email - Maniesta Veyra',
      html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    if (!this.resend) return;
    const resetUrl = `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
    await this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Reset your password - Maniesta Veyra',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });
  }

  async sendOrderConfirmationEmail(to: string, order: any) {
    if (!this.resend) return;
    await this.resend.emails.send({
      from: this.from,
      to,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `<p>Thank you for your order #${order.orderNumber}.</p>`,
    });
  }

  async sendCustomOrderReceivedEmail(to: string, order: any) {
    if (!this.resend) return;
    await this.resend.emails.send({
      from: this.from,
      to,
      subject: `Custom Order Received - ${order.orderNumber}`,
      html: `<p>Your custom design order has been received.</p>`,
    });
  }
}

export const emailService = new EmailService();