'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, Search, Heart, ShoppingBag, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Container } from './container';
import { publicEnv } from '@/lib/env';
import { useCartStore } from '@/stores/cart-store';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/collections', label: 'Collections' },
  { href: '/custom-shirts', label: 'Custom Studio' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Total quantity from cart store
  const cartCount = useCartStore((s) => s.totalItems);

  // Close search on outside click
  useEffect(() => {
    if (!isSearchOpen) return;
    function onClick(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsSearchOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isSearchOpen]);

  // Focus input when search opens — but not on mobile (avoid keyboard popup)
  useEffect(() => {
    if (!isSearchOpen) return;
    if (window.matchMedia('(min-width: 768px)').matches) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setIsSearchOpen(false);
    setQuery('');
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-mv-border bg-mv-bg/95 backdrop-blur supports-[backdrop-filter]:bg-mv-bg/80">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label={`${publicEnv.NEXT_PUBLIC_APP_NAME} — home`}
        >
          <Image
            src="/favicon-192.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded"
            priority
          />
          <span className="font-display text-xl font-bold text-mv-text hidden sm:inline">
            {publicEnv.NEXT_PUBLIC_APP_NAME}
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors',
                isActive(link.href)
                  ? 'text-mv-accent'
                  : 'text-mv-text hover:text-mv-accent'
              )}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen((v) => !v)}
            aria-label={isSearchOpen ? 'Close search' : 'Open search'}
            aria-expanded={isSearchOpen}
            aria-controls="mv-search-panel"
          >
            {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>

          <Link href="/wishlist" aria-label="Wishlist">
            <Button variant="ghost" size="icon" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/account" aria-label="Account">
            <Button variant="ghost" size="icon" aria-label="Account">
              <User className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/cart" aria-label={`Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}>
            <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-mv-accent px-1 text-[10px] font-medium text-white"
                  aria-hidden="true"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile menu trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-4">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-8" aria-label="Mobile">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'text-base font-medium py-3 px-2 rounded-md transition-colors',
                      isActive(link.href)
                        ? 'text-mv-accent bg-mv-bg-alt'
                        : 'text-mv-text hover:bg-mv-bg-alt'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>

      {/* Search panel */}
      {isSearchOpen && (
        <div
          id="mv-search-panel"
          ref={searchContainerRef}
          className="border-t border-mv-border bg-mv-bg"
        >
          <Container className="py-4">
            <form onSubmit={handleSearchSubmit} role="search">
              <label htmlFor="mv-search-input" className="sr-only">
                Search products
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mv-muted" aria-hidden="true" />
                <Input
                  id="mv-search-input"
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories, or SKU…"
                  className="pl-10 pr-24"
                  enterKeyHint="search"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="default"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7"
                >
                  Search
                </Button>
              </div>
            </form>
          </Container>
        </div>
      )}
    </header>
  );
}