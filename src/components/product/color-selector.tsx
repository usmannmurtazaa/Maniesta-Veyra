'use client';

import { cn } from '@/lib/utils';

interface ProductColorOption {
  id: string;
  name: string;
  hexCode: string;
}

interface ColorSelectorProps {
  colors: ProductColorOption[];
  selectedColorId?: string;
  onSelect: (colorId: string) => void;
}

export function ColorSelector({ colors, selectedColorId, onSelect }: ColorSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-mv-text">Color</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const isSelected = selectedColorId === color.id;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onSelect(color.id)}
              aria-label={`Select color ${color.name}`}
              aria-pressed={isSelected}
              className={cn(
                'h-8 w-8 rounded-full border-2 transition-colors',
                isSelected ? 'border-mv-primary' : 'border-mv-border hover:border-mv-primary'
              )}
              style={{ backgroundColor: color.hexCode }}
            />
          );
        })}
      </div>
    </div>
  );
}