import { defaultCache } from '@serwist/next/worker';
import type {
  PrecacheEntry,
  SerwistGlobalConfig,
} from 'serwist';

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

  navigationPreload: false,

  fallbacks: {
    entries: [
      {
        url: '/offline.html',
        matcher: ({ request }) =>
          request.destination === 'document',
      },
    ],
  },

  runtimeCaching: [
    // ------------------------------------------------------------
    // HTML DOCUMENTS
    // ------------------------------------------------------------
    {
      matcher: ({ request }) =>
        request.destination === 'document' ||
        request.headers
          .get('accept')
          ?.includes('text/html'),

      handler: new NetworkOnly(),
    },

    // ------------------------------------------------------------
    // NEXT.JS RSC
    // ------------------------------------------------------------
    // RSC responses should always come directly from Next.js.
    // They should not be cached.
    {
      matcher: ({ url }) =>
        url.searchParams.has('_rsc'),

      handler: new NetworkOnly(),
    },

    // ------------------------------------------------------------
    // NEXT.JS IMAGE OPTIMIZATION
    // ------------------------------------------------------------
    {
      matcher: ({ url }) =>
        url.pathname.startsWith('/_next/image'),

      handler: new NetworkOnly(),
    },

    // ------------------------------------------------------------
    // API ROUTES
    // ------------------------------------------------------------
    {
      matcher: ({ url }) =>
        url.pathname.startsWith('/api/'),

      handler: new NetworkOnly(),
    },

    // ------------------------------------------------------------
    // PRIVATE / DYNAMIC ROUTES
    // ------------------------------------------------------------
    {
      matcher: ({ url }) =>
        /^\/(account|checkout|cart|admin|wishlist|auth|customize|custom-shirts)(\/|$)/.test(
          url.pathname
        ),

      handler: new NetworkOnly(),
    },

    // ------------------------------------------------------------
    // VERCEL BLOB IMAGES
    // ------------------------------------------------------------
    {
      matcher: ({ url }) =>
        url.hostname.endsWith(
          '.blob.vercel-storage.com'
        ),

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

    // ------------------------------------------------------------
    // GOOGLE TAG MANAGER
    // ------------------------------------------------------------
    {
      matcher: ({ url }) =>
        url.hostname ===
        'www.googletagmanager.com',

      handler: new NetworkFirst({
        cacheName: 'mv-ga',
        networkTimeoutSeconds: 3,
      }),
    },

    // ------------------------------------------------------------
    // DEFAULT SERWIST CACHE
    // ------------------------------------------------------------
    ...defaultCache,
  ],
});

serwist.addEventListeners();