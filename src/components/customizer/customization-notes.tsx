'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCustomizerStore } from '@/stores/customizer-store';

const MAX_NOTES_LENGTH = 500;

export function CustomizationNotes() {
  const { notes, setNotes } = useCustomizerStore();
  const remaining = MAX_NOTES_LENGTH - (notes?.length ?? 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="customization-notes">
          Special instructions{' '}
          <span className="font-normal text-mv-muted">(optional)</span>
        </Label>
        <span
          className={`text-xs ${
            remaining < 50 ? 'text-mv-warning' : 'text-mv-muted'
          }`}
          aria-live="polite"
        >
          {remaining} characters left
        </span>
      </div>

      <Textarea
        id="customization-notes"
        placeholder="Any specific requests for your custom order — placement tweaks, print size preferences, or deadlines."
        value={notes ?? ''}
        onChange={(e) => setNotes(e.target.value.slice(0, MAX_NOTES_LENGTH))}
        rows={4}
        maxLength={MAX_NOTES_LENGTH}
        aria-describedby="customization-notes-hint"
      />

      <p id="customization-notes-hint" className="text-xs text-mv-muted">
        We review every note before production. Keep it short and specific.
      </p>
    </div>
  );
}