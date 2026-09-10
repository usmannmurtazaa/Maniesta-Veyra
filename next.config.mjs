import { withSentryConfig } from '@sentry/nextjs';
import withSerwistInit from '@serwist/next';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const hasSentryToken = Boolean(process.env.SENTRY_AUTH_TOKEN);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  webpack: (config, { isServer }) => {
    // Konva pulls in `canvas` on the server side (Node), which is a
    // native module we do not need. Stub it out so the build succeeds.
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: path.resolve(process.cwd(), 'src/lib/canvas-stub.ts'),
      };
    }
    return config;
  },
};

// ---------------------------------------------------------------------------
// Serwist (PWA) — disable in dev to keep HMR fast
// ---------------------------------------------------------------------------
const withSerwist = withSerwistInit({
  swSrc: 'src/sw.ts',
  swDest: 'public/sw.js',
  disable: isDev,
  register: true,
  reloadOnOnline: true,
});

// ---------------------------------------------------------------------------
// Sentry — wrap, but DO NOT run its webpack plugins unless we have a token.
// This is what actually prevents the clientReferenceManifest build conflict.
// ---------------------------------------------------------------------------
const configWithSerwist = withSerwist(nextConfig);

export default withSentryConfig(configWithSerwist, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !hasSentryToken,

  // ✅ These are the real options that disable the plugins causing your build conflict.
  disableServerWebpackPlugin: !hasSentryToken,
  disableClientWebpackPlugin: !hasSentryToken,

  // ✅ Keep the runtime SDK, but do not upload source maps.
  widenClientFileUpload: false,
  hideSourceMaps: true,
  disableLogger: true,

  // ✅ These control SDK auto-instrumentation, not the webpack plugin.
  autoInstrumentServerFunctions: isProd,
  autoInstrumentMiddleware: isProd,
  autoInstrumentAppDirectory: isProd,
});