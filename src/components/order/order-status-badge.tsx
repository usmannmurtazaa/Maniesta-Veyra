import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: string;
}

const statusMap: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'error' }> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  CONFIRMED: { label: 'Confirmed', variant: 'default' },
  PROCESSING: { label: 'Processing', variant: 'default' },
  SHIPPED: { label: 'Shipped', variant: 'default' },
  DELIVERED: { label: 'Delivered', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'error' },
  REFUNDED: { label: 'Refunded', variant: 'error' },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusMap[status] ?? { label: status, variant: 'default' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}