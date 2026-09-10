import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist, NetworkFirst, CacheFirst, NetworkOnly } from 'serwist';

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
  runtimeCaching: [
    // ✅ HTML pages — network first, cache fallback, 3s timeout
    {
      matcher: ({ request }) => request.destination === 'document',
      handler: new NetworkFirst({
        cacheName: 'pages',
        networkTimeoutSeconds: 3,
      }),
    },
    // ✅ Static assets — cache first
    {
      matcher: ({ request }) =>
        request.destination === 'image' ||
        request.destination === 'font' ||
        request.destination === 'style' ||
        request.destination === 'script',
      handler: new CacheFirst({
        cacheName: 'static-assets',
        plugins: [],
      }),
    },
    // ✅ Public API — network only with cache fallback
    {
      matcher: ({ url }) => url.pathname.startsWith('/api/products'),
      handler: new NetworkFirst({
        cacheName: 'public-api',
        networkTimeoutSeconds: 3,
      }),
    },
    // ✅ NEVER cache private routes
    {
      matcher: ({ url }) =>
        url.pathname.startsWith('/api/') ||
        url.pathname.startsWith('/account') ||
        url.pathname.startsWith('/checkout') ||
        url.pathname.startsWith('/cart') ||
        url.pathname.startsWith('/admin') ||
        url.pathname.startsWith('/auth') ||
        url.pathname.startsWith('/customize') ||
        url.pathname.startsWith('/wishlist'),
      handler: new NetworkOnly(),
    },
  ],
  fallbacks: {
    entries: [
      {
        url: '/offline',
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});

serwist.addEventListeners();