import { withSentryConfig } from '@sentry/nextjs/config';
import withSerwistInit from '@serwist/next';
import path from 'node:path';

const isDev = process.env.NODE_ENV === 'development';
const hasSentryToken = Boolean(process.env.SENTRY_AUTH_TOKEN);
const hasSentryDsn = Boolean(
  process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
);

// Content-Security-Policy — minimum viable for this stack.
// Tighten over time with nonces/hashes for inline scripts.
const cspDirectives = [
  `default-src 'self'`,
  // Vercel Blob (product images + preview thumbnails), Unsplash (dev only), data URIs for canvas exports
  `img-src 'self' data: blob: https://*.blob.vercel-storage.com https://images.unsplash.com`,
  // Google Fonts + Vercel Blob
  `font-src 'self' data: https://fonts.gstatic.com`,
  // Inline styles are required by Next.js and Radix UI
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  // Inline scripts are required by Next.js runtime; Google Analytics; Vercel Analytics
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com`,
  // API calls + Upstash + GA + Blob
  `connect-src 'self' https://www.google-analytics.com https://*.blob.vercel-storage.com https://*.upstash.io${isDev ? ' ws: http://localhost:*' : ''}`,
  // Stripe checkout (only loaded when user selects ONLINE payment)
  `frame-src 'self' https://checkout.stripe.com https://js.stripe.com`,
  `form-action 'self'`,
  `base-uri 'self'`,
  `object-src 'none'`,
  `frame-ancestors 'self'`,
  `upgrade-insecure-requests`,
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  // Next 15 native replacement for webpack externals for Konva.
  // Prevents Next from trying to bundle Konva's native `canvas` dep on the server.
  serverExternalPackages: ['konva', 'react-konva'],

  images: {
    formats: ['image/avif', 'image/webp'],
    // Next 15.5+ requires explicit qualities if you use the `quality` prop
    qualities: [75, 90],
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
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'Content-Security-Policy', value: cspDirectives },
        ],
      },
      // Cache-Control for static assets (Next already sets some, but explicit is safer)
      {
        source: '/icons/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  webpack: (config, { isServer, nextRuntime }) => {
    // Belt-and-suspenders: also alias `canvas` in case any dep does
    // require('canvas') at module load time. serverExternalPackages above
    // handles the module resolution; this handles the import path.
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: path.resolve(process.cwd(), 'src/lib/canvas-stub.ts'),
      };
    }

    // Silence jose's CompressionStream/DecompressionStream warnings in the
    // Edge runtime. Auth.js does not use JWE compression by default, so the
    // flagged code path never executes — the warning is informational only.
    if (nextRuntime === 'edge') {
      config.ignoreWarnings = [
        ...(config.ignoreWarnings ?? []),
        { module: /jose\/dist\/webapi\/lib\/deflate\.js/ },
      ];
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
  additionalPrecacheEntries: [{ url: '/offline.html', revision: null }],
});

const configWithSerwist = withSerwist(nextConfig);

// ---------------------------------------------------------------------------
// Sentry — single top-level export (required by ESM).
// Apply the wrapper only when a DSN exists.
// ---------------------------------------------------------------------------
let exportedConfig = configWithSerwist;

if (hasSentryDsn) {
  exportedConfig = withSentryConfig(configWithSerwist, {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,

    silent: !hasSentryToken,

    // Prevent the clientReferenceManifest build conflict in Next 15.
    // Disabling the webpack plugins when we cannot upload source maps
    // is the actual fix, not a workaround.
    disableServerWebpackPlugin: !hasSentryToken,
    disableClientWebpackPlugin: !hasSentryToken,

    widenClientFileUpload: false,

    // v10: replaces the deprecated `hideSourceMaps`
    sourcemaps: {
      deleteSourcemapsAfterUpload: true,
    },

    // v10: replaces the deprecated `disableLogger`.
    // Treeshakes Sentry debug logging from the production bundle.
    webpack: {
      treeshake: {
        removeDebugLogging: true,
      },
    },
  });
}

export default exportedConfig;