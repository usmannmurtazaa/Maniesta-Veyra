import { auth } from '@/lib/auth/auth';
import { UnauthorizedError, ForbiddenError } from '@/lib/errors';

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new UnauthorizedError();
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  const role = session.user.role;
  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    throw new ForbiddenError();
  }
  return session;
}

export async function requireSuperAdmin() {
  const session = await requireAuth();
  if (session.user.role !== 'SUPER_ADMIN') {
    throw new ForbiddenError();
  }
  return session;
}