'use client';

import { useCustomizerStore } from '@/stores/customizer-store';

interface GarmentSelectorProps {
  garments: any[];
}

export function GarmentSelector({ garments }: GarmentSelectorProps) {
  const { setGarment, garmentId } = useCustomizerStore();
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {garments.map((g) => (
        <button
          key={g.id}
          onClick={() => setGarment(g.id)}
          className={`border rounded-lg p-4 text-center transition ${
            garmentId === g.id ? 'border-mv-primary bg-mv-bg-alt' : 'border-mv-border hover:border-mv-primary'
          }`}
        >
          <p className="font-medium">{g.name}</p>
          <p className="text-sm text-mv-muted">₨ {Number(g.basePrice).toLocaleString()}</p>
        </button>
      ))}
    </div>
  );
}