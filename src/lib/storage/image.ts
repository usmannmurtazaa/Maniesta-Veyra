import { getPublicEnv } from '@/lib/env';

/**
 * Generate a full URL for a product image stored in Vercel Blob.
 */
export function getProductImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const env = getPublicEnv();
  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}

/**
 * Placeholder image URL for products with no image.
 */
export function getPlaceholderImage(): string {
  return '/images/placeholder.png';
}