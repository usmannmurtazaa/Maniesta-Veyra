'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  registerSchema,
  type RegisterInput,
} from '@/lib/validation/user.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Container } from '@/components/layout/container';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  // Watch password to enforce confirmation match
  const password = watch('password');

  const onSubmit = async (data: RegisterInput) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.error?.message ?? 'Registration failed');
        return;
      }

      // Show success state with the email they used
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
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mv-success/10">
            <CheckCircle2 className="h-7 w-7 text-mv-success" aria-hidden />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-mv-text">
            Check your email
          </h1>
          <p className="mt-3 text-mv-text-secondary">
            We sent a verification link to
          </p>
          <p className="mt-1 font-medium text-mv-text">{success}</p>
          <p className="mt-4 text-sm text-mv-muted">
            Click the link in the email to activate your account. Check your
            spam folder if you do not see it within a few minutes.
          </p>
          <div className="mt-8 space-y-3">
            <Link href="/auth/login" className="block">
              <Button variant="default" className="w-full">
                Go to login
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
  // Registration form
  // ---------------------------------------------------------------------
  return (
    <Container className="flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-mv-text">
            Create your account
          </h1>
          <p className="mt-2 text-mv-text-secondary">
            Join Maniesta Veyra and start shopping
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Name — stacked on mobile, side-by-side from sm up */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                autoComplete="given-name"
                {...register('firstName')}
                className={cn(errors.firstName && 'border-mv-error focus-visible:ring-mv-error')}
              />
              {errors.firstName && (
                <p className="text-xs text-mv-error">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                autoComplete="family-name"
                {...register('lastName')}
                className={cn(errors.lastName && 'border-mv-error focus-visible:ring-mv-error')}
              />
              {errors.lastName && (
                <p className="text-xs text-mv-error">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              {...register('email')}
              className={cn(errors.email && 'border-mv-error focus-visible:ring-mv-error')}
            />
            {errors.email && (
              <p className="text-xs text-mv-error">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone <span className="font-normal text-mv-muted">(optional)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="03XX-XXXXXXX"
              autoComplete="tel"
              inputMode="tel"
              {...register('phone')}
              className={cn(errors.phone && 'border-mv-error focus-visible:ring-mv-error')}
            />
            {errors.phone && (
              <p className="text-xs text-mv-error">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              {...register('password')}
              className={cn(errors.password && 'border-mv-error focus-visible:ring-mv-error')}
            />
            {errors.password && (
              <p className="text-xs text-mv-error">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              {...register('confirmPassword', {
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              className={cn(errors.confirmPassword && 'border-mv-error focus-visible:ring-mv-error')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-mv-error">{errors.confirmPassword.message}</p>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-mv-error/30 bg-mv-error/5 p-3">
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-mv-error"
                aria-hidden
              />
              <p className="text-sm text-mv-error">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <div className="text-center text-sm text-mv-text-secondary">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-mv-accent underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </Container>
  );
}