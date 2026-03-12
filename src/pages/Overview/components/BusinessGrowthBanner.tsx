import { Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import type { BusinessGrowthMetrics } from '@/services/types/metrics';

interface BusinessGrowthBannerProps {
  metrics: BusinessGrowthMetrics;
}

function formatNaira(value: number): string {
  if (value >= 1_000_000) return `\u20A6${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `\u20A6${(value / 1_000).toFixed(0)}K`;
  return `\u20A6${value}`;
}

export function BusinessGrowthBanner({ metrics }: BusinessGrowthBannerProps) {
  const goalPct = Math.round((metrics.stores_current / metrics.stores_target) * 100);

  return (
    <div>
      {/* Section header */}
      <div className="mb-3 flex items-center gap-1.5">
        <Flame className="size-4 text-warning-600" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-warning-600">
          Business Growth — Are we acquiring and retaining stores?
        </h2>
      </div>

      {/* Card with left accent border */}
      <Card className="border-l-4 border-l-warning-500">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Stores vs Target */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-text-tertiary">Stores vs Target</span>
                <InfoTooltip content="Current number of live stores compared to the 60-day acquisition target." />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-text-primary">
                  {metrics.stores_current}
                </span>
                <span className="text-lg font-semibold text-text-quaternary">
                  /{metrics.stores_target}
                </span>
              </div>
              <p className="text-xs text-text-tertiary">{goalPct}% to 60-day goal</p>
              <p className="text-xs font-medium text-warning-600">
                {metrics.target_deadline_days}d left
              </p>
            </div>

            {/* New Stores (7D) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-text-tertiary">New Stores (7D)</span>
                <InfoTooltip content="Number of new stores onboarded in the last 7 days, compared to the prior week." />
              </div>
              <span className="text-2xl font-bold tracking-tight text-text-primary">
                +{metrics.new_stores_7d}
              </span>
              <p className="text-xs text-success-700">+{metrics.new_stores_change} vs last week</p>
              <p className="text-xs text-text-tertiary">
                Pipeline: {metrics.pipeline_count}&nbsp;&nbsp;Live: {metrics.live_count}
              </p>
            </div>

            {/* RS Revenue (7D) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-text-tertiary">RS Revenue (7D)</span>
                <InfoTooltip content="RetailStack platform revenue from fees in the last 7 days, with estimated monthly recurring revenue." />
              </div>
              <span className="text-2xl font-bold tracking-tight text-text-primary">
                {formatNaira(metrics.rs_revenue_7d)}
              </span>
              <p className="text-xs text-success-700">+{metrics.rs_revenue_change_pct}% WoW</p>
              <p className="text-xs text-text-tertiary">
                MRR est: {formatNaira(metrics.mrr_estimate)}
              </p>
            </div>

            {/* 4-Week Retention */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-text-tertiary">4-Week Retention</span>
                <InfoTooltip content="Percentage of stores still active after 4 weeks on the platform. Churn risk stores have declining engagement." />
              </div>
              <span className="text-2xl font-bold tracking-tight text-text-primary">
                {metrics.retention_4wk}%
              </span>
              <p className="text-xs font-medium text-warning-600">
                {metrics.churn_risk_count} stores at churn risk
              </p>
              <p className="text-xs text-text-tertiary">Sticky 4wk+: {metrics.sticky_4wk_plus}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
