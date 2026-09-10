import * as Sentry from '@sentry/nextjs';

/**
 * Sentry configuration shared by all runtimes.
 *
 * Notes:
 * - `tracesSampleRate` is intentionally low in production to stay within
 *   the Sentry quota. Tune per traffic once you have real numbers.
 * - `environment` and `release` are required for release-based regression
 *   detection and per-env alert rules.
 * - `replaysOnErrorSampleRate` gives you a session replay only when an
 *   error actually fires, so it's cheap.
 */
function getSentryConfig(): Sentry.NodeOptions {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    dsn: process.env.SENTRY_DSN,
    enabled: isProd,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
    release: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.npm_package_version,
    // 10% of transactions in prod, 100% locally so you actually see traces during dev.
    tracesSampleRate: isProd ? 0.1 : 1.0,
    // Only capture replays when an error fires. No "always-on" replays — they're expensive.
    replaysOnErrorSampleRate: isProd ? 1.0 : 0,
    // Don't send PII by default (URLs, cookies, etc.).
    sendDefaultPii: false,
    // Ignore noisy errors that aren't actionable.
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      // Non-bugs that show up from bots / previews
      'Non-Error promise rejection captured',
    ],
  };
}

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init(getSentryConfig());
  }
}

// Capture unhandled errors in Server Components, route handlers,
// and middleware — reported to Sentry with request context attached.
export const onRequestError = Sentry.captureRequestError;