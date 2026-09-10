'use client';

import { cn } from '@/lib/utils';

interface ProductSizeOption {
  id: string;
  label: string;
}

interface SizeSelectorProps {
  sizes: ProductSizeOption[];
  selectedSizeId?: string;
  onSelect: (sizeId: string) => void;
}

export function SizeSelector({ sizes, selectedSizeId, onSelect }: SizeSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-mv-text">Size</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSizeId === size.id;
          return (
            <button
              key={size.id}
              type="button"
              onClick={() => onSelect(size.id)}
              aria-pressed={isSelected}
              className={cn(
                'h-10 min-w-10 px-3 rounded-md border text-sm font-medium transition-colors',
                isSelected
                  ? 'bg-mv-primary text-white border-mv-primary'
                  : 'bg-white text-mv-text border-mv-border hover:border-mv-primary'
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