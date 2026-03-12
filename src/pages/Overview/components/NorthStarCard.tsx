import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { TrendingUp, TrendingDown, Star, CheckCircle2, XCircle } from 'lucide-react';
import type { NorthStarMetric } from '@/services/types/metrics';

interface NorthStarCardProps {
  data: NorthStarMetric;
}

function CriteriaItem({
  label,
  passing,
  total,
}: {
  label: string;
  passing: number;
  total: number;
}) {
  const allPassing = passing === total;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1.5">
          {allPassing ? (
            <CheckCircle2 className="size-3.5 text-success-500" />
          ) : (
            <XCircle className="size-3.5 text-warning-500" />
          )}
          <span className="text-xs text-text-secondary">{label}</span>
          <span
            className={`text-xs font-semibold ${allPassing ? 'text-success-700' : 'text-warning-700'}`}
          >
            {passing}/{total}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {passing} of {total} stores {allPassing ? 'passing' : 'meet this criteria'}
      </TooltipContent>
    </Tooltip>
  );
}

export function NorthStarCard({ data }: NorthStarCardProps) {
  const isPositiveChange = data.change_vs_last_period >= 0;
  const progressPct = (data.fully_operational_stores / data.total_stores) * 100;

  return (
    <Card className="relative overflow-hidden">
      {/* Subtle accent gradient on the left edge */}
      <div
        className="absolute inset-y-0 left-0 w-1 rounded-l-xl"
        style={{
          background: 'linear-gradient(to bottom, #7C3AED, #9E77ED)',
        }}
      />
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="size-4 text-warning-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                North Star
              </span>
              <InfoTooltip content="Stores that processed sales, recorded inventory movements, closed trading days, and had zero critical failures — all in the last 7 days. This is the single number that tells you if the business is healthy." />
            </div>
            <Badge variant={isPositiveChange ? 'positive' : 'negative'}>
              {isPositiveChange ? (
                <TrendingUp className="mr-1 size-3" />
              ) : (
                <TrendingDown className="mr-1 size-3" />
              )}
              {isPositiveChange ? '+' : ''}
              {data.change_vs_last_period} vs last week
            </Badge>
          </div>

          {/* Main metric */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold tracking-tight text-text-primary">
              {data.fully_operational_stores}
            </span>
            <span className="text-lg text-text-tertiary">/ {data.total_stores}</span>
            <span className="text-sm text-text-secondary">Fully Operational Stores</span>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-bg-secondary">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${progressPct}%`,
                    background: 'linear-gradient(to right, #7C3AED, #9E77ED)',
                  }}
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-text-primary">
              {data.operational_rate}%
            </span>
          </div>

          {/* Criteria breakdown */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border-secondary pt-4">
            <CriteriaItem
              label="Sales"
              passing={data.criteria_breakdown.sales.passing}
              total={data.criteria_breakdown.sales.total}
            />
            <CriteriaItem
              label="Inventory"
              passing={data.criteria_breakdown.inventory.passing}
              total={data.criteria_breakdown.inventory.total}
            />
            <CriteriaItem
              label="Day Close"
              passing={data.criteria_breakdown.day_close.passing}
              total={data.criteria_breakdown.day_close.total}
            />
            <CriteriaItem
              label="No Failures"
              passing={data.criteria_breakdown.no_failures.passing}
              total={data.criteria_breakdown.no_failures.total}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
