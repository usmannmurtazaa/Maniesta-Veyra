import type { MetadataRoute } from 'next';
import { publicEnv } from '@/lib/env';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${publicEnv.NEXT_PUBLIC_APP_NAME} - Premium Clothing & Custom Print Studio`,
    short_name: publicEnv.NEXT_PUBLIC_APP_NAME,
    description: publicEnv.NEXT_PUBLIC_APP_TAGLINE,
    start_url: '/?utm_source=pwa&utm_medium=app',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    orientation: 'portrait',
    lang: 'en-PK',
    dir: 'ltr',
    categories: ['shopping', 'lifestyle', 'fashion'],
    background_color: '#FAFAFA',
    theme_color: '#1A1A2E',
    shortcuts: [
      {
        name: 'Shop Collection',
        short_name: 'Shop',
        description: 'Browse all ready-made clothing',
        url: '/shop',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Custom Print Studio',
        short_name: 'Custom',
        description: 'Create your own custom printed shirt',
        url: '/customize',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'My Cart',
        short_name: 'Cart',
        description: 'View your shopping cart',
        url: '/cart',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}