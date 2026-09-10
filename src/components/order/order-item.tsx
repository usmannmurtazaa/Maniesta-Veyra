import Image from 'next/image';

interface OrderItemProps {
  item: {
    id: string;
    productName: string;
    productSlug?: string | null;
    variantSku?: string | null;
    colorName?: string | null;
    sizeLabel?: string | null;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    isCustomDesign: boolean;
    imageUrl?: string | null;
  };
}

export function OrderItem({ item }: OrderItemProps) {
  return (
    <div className="flex gap-4 border-b border-mv-border py-4 last:border-0">
      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-mv-bg-alt">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.productName}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-mv-muted text-xs">
            No image
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-mv-text">{item.productName}</p>
            {item.colorName && item.sizeLabel && (
              <p className="text-xs text-mv-muted mt-1">
                {item.colorName} / {item.sizeLabel}
              </p>
            )}
            {item.variantSku && (
              <p className="text-xs text-mv-muted">SKU: {item.variantSku}</p>
            )}
            {item.isCustomDesign && (
              <p className="text-xs text-mv-warning mt-1">Custom design order</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-mv-text">
              ₨ {Number(item.totalPrice).toLocaleString()}
            </p>
            <p className="text-xs text-mv-muted mt-1">
              {item.quantity} × ₨ {Number(item.unitPrice).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}