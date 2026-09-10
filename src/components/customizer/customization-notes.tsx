'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCustomizerStore } from '@/stores/customizer-store';

export function CustomizationNotes() {
  const { notes, setNotes } = useCustomizerStore();

  return (
    <div className="space-y-2">
      <Label htmlFor="customization-notes">Special Instructions</Label>
      <Textarea
        id="customization-notes"
        placeholder="Any specific requests or notes for your custom order..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
      />
    </div>
  );
}