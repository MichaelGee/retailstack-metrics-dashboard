import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Bar,
  ComposedChart,
} from 'recharts';
import type { TrendDataPoint } from '@/services/types/metrics';

interface TrendChartProps {
  data: TrendDataPoint[];
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`;
  return `₦${value}`;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border-secondary bg-white p-3 shadow-lg">
      <p className="mb-1.5 text-xs font-medium text-text-tertiary">{label}</p>
      {payload.map(entry => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <div className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-text-secondary">
            {entry.dataKey === 'gmv'
              ? `GMV: ${formatCurrency(entry.value)}`
              : `Operational: ${entry.value} stores`}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-text-secondary">
          Weekly Trends — GMV & Operational Stores
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gmvGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9E77ED" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#9E77ED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#667085' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="gmv"
                tick={{ fontSize: 11, fill: '#667085' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatCurrency}
              />
              <YAxis
                yAxisId="stores"
                orientation="right"
                tick={{ fontSize: 11, fill: '#667085' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 'dataMax + 2']}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area
                yAxisId="gmv"
                type="monotone"
                dataKey="gmv"
                stroke="#9E77ED"
                strokeWidth={2}
                fill="url(#gmvGradient)"
              />
              <Bar
                yAxisId="stores"
                dataKey="operational_stores"
                fill="#16a34a"
                opacity={0.6}
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
