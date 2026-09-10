'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SortOption {
  label: string;
  value: string;
}

interface FilterSortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: SortOption[];
}

const defaultOptions: SortOption[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Popular', value: 'popular' },
  { label: 'Best Rated', value: 'rating' },
];

export function FilterSortDropdown({
  value,
  onChange,
  options = defaultOptions,
}: FilterSortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-mv-muted">Sort by</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}