'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PriceRange {
  min?: number;
  max?: number;
}

interface FilterPriceRangeProps {
  title?: string;
  value: PriceRange;
  onChange: (range: PriceRange) => void;
}

export function FilterPriceRange({
  title = 'Price Range',
  value,
  onChange,
}: FilterPriceRangeProps) {
  const handleMinChange = (raw: string) => {
    const min = raw ? Number(raw) : undefined;
    onChange({ ...value, min });
  };

  const handleMaxChange = (raw: string) => {
    const max = raw ? Number(raw) : undefined;
    onChange({ ...value, max });
  };

  return (
    <div>
      <h3 className="font-medium text-mv-text mb-2">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="minPrice" className="text-xs text-mv-muted">
            Min
          </Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="0"
            value={value.min ?? ''}
            onChange={(e) => handleMinChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="maxPrice" className="text-xs text-mv-muted">
            Max
          </Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="Any"
            value={value.max ?? ''}
            onChange={(e) => handleMaxChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}