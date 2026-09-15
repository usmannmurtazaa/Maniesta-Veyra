'use client';

import { useCustomizerStore } from '@/stores/customizer-store';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

type NumericLike = number | string | { toString(): string };

interface Garment {
  id: string;
  name: string;
  basePrice: NumericLike;
  description?: string | null;
}

interface GarmentSelectorProps {
  garments: Garment[];
}

export function GarmentSelector({ garments }: GarmentSelectorProps) {
  const { setGarment, garmentId } = useCustomizerStore();

  if (garments.length === 0) {
    return (
      <div className="py-16 text-center text-mv-muted">
        No garments are available for customization right now.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-mv-text">
          Choose a garment
        </h2>
        <p className="mt-1 text-sm text-mv-muted">
          {garments.length} {garments.length === 1 ? 'option' : 'options'} available
        </p>
      </div>

      <div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3"
        role="radiogroup"
        aria-label="Garment"
      >
        {garments.map((g) => {
          const isSelected = garmentId === g.id;
          return (
            <button
              key={g.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setGarment(g.id)}
              className={cn(
                'flex min-h-[44px] flex-col items-start gap-1 rounded-lg border p-4 text-left transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-focus focus-visible:ring-offset-2',
                isSelected
                  ? 'border-mv-primary bg-mv-bg-alt ring-2 ring-mv-primary/20'
                  : 'border-mv-border hover:border-mv-primary/60'
              )}
            >
              <span className="text-sm font-medium text-mv-text">
                {g.name}
              </span>
              {g.description && (
                <span className="line-clamp-2 text-xs text-mv-text-secondary">
                  {g.description}
                </span>
              )}
              <span className="mt-1 text-sm font-semibold text-mv-accent">
                {formatCurrency(g.basePrice)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}