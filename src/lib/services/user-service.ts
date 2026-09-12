import { hash, compare } from 'bcryptjs';
import { randomBytes, createHash } from 'crypto';
import { prisma } from '@/lib/db/prisma';
import type {
  RegisterInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from '@/lib/validation/user.schema';
import { ConflictError, NotFoundError, UnauthorizedError } from '@/lib/errors';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '@/lib/email/send';

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes
const BCRYPT_COST = 12;

function generateToken(): { raw: string; hashed: string } {
  const raw = randomBytes(32).toString('hex');
  const hashed = createHash('sha256').update(raw).digest('hex');
  return { raw, hashed };
}

export class UserService {
  async register(input: RegisterInput) {
    // ---- 1. Verify email is not taken -----------------------------------
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true, emailVerified: true },
    });

    if (existingUser) {
      // If the account exists but was never verified, allow the user to
      // re-register by reusing the same account. This avoids the situation
      // where a user who missed their verification email is locked out.
      if (!existingUser.emailVerified) {
        throw new ConflictError(
          'An account with this email already exists but is not verified. Please check your inbox or reset your password.'
        );
      }
      throw new ConflictError('Email already registered');
    }

    // ---- 2. Hash password ----------------------------------------------
    const passwordHash = await hash(input.password, BCRYPT_COST);

    // ---- 3. Create user + token in one transaction ---------------------
    const { raw: token, hashed: tokenHash } = generateToken();
    const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: input.email,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          role: 'CUSTOMER',
        },
      });

      await tx.passwordResetToken.create({
        data: {
          userId: createdUser.id,
          tokenHash,
          expiresAt,
        },
      });

      return createdUser;
    });

    // ---- 4. Send verification email (non-fatal) ------------------------
    // If email delivery fails, the account still exists. The user can
    // request a new link via /auth/forgot-password. Failing the whole
    // registration would leave an orphaned user record with no recourse.
    try {
      await sendVerificationEmail(user.email, token);
    } catch (error) {
      console.error('[register] failed to send verification email:', error);
    }

    return user;
  }

  async verifyEmail(token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    // ---- 1. Look up the token (including used ones) --------------------
    const record = await prisma.passwordResetToken.findFirst({
      where: { tokenHash },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new NotFoundError(
        'This verification link is invalid. Please request a new one.'
      );
    }

    // ---- 2. Handle the "already used" case -----------------------------
    // If the token was already consumed AND the user's email is verified,
    // treat this as success — the user just clicked an old link.
    if (record.usedAt) {
      const user = await prisma.user.findUnique({
        where: { id: record.userId },
        select: { emailVerified: true },
      });

      if (user?.emailVerified) {
        return true;
      }

      throw new NotFoundError(
        'This verification link has already been used. Please request a new one.'
      );
    }

    // ---- 3. Handle the "expired" case ---------------------------------
    if (record.expiresAt < new Date()) {
      throw new NotFoundError(
        'This verification link has expired. Please request a new one.'
      );
    }

    // ---- 4. Mark verified + consume token in a transaction -------------
    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { emailVerified: new Date() },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return true;
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    // To prevent email enumeration, return success even when no account
    // exists. The API route applies rate limiting on top of this.
    if (!user) {
      return true;
    }

    const { raw: token, hashed: tokenHash } = generateToken();
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    // Invalidate all outstanding tokens for this user before issuing a new
    // one. This ensures only the most recent link works — protects against
    // a user who clicks the wrong email in a long thread.
    await prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.updateMany({
        where: { userId: user.id, usedAt: null },
        data: { usedAt: new Date() },
      });

      await tx.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });
    });

    // Non-fatal: if the email fails, the user can request another link.
    try {
      await sendPasswordResetEmail(user.email, token);
    } catch (error) {
      console.error('[forgotPassword] failed to send reset email:', error);
    }

    return true;
  }

  async resetPassword(input: ResetPasswordInput) {
    const tokenHash = createHash('sha256').update(input.token).digest('hex');

    const record = await prisma.passwordResetToken.findFirst({
      where: { tokenHash },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new NotFoundError('Invalid or expired reset link.');
    }

    if (record.usedAt) {
      throw new NotFoundError(
        'This reset link has already been used. Please request a new one.'
      );
    }

    if (record.expiresAt < new Date()) {
      throw new NotFoundError(
        'This reset link has expired. Please request a new one.'
      );
    }

    const passwordHash = await hash(input.password, BCRYPT_COST);

    // Mark password changed + consume token atomically.
    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return true;
  }

  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user || !user.passwordHash) {
      throw new NotFoundError('User not found');
    }

    const isValid = await compare(input.currentPassword, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    const newPasswordHash = await hash(input.newPassword, BCRYPT_COST);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    return true;
  }
}

export const userService = new UserService();