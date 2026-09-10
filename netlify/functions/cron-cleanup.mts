import type { Config } from '@netlify/functions';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const [resetTokens, coupons, guestCarts] = await Promise.all([
    prisma.passwordResetToken.deleteMany({
      where: {
        OR: [
          { usedAt: { not: null, lt: sevenDaysAgo } },
          { expiresAt: { lt: sevenDaysAgo } },
        ],
      },
    }),
    prisma.coupon.updateMany({
      where: { isActive: true, expiresAt: { lt: now } },
      data: { isActive: false },
    }),
    prisma.cart.deleteMany({
      where: { userId: null, updatedAt: { lt: ninetyDaysAgo } },
    }),
  ]);

  return new Response(
    JSON.stringify({
      ok: true,
      results: {
        resetTokensDeleted: resetTokens.count,
        couponsDeactivated: coupons.count,
        guestCartsDeleted: guestCarts.count,
      },
    }),
    { headers: { 'content-type': 'application/json' } }
  );
};

// Runs daily at 03:00 UTC
export const config: Config = {
  schedule: '0 3 * * *',
};