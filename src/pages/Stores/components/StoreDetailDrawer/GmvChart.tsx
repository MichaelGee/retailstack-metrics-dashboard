import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DailyGmv } from '@/services/mock/store-detail-data';

interface GmvChartProps {
  data: DailyGmv[];
}

function formatNaira(value: number): string {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`;
  return `₦${value}`;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: DailyGmv }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-border-secondary bg-white p-3 shadow-lg">
      <p className="mb-1 text-xs font-medium text-text-tertiary">{d.label}</p>
      <p className="text-sm font-semibold text-text-primary">{formatNaira(d.gmv)}</p>
      <p className="text-xs text-text-secondary">{d.transactions} transactions</p>
    </div>
  );
}

export function GmvChart({ data }: GmvChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-text-secondary">
          Daily GMV — Last 30 Days
        </CardTitle>
        <CardDescription className="text-xs">
          Transaction volume trend for this store. Hover for daily breakdown.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="storeGmvGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9E77ED" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#9E77ED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#667085' }}
                axisLine={false}
                tickLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#667085' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatNaira}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="gmv"
                stroke="#9E77ED"
                strokeWidth={2}
                fill="url(#storeGmvGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
