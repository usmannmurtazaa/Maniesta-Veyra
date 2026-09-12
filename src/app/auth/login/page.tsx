'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginInput } from '@/lib/validation/user.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Container } from '@/components/layout/container';
import { cn } from '@/lib/utils';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        return;
      }

      // Honor the `?redirect=` param set by middleware when a user was
      // bounced to login from a protected route. Fall back to /account.
      const redirectTo = searchParams.get('redirect') || '/account';
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Container className="flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-mv-text">
            Welcome back
          </h1>
          <p className="mt-2 text-mv-text-secondary">
            Sign in to your Maniesta Veyra account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              autoFocus
              {...register('email')}
              className={cn(
                errors.email && 'border-mv-error focus-visible:ring-mv-error'
              )}
            />
            {errors.email && (
              <p className="text-xs text-mv-error">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-mv-accent underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password')}
                className={cn(
                  'pr-10',
                  errors.password && 'border-mv-error focus-visible:ring-mv-error'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-mv-muted transition-colors hover:text-mv-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-focus"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-mv-error">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-mv-error/30 bg-mv-error/5 p-3"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-mv-error"
                aria-hidden
              />
              <p className="text-sm text-mv-error">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="text-center text-sm text-text-secondary">
          <span className="text-mv-text-secondary">
            Don&rsquo;t have an account?{' '}
          </span>
          <Link
            href="/auth/register"
            className="font-medium text-mv-accent underline-offset-4 hover:underline"
          >
            Create account
          </Link>
        </div>
      </div>
    </Container>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-mv-muted">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}