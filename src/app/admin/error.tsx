'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[admin] error:', error);
  }, [error]);

  const isForbidden =
    error.message?.includes('Forbidden') ||
    error.message?.includes('FORBIDDEN');
  const isUnauthorized =
    error.message?.includes('Unauthorized') ||
    error.message?.includes('UNAUTHORIZED');

  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-md text-center">
        <h1 className="font-display text-2xl font-bold text-mv-text">
          {isUnauthorized
            ? 'Please sign in'
            : isForbidden
              ? 'Access denied'
              : 'Something went wrong'}
        </h1>
        <p className="mt-3 text-sm text-mv-text-secondary">
          {isUnauthorized
            ? 'Your session has ended. Sign in to continue.'
            : isForbidden
              ? 'You do not have permission to view this page.'
              : 'We could not load this page. Please try again.'}
        </p>
        <div className="mt-6 space-y-3">
          {isUnauthorized ? (
            <Link href="/auth/login?redirect=/admin" className="block">
              <Button className="w-full">Sign in</Button>
            </Link>
          ) : isForbidden ? (
            <Link href="/account" className="block">
              <Button className="w-full">Go to my account</Button>
            </Link>
          ) : (
            <Button onClick={reset} className="w-full">
              Try again
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
}