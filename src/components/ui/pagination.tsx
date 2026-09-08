'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-2">
      <Link href={`${basePath}?page=${Math.max(1, currentPage - 1)}`} aria-label="Previous page">
        <Button variant="outline" size="icon" disabled={currentPage <= 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </Link>
      {pages.map((page) => (
        <Link key={page} href={`${basePath}?page=${page}`}>
          <Button
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
          >
            {page}
          </Button>
        </Link>
      ))}
      <Link href={`${basePath}?page=${Math.min(totalPages, currentPage + 1)}`} aria-label="Next page">
        <Button variant="outline" size="icon" disabled={currentPage >= totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}