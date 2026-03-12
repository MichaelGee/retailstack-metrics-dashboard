import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface TrustGaugeProps {
  label: string;
  rate: number;
  threshold: number;
  detail: string;
  secondaryDetail?: string;
  lastUpdated?: string;
  tooltip?: string;
}

export function TrustGauge({
  label,
  rate,
  threshold,
  detail,
  secondaryDetail,
  lastUpdated,
  tooltip,
}: TrustGaugeProps) {
  const isHealthy = rate >= threshold;
  const barColor = isHealthy ? '#16a34a' : '#f59e0b';

  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-text-tertiary">{label}</span>
              {tooltip && <InfoTooltip content={tooltip} />}
            </div>
            {isHealthy ? (
              <Badge variant="positive">
                <CheckCircle2 className="mr-1 size-3" />
                Healthy
              </Badge>
            ) : (
              <Badge variant="warning">
                <AlertTriangle className="mr-1 size-3" />
                Below {threshold}%
              </Badge>
            )}
          </div>

          {/* Rate */}
          <span className="text-2xl font-bold tracking-tight text-text-primary">{rate}%</span>

          {/* Progress bar with threshold marker */}
          <div className="relative mt-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-bg-secondary">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${rate}%`, backgroundColor: barColor }}
              />
            </div>
            {/* Threshold indicator */}
            <div
              className="absolute -top-0.5 flex flex-col items-center"
              style={{ left: `${threshold}%`, transform: 'translateX(-50%)' }}
            >
              <div className="h-3 w-0.5 rounded-full bg-text-tertiary" />
              <span className="mt-0.5 whitespace-nowrap text-[10px] font-medium text-text-quaternary">
                {threshold}% min
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-text-secondary">{detail}</span>
            {secondaryDetail && (
              <span className="text-xs text-text-tertiary">{secondaryDetail}</span>
            )}
            {lastUpdated && (
              <span className="text-xs text-text-quaternary">
                Updated {formatTimeAgo(lastUpdated)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}
