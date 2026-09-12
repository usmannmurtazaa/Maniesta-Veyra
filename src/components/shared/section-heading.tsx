import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  eyebrow?: string;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = 'left',
  eyebrow,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-8 md:mb-12',
        align === 'center' && 'text-center mx-auto max-w-2xl',
        className
      )}
    >
      {eyebrow && (
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-mv-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-mv-text leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-mv-text-secondary max-w-xl mx-auto md:mx-0">
          {subtitle}
        </p>
      )}
    </div>
  );
}