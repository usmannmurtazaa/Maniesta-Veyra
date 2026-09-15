'use client';

import { PrintLocation } from '@prisma/client';
import { useCustomizerStore } from '@/stores/customizer-store';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Human-readable labels for each print location.
// Add new entries here when you add new enum values.
const LOCATION_LABELS: Record<PrintLocation, string> = {
  [PrintLocation.FRONT]: 'Front',
  [PrintLocation.BACK]: 'Back',
  [PrintLocation.LEFT_SLEEVE]: 'Left sleeve',
  [PrintLocation.RIGHT_SLEEVE]: 'Right sleeve',
};

const LOCATIONS: PrintLocation[] = [
  PrintLocation.FRONT,
  PrintLocation.BACK,
  PrintLocation.LEFT_SLEEVE,
  PrintLocation.RIGHT_SLEEVE,
];

export function PrintLocationSelector() {
  const {
    selectedLocations,
    toggleLocation,
    activeLocation,
    setActiveLocation,
  } = useCustomizerStore();

  const hasMultipleLocations = selectedLocations.length > 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-mv-text">
          Select print locations
        </h2>
        <p className="mt-1 text-sm text-mv-muted">
          Choose one or more. You can upload different artwork for each.
        </p>
      </div>

      {/* ---- Checkbox list ---- */}
      <div
        className="space-y-1"
        role="group"
        aria-label="Print locations"
      >
        {LOCATIONS.map((loc) => {
          const isChecked = selectedLocations.includes(loc);
          return (
            <label
              key={loc}
              htmlFor={`loc-${loc}`}
              className={cn(
                'flex min-h-[44px] cursor-pointer items-center gap-3 rounded-md border px-3 py-2 transition-colors',
                'focus-within:ring-2 focus-within:ring-mv-focus focus-within:ring-offset-2',
                isChecked
                  ? 'border-mv-primary bg-mv-bg-alt'
                  : 'border-mv-border hover:border-mv-primary/60'
              )}
            >
              <Checkbox
                id={`loc-${loc}`}
                checked={isChecked}
                onCheckedChange={() => toggleLocation(loc)}
              />
              <span className="text-sm font-medium text-mv-text">
                {LOCATION_LABELS[loc]}
              </span>
            </label>
          );
        })}
      </div>

      {/* ---- Active location picker ---- */}
      {selectedLocations.length > 0 && (
        <div className="space-y-3 rounded-lg border border-mv-border bg-mv-bg-alt/50 p-4">
          <div>
            <p className="text-sm font-medium text-mv-text">
              {hasMultipleLocations
                ? 'Currently editing'
                : 'Editing'}
            </p>
            <p className="mt-0.5 text-xs text-mv-muted">
              {hasMultipleLocations
                ? 'Switch between locations to position each design separately.'
                : 'You can switch locations after adding more below.'}
            </p>
          </div>

          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Active print location"
          >
            {selectedLocations.map((loc) => {
              const isActive = activeLocation === loc;
              return (
                <Button
                  key={loc}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveLocation(loc)}
                >
                  {LOCATION_LABELS[loc]}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}