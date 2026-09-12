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
        url: '/offline.html',
        matcher: ({ request }) => request.destination === 'document',
      },
    ],
  },

  runtimeCaching: [
    // ----------------------------------------------------------------
    // Custom overrides — must come BEFORE defaultCache so they win.
    // Serwist matches top-to-bottom and stops at the first match.
    // ----------------------------------------------------------------

    // 1. Private API routes — never cache
    {
      matcher: ({ url }) => url.pathname.startsWith('/api/'),
      handler: new NetworkOnly(),
    },

    // 2. Private page routes — never cache the document
    {
      matcher: ({ url }) =>
        /^\/(account|checkout|cart|admin|wishlist|auth|customize)(\/|$)/.test(
          url.pathname
        ),
      handler: new NetworkOnly(),
    },

    // 3. Public documents — NetworkFirst with 5s timeout.
    //    When the server returns 5xx OR the request times out, Serwist
    //    falls through to the `fallbacks` entry above (serves /offline.html)
    //    instead of showing the browser's crash page.
    //    Only 200 responses are cached (cacheableResponse statuses below).
    {
      matcher: ({ request }) => request.destination === 'document',
      handler: new NetworkFirst({
        cacheName: 'mv-documents',
        networkTimeoutSeconds: 5,
        plugins: [
          new CacheableResponsePlugin({
            // Do NOT cache 5xx or 404 responses
            statuses: [200],
          }),
        ],
      }),
    },

    // 4. Vercel Blob product images — long-lived cache
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

    // 5. GA4 — fail fast when offline
    {
      matcher: ({ url }) => url.hostname === 'www.googletagmanager.com',
      handler: new NetworkFirst({
        cacheName: 'mv-ga',
        networkTimeoutSeconds: 3,
      }),
    },

    // ----------------------------------------------------------------
    // Default Serwist rules — Next.js chunks, fonts, RSC payloads.
    // These never run for documents because rule #3 matches first.
    // ----------------------------------------------------------------
    ...defaultCache,
  ],
});

serwist.addEventListeners();