import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <div className={className}>
      <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-mv-text">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-lg md:text-xl text-mv-text-secondary">{subtitle}</p>
      )}
    </div>
  );
}