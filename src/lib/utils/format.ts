/**
 * Locale used for all number/date formatting.
 *
 * ⚠️ Do NOT remove this constant. Without an explicit locale, the server
 * formats with `en-US` (from the Node runtime) while the client formats
 * with the user's locale. React detects the mismatch and refuses to
 * hydrate — this manifests as React error #418.
 */
const LOCALE = 'en-PK';

/** Anything that can be coerced to a finite number. */
type NumericLike = number | string | { toString(): string };

/**
 * Format a value as Pakistani Rupees.
 *
 *   formatCurrency(2499)          → "₨ 2,499"
 *   formatCurrency("2499.50")     → "₨ 2,500"   (rounded)
 *   formatCurrency(new Decimal(0))→ "₨ 0"
 */
export function formatCurrency(amount: NumericLike, _currency = 'PKR'): string {
  const n = Number(amount);
  if (!Number.isFinite(n)) return '₨ 0';

  return `₨ ${n.toLocaleString(LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Format a number without the currency symbol.
 * Use when the ₨ symbol is rendered separately or in a code context.
 */
export function formatNumber(value: NumericLike): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';

  return n.toLocaleString(LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Format a date as "15 December 2025" (day month year, no weekday).
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString(LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date + time as "15 Dec 2025, 03:45 PM".
 */
export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString(LOCALE, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}