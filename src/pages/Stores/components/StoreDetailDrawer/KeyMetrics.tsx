import { InfoTooltip } from '@/components/ui/info-tooltip';
import type { StoreDetail } from '@/services/mock/store-detail-data';

interface KeyMetricsProps {
  detail: StoreDetail;
}

function formatNaira(value: number): string {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`;
  return `₦${value}`;
}

function MetricMini({
  label,
  value,
  sub,
  tooltip,
  alert,
}: {
  label: string;
  value: string;
  sub?: string;
  tooltip: string;
  alert?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border-secondary p-3">
      <div className="flex items-center gap-1">
        <span className="text-xs text-text-tertiary">{label}</span>
        <InfoTooltip content={tooltip} />
      </div>
      <span className={`text-lg font-bold ${alert ? 'text-warning-700' : 'text-text-primary'}`}>
        {value}
      </span>
      {sub && <span className="text-xs text-text-quaternary">{sub}</span>}
    </div>
  );
}

export function KeyMetrics({ detail }: KeyMetricsProps) {
  const { store, summary } = detail;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <MetricMini
        label="GMV (7d)"
        value={formatNaira(store.gmv)}
        sub={`Avg ${formatNaira(summary.avg_daily_gmv)}/day`}
        tooltip="Total transaction value for this store in the last 7 days."
      />
      <MetricMini
        label="Transactions"
        value={summary.total_transactions_7d.toString()}
        sub={`~${summary.avg_transactions_per_day}/day`}
        tooltip="Total number of completed transactions in the last 7 days."
      />
      <MetricMini
        label="Peak Day"
        value={formatNaira(summary.peak_day_gmv)}
        sub={summary.peak_day_label}
        tooltip="Highest single-day GMV in the last 7 days."
      />
      <MetricMini
        label="Reconciliation"
        value={`${store.reconciliation_rate}%`}
        sub={`${summary.reconciliation_streak}d balanced streak`}
        tooltip="Percentage of closed trading days where cash matched sales. Alert threshold is 85%."
        alert={store.reconciliation_rate < 85}
      />
      <MetricMini
        label="Sync Rate"
        value={`${store.sync_reliability_rate}%`}
        sub={`${summary.total_sync_events_7d} events this week`}
        tooltip="Percentage of events synced without data loss. Below 99% is a warning."
        alert={store.sync_reliability_rate < 99}
      />
      <MetricMini
        label="Decisions"
        value={store.decision_actions_count > 0 ? `${store.decision_actions_count}` : 'None'}
        sub={store.decision_actions_count > 0 ? 'actions this week' : 'No decisions this week'}
        tooltip="Price changes, stock adjustments, inventory counts, or purchase orders made this week."
        alert={store.decision_actions_count === 0}
      />
    </div>
  );
}
