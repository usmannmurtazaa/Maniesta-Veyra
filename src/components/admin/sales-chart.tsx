'use client';

interface SalesChartProps {
  dailySales: Record<string, number>;
}

export function SalesChart({ dailySales }: SalesChartProps) {
  const entries = Object.entries(dailySales);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="border border-mv-border rounded-lg p-4">
      <h3 className="font-semibold mb-4">Daily Sales</h3>
      <div className="flex items-end gap-2 h-40">
        {entries.map(([date, amount]) => (
          <div key={date} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-mv-primary rounded-t"
              style={{ height: `${(amount / max) * 100}%` }}
              title={`${date}: ₨ ${amount}`}
            />
            <span className="text-xs mt-1">{date.slice(5)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}