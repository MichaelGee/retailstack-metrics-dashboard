import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import type { InventoryBreakdown } from '@/services/mock/store-detail-data';

interface InventorySectionProps {
  breakdown: InventoryBreakdown[];
  recentEvents: { date: string; label: string; count: number }[];
  totalEvents: number;
}

const typeColors: Record<string, string> = {
  stock_in: '#16a34a',
  stock_out: '#9E77ED',
  adjustment: '#f59e0b',
  transfer: '#3b82f6',
};

export function InventorySection({ breakdown, recentEvents, totalEvents }: InventorySectionProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-sm font-medium text-text-secondary">
            Inventory Activity
          </CardTitle>
          <InfoTooltip content="Breakdown of inventory movements by type, plus a 14-day trend of daily activity." />
        </div>
        <CardDescription className="text-xs">
          {totalEvents} total events in the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Breakdown bars */}
        <div className="mb-4 flex flex-col gap-2">
          {breakdown.map(item => (
            <div key={item.type} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs text-text-secondary">{item.label}</span>
              <div className="flex-1">
                <div className="h-4 w-full overflow-hidden rounded bg-bg-secondary">
                  <div
                    className="h-full rounded transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: typeColors[item.type],
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>
              <span className="w-16 text-right text-xs font-medium text-text-primary">
                {item.count} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>

        {/* Daily trend chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recentEvents} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: '#667085' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis tick={{ fontSize: 10, fill: '#667085' }} axisLine={false} tickLine={false} />
              <RechartsTooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-lg border border-border-secondary bg-white p-2 shadow-lg">
                      <p className="text-xs text-text-tertiary">{label}</p>
                      <p className="text-sm font-semibold text-text-primary">
                        {payload[0].value} events
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="count" fill="#16a34a" opacity={0.6} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
