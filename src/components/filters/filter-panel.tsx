interface FilterPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function FilterPanel({ children, className }: FilterPanelProps) {
  return <div className={`space-y-6 ${className ?? ''}`}>{children}</div>;
}