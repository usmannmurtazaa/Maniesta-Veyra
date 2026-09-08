'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'; // We need to create Sheet component, but we can use Dialog as base for now. Let's create a simple Sheet below.
import { Container } from './container';
import { publicEnv } from '@/lib/env';

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-mv-border bg-mv-bg/95 backdrop-blur supports-[backdrop-filter]:bg-mv-bg/80">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-mv-text">
            {publicEnv.NEXT_PUBLIC_APP_NAME}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/shop" className="text-sm font-medium text-mv-text hover:text-mv-accent transition-colors">
            Shop
          </Link>
          <Link href="/collections" className="text-sm font-medium text-mv-text hover:text-mv-accent transition-colors">
            Collections
          </Link>
          <Link href="/custom-shirts" className="text-sm font-medium text-mv-text hover:text-mv-accent transition-colors">
            Custom Studio
          </Link>
          <Link href="/about" className="text-sm font-medium text-mv-text hover:text-mv-accent transition-colors">
            About
          </Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-2">
          {/* Search toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Wishlist */}
          <Button variant="ghost" size="icon" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </Button>

          {/* Account */}
          <Button variant="ghost" size="icon" aria-label="Account">
            <User className="h-5 w-5" />
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-mv-accent text-[10px] text-white">
              0
            </span>
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-4">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/shop" className="text-base font-medium py-2">Shop</Link>
                <Link href="/collections" className="text-base font-medium py-2">Collections</Link>
                <Link href="/custom-shirts" className="text-base font-medium py-2">Custom Studio</Link>
                <Link href="/about" className="text-base font-medium py-2">About</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>

      {/* Search bar expandable (simple) */}
      {isSearchOpen && (
        <div className="border-t border-mv-border bg-mv-bg">
          <Container className="py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mv-muted" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}