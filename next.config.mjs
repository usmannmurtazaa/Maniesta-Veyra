import { withSentryConfig } from '@sentry/nextjs';
import withSerwistInit from '@serwist/next';
import path from 'node:path';

const isDev = process.env.NODE_ENV === 'development';
const hasSentryToken = Boolean(process.env.SENTRY_AUTH_TOKEN);
const hasSentryDsn = Boolean(
  process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.blob.vercel-storage.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
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
    // Konva pulls in the `canvas` native module on the server.
    // Stub it out so Next.js can build without it.
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
// Serwist (PWA)
// ---------------------------------------------------------------------------
const withSerwist = withSerwistInit({
  swSrc: 'src/sw.ts',
  swDest: 'public/sw.js',
  disable: isDev,
  register: true,
  reloadOnOnline: true,
});

const configWithSerwist = withSerwist(nextConfig);

// ---------------------------------------------------------------------------
// Sentry — apply the wrapper only when a DSN exists.
// Single top-level export (required by ESM).
// ---------------------------------------------------------------------------
let exportedConfig = configWithSerwist;

if (hasSentryDsn) {
  exportedConfig = withSentryConfig(configWithSerwist, {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,

    silent: !hasSentryToken,

    // Prevent the "clientReferenceManifest" build conflict in Next 15:
    // disable Sentry's webpack plugins when we cannot upload source maps.
    disableServerWebpackPlugin: !hasSentryToken,
    disableClientWebpackPlugin: !hasSentryToken,

    widenClientFileUpload: false,

    // v10: replaces the deprecated `hideSourceMaps`
    sourcemaps: {
      deleteSourcemapsAfterUpload: true,
    },

    disableLogger: true,
  });
}

export default exportedConfig;