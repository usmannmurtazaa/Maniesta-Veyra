import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  className?: string;
}

export function PriceDisplay({ price, compareAtPrice, className }: PriceDisplayProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-2xl font-semibold">₨ {price.toLocaleString()}</span>
      {compareAtPrice && (
        <span className="text-lg text-mv-muted line-through">₨ {compareAtPrice.toLocaleString()}</span>
      )}
    </div>
  );
}