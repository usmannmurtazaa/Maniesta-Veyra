import { withSentryConfig } from '@sentry/nextjs/config';
import withSerwistInit from '@serwist/next';
import path from 'node:path';

const isDev = process.env.NODE_ENV === 'development';
const hasSentryToken = Boolean(process.env.SENTRY_AUTH_TOKEN);
const hasSentryDsn = Boolean(
  process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
);

// Content-Security-Policy — minimum viable for this stack.
const cspDirectives = [
  `default-src 'self'`,
  `img-src 'self' data: blob: https://*.blob.vercel-storage.com https://images.unsplash.com`,
  `font-src 'self' data: https://fonts.gstatic.com`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com`,
  `connect-src 'self' https://*.google-analytics.com https://*.blob.vercel-storage.com https://*.upstash.io https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io https://api.stripe.com${isDev ? ' ws: http://localhost:*' : ''}`,
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

  // ✅ ONLY server-only packages that must not be bundled.
  //    Removed 'konva' and 'react-konva' — they need to be bundled normally
  //    on the client. They are loaded dynamically with ssr:false on the
  //    customizer route, so the server never tries to SSR them.
  serverExternalPackages: [
    'file-type',
    'image-size',
  ],

  // ✅ Let webpack process react-konva's ESM output for the client bundle.
  //    react-konva 18.2.x ships ESM that needs Next.js's transform pipeline.
  transpilePackages: ['konva', 'react-konva'],

  images: {
    formats: ['image/avif', 'image/webp'],
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
      {
        source: '/icons/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  webpack: (config, { isServer, nextRuntime }) => {
    // ✅ Alias `canvas` ONLY on the Node.js server runtime — this is where
    //    Konva tries to load the native module. The edge runtime and the
    //    client bundle must NOT use this stub.
    if (isServer && nextRuntime === 'nodejs') {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: path.resolve(process.cwd(), 'src/lib/canvas-stub.ts'),
      };
    }

    // Silence jose's CompressionStream/DecompressionStream warnings in the
    // Edge runtime. Auth.js does not use JWE compression by default.
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

    disableServerWebpackPlugin: !hasSentryToken,
    disableClientWebpackPlugin: !hasSentryToken,

    widenClientFileUpload: false,

    sourcemaps: {
      deleteSourcemapsAfterUpload: true,
    },

    webpack: {
      treeshake: {
        removeDebugLogging: true,
      },
    },
  });
}

export default exportedConfig;