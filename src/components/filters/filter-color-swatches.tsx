'use client';

import { cn } from '@/lib/utils';

interface ColorOption {
  label: string;
  value: string;
  hexCode: string;
}

interface FilterColorSwatchesProps {
  title: string;
  colors: ColorOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function FilterColorSwatches({
  title,
  colors,
  selectedValues,
  onChange,
}: FilterColorSwatchesProps) {
  const toggleColor = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  return (
    <div>
      <h3 className="font-medium text-mv-text mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const isSelected = selectedValues.includes(color.value);
          return (
            <button
              key={color.value}
              type="button"
              onClick={() => toggleColor(color.value)}
              aria-label={`Filter by ${color.label}`}
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