import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import type { SyncEvent } from '@/services/mock/store-detail-data';

interface SyncEventsLogProps {
  events: SyncEvent[];
  syncRate: number;
}

const statusConfig: Record<
  SyncEvent['status'],
  { icon: React.ElementType; variant: 'positive' | 'warning' | 'negative'; label: string }
> = {
  success: { icon: CheckCircle2, variant: 'positive', label: 'Synced' },
  retried: { icon: RotateCcw, variant: 'warning', label: 'Retried' },
  failed: { icon: XCircle, variant: 'negative', label: 'Failed' },
};

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleString('en-NG', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function SyncEventsLog({ events, syncRate }: SyncEventsLogProps) {
  const failed = events.filter(e => e.status === 'failed').length;
  const retried = events.filter(e => e.status === 'retried').length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <CardTitle className="text-sm font-medium text-text-secondary">Sync Events</CardTitle>
              <InfoTooltip content="Recent data sync attempts for this store. Events that fail and can't be retried are flagged as unrecoverable and require manual review." />
            </div>
            <CardDescription className="text-xs">
              {events.length} events — {retried} retried, {failed} failed
            </CardDescription>
          </div>
          <span
            className={`text-sm font-bold ${syncRate >= 99 ? 'text-success-700' : syncRate >= 98 ? 'text-warning-700' : 'text-error-700'}`}
          >
            {syncRate}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {events.slice(0, 12).map(event => {
            const config = statusConfig[event.status];
            const Icon = config.icon;
            return (
              <div
                key={event.id}
                className="flex items-start gap-3 rounded-lg border border-border-secondary p-3"
              >
                <Icon
                  className={`mt-0.5 size-4 shrink-0 ${
                    event.status === 'success'
                      ? 'text-success-500'
                      : event.status === 'retried'
                        ? 'text-warning-500'
                        : 'text-error-500'
                  }`}
                />
                <div className="flex flex-1 flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-text-primary">
                      {event.description}
                    </span>
                    <Badge variant={config.variant} className="text-[10px]">
                      {config.label}
                    </Badge>
                  </div>
                  {event.resolution && (
                    <p className="text-xs text-text-tertiary">{event.resolution}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {event.event_type === 'transaction' ? 'Transaction' : 'Inventory'}
                    </Badge>
                    <span className="text-xs text-text-quaternary">
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
