'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  MapPin,
  ShoppingBag,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/account', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/account/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/account/profile', label: 'Profile', icon: User },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/security', label: 'Security', icon: Lock },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        // Mobile: horizontal scroll tabs
        'flex gap-2 overflow-x-auto pb-1 -mx-4 px-4',
        'scrollbar-hidden',
        // Desktop: vertical stack
        'md:mx-0 md:px-0 md:pb-0 md:flex-col md:overflow-visible md:gap-1'
      )}
      aria-label="Account navigation"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap',
              // Mobile tab styling
              'border border-mv-border bg-white',
              // Desktop removes the border, uses full-width row
              'md:border-0 md:bg-transparent md:whitespace-normal',
              isActive
                ? 'border-mv-primary bg-mv-primary text-white md:bg-mv-primary md:text-white'
                : 'text-mv-text-secondary hover:bg-mv-bg-alt hover:text-mv-text md:text-mv-text-secondary'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}