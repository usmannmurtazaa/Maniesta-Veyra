import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function SectionHeading({ title, subtitle, align = 'left', className }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-8',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
    >
      <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-mv-text">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-mv-text-secondary max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}