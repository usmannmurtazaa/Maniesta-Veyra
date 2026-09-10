import * as Sentry from '@sentry/nextjs';

/**
 * Sentry initialization for Node.js and Edge runtimes.
 *
 * Replay-related options (replaysOnErrorSampleRate, replaysSessionSampleRate)
 * are intentionally absent here — they are browser-only and live in
 * `src/instrumentation-client.ts`.
 */
function getSentryConfig(): Sentry.NodeOptions {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    dsn: process.env.SENTRY_DSN,
    enabled: isProd,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
    release: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.npm_package_version,
    tracesSampleRate: isProd ? 0.1 : 1.0,
    sendDefaultPii: false,
    ignoreErrors: [
      'top.GLOBALS',
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error promise rejection captured',
    ],
  };
}

export async function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' ||
    process.env.NEXT_RUNTIME === 'edge'
  ) {
    Sentry.init(getSentryConfig());
  }
}

export const onRequestError = Sentry.captureRequestError;