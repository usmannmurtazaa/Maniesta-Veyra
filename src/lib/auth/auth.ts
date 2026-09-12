import NextAuth, { type DefaultSession, CredentialsSignin } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';
import type { UserRole } from '@prisma/client';

// ---------------------------------------------------------------------------
// Type augmentation
// ---------------------------------------------------------------------------
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession['user'];
  }

  interface User {
    role?: UserRole;
  }
}

// ---------------------------------------------------------------------------
// Error classes — allow the UI to distinguish failure reasons
// ---------------------------------------------------------------------------
class InvalidCredentialsError extends CredentialsSignin {
  code = 'INVALID_CREDENTIALS';
}

class EmailNotVerifiedError extends CredentialsSignin {
  code = 'EMAIL_NOT_VERIFIED';
}

class AccountDisabledError extends CredentialsSignin {
  code = 'ACCOUNT_DISABLED';
}

// ---------------------------------------------------------------------------
// NextAuth configuration
// ---------------------------------------------------------------------------
export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new InvalidCredentialsError();
        }

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            passwordHash: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            emailVerified: true,
          },
        });

        // Timing-safe: even for missing users, run a bcrypt comparison
        if (!user || !user.passwordHash) {
          await compare(
            password,
            '$2a$12$invalidhashusedonlyforshape000000000000000000000000000'
          );
          throw new InvalidCredentialsError();
        }

        const isValid = await compare(password, user.passwordHash);
        if (!isValid) {
          throw new InvalidCredentialsError();
        }

        if (!user.isActive) {
          throw new AccountDisabledError();
        }

        if (!user.emailVerified) {
          throw new EmailNotVerifiedError();
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // First sign-in: `user` is present — persist id + role onto the JWT.
      // Inline cast because the JWT type is not augmentable in beta.32.
      if (user) {
        (token as Record<string, unknown>).id = user.id;
        (token as Record<string, unknown>).role =
          (user.role ?? 'CUSTOMER') as UserRole;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const t = token as Record<string, unknown>;
        session.user.id = (t.id as string) ?? '';
        session.user.role = (t.role as UserRole) ?? 'CUSTOMER';
      }
      return session;
    },
  },
});