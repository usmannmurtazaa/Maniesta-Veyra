import Link from 'next/link';
import { Container } from './container';
import { publicEnv } from '@/lib/env';

const FOOTER_LINKS = {
  shop: [
    { href: '/shop', label: 'All products' },
    { href: '/shop/drop-shoulder-shirts', label: 'Drop shoulder shirts' },
    { href: '/custom-shirts', label: 'Custom Studio' },
    { href: '/collections', label: 'Collections' },
  ],
  support: [
    { href: '/contact', label: 'Contact' },
    { href: '/shipping', label: 'Shipping' },
    { href: '/returns', label: 'Returns & exchanges' },
    { href: '/faq', label: 'FAQ' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/privacy', label: 'Privacy policy' },
    { href: '/terms', label: 'Terms of service' },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-mv-border bg-mv-bg-alt">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display text-xl font-bold text-mv-text">
              {publicEnv.NEXT_PUBLIC_APP_NAME}
            </Link>
            <p className="mt-3 text-sm text-mv-text-secondary max-w-xs">
              {publicEnv.NEXT_PUBLIC_APP_TAGLINE}
            </p>
          </div>

          {/* Shop */}
          <nav aria-label="Shop">
            <h3 className="text-sm font-semibold text-mv-text">Shop</h3>
            <ul className="mt-3 space-y-2">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-mv-text-secondary transition-colors hover:text-mv-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support */}
          <nav aria-label="Support">
            <h3 className="text-sm font-semibold text-mv-text">Support</h3>
            <ul className="mt-3 space-y-2">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-mv-text-secondary transition-colors hover:text-mv-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <h3 className="text-sm font-semibold text-mv-text">Company</h3>
            <ul className="mt-3 space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-mv-text-secondary transition-colors hover:text-mv-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-mv-border pt-6 text-xs text-mv-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {publicEnv.NEXT_PUBLIC_APP_NAME}. All rights reserved.
          </p>
          <p>
            Designed & developed by{' '}
            <a
              href="https://usmanmurtaza.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mv-text underline-offset-4 hover:text-mv-accent hover:underline"
            >
              Usman Murtaza
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}