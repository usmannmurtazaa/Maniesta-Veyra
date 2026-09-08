'use client';

import { PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string; // Use href for navigation
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onAction) onAction();
    else if (actionHref) router.push(actionHref);
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <PackageOpen className="h-16 w-16 text-mv-muted mb-4" />
      <h3 className="text-lg font-semibold text-mv-text">{title}</h3>
      {description && <p className="mt-1 text-sm text-mv-muted max-w-sm">{description}</p>}
      {actionLabel && handleClick && (
        <Button variant="outline" className="mt-4" onClick={handleClick}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}