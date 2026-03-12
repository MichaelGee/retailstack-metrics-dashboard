import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { SyncTimelinePoint, TrustMetrics } from '@/services/types/metrics';

interface SyncReliabilityChartProps {
  metrics: TrustMetrics;
  timeline: SyncTimelinePoint[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: SyncTimelinePoint }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-lg border border-border-secondary bg-white p-3 shadow-lg">
      <p className="mb-1 text-xs font-medium text-text-tertiary">{label}</p>
      <p className="text-sm font-semibold text-text-primary">{point.rate}%</p>
      <p className="text-xs text-text-secondary">
        {point.events_failed} failed of {point.events_total}
      </p>
    </div>
  );
}

export function SyncReliabilityChart({ metrics, timeline }: SyncReliabilityChartProps) {
  const isHealthy = metrics.sync_reliability_rate >= metrics.sync_threshold;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Sync Reliability — Last 24 Hours
              </CardTitle>
              <InfoTooltip content="Percentage of transactions and inventory events saved and synced without data loss or unrecoverable conflict. Only unrecoverable conflicts count as failures — retried events that eventually succeed are not counted." />
            </div>
            <CardDescription className="mt-0.5 text-xs">
              The yellow line marks the 99% warning threshold. The red line marks the 98% incident
              threshold.
            </CardDescription>
          </div>
          {isHealthy ? (
            <Badge variant="positive">
              <CheckCircle2 className="mr-1 size-3" />
              {metrics.sync_reliability_rate}% — Healthy
            </Badge>
          ) : (
            <Badge variant="negative">
              <AlertTriangle className="mr-1 size-3" />
              {metrics.sync_reliability_rate}% — Below Threshold
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary stats */}
        <div className="mb-4 flex flex-wrap gap-6">
          <div className="flex flex-col">
            <span className="text-xs text-text-tertiary">Events Synced</span>
            <span className="text-lg font-semibold text-text-primary">
              {metrics.successfully_synced.toLocaleString()} /{' '}
              {metrics.total_events_attempted.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-text-tertiary">Retried</span>
            <span className="text-lg font-semibold text-text-primary">
              {metrics.resolved_via_retry}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-text-tertiary">Unrecoverable</span>
            <span className="text-lg font-semibold text-error-700">
              {metrics.unrecoverable_conflicts}
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="syncGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 10, fill: '#667085' }}
                axisLine={false}
                tickLine={false}
                interval={3}
              />
              <YAxis
                domain={[96, 100]}
                tick={{ fontSize: 11, fill: '#667085' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `${v}%`}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={metrics.sync_threshold}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{
                  value: `${metrics.sync_threshold}% threshold`,
                  position: 'right',
                  fontSize: 10,
                  fill: '#f59e0b',
                }}
              />
              <ReferenceLine
                y={metrics.sync_incident_threshold}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{
                  value: `${metrics.sync_incident_threshold}% incident`,
                  position: 'right',
                  fontSize: 10,
                  fill: '#ef4444',
                }}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#16a34a"
                strokeWidth={2}
                fill="url(#syncGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
