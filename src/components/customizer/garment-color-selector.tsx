'use client';

import { useCustomizerStore } from '@/stores/customizer-store';
import { cn } from '@/lib/utils';

interface GarmentColor {
  id: string;
  name: string;
  hexCode: string;
  sortOrder?: number;
}

interface GarmentColorSelectorProps {
  colors: GarmentColor[];
}

export function GarmentColorSelector({ colors }: GarmentColorSelectorProps) {
  const { garmentColorId, setColor } = useCustomizerStore();

  if (colors.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-mv-text">
          Select Garment Color
        </h2>
        <p className="text-sm text-mv-muted">
          No colors available for this garment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-mv-text">
          Select Garment Color
        </h2>
        <p className="mt-1 text-sm text-mv-muted">
          {colors.length} color{colors.length === 1 ? '' : 's'} available
        </p>
      </div>

      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4"
        role="radiogroup"
        aria-label="Garment color"
      >
        {colors.map((color) => {
          const isSelected = garmentColorId === color.id;
          return (
            <button
              key={color.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setColor(color.id)}
              className={cn(
                'flex min-h-[44px] items-center gap-2 rounded-md border px-3 py-2 text-left transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-focus focus-visible:ring-offset-2',
                isSelected
                  ? 'border-mv-primary bg-mv-bg-alt'
                  : 'border-mv-border hover:border-mv-primary/60'
              )}
            >
              <span
                className="h-6 w-6 shrink-0 rounded-full border border-mv-border"
                style={{ backgroundColor: color.hexCode }}
                aria-hidden
              />
              <span className="truncate text-sm font-medium text-mv-text">
                {color.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}