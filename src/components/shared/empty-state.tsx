'use client';

import { PackageOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const router = useRouter();

  function handleClick() {
    if (onAction) onAction();
    else if (actionHref) router.push(actionHref);
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <PackageOpen
        className="mb-4 h-16 w-16 text-mv-muted"
        strokeWidth={1.25}
        aria-hidden
      />
      <h3 className="text-lg font-semibold text-mv-text">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-mv-muted">{description}</p>
      )}
      {actionLabel && (actionHref || onAction) && (
        <Button variant="outline" className="mt-6" onClick={handleClick}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}