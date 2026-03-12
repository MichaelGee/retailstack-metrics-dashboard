import { useState } from 'react';
import PageHelmet from '@/common/PageHelmet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DollarSign, BarChart3, Package, ClipboardCheck } from 'lucide-react';
import { NorthStarCard } from './components/NorthStarCard';
import { MetricCard } from './components/MetricCard';
import { TrustGauge } from './components/TrustGauge';
import { TrendChart } from './components/TrendChart';
import { BusinessGrowthBanner } from './components/BusinessGrowthBanner';
import { RetentionSignalSection } from './components/RetentionSignalSection';
import { Card, CardContent } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { getMockOverviewMetrics } from '@/services/mock/metrics-data';
import type { PeriodFilter } from '@/services/types/metrics';

function formatNaira(value: number): string {
  if (value >= 1_000_000) return `\u20A6${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `\u20A6${(value / 1_000).toFixed(0)}K`;
  return `\u20A6${value}`;
}

const storesWithDecisions = ['Ikeja', 'Surulere', 'Yaba'];
const storesWithoutDecisions = ['Lekki', 'VI', 'Apapa', 'Ajah', 'Festac'];

const Overview = () => {
  const [period, setPeriod] = useState<PeriodFilter>('7d');
  const data = getMockOverviewMetrics(period);

  const inventoryTarget = 80;
  const inventoryValue = data.depth.inventory_events_per_1m_gmv;
  const inventoryPct = Math.min((inventoryValue / inventoryTarget) * 100, 100);

  return (
    <>
      <PageHelmet
        title="Overview — RetailStack Metrics"
        description="RetailStack Metrics Dashboard overview"
      />
      <div className="flex flex-col gap-6 p-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Overview</h1>
            <p className="text-sm text-text-tertiary">
              Platform health at a glance. All metrics use a rolling window from the current time.
            </p>
          </div>
          <Select value={period} onValueChange={v => setPeriod(v as PeriodFilter)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="14d">Last 14 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Business Growth Banner — top of page */}
        <BusinessGrowthBanner metrics={data.business_growth} />

        {/* North Star — full width hero */}
        <NorthStarCard data={data.north_star} />

        {/* Economic */}
        <div>
          <div className="mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Economic
            </h2>
            <p className="mt-0.5 text-xs text-text-quaternary">
              Revenue indicators — total transaction volume and per-store averages.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <MetricCard
              label="Total GMV"
              value={formatNaira(data.economic.total_gmv)}
              changePct={data.economic.gmv_change_pct}
              subtitle={`Revenue: ${formatNaira(data.economic.revenue_at_1pct)} (1%)`}
              icon={DollarSign}
              tooltip="Total value of all transactions processed through Retail Stack across all stores. Your 1% fee is calculated from this number."
            />
            <MetricCard
              label="GMV per Operational Store"
              value={formatNaira(data.economic.gmv_per_operational_store)}
              changePct={data.economic.gmv_per_store_change_pct}
              subtitle="Avg. volume per healthy store"
              icon={BarChart3}
              tooltip="Average GMV per fully operational store. If store count grows but this drops, new stores aren't doing real volume."
            />
          </div>
        </div>

        {/* Retention Signal — between Economic and Depth */}
        <RetentionSignalSection metrics={data.retention} />

        {/* Depth */}
        <div>
          <div className="mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Depth
            </h2>
            <p className="mt-0.5 text-xs text-text-quaternary">
              Engagement signals — are stores actively running their business through the platform,
              not just processing sales?
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Inventory Events per 1M GMV — with progress bar */}
            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex flex-col gap-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-text-tertiary">
                        Inventory Events per {'\u20A6'}1M GMV
                      </span>
                      <InfoTooltip content="Stock-in, stock-out, adjustments, and transfers normalized per \u20A61M in sales. A rising number means stores trust the inventory layer. Flat while GMV grows is a depth problem." />
                    </div>
                    <Package className="size-4 text-text-quaternary" />
                  </div>

                  {/* Value */}
                  <span className="text-2xl font-bold tracking-tight text-text-primary">
                    {inventoryValue}
                  </span>

                  {/* Trend + subtitle */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-tertiary">
                      {data.depth.total_inventory_events} total events
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="flex flex-col gap-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-bg-secondary">
                      <div
                        className="h-full rounded-full bg-brand-500 transition-all duration-300"
                        style={{ width: `${inventoryPct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-end">
                      <span className="text-xs text-text-quaternary">
                        Target: {inventoryTarget}+
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Stores with Decisions — with store badges */}
            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex flex-col gap-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-text-tertiary">
                        Weekly Stores with Decisions
                      </span>
                      <InfoTooltip content="Stores that performed at least one price change, stock adjustment, inventory count, or purchase order in the last 7 days. The strongest signal that owners are actively running their business through Retail Stack." />
                    </div>
                    <ClipboardCheck className="size-4 text-text-quaternary" />
                  </div>

                  {/* Value */}
                  <span className="text-2xl font-bold tracking-tight text-text-primary">
                    {data.depth.weekly_stores_with_decisions} / {data.depth.total_stores}
                  </span>

                  {/* Subtitle */}
                  <span className="text-xs text-text-tertiary">
                    {data.depth.decision_rate}% of stores took action
                  </span>

                  {/* Store badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {storesWithDecisions.map(name => (
                      <span
                        key={name}
                        className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700"
                      >
                        {name}
                      </span>
                    ))}
                    {storesWithoutDecisions.map(name => (
                      <span
                        key={name}
                        className="rounded-full bg-bg-secondary px-2.5 py-0.5 text-xs font-medium text-text-quaternary"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust */}
        <div>
          <div className="mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Trust
            </h2>
            <p className="mt-0.5 text-xs text-text-quaternary">
              System reliability and data integrity — if these slip, stores stop trusting what they
              see.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TrustGauge
              label="Reconciliation Completion Rate"
              rate={data.trust.reconciliation_completion_rate}
              threshold={data.trust.reconciliation_threshold}
              detail={`${data.trust.balanced_closed_days} of ${data.trust.total_closed_days} trading days balanced`}
              secondaryDetail={
                data.trust.stores_below_threshold > 0
                  ? `${data.trust.stores_below_threshold} store${data.trust.stores_below_threshold > 1 ? 's' : ''} below ${data.trust.reconciliation_threshold}% threshold`
                  : undefined
              }
              tooltip="Percentage of trading days closed with balanced sales and cash records. A store that stops reconciling is quietly disengaging before it formally churns. Alert threshold: 85%."
            />
            <TrustGauge
              label="Sync Reliability Rate"
              rate={data.trust.sync_reliability_rate}
              threshold={data.trust.sync_threshold}
              detail={`${data.trust.successfully_synced.toLocaleString()} of ${data.trust.total_events_attempted.toLocaleString()} events synced`}
              secondaryDetail={`${data.trust.resolved_via_retry} retried \u00B7 ${data.trust.unrecoverable_conflicts} unrecoverable`}
              lastUpdated={data.trust.last_updated}
              tooltip="Percentage of transactions and inventory events synced without data loss. Below 99% triggers a warning. Below 98% is a production incident. Refreshes every 15 minutes."
            />
          </div>
        </div>

        {/* Trend chart */}
        <TrendChart data={data.trends} />
      </div>
    </>
  );
};

export default Overview;
