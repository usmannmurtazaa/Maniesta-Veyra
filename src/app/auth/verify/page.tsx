'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

type Status = 'loading' | 'success' | 'error' | 'no-token';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [status, setStatus] = useState<Status>(token ? 'loading' : 'no-token');
  const [message, setMessage] = useState('');

  // -------------------------------------------------------------------
  // Run verification once on mount, if we have a token
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function verify() {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const result = await response.json().catch(() => ({}));

        if (cancelled) return;

        if (response.ok) {
          setStatus('success');
          setMessage('Your email has been verified.');
        } else {
          setStatus('error');
          setMessage(
            result.error?.message ??
              'This verification link may have expired or already been used.'
          );
        }
      } catch {
        if (cancelled) return;
        setStatus('error');
        setMessage(
          'We could not reach the server. Please check your connection and try again.'
        );
      }
    }

    verify();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // -------------------------------------------------------------------
  // Auto-redirect on success — with cleanup so we don't fire post-unmount
  // -------------------------------------------------------------------
  useEffect(() => {
    if (status !== 'success') return;

    const timeout = setTimeout(() => {
      router.push('/auth/login');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [status, router]);

  // -------------------------------------------------------------------
  // No token — the URL was mangled, or the user typed it manually
  // -------------------------------------------------------------------
  if (status === 'no-token') {
    return (
      <Container className="flex min-h-[80vh] items-center justify-center py-16">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mv-warning/10">
            <ShieldAlert className="h-7 w-7 text-mv-warning" aria-hidden />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-mv-text">
            Link is incomplete
          </h1>
          <p className="mt-3 text-mv-text-secondary">
            This page needs a verification link from your email. Please open the
            link we sent when you signed up.
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

  // -------------------------------------------------------------------
  // Loading — spinner
  // -------------------------------------------------------------------
  if (status === 'loading') {
    return (
      <Container className="flex min-h-[80vh] items-center justify-center py-16">
        <div className="w-full max-w-md text-center" aria-live="polite">
          <Loader2
            className="mx-auto h-10 w-10 animate-spin text-mv-accent"
            aria-hidden
          />
          <h1 className="mt-6 font-display text-2xl font-bold text-mv-text">
            Verifying your email
          </h1>
          <p className="mt-2 text-mv-text-secondary">
            This only takes a moment.
          </p>
        </div>
      </Container>
    );
  }

  // -------------------------------------------------------------------
  // Success
  // -------------------------------------------------------------------
  if (status === 'success') {
    return (
      <Container className="flex min-h-[80vh] items-center justify-center py-16">
        <div className="w-full max-w-md text-center" aria-live="polite">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mv-success/10">
            <CheckCircle2 className="h-7 w-7 text-mv-success" aria-hidden />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-mv-text">
            Email verified
          </h1>
          <p className="mt-3 text-mv-text-secondary">
            {message} You can now sign in and start shopping.
          </p>
          <div className="mt-8 space-y-3">
            <Link href="/auth/login" className="block">
              <Button variant="default" className="w-full">
                Go to login
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-mv-muted">
            Redirecting automatically in a few seconds…
          </p>
        </div>
      </Container>
    );
  }

  // -------------------------------------------------------------------
  // Error
  // -------------------------------------------------------------------
  return (
    <Container className="flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-md text-center" aria-live="assertive">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mv-error/10">
          <AlertCircle className="h-7 w-7 text-mv-error" aria-hidden />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-mv-text">
          Verification failed
        </h1>
        <p className="mt-3 text-mv-text-secondary">{message}</p>
        <p className="mt-3 text-sm text-mv-muted">
          If your link has expired, sign in to your account and we&rsquo;ll
          send a fresh one, or contact us at{' '}
          <a
            href="mailto:maniestaveyra@gmail.com"
            className="text-mv-accent underline-offset-4 hover:underline"
          >
            maniestaveyra@gmail.com
          </a>
          .
        </p>
        <div className="mt-8 space-y-3">
          <Link href="/auth/login" className="block">
            <Button variant="default" className="w-full">
              Try signing in
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

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <Container className="flex min-h-[80vh] items-center justify-center">
          <Loader2
            className="h-8 w-8 animate-spin text-mv-accent"
            aria-hidden
          />
        </Container>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}