/**
 * Secure admin bootstrap script.
 *
 * Usage:
 *   npx tsx prisma/seed-admin.ts
 *
 * Requires:
 *   ADMIN_EMAIL, ADMIN_PASSWORD  (from environment)
 *
 * Behavior:
 *   - If a user with ADMIN_EMAIL exists, promote to SUPER_ADMIN.
 *   - Otherwise, create a new user with SUPER_ADMIN role.
 *   - Password is always (re)set to ADMIN_PASSWORD.
 *
 * This script is idempotent and safe to run multiple times.
 */

import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const firstName = process.env.ADMIN_FIRST_NAME || 'Super';
  const lastName = process.env.ADMIN_LAST_NAME || 'Admin';

  if (!email || !password) {
    console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD.');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('ADMIN_PASSWORD must be at least 8 characters.');
    process.exit(1);
  }

  const passwordHash = await hash(password, 12);

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash,
        role: UserRole.SUPER_ADMIN,
        isActive: true,
        emailVerified: existing.emailVerified ?? new Date(),
      },
    });
    console.log(`Updated existing user ${email} as SUPER_ADMIN.`);
  } else {
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role: UserRole.SUPER_ADMIN,
        isActive: true,
        emailVerified: new Date(),
      },
    });
    console.log(`Created SUPER_ADMIN user ${email}.`);
  }

  console.log('Done. Remove ADMIN_PASSWORD from environment now.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });