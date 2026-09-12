'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout';

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[account] error:', error);
  }, [error]);

  const isUnauthorized =
    error.message?.includes('Unauthorized') ||
    error.message?.includes('UNAUTHORIZED');

  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-md text-center">
        <h1 className="font-display text-2xl font-bold text-mv-text">
          {isUnauthorized ? 'Please sign in' : 'Something went wrong'}
        </h1>
        <p className="mt-3 text-sm text-mv-text-secondary">
          {isUnauthorized
            ? 'Your session has ended. Sign in again to view your account.'
            : 'We could not load this page. Please try again.'}
        </p>
        <div className="mt-6 space-y-3">
          {isUnauthorized ? (
            <Link href="/auth/login?redirect=/account" className="block">
              <Button className="w-full">Sign in</Button>
            </Link>
          ) : (
            <Button onClick={reset} className="w-full">
              Try again
            </Button>
          )}
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