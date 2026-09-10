'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterCheckboxGroupProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function FilterCheckboxGroup({
  title,
  options,
  selectedValues,
  onChange,
}: FilterCheckboxGroupProps) {
  const toggleValue = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  return (
    <div>
      <h3 className="font-medium text-mv-text mb-2">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <Checkbox
              id={`${title}-${option.value}`}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={() => toggleValue(option.value)}
            />
            <Label htmlFor={`${title}-${option.value}`} className="text-sm font-normal cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}