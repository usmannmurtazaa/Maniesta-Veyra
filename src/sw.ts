import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

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
  navigationPreload: true,

  // Offline fallback for failed navigations
  fallbacks: {
    entries: [
      {
        url: '/offline',
        matcher: ({ request }) => request.destination === 'document',
      },
    ],
  },

  runtimeCaching: [
    // ----------------------------------------------------------------
    // Custom overrides — placed BEFORE defaultCache so they win.
    // Serwist matches in order and stops at the first match.
    // ----------------------------------------------------------------

    // 1. Private API routes — never touch the cache
    {
      matcher: ({ url }) => url.pathname.startsWith('/api/'),
      handler: 'NetworkOnly',
    },

    // 2. Private page routes — never cache the document
    {
      matcher: ({ url }) =>
        /^\/(account|checkout|cart|admin|wishlist|auth|customize)(\/|$)/.test(
          url.pathname
        ),
      handler: 'NetworkOnly',
    },

    // 3. Product images from Vercel Blob — long-lived cache
    {
      matcher: ({ url }) =>
        url.hostname.endsWith('.blob.vercel-storage.com'),
      handler: 'CacheFirst',
      options: {
        cacheName: 'mv-product-images',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },

    // 4. GA4 — do not block navigation if Google is slow
    {
      matcher: ({ url }) => url.hostname === 'www.googletagmanager.com',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'mv-ga',
        networkTimeoutSeconds: 3,
      },
    },

    // ----------------------------------------------------------------
    // Default Serwist cache — handles Next.js chunks, fonts, RSC payloads,
    // and public navigation documents with NetworkFirst + cache fallback.
    // ----------------------------------------------------------------
    ...defaultCache,
  ],
});

serwist.addEventListeners();