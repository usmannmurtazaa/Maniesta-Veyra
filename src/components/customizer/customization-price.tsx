'use client';

import { Button } from '@/components/ui/button';
import { useCustomizerStore } from '@/stores/customizer-store';
import { formatCurrency } from '@/lib/utils/format';

interface CustomizationPriceProps {
  onCalculate: () => void;
  isCalculating?: boolean;
}

export function CustomizationPrice({
  onCalculate,
  isCalculating = false,
}: CustomizationPriceProps) {
  const { estimatedPrice } = useCustomizerStore();

  return (
    <div className="flex flex-col gap-4 border-t border-mv-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        {estimatedPrice ? (
          <>
            <p className="text-lg font-semibold text-mv-text">
              {formatCurrency(estimatedPrice.unitPrice)}{' '}
              <span className="text-sm font-normal text-mv-text-secondary">
                per item
              </span>
            </p>
            <p className="text-sm text-mv-muted">
              {estimatedPrice.totalPrice !== estimatedPrice.unitPrice && (
                <>Total: {formatCurrency(estimatedPrice.totalPrice)}</>
              )}
            </p>
          </>
        ) : (
          <p className="text-sm text-mv-muted">
            Price updates as you configure your design.
          </p>
        )}
      </div>

      <Button
        variant="outline"
        onClick={onCalculate}
        disabled={isCalculating}
        className="shrink-0"
      >
        {isCalculating
          ? 'Calculating…'
          : estimatedPrice
            ? 'Recalculate'
            : 'Calculate price'}
      </Button>
    </div>
  );
}