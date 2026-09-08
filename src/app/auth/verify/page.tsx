'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/layout/container';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function verify() {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const result = await response.json();
        if (response.ok) {
          setStatus('success');
          setMessage('Email verified successfully!');
          setTimeout(() => router.push('/auth/login'), 2000);
        } else {
          setStatus('error');
          setMessage(result.error?.message || 'Verification failed');
        }
      } catch {
        setStatus('error');
        setMessage('An unexpected error occurred');
      }
    }
    if (token) verify();
    else {
      setStatus('error');
      setMessage('No token provided');
    }
  }, [token, router]);

  return (
    <Container className="flex min-h-[80vh] items-center justify-center py-16">
      <div className="text-center">
        {status === 'loading' && <p className="text-lg">Verifying your email...</p>}
        {status === 'success' && (
          <>
            <h1 className="font-display text-3xl font-bold text-mv-text">Email verified!</h1>
            <p className="mt-2 text-mv-text-secondary">Redirecting to login...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="font-display text-3xl font-bold text-mv-error">Verification failed</h1>
            <p className="mt-2 text-mv-text-secondary">{message}</p>
          </>
        )}
      </div>
    </Container>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}