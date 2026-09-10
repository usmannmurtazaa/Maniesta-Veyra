import { OrderStatusBadge } from './order-status-badge';

interface TimelineEvent {
  status: string;
  createdAt: string | Date;
  notes?: string | null;
}

interface OrderTimelineProps {
  history: TimelineEvent[];
}

export function OrderTimeline({ history }: OrderTimelineProps) {
  if (history.length === 0) {
    return <p className="text-sm text-mv-muted">No status updates yet.</p>;
  }

  return (
    <ol className="relative space-y-6 pl-6">
      {/* Vertical line */}
      <div className="absolute left-2 top-2 bottom-2 w-px bg-mv-border" aria-hidden="true" />

      {history.map((event, index) => {
        const date = new Date(event.createdAt);
        return (
          <li key={index} className="relative">
            {/* Dot */}
            <span className="absolute -left-6 top-1 h-4 w-4 rounded-full border-2 border-mv-primary bg-white" />

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <OrderStatusBadge status={event.status} />
                <span className="text-xs text-mv-muted">
                  {date.toLocaleDateString()} {date.toLocaleTimeString()}
                </span>
              </div>
              {event.notes && (
                <p className="text-sm text-mv-text-secondary">{event.notes}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}