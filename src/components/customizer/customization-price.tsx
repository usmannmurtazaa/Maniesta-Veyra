'use client';

import { Button } from '@/components/ui/button';
import { useCustomizerStore } from '@/stores/customizer-store';

interface CustomizationPriceProps {
  onCalculate: () => void;
}

export function CustomizationPrice({ onCalculate }: CustomizationPriceProps) {
  const { estimatedPrice } = useCustomizerStore();

  return (
    <div className="flex items-center justify-between border-t border-mv-border pt-4">
      <div>
        {estimatedPrice ? (
          <>
            <p className="text-lg font-semibold">₨ {estimatedPrice.unitPrice.toLocaleString()} <span className="text-sm font-normal">per item</span></p>
            <p className="text-sm text-mv-muted">Total: ₨ {estimatedPrice.totalPrice.toLocaleString()}</p>
          </>
        ) : (
          <p className="text-mv-muted">Click calculate to see price</p>
        )}
      </div>
      <Button variant="outline" onClick={onCalculate}>Calculate Price</Button>
    </div>
  );
}