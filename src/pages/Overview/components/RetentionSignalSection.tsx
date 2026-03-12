import { Card, CardContent } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import type { RetentionMetrics } from '@/services/types/metrics';

interface RetentionSignalSectionProps {
  metrics: RetentionMetrics;
}

export function RetentionSignalSection({ metrics }: RetentionSignalSectionProps) {
  return (
    <div>
      {/* Section header */}
      <div className="mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Retention Signal
        </h2>
        <p className="mt-0.5 text-xs text-text-quaternary">
          Are stores sticking around and growing on the platform?
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Active Stores (7D) */}
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-text-tertiary">Active Stores (7D)</span>
                <InfoTooltip content="Number of stores that completed at least one transaction in the last 7 days." />
              </div>
              <span className="text-2xl font-bold tracking-tight text-text-primary">
                {metrics.active_stores_7d} / {metrics.total_stores}
              </span>
              <p className="text-xs font-medium text-success-700">
                All stores transacted this week
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Avg Time to Fully Operational */}
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-text-tertiary">
                  Avg Time to Fully Operational
                </span>
                <InfoTooltip content="Average number of days from onboarding to fully operational status, compared to the previous cohort." />
              </div>
              <span className="text-2xl font-bold tracking-tight text-text-primary">
                {metrics.avg_time_to_operational_days} days
              </span>
              <p className="text-xs font-medium text-success-700">
                Down from {metrics.prev_cohort_days} days last cohort
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Churn Risk */}
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-text-tertiary">Churn Risk</span>
                <InfoTooltip content="Stores showing signs of disengagement based on reconciliation and activity thresholds." />
              </div>
              <span className="text-2xl font-bold tracking-tight text-text-primary">
                {metrics.churn_risk_stores} stores
              </span>
              <p className="text-xs font-medium text-warning-600">{metrics.churn_risk_reason}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
