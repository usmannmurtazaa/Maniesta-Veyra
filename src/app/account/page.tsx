import { requireAuth } from '@/lib/auth/guards';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AccountDashboardPage() {
  const session = await requireAuth();
  const userId = session.user.id;

  const [user, ordersCount, wishlistCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.order.count({ where: { userId } }),
    prisma.wishlistItem.count({ where: { wishlist: { userId } } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">
        Welcome, {user?.firstName}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{ordersCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Wishlist</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{wishlistCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-mv-muted">{user?.email}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}