import type { MetadataRoute } from 'next';
import { publicEnv } from '@/lib/env';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${publicEnv.NEXT_PUBLIC_APP_NAME} - Premium Clothing & Custom Print Studio`,
    short_name: publicEnv.NEXT_PUBLIC_APP_NAME,
    description: publicEnv.NEXT_PUBLIC_APP_TAGLINE,
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAFA',
    theme_color: '#1A1A2E',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
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