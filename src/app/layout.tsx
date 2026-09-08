import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { publicEnv } from '@/lib/env';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { OrganizationJsonLd } from '@/components/seo/organization-json-ld';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${publicEnv.NEXT_PUBLIC_APP_NAME} | ${publicEnv.NEXT_PUBLIC_APP_TAGLINE}`,
    template: `%s | ${publicEnv.NEXT_PUBLIC_APP_NAME}`,
  },
  description: 'Premium clothing e-commerce and custom print studio.',
  openGraph: {
    title: publicEnv.NEXT_PUBLIC_APP_NAME,
    description: 'Premium clothing e-commerce and custom print studio.',
    url: publicEnv.NEXT_PUBLIC_APP_URL,
    siteName: publicEnv.NEXT_PUBLIC_APP_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: publicEnv.NEXT_PUBLIC_APP_NAME,
    description: 'Premium clothing e-commerce and custom print studio.',
  },
  robots: {
    index: true,
    follow: true,
  },
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
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        <OrganizationJsonLd />
      </head>
      <body className="font-sans bg-mv-bg text-mv-text antialiased">
        <TooltipProvider delayDuration={200}>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}