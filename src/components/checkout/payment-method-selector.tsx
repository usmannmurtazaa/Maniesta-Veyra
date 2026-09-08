'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
  paymentMethods: string[];
}

export function PaymentMethodSelector({ value, onChange, paymentMethods }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment Method</h2>
      <RadioGroup value={value} onValueChange={onChange}>
        {paymentMethods.map((method) => (
          <div key={method} className="flex items-center gap-2">
            <RadioGroupItem value={method} id={`payment-${method}`} />
            <Label htmlFor={`payment-${method}`} className="capitalize">
              {method.replace(/_/g, ' ')}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}