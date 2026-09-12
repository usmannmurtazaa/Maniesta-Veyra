'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { MailCheck, AlertCircle } from 'lucide-react';
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '@/lib/validation/user.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Container } from '@/components/layout/container';
import { cn } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.error?.message ?? 'Request failed');
        return;
      }

      // Show the address they entered so they can double-check
      setSuccess(data.email);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  // ---------------------------------------------------------------------
  // Success state
  // ---------------------------------------------------------------------
  if (success) {
    return (
      <Container className="flex min-h-[80vh] items-center justify-center py-16">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mv-accent/10">
            <MailCheck className="h-7 w-7 text-mv-accent" aria-hidden />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-mv-text">
            Check your email
          </h1>
          <p className="mt-3 text-mv-text-secondary">
            If an account exists for
          </p>
          <p className="mt-1 font-medium text-mv-text">{success}</p>
          <p className="mt-3 text-mv-text-secondary">
            we&rsquo;ve sent a link to reset your password.
          </p>
          <p className="mt-4 text-sm text-mv-muted">
            The link expires in 30 minutes. Check your spam folder if you do
            not see it within a few minutes.
          </p>
          <div className="mt-8 space-y-3">
            <Link href="/auth/login" className="block">
              <Button variant="default" className="w-full">
                Back to login
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="ghost" className="w-full">
                Back to home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  // ---------------------------------------------------------------------
  // Form state
  // ---------------------------------------------------------------------
  return (
    <Container className="flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-mv-text">
            Forgot password?
          </h1>
          <p className="mt-2 text-mv-text-secondary">
            Enter the email you signed up with and we&rsquo;ll send you a link
            to reset your password.
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
            {isSubmitting ? 'Sending…' : 'Send reset link'}
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