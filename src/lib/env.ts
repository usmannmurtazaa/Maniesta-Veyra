import { z } from 'zod';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * An optional URL that:
 *   - accepts undefined
 *   - accepts an empty string (treated as undefined)
 *   - accepts a valid URL
 *   - treats any other value as undefined instead of throwing
 *
 * This is important for optional integrations (Upstash, Stripe, Sentry).
 * A typo or a stale value in the hosting dashboard should not break the
 * entire build — the feature should simply be disabled.
 */
const optionalUrl = z
  .string()
  .optional()
  .transform((v) => {
    const trimmed = v?.trim();
    if (!trimmed) return undefined;
    try {
      new URL(trimmed);
      return trimmed;
    } catch {
      return undefined;
    }
  });

const optionalString = z
  .string()
  .optional()
  .transform((v) => {
    const trimmed = v?.trim();
    return trimmed ? trimmed : undefined;
  });

// ---------------------------------------------------------------------------
// Server environment schema (private)
// ---------------------------------------------------------------------------
const serverEnvSchema = z.object({
  // Database — required
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),

  // Auth — required
  AUTH_SECRET: z.string().min(32),
  AUTH_URL: optionalUrl,

  // Storage — optional
  BLOB_READ_WRITE_TOKEN: optionalString,

  // Email — optional
  RESEND_API_KEY: optionalString,
  EMAIL_FROM: optionalString,

  // Rate limiting (Upstash) — optional
  UPSTASH_REDIS_URL: optionalUrl,
  UPSTASH_REDIS_TOKEN: optionalString,

  // Payments — optional
  STRIPE_SECRET_KEY: optionalString,
  STRIPE_WEBHOOK_SECRET: optionalString,

  // Monitoring — optional
  SENTRY_DSN: optionalUrl,
});

// ---------------------------------------------------------------------------
// Public environment schema (safe for browser)
// ---------------------------------------------------------------------------
const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().catch('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Maniesta Veyra'),
  NEXT_PUBLIC_APP_TAGLINE: z.string().default('Wear Your Identity.'),
  NEXT_PUBLIC_PORTFOLIO_URL: z.string().url().catch('#'),
  NEXT_PUBLIC_CURRENCY: z.string().default('PKR'),
  NEXT_PUBLIC_CURRENCY_SYMBOL: z.string().default('₨'),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;
type PublicEnv = z.infer<typeof publicEnvSchema>;

let cachedServerEnv: ServerEnv | null = null;
let cachedPublicEnv: PublicEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (!cachedServerEnv) {
    cachedServerEnv = serverEnvSchema.parse(process.env);
  }
  return cachedServerEnv;
}

export function getPublicEnv(): PublicEnv {
  if (!cachedPublicEnv) {
    cachedPublicEnv = publicEnvSchema.parse({
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
      NEXT_PUBLIC_APP_TAGLINE: process.env.NEXT_PUBLIC_APP_TAGLINE,
      NEXT_PUBLIC_PORTFOLIO_URL: process.env.NEXT_PUBLIC_PORTFOLIO_URL,
      NEXT_PUBLIC_CURRENCY: process.env.NEXT_PUBLIC_CURRENCY,
      NEXT_PUBLIC_CURRENCY_SYMBOL: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL,
      NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
      NEXT_PUBLIC_VERCEL_ANALYTICS_ID:
        process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
    });
  }
  return cachedPublicEnv;
}

export const publicEnv = getPublicEnv();