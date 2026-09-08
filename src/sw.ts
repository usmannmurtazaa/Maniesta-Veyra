import { defaultCache } from '@serwist/next/browser';
import type { PrecacheEntry } from '@serwist/precaching';
import { installSerwist } from '@serwist/sw';

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.blob\.vercel-storage\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'product-images',
        expiration: { maxEntries: 200, maxAgeSeconds: 604800 },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'google-fonts' },
    },
    {
      urlPattern: /^https:\/\/www\.googletagmanager\.com\/.*/i,
      handler: 'NetworkFirst',
    },
    {
      urlPattern: /^\/api\/.*/i,
      handler: 'NetworkOnly',
    },
    {
      urlPattern: /^\/(account|checkout|cart|admin|wishlist|auth|customize).*/i,
      handler: 'NetworkOnly',
    },
  ],
});