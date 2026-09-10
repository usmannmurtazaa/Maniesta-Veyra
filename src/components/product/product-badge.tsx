import { Badge } from '@/components/ui/badge';

interface ProductBadgeProps {
  label: string;
  variant?: 'default' | 'accent' | 'outline' | 'success' | 'warning' | 'error';
}

export function ProductBadge({ label, variant = 'default' }: ProductBadgeProps) {
  return <Badge variant={variant}>{label}</Badge>;
}