'use client';

import { useCustomizerStore } from '@/stores/customizer-store';

interface SizeSelectorProps {
  sizes: any[];
}

export function SizeSelector({ sizes }: SizeSelectorProps) {
  const { garmentSizeId, setSize } = useCustomizerStore();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Size</h2>
      <div className="flex gap-2">
        {sizes.map((size) => (
          <button
            key={size.id}
            onClick={() => setSize(size.id)}
            className={`h-10 min-w-10 px-3 rounded-md border text-sm font-medium ${
              garmentSizeId === size.id
                ? 'bg-mv-primary text-white border-mv-primary'
                : 'bg-white border-mv-border'
            }`}
          >
            {size.label}
          </button>
        ))}
      </div>
    </div>
  );
}