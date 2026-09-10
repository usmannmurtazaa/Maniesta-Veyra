import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CustomOrderCardProps {
  id: string;
  orderNumber: string;
  customerEmail: string;
  garmentName: string;
  status: string;
  createdAt: string;
  onStatusChange?: (id: string, status: string) => void;
}

export function CustomOrderCard({
  id,
  orderNumber,
  customerEmail,
  garmentName,
  status,
  createdAt,
}: CustomOrderCardProps) {
  const statusLabel = status.replace(/_/g, ' ');
  const statusVariant =
    status === 'PENDING_REVIEW'
      ? 'warning'
      : status === 'APPROVED'
      ? 'success'
      : status === 'REJECTED'
      ? 'error'
      : 'default';

  return (
    <Link
      href={`/admin/custom-orders/${id}`}
      className="block border border-mv-border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-mv-text">Order #{orderNumber}</p>
          <p className="text-sm text-mv-text-secondary mt-1">{customerEmail}</p>
          <p className="text-sm text-mv-muted mt-1">Garment: {garmentName}</p>
          <p className="text-xs text-mv-muted mt-2">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge variant={statusVariant as any}>{statusLabel}</Badge>
      </div>
    </Link>
  );
}