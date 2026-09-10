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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-mv-text">Select Garment Color</h2>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isSelected = garmentColorId === color.id;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => setColor(color.id)}
              className={cn(
                'flex items-center gap-2 rounded-md border px-3 py-2 transition-colors',
                isSelected
                  ? 'border-mv-primary bg-mv-bg-alt'
                  : 'border-mv-border hover:border-mv-primary'
              )}
              aria-pressed={isSelected}
              aria-label={`Select color ${color.name}`}
            >
              <span
                className="h-6 w-6 rounded-full border border-mv-border"
                style={{ backgroundColor: color.hexCode }}
              />
              <span className="text-sm font-medium text-mv-text">{color.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}