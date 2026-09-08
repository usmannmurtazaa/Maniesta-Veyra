'use client';

import { useCustomizerStore } from '@/stores/customizer-store';

interface ColorSelectorProps {
  colors: any[];
}

export function ColorSelector({ colors }: ColorSelectorProps) {
  const { garmentColorId, setColor } = useCustomizerStore();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Color</h2>
      <div className="flex gap-3">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => setColor(color.id)}
            className={`h-10 w-10 rounded-full border-2 ${
              garmentColorId === color.id ? 'border-mv-primary' : 'border-mv-border'
            }`}
            style={{ backgroundColor: color.hexCode }}
            aria-label={color.name}
          />
        ))}
      </div>
    </div>
  );
}