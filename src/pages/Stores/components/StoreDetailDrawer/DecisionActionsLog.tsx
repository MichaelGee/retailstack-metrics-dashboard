import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { Tag, PackageCheck, ClipboardList, ShoppingBag } from 'lucide-react';
import type { DecisionAction } from '@/services/mock/store-detail-data';

interface DecisionActionsLogProps {
  actions: DecisionAction[];
}

const typeConfig: Record<
  DecisionAction['type'],
  { icon: React.ElementType; color: string; bg: string }
> = {
  price_change: { icon: Tag, color: 'text-blue-600', bg: 'bg-blue-50' },
  stock_adjustment: { icon: PackageCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
  inventory_count: { icon: ClipboardList, color: 'text-green-600', bg: 'bg-green-50' },
  purchase_order: { icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
};

function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function DecisionActionsLog({ actions }: DecisionActionsLogProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-sm font-medium text-text-secondary">
            Decision Actions
          </CardTitle>
          <InfoTooltip content="Business decisions made through the platform: price changes, stock adjustments, inventory counts, and purchase orders. This is the strongest engagement signal." />
        </div>
        <CardDescription className="text-xs">
          {actions.length > 0
            ? `${actions.length} action${actions.length > 1 ? 's' : ''} in the last 7 days`
            : 'No decision actions recorded this week'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {actions.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <ClipboardList className="mb-2 size-8 text-text-quaternary" />
            <p className="text-sm text-text-tertiary">No decisions this week</p>
            <p className="text-xs text-text-quaternary">
              The store owner hasn't made any price changes, stock adjustments, inventory counts, or
              purchase orders.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {actions.map(action => {
              const config = typeConfig[action.type];
              const Icon = config.icon;
              return (
                <div key={action.id} className="flex gap-3">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}
                  >
                    <Icon className={`size-4 ${config.color}`} />
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-primary">
                        {action.description}
                      </span>
                      <span className="text-xs text-text-quaternary">
                        {formatTimeAgo(action.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-text-tertiary">{action.details}</p>
                    <span className="text-xs text-text-quaternary">by {action.performed_by}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
