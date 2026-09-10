import * as Sentry from '@sentry/nextjs';

const isProd = process.env.NODE_ENV === 'production';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Do not send anything from local dev — this keeps your quota clean and
  // avoids polluting the dashboard with hot-reload noise.
  enabled: isProd,

  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,

  // Sentry will only see NEXT_PUBLIC_* vars on the client, so the release
  // must be injected via a NEXT_PUBLIC_ var. You already set
  // NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA in Vercel by default? No — Vercel
  // exposes VERCEL_GIT_COMMIT_SHA as a server-only var. Use the fallback.
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

  // 10% transaction sampling in production, 100% in dev.
  tracesSampleRate: isProd ? 0.1 : 1.0,

  // Session Replay:
  //  - 0% of sessions always recorded (expensive)
  //  - 100% of sessions recorded *when an error fires* (cheap, high signal)
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: isProd ? 1.0 : 0,

  // Never send PII by default. Enable per-feature if you add user context.
  sendDefaultPii: false,

  // Filter noise that is not actionable.
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    // Facebook in-app browser
    'fb_xd_fragment',
    // Random chunk load failures (usually adblockers)
    /ChunkLoadError/,
    /Loading chunk \d+ failed/,
    // ResizeObserver noise (fires on nearly every modern site)
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    // Next.js internal — not a real bug
    'NEXT_NOT_FOUND',
    'NEXT_REDIRECT',
  ],

  // Scrub URLs so we never store query strings that could contain tokens,
  // emails, or cart IDs.
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

// Next.js 15 App Router: capture client-side navigations as spans.
// This export MUST live in `instrumentation-client.ts`, not in the old
// `sentry.client.config.ts`.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;