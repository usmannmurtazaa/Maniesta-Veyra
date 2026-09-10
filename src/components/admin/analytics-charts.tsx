'use client';

interface AnalyticsChartsProps {
  data: {
    labels: string[];
    values: number[];
  };
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  if (!data.labels.length || !data.values.length) {
    return (
      <div className="border border-mv-border rounded-lg p-6 text-center text-mv-muted">
        No analytics data available yet.
      </div>
    );
  }

  const max = Math.max(...data.values, 1);

  return (
    <div className="border border-mv-border rounded-lg p-6">
      <h3 className="font-semibold mb-4 text-mv-text">Sales Overview</h3>
      <div className="flex items-end gap-2 h-48">
        {data.labels.map((label, index) => {
          const value = data.values[index] ?? 0;
          const heightPercent = (value / max) * 100;
          return (
            <div key={label + index} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-mv-primary rounded-t transition-all hover:bg-mv-primary-hover"
                style={{ height: `${heightPercent}%`, minHeight: '2px' }}
                title={`${label}: ₨ ${value.toLocaleString()}`}
              />
              <span className="text-xs text-mv-muted truncate max-w-full">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}