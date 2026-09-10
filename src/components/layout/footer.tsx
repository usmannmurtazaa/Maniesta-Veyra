'use client';

import { useEffect, useState } from 'react';
import { publicEnv } from '@/lib/env';
import { Container } from './container';

export function Footer() {
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-mv-border bg-mv-bg-alt py-12 mt-auto">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="font-display text-xl font-bold text-mv-text">
              {publicEnv.NEXT_PUBLIC_APP_NAME}
            </p>
            <p className="text-sm text-mv-muted mt-1">
              {publicEnv.NEXT_PUBLIC_APP_TAGLINE}
            </p>
          </div>
          <div className="text-sm text-mv-muted">
            <p>
              Designed &amp; Developed by{' '}
              <a
                href={publicEnv.NEXT_PUBLIC_PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mv-text underline-offset-2 hover:underline"
              >
                Usman Murtaza
              </a>
            </p>
            <p className="mt-1">
              © {year} {publicEnv.NEXT_PUBLIC_APP_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}