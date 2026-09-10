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
  navigationPreload: true,

  fallbacks: {
    entries: [
      {
        url: '/offline',
        matcher: ({ request }) => request.destination === 'document',
      },
    ],
  },

  runtimeCaching: [
    // Private API routes — never cache
    {
      matcher: ({ url }) => url.pathname.startsWith('/api/'),
      handler: new NetworkOnly(),
    },

    // Private page routes — never cache the document
    {
      matcher: ({ url }) =>
        /^\/(account|checkout|cart|admin|wishlist|auth|customize)(\/|$)/.test(
          url.pathname
        ),
      handler: new NetworkOnly(),
    },

    // Vercel Blob product images — long-lived cache
    {
      matcher: ({ url }) => url.hostname.endsWith('.blob.vercel-storage.com'),
      handler: new CacheFirst({
        cacheName: 'mv-product-images',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 7,
          }),
          new CacheableResponsePlugin({
            statuses: [0, 200],
          }),
        ],
      }),
    },

    // GA4 — fail fast when offline
    {
      matcher: ({ url }) => url.hostname === 'www.googletagmanager.com',
      handler: new NetworkFirst({
        cacheName: 'mv-ga',
        networkTimeoutSeconds: 3,
      }),
    },

    // Default Serwist rules (documents, Next.js chunks, fonts, RSC)
    ...defaultCache,
  ],
});

serwist.addEventListeners();