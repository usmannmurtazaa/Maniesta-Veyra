'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Container } from './container';

const STORAGE_KEY = 'mv-announcement-dismissed-v1';

export function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Read on mount (avoids SSR hydration mismatch)
    if (localStorage.getItem(STORAGE_KEY) !== '1') {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="relative bg-mv-primary py-2 text-center text-xs text-mv-inverse sm:text-sm"
      role="region"
      aria-label="Announcement"
    >
      <Container>
        <p className="px-8 text-mv-inverse-muted">
          Free shipping across Pakistan
          <span className="mx-2 text-mv-inverse-muted/60" aria-hidden>
            ·
          </span>
          Free 14-day exchanges
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-mv-inverse-muted transition-colors hover:text-mv-inverse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-inverse/40"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </Container>
    </div>
  );
}