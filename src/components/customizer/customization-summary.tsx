'use client';

import { useCustomizerStore } from '@/stores/customizer-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CustomizationSummary() {
  const { garmentId, garmentColorId, garmentSizeId, selectedLocations, quantity, notes, setQuantity, setNotes } = useCustomizerStore();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Summary</h2>
      <p>Garment: {garmentId}</p>
      <p>Color: {garmentColorId}</p>
      <p>Size: {garmentSizeId}</p>
      <p>Print Locations: {selectedLocations.join(', ')}</p>
      <div className="space-y-2">
        <Label>Quantity</Label>
        <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      </div>
      <div className="space-y-2">
        <Label>Notes</Label>
        <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Special instructions" />
      </div>
    </div>
  );
}