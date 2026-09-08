'use client';

import { PrintLocation } from '@prisma/client';
import { useCustomizerStore } from '@/stores/customizer-store';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const locations = [
  PrintLocation.FRONT,
  PrintLocation.BACK,
  PrintLocation.LEFT_SLEEVE,
  PrintLocation.RIGHT_SLEEVE,
];

export function PrintLocationSelector() {
  const { selectedLocations, toggleLocation, activeLocation, setActiveLocation } = useCustomizerStore();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Print Locations</h2>
      <div className="space-y-2">
        {locations.map((loc) => (
          <div key={loc} className="flex items-center gap-2">
            <Checkbox
              id={`loc-${loc}`}
              checked={selectedLocations.includes(loc)}
              onCheckedChange={() => toggleLocation(loc)}
            />
            <Label htmlFor={`loc-${loc}`} className="capitalize">{loc.replace('_', ' ')}</Label>
          </div>
        ))}
      </div>
      {selectedLocations.length > 0 && (
        <div className="flex gap-2">
          {selectedLocations.map((loc) => (
            <Button key={loc} variant={activeLocation === loc ? 'default' : 'outline'} size="sm" onClick={() => setActiveLocation(loc)}>
              {loc}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}