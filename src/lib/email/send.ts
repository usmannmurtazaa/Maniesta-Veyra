import { Resend } from 'resend';
import { getServerEnv, getPublicEnv } from '@/lib/env';

const env = getServerEnv();
const publicEnv = getPublicEnv();

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function sendVerificationEmail(to: string, token: string) {
  if (!resend || !env.EMAIL_FROM) {
    console.warn('Email service not configured. Skipping verification email.');
    return;
  }
  const verificationUrl = `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
  await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: 'Verify your email - Maniesta Veyra',
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
  });

export async function sendPasswordResetEmail(to: string, token: string) {
  if (!resend || !env.EMAIL_FROM) {
    console.warn('Email service not configured. Skipping password reset email.');
    return;
  }
  const resetUrl = `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
  await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: 'Reset your password - Maniesta Veyra',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  });

  export async function sendOrderConfirmationEmail(to: string, order: any) {
  if (!resend || !env.EMAIL_FROM) return;
  await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `<h1>Thank you for your order!</h1><p>Order #${order.orderNumber}</p><p>Total: ₨ ${Number(order.total).toLocaleString()}</p>`,
  });
}

export async function sendCustomOrderReceivedEmail(to: string, order: any) {
  if (!resend || !env.EMAIL_FROM) return;
  await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: `Custom Order Received - ${order.orderNumber}`,
    html: `<p>Your custom design order has been received. We will review it shortly.</p>`,
  });

}