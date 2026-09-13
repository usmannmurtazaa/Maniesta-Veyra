'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Base path, optionally with an existing query string (e.g. `/search?q=shirt`) */
  basePath: string;
}

/**
 * Build a pagination href that correctly appends `page=N` to a URL that
 * may or may not already contain a query string.
 *
 *   buildHref('/shop', 2)              → '/shop?page=2'
 *   buildHref('/search?q=shirt', 2)    → '/search?q=shirt&page=2'
 */
function buildHref(basePath: string, page: number): string {
  const separator = basePath.includes('?') ? '&' : '?';
  return `${basePath}${separator}page=${page}`;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Show at most 5 numbered pages around the current one
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + windowSize - 1);
  if (end - start + 1 < windowSize) {
    start = Math.max(1, end - windowSize + 1);
  }
  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      <Link
        href={buildHref(basePath, Math.max(1, currentPage - 1))}
        aria-label="Previous page"
        aria-disabled={currentPage <= 1}
        tabIndex={currentPage <= 1 ? -1 : undefined}
      >
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage <= 1}
          tabIndex={-1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </Link>

      {start > 1 && (
        <>
          <Link href={buildHref(basePath, 1)}>
            <Button variant="outline" size="sm">1</Button>
          </Link>
          {start > 2 && (
            <span className="px-2 text-sm text-mv-muted" aria-hidden>
              …
            </span>
          )}
        </>
      )}

      {pages.map((page) => (
        <Link key={page} href={buildHref(basePath, page)}>
          <Button
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Button>
        </Link>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-2 text-sm text-mv-muted" aria-hidden>
              …
            </span>
          )}
          <Link href={buildHref(basePath, totalPages)}>
            <Button variant="outline" size="sm">
              {totalPages}
            </Button>
          </Link>
        </>
      )}

      <Link
        href={buildHref(basePath, Math.min(totalPages, currentPage + 1))}
        aria-label="Next page"
        aria-disabled={currentPage >= totalPages}
        tabIndex={currentPage >= totalPages ? -1 : undefined}
      >
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage >= totalPages}
          tabIndex={-1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    </nav>
  );
}