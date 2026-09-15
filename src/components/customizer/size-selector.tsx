'use client';

import { useCustomizerStore } from '@/stores/customizer-store';
import { cn } from '@/lib/utils';

interface GarmentSize {
  id: string;
  label: string;
}

interface SizeSelectorProps {
  sizes: GarmentSize[];
}

export function SizeSelector({ sizes }: SizeSelectorProps) {
  const { garmentSizeId, setSize } = useCustomizerStore();

  if (sizes.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-mv-text">Select Size</h2>
        <p className="text-sm text-mv-muted">
          No sizes available for this garment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-mv-text">Select Size</h2>
        <p className="mt-1 text-sm text-mv-muted">
          Standard fit — see the size guide on product pages for measurements.
        </p>
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label="Size"
      >
        {sizes.map((size) => {
          const isSelected = garmentSizeId === size.id;
          return (
            <button
              key={size.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSize(size.id)}
              className={cn(
                'flex h-11 min-w-[44px] items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-focus focus-visible:ring-offset-2',
                isSelected
                  ? 'border-mv-primary bg-mv-primary text-white'
                  : 'border-mv-border bg-white text-mv-text hover:border-mv-primary/60'
              )}
            >
              {size.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}