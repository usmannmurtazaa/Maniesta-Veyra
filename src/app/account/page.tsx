import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Package, Heart, User as UserIcon } from 'lucide-react';
import { requireAuth } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Account',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function AccountDashboardPage() {
  const session = await requireAuth();
  const userId = session.user.id;

  const [user, ordersCount, wishlistCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true, email: true },
    }),
    prisma.order.count({ where: { userId } }),
    prisma.wishlistItem.count({ where: { wishlist: { userId } } }),
  ]);

  const displayName = user?.firstName?.trim() || 'there';

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-mv-text">
          Welcome back, {displayName}
        </h1>
        <p className="mt-2 text-sm text-mv-text-secondary">
          Manage your orders, wishlist, and account details.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Orders */}
        <Link href="/account/orders" className="block group">
          <Card className="h-full transition-shadow group-hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-mv-text-secondary">
                Orders
              </CardTitle>
              <Package className="h-4 w-4 text-mv-muted" aria-hidden />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-mv-text">{ordersCount}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-mv-accent">
                View orders
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Wishlist */}
        <Link href="/wishlist" className="block group">
          <Card className="h-full transition-shadow group-hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-mv-text-secondary">
                Wishlist
              </CardTitle>
              <Heart className="h-4 w-4 text-mv-muted" aria-hidden />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-mv-text">{wishlistCount}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-mv-accent">
                View wishlist
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Account */}
        <Link href="/account/profile" className="block group">
          <Card className="h-full transition-shadow group-hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-mv-text-secondary">
                Account
              </CardTitle>
              <UserIcon className="h-4 w-4 text-mv-muted" aria-hidden />
            </CardHeader>
            <CardContent>
              <p className="truncate text-sm font-medium text-mv-text">
                {user?.email ?? '—'}
              </p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-mv-accent">
                Manage profile
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}