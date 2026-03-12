import { Card, CardContent } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  changePct?: number;
  trend?: 'rising' | 'flat' | 'declining';
  icon?: LucideIcon;
  format?: 'currency' | 'number' | 'percentage';
  tooltip?: string;
}

export function MetricCard({
  label,
  value,
  subtitle,
  changePct,
  trend,
  icon: Icon,
  tooltip,
}: MetricCardProps) {
  const trendColor =
    trend === 'rising' || (changePct !== undefined && changePct > 0)
      ? 'text-success-700'
      : trend === 'declining' || (changePct !== undefined && changePct < 0)
        ? 'text-error-700'
        : 'text-text-tertiary';

  const TrendIcon =
    trend === 'rising' || (changePct !== undefined && changePct > 0)
      ? TrendingUp
      : trend === 'declining' || (changePct !== undefined && changePct < 0)
        ? TrendingDown
        : Minus;

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
            {Icon && <Icon className="size-4 text-text-quaternary" />}
          </div>

          {/* Value */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-text-primary">{value}</span>
          </div>

          {/* Trend + subtitle */}
          <div className="flex items-center gap-2">
            {(changePct !== undefined || trend) && (
              <div className={`flex items-center gap-0.5 ${trendColor}`}>
                <TrendIcon className="size-3" />
                {changePct !== undefined && (
                  <span className="text-xs font-medium">
                    {changePct > 0 ? '+' : ''}
                    {changePct}%
                  </span>
                )}
                {trend && changePct === undefined && (
                  <span className="text-xs font-medium capitalize">{trend}</span>
                )}
              </div>
            )}
            {subtitle && <span className="text-xs text-text-tertiary">{subtitle}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
