/**
 * Calculate tax amount based on subtotal and tax rate (percentage).
 * Default rate is 0% for Pakistan, but can be configured.
 */
export function calculateTax(subtotal: number, taxRatePercent: number = 0): number {
  const rate = Math.max(0, taxRatePercent);
  return Number((subtotal * rate / 100).toFixed(2));
}