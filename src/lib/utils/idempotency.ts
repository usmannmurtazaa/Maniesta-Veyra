import { randomBytes } from 'crypto';

export function generateIdempotencyKey(): string {
  return randomBytes(16).toString('hex');
}

export function isValidIdempotencyKey(key: string): boolean {
  return /^[a-f0-9]{32}$/i.test(key);
}