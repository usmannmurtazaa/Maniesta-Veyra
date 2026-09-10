import * as Sentry from '@sentry/nextjs';

const isProd = process.env.NODE_ENV === 'production';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: isProd,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

  tracesSampleRate: isProd ? 0.1 : 1.0,

  // Browser-only options — valid on BrowserOptions
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: isProd ? 1.0 : 0,

  sendDefaultPii: false,

  ignoreErrors: [
    'top.GLOBALS',
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    /ChunkLoadError/,
    /Loading chunk \d+ failed/,
    'NEXT_NOT_FOUND',
    'NEXT_REDIRECT',
  ],

  beforeSend(event) {
    if (event.request?.url) {
      try {
        const url = new URL(event.request.url);
        url.search = '';
        event.request.url = url.toString();
      } catch {
        // ignore malformed URLs
      }
    }
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;