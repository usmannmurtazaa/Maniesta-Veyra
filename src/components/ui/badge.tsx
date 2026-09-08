import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-mv-primary text-white',
        accent: 'bg-mv-accent text-white',
        outline: 'border border-mv-border text-mv-text',
        success: 'bg-mv-success/20 text-mv-success',
        warning: 'bg-mv-warning/20 text-mv-warning',
        error: 'bg-mv-error/20 text-mv-error',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };