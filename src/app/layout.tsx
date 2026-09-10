import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { publicEnv } from '@/lib/env';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { OrganizationJsonLd } from '@/components/seo/organization-json-ld';

// Body font — critical path, keep preload enabled
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Display font — used only in headings; disable preload to avoid
// "preloaded but not used" warnings on pages with no large headings.
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_APP_URL),
  title: {
    default: `${publicEnv.NEXT_PUBLIC_APP_NAME} | ${publicEnv.NEXT_PUBLIC_APP_TAGLINE}`,
    template: `%s | ${publicEnv.NEXT_PUBLIC_APP_NAME}`,
  },
  description:
    'Premium ready-made clothing and a custom print studio. Wear Your Identity.',
  openGraph: {
    title: publicEnv.NEXT_PUBLIC_APP_NAME,
    description:
      'Premium ready-made clothing and a custom print studio. Wear Your Identity.',
    url: publicEnv.NEXT_PUBLIC_APP_URL,
    siteName: publicEnv.NEXT_PUBLIC_APP_NAME,
    type: 'website',
    locale: 'en_PK',
  },
  twitter: {
    card: 'summary_large_image',
    title: publicEnv.NEXT_PUBLIC_APP_NAME,
    description:
      'Premium ready-made clothing and a custom print studio. Wear Your Identity.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#1A1A2E',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  // Allow pinch-zoom for accessibility (WCAG 1.4.4)
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = publicEnv.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  send_page_view: true
                });
              `}
            </Script>
          </>
        )}
        <OrganizationJsonLd />
      </head>
      <body className="font-sans bg-mv-bg text-mv-text antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-mv-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-mv-inverse"
        >
          Skip to content
        </a>
        <TooltipProvider delayDuration={200}>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}