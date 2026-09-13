import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import {
  Serwist,
  NetworkOnly,
  NetworkFirst,
  CacheFirst,
  ExpirationPlugin,
  CacheableResponsePlugin,
} from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,

  // Disabled: we do not consume `event.preloadResponse`. Enabling this
  // without using it produces "navigation preload request was cancelled"
  // warnings on every navigation.
  navigationPreload: false,

  fallbacks: {
    entries: [
      {
        url: '/offline.html',
        matcher: ({ request }) => request.destination === 'document',
      },
    ],
  },

  runtimeCaching: [
    // -----------------------------------------------------------------
    // 1. Next.js image optimization (/_next/image?url=...)
    //    DO NOT cache these. The optimizer already sends long
    //    Cache-Control headers that the browser respects. Caching here
    //    causes failures when the underlying source image is missing.
    // -----------------------------------------------------------------
    {
      matcher: ({ url }) => url.pathname.startsWith('/_next/image'),
      handler: new NetworkOnly(),
    },

    // -----------------------------------------------------------------
    // 2. React Server Component payloads (?_rsc=...)
    //    These are per-user and short-lived. Caching them causes
    //    hydration mismatches. Also: when the user is logged out,
    //    the server redirects and the fetch returns HTML — putting
    //    that in the cache breaks subsequent RSC fetches.
    // -----------------------------------------------------------------
    {
      matcher: ({ url }) => url.searchParams.has('_rsc'),
      handler: new NetworkOnly(),
    },

    // -----------------------------------------------------------------
    // 3. API routes — always hit the network
    // -----------------------------------------------------------------
    {
      matcher: ({ url }) => url.pathname.startsWith('/api/'),
      handler: new NetworkOnly(),
    },

    // -----------------------------------------------------------------
    // 4. Private page routes — never cache
    // -----------------------------------------------------------------
    {
      matcher: ({ url }) =>
        /^\/(account|checkout|cart|admin|wishlist|auth|customize)(\/|$)/.test(
          url.pathname
        ),
      handler: new NetworkOnly(),
    },

    // -----------------------------------------------------------------
    // 5. Vercel Blob images — long-lived cache.
    //    Only 200 (same-origin) and 0 (opaque, cross-origin without CORS)
    //    are cached. 404/500 responses pass through uncached.
    // -----------------------------------------------------------------
    {
      matcher: ({ url }) => url.hostname.endsWith('.blob.vercel-storage.com'),
      handler: new CacheFirst({
        cacheName: 'mv-product-images',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 7,
          }),
          new CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
      }),
    },

    // -----------------------------------------------------------------
    // 6. GA4 — fail fast when offline, don't block navigation
    // -----------------------------------------------------------------
    {
      matcher: ({ url }) => url.hostname === 'www.googletagmanager.com',
      handler: new NetworkFirst({
        cacheName: 'mv-ga',
        networkTimeoutSeconds: 3,
      }),
    },

    // -----------------------------------------------------------------
    // 7. Default Serwist rules (Next.js chunks, fonts, static assets)
    //    Our earlier rules already excluded images, RSC, API, and
    //    private routes, so `defaultCache` only handles safe content.
    // -----------------------------------------------------------------
    ...defaultCache,
  ],
});

serwist.addEventListeners();