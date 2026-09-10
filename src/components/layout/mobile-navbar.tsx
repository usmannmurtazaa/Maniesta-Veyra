'use client';

import Link from 'next/link';
import { Search, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileDrawer } from './mobile-drawer';
import { publicEnv } from '@/lib/env';

export function MobileNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-mv-border bg-mv-bg/95 backdrop-blur lg:hidden">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <MobileDrawer />
          <Link href="/" className="font-display text-lg font-bold text-mv-text">
            {publicEnv.NEXT_PUBLIC_APP_NAME}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}