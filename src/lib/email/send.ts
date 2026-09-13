import { Resend } from 'resend';
import { Prisma } from '@prisma/client';
import { getServerEnv, getPublicEnv } from '@/lib/env';
import { formatCurrency } from '@/lib/utils/format';

const env = getServerEnv();
const publicEnv = getPublicEnv();

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NumericLike = number | string | { toString(): string };

interface OrderEmailData {
  orderNumber: string;
  total: NumericLike;
  subtotal?: NumericLike;
  items?: Array<{
    productName: string;
    quantity: number;
    totalPrice: NumericLike;
    colorName?: string | null;
    sizeLabel?: string | null;
  }>;
  /**
   * Prisma stores JSON columns as `JsonValue`, which can be any JSON shape
   * (string, number, array, object, or null). We narrow it at read time
   * via `readShippingAddress()` below.
   */
  shippingAddressSnapshot?: Prisma.JsonValue;
}

// ---------------------------------------------------------------------------
// Brand colors (keep in sync with globals.css)
// ---------------------------------------------------------------------------
const BRAND = {
  primary: '#1a1a2e',
  accent: '#c0392b',
  bg: '#f5f5f0',
  white: '#ffffff',
  text: '#1a1a2e',
  muted: '#8a8a9a',
  border: '#e8e8e0',
};

// ---------------------------------------------------------------------------
// Runtime narrowing for the shipping address JSON column
//
// Prisma's `JsonValue` includes `null`, primitives, and arrays. At runtime
// the field is always the object we wrote during checkout, but TypeScript
// only knows the broad type. This helper extracts only the string fields
// we care about — anything unexpected becomes an empty string.
// ---------------------------------------------------------------------------
function readShippingAddress(value: Prisma.JsonValue | undefined) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const v = value as Record<string, Prisma.JsonValue>;
  const str = (key: string) => (typeof v[key] === 'string' ? (v[key] as string) : '');

  return {
    fullName: str('fullName'),
    addressLine1: str('addressLine1'),
    addressLine2: str('addressLine2'),
    city: str('city'),
    state: str('state'),
    postalCode: str('postalCode'),
    phone: str('phone'),
  };
}

// ---------------------------------------------------------------------------
// HTML shell — shared wrapper for every email
//
// Email clients do not reliably support <style> blocks; every rule must be
// inline. Table-based layout is still the safest cross-client approach.
// ---------------------------------------------------------------------------
function emailShell(contentHtml: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Maniesta Veyra</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${BRAND.text};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.bg};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${BRAND.white};border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background:${BRAND.primary};padding:28px 32px;">
              <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:bold;color:${BRAND.white};letter-spacing:0.02em;">
                Maniesta Veyra
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;font-size:15px;line-height:1.6;color:${BRAND.text};">
              ${contentHtml}
            </td>
          </tr>
          <tr>
            <td style="background:${BRAND.bg};padding:24px 32px;text-align:center;font-size:12px;color:${BRAND.muted};line-height:1.5;">
              <p style="margin:0 0 8px;font-family:Georgia,serif;color:${BRAND.primary};font-weight:bold;letter-spacing:0.02em;">
                Wear Your Identity.
              </p>
              <p style="margin:0;">
                Questions? Reply to this email or write to orders@maniestaveyra.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Send wrapper — the ONE place that talks to Resend.
//
// The Resend SDK returns `{ data, error }` instead of throwing on most
// failures. Ignoring `error` silently drops emails. This wrapper surfaces
// them via console.error + a boolean return so callers can decide what to do.
// ---------------------------------------------------------------------------
async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> {
  if (!resend || !env.EMAIL_FROM) {
    console.error(
      '[email] Resend is not configured. Set RESEND_API_KEY and EMAIL_FROM in the environment.'
    );
    return false;
  }

  try {
    const result = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });

    if (result.error) {
      console.error('[email] send rejected by Resend:', result.error);
      return false;
    }

    console.log(
      `[email] sent ${result.data?.id ?? '(no id)'} to ${params.to} — "${params.subject}"`
    );
    return true;
  } catch (error) {
    console.error('[email] send threw:', error);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Verification email
// ---------------------------------------------------------------------------
export async function sendVerificationEmail(to: string, token: string) {
  const url = `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;

  const html = emailShell(`
    <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px;color:${BRAND.text};">
      Welcome to Maniesta Veyra
    </h1>
    <p style="margin:0 0 16px;">
      Thanks for signing up. Please confirm your email address to activate your account.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
      <tr>
        <td style="background:${BRAND.accent};border-radius:6px;">
          <a href="${url}" style="display:inline-block;padding:12px 28px;color:${BRAND.white};text-decoration:none;font-weight:500;font-size:15px;">
            Verify email
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 8px;color:${BRAND.muted};font-size:13px;">
      This link expires in 24 hours.
    </p>
    <p style="margin:0;color:${BRAND.muted};font-size:12px;word-break:break-all;">
      Or copy this link into your browser:<br />
      <span style="color:${BRAND.primary};">${url}</span>
    </p>
  `);

  const text = [
    'Welcome to Maniesta Veyra.',
    '',
    'Please confirm your email address to activate your account:',
    url,
    '',
    'This link expires in 24 hours.',
    '',
    'Maniesta Veyra — Wear Your Identity.',
  ].join('\n');

  return sendEmail({
    to,
    subject: 'Verify your email — Maniesta Veyra',
    html,
    text,
  });
}

// ---------------------------------------------------------------------------
// Password reset email
// ---------------------------------------------------------------------------
export async function sendPasswordResetEmail(to: string, token: string) {
  const url = `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

  const html = emailShell(`
    <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px;color:${BRAND.text};">
      Reset your password
    </h1>
    <p style="margin:0 0 16px;">
      We received a request to reset the password for your Maniesta Veyra account.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
      <tr>
        <td style="background:${BRAND.accent};border-radius:6px;">
          <a href="${url}" style="display:inline-block;padding:12px 28px;color:${BRAND.white};text-decoration:none;font-weight:500;font-size:15px;">
            Reset password
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 8px;color:${BRAND.muted};font-size:13px;">
      This link expires in 30 minutes.
    </p>
    <p style="margin:0 0 16px;color:${BRAND.muted};font-size:13px;">
      If you did not request a password reset, you can safely ignore this email.
    </p>
    <p style="margin:0;color:${BRAND.muted};font-size:12px;word-break:break-all;">
      Or copy this link into your browser:<br />
      <span style="color:${BRAND.primary};">${url}</span>
    </p>
  `);

  const text = [
    'Reset your Maniesta Veyra password.',
    '',
    'Open this link to choose a new password:',
    url,
    '',
    'This link expires in 30 minutes.',
    '',
    'If you did not request this, you can ignore this email.',
  ].join('\n');

  return sendEmail({
    to,
    subject: 'Reset your password — Maniesta Veyra',
    html,
    text,
  });
}

// ---------------------------------------------------------------------------
// Order confirmation email
// ---------------------------------------------------------------------------
export async function sendOrderConfirmationEmail(
  to: string,
  order: OrderEmailData
) {
  const itemsHtml = order.items?.length
    ? order.items
        .map(
          (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid ${BRAND.border};font-size:14px;">
            ${item.productName}
            ${
              item.colorName || item.sizeLabel
                ? `<br /><span style="color:${BRAND.muted};font-size:12px;">${[item.colorName, item.sizeLabel].filter(Boolean).join(' / ')}</span>`
                : ''
            }
          </td>
          <td style="padding:8px 0;border-bottom:1px solid ${BRAND.border};font-size:14px;text-align:center;">
            × ${item.quantity}
          </td>
          <td style="padding:8px 0;border-bottom:1px solid ${BRAND.border};font-size:14px;text-align:right;">
            ${formatCurrency(item.totalPrice)}
          </td>
        </tr>`
        )
        .join('')
    : '';

  // Narrow the JSON column at runtime before rendering.
  const addr = readShippingAddress(order.shippingAddressSnapshot);
  const addressHtml = addr
    ? `
    <p style="margin:0;color:${BRAND.muted};font-size:13px;line-height:1.6;">
      ${addr.fullName}<br />
      ${addr.addressLine1}<br />
      ${addr.addressLine2 ? `${addr.addressLine2}<br />` : ''}
      ${addr.city}, ${addr.state} ${addr.postalCode}<br />
      ${addr.phone}
    </p>`
    : '';

  const html = emailShell(`
    <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px;color:${BRAND.text};">
      Thank you for your order
    </h1>
    <p style="margin:0 0 8px;">Your order <strong>#${order.orderNumber}</strong> has been received.</p>
    <p style="margin:0 0 24px;color:${BRAND.muted};font-size:13px;">
      We will send another email when it ships.
    </p>

    ${
      itemsHtml
        ? `
    <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.08em;color:${BRAND.muted};margin:0 0 8px;">Order summary</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      ${itemsHtml}
    </table>`
        : ''
    }

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      ${
        order.subtotal !== undefined
          ? `<tr>
              <td style="padding:2px 0;font-size:14px;color:${BRAND.muted};">Subtotal</td>
              <td style="padding:2px 0;font-size:14px;text-align:right;">${formatCurrency(order.subtotal)}</td>
            </tr>`
          : ''
      }
      <tr>
        <td style="padding:8px 0;font-size:16px;font-weight:600;border-top:1px solid ${BRAND.border};">Total</td>
        <td style="padding:8px 0;font-size:16px;font-weight:600;text-align:right;border-top:1px solid ${BRAND.border};">${formatCurrency(order.total)}</td>
      </tr>
    </table>

    ${
      addressHtml
        ? `
    <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.08em;color:${BRAND.muted};margin:0 0 8px;">Shipping to</h2>
    ${addressHtml}`
        : ''
    }
  `);

  const text = [
    `Thank you for your order #${order.orderNumber}.`,
    '',
    ...(order.items?.map(
      (i) => `${i.productName} × ${i.quantity} — ${formatCurrency(i.totalPrice)}`
    ) ?? []),
    '',
    `Total: ${formatCurrency(order.total)}`,
    '',
    'Maniesta Veyra — Wear Your Identity.',
  ].join('\n');

  return sendEmail({
    to,
    subject: `Order confirmation — #${order.orderNumber}`,
    html,
    text,
  });
}

// ---------------------------------------------------------------------------
// Custom order received email
// ---------------------------------------------------------------------------
export async function sendCustomOrderReceivedEmail(
  to: string,
  order: OrderEmailData
) {
  const html = emailShell(`
    <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px;color:${BRAND.text};">
      Your custom order is in
    </h1>
    <p style="margin:0 0 16px;">
      We received your custom order <strong>#${order.orderNumber}</strong>.
    </p>
    <p style="margin:0 0 16px;">
      Our team will review your design and prepare it for production. This usually takes 1–2 business days.
    </p>
    <p style="margin:0;color:${BRAND.muted};font-size:13px;">
      We will email you again when your order enters production.
    </p>
  `);

  const text = [
    `Your custom order #${order.orderNumber} has been received.`,
    '',
    'We will review your design and prepare it for production.',
    '',
    'Maniesta Veyra - Wear Your Identity.',
  ].join('\n');

  return sendEmail({
    to,
    subject: `Custom order received — #${order.orderNumber}`,
    html,
    text,
  });
}