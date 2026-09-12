'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldAlert,
} from 'lucide-react';
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from '@/lib/validation/user.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Container } from '@/components/layout/container';
import { cn } from '@/lib/utils';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: '', confirmPassword: '' },
  });

  // Redirect after success — with cleanup so we don't fire post-unmount
  useEffect(() => {
    if (!success) return;
    const timeout = setTimeout(() => {
      router.push('/auth/login');
    }, 3000);
    return () => clearTimeout(timeout);
  }, [success, router]);

  // ---------------------------------------------------------------
  // Submit handler (this was missing in the previous version)
  // ---------------------------------------------------------------
  const onSubmit = async (data: ResetPasswordInput) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.error?.message ?? 'Reset failed');
        return;
      }

      setSuccess(true);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  // ---------------------------------------------------------------
  // Missing token — link was mangled or user typed the URL
  // ---------------------------------------------------------------
  if (!token) {
    return (
      <Container className="flex min-h-[80vh] items-center justify-center py-16">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mv-warning/10">
            <ShieldAlert className="h-7 w-7 text-mv-warning" aria-hidden />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-mv-text">
            Link is missing
          </h1>
          <p className="mt-3 text-mv-text-secondary">
            This password reset link looks incomplete. Please request a new one
            and use the link from the email.
          </p>
          <div className="mt-8 space-y-3">
            <Link href="/auth/forgot-password" className="block">
              <Button variant="default" className="w-full">
                Request new link
              </Button>
            </Link>
            <Link href="/auth/login" className="block">
              <Button variant="ghost" className="w-full">
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  // ---------------------------------------------------------------
  // Success
  // ---------------------------------------------------------------
  if (success) {
    return (
      <Container className="flex min-h-[80vh] items-center justify-center py-16">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mv-success/10">
            <CheckCircle2 className="h-7 w-7 text-mv-success" aria-hidden />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-mv-text">
            Password updated
          </h1>
          <p className="mt-3 text-mv-text-secondary">
            Your password has been reset. You can now sign in with your new
            password.
          </p>
          <div className="mt-8 space-y-3">
            <Link href="/auth/login" className="block">
              <Button variant="default" className="w-full">
                Go to login
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-mv-muted" aria-live="polite">
            Redirecting automatically in a few seconds…
          </p>
        </div>
      </Container>
    );
  }

  // ---------------------------------------------------------------
  // Form
  // ---------------------------------------------------------------
  return (
    <Container className="flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-mv-text">
            Reset your password
          </h1>
          <p className="mt-2 text-mv-text-secondary">
            Choose a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <input type="hidden" {...register('token')} />

          {/* New password */}
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                {...register('password')}
                className={cn(
                  'pr-10',
                  errors.password &&
                    'border-mv-error focus-visible:ring-mv-error'
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

          {/* Confirm password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              {...register('confirmPassword')}
              className={cn(
                errors.confirmPassword &&
                  'border-mv-error focus-visible:ring-mv-error'
              )}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-mv-error">
                {errors.confirmPassword.message}
              </p>
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
              <div>
                <p className="text-sm text-mv-error">{error}</p>
                <p className="mt-1 text-xs text-mv-muted">
                  If the link expired,{' '}
                  <Link
                    href="/auth/forgot-password"
                    className="text-mv-accent underline-offset-4 hover:underline"
                  >
                    request a new one
                  </Link>
                  .
                </p>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Resetting…' : 'Reset password'}
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link
            href="/auth/login"
            className="font-medium text-mv-accent underline-offset-4 hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </Container>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Container className="flex min-h-[80vh] items-center justify-center">
          <p className="text-mv-muted">Loading…</p>
        </Container>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}