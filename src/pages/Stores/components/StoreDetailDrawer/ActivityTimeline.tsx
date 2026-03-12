import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import {
  ShoppingCart,
  Package,
  CalendarCheck,
  ClipboardCheck,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import type { ActivityItem } from '@/services/mock/store-detail-data';

interface ActivityTimelineProps {
  items: ActivityItem[];
}

const categoryConfig: Record<
  ActivityItem['category'],
  { icon: React.ElementType; color: string; bg: string }
> = {
  sale: { icon: ShoppingCart, color: 'text-green-600', bg: 'bg-green-50' },
  inventory: { icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
  reconciliation: { icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
  decision: { icon: ClipboardCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
  sync: { icon: RefreshCw, color: 'text-gray-600', bg: 'bg-gray-50' },
  failure: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
};

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3_600_000);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-sm font-medium text-text-secondary">
            Activity Timeline
          </CardTitle>
          <InfoTooltip content="Chronological feed of all store activity: sales, inventory events, reconciliation, business decisions, sync events, and any failures." />
        </div>
        <CardDescription className="text-xs">Recent activity across all categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute inset-y-0 left-4 w-px bg-border-secondary" />

            <div className="flex flex-col gap-4">
              {items.map(item => {
                const config = categoryConfig[item.category];
                const Icon = config.icon;
                return (
                  <div key={item.id} className="relative flex gap-4 pl-1">
                    {/* Icon dot */}
                    <div
                      className={`relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full ${config.bg} ring-2 ring-white`}
                    >
                      <Icon className={`size-3.5 ${config.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col gap-0.5 pb-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-text-primary">{item.title}</span>
                        <span className="text-xs text-text-quaternary">
                          {formatTime(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-text-tertiary">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
