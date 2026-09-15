'use client';

import { Minus, Plus } from 'lucide-react';
import { useCustomizerStore } from '@/stores/customizer-store';
import { CustomizationNotes } from './customization-notes';

interface Garment {
  id: string;
  name: string;
  colors: { id: string; name: string; hexCode: string }[];
  sizes: { id: string; label: string }[];
}

interface CustomizationSummaryProps {
  garment?: Garment;
}

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 50;

export function CustomizationSummary({ garment }: CustomizationSummaryProps) {
  const {
    garmentColorId,
    garmentSizeId,
    selectedLocations,
    quantity,
    setQuantity,
  } = useCustomizerStore();

  const selectedColor = garment?.colors.find((c) => c.id === garmentColorId);
  const selectedSize = garment?.sizes.find((s) => s.id === garmentSizeId);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-display text-2xl font-bold text-mv-text">
          Review your design
        </h2>
        <p className="mt-1 text-sm text-mv-text-secondary">
          Confirm your choices before adding to cart.
        </p>
      </header>

      {/* Review table */}
      <dl className="divide-y divide-mv-border overflow-hidden rounded-lg border border-mv-border bg-white">
        <Row label="Garment" value={garment?.name} />
        <Row
          label="Color"
          value={
            selectedColor ? (
              <span className="inline-flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full border border-mv-border"
                  style={{ backgroundColor: selectedColor.hexCode }}
                  aria-hidden
                />
                {selectedColor.name}
              </span>
            ) : undefined
          }
        />
        <Row label="Size" value={selectedSize?.label} />
        <Row
          label="Print locations"
          value={
            selectedLocations.length > 0
              ? selectedLocations
                  .map((l) => l.replace(/_/g, ' ').toLowerCase())
                  .join(', ')
              : undefined
          }
        />
      </dl>

      {/* Quantity with +/- controls */}
      <div className="space-y-2">
        <label
          htmlFor="customization-quantity"
          className="block text-sm font-medium text-mv-text"
        >
          Quantity
        </label>
        <div className="inline-flex items-center rounded-md border border-mv-border">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(MIN_QUANTITY, quantity - 1))}
            disabled={quantity <= MIN_QUANTITY}
            className="flex h-10 w-10 items-center justify-center rounded-l-md transition-colors hover:bg-mv-bg-alt disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span
            id="customization-quantity"
            className="w-12 select-none text-center text-sm font-medium"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(MAX_QUANTITY, quantity + 1))}
            disabled={quantity >= MAX_QUANTITY}
            className="flex h-10 w-10 items-center justify-center rounded-r-md transition-colors hover:bg-mv-bg-alt disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Notes — reuses the dedicated component */}
      <CustomizationNotes />
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="shrink-0 text-sm text-mv-text-secondary">{label}</dt>
      <dd className="min-w-0 truncate text-right text-sm font-medium capitalize text-mv-text">
        {value ?? <span className="text-mv-muted">Not selected</span>}
      </dd>
    </div>
  );
}