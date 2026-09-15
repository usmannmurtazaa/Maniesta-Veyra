'use client';

import { useCustomizerStore } from '@/stores/customizer-store';
import { cn } from '@/lib/utils';

interface GarmentColor {
  id: string;
  name: string;
  hexCode: string;
}

interface ColorSelectorProps {
  colors: GarmentColor[];
}

export function ColorSelector({ colors }: ColorSelectorProps) {
  const { garmentColorId, setColor } = useCustomizerStore();

  if (colors.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Select Color</h2>
        <p className="text-sm text-mv-muted">
          No colors available for this garment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Color</h2>
      <div
        className="flex flex-wrap gap-3"
        role="group"
        aria-label="Color"
      >
        {colors.map((color) => {
          const isSelected = garmentColorId === color.id;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => setColor(color.id)}
              className={cn(
                'h-10 w-10 rounded-full border-2 transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-focus focus-visible:ring-offset-2',
                isSelected
                  ? 'border-mv-primary ring-2 ring-mv-primary/20'
                  : 'border-mv-border hover:border-mv-primary/60'
              )}
              style={{ backgroundColor: color.hexCode }}
              aria-label={color.name}
              aria-pressed={isSelected}
              title={color.name}
            />
          );
        })}
      </div>
    </div>
  );
}