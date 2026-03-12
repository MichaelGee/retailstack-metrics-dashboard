import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import {
  CheckCircle2,
  XCircle,
  ShoppingCart,
  Package,
  CalendarCheck,
  ShieldCheck,
} from 'lucide-react';
import type { StoreOperationalStatus } from '@/services/types/metrics';

interface OperationalStatusProps {
  store: StoreOperationalStatus;
  daysSinceLastInventory: number;
}

function CriterionRow({
  passing,
  label,
  detail,
  icon: Icon,
  tooltip,
}: {
  passing: boolean;
  label: string;
  detail: string;
  icon: React.ElementType;
  tooltip: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-3">
        <div
          className={`flex size-8 items-center justify-center rounded-lg ${
            passing ? 'bg-success-50' : 'bg-error-50'
          }`}
        >
          <Icon className={`size-4 ${passing ? 'text-success-600' : 'text-error-600'}`} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-text-primary">{label}</span>
            <InfoTooltip content={tooltip} side="right" />
          </div>
          <span className="text-xs text-text-tertiary">{detail}</span>
        </div>
      </div>
      {passing ? (
        <Badge variant="positive">
          <CheckCircle2 className="mr-1 size-3" />
          Passing
        </Badge>
      ) : (
        <Badge variant="negative">
          <XCircle className="mr-1 size-3" />
          Failing
        </Badge>
      )}
    </div>
  );
}

export function OperationalStatus({ store, daysSinceLastInventory }: OperationalStatusProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm font-medium text-text-primary">Operational Criteria</span>
          <InfoTooltip content="A store must meet all 4 criteria in the last 7 days to be considered Fully Operational." />
        </div>
        <div className="divide-y divide-border-secondary">
          <CriterionRow
            passing={store.has_sales}
            label="Processed Sales"
            detail={
              store.has_sales
                ? 'At least 1 transaction recorded'
                : 'No transactions in the last 7 days'
            }
            icon={ShoppingCart}
            tooltip="The store must have processed at least 1 sale in the rolling 7-day window."
          />
          <CriterionRow
            passing={store.has_inventory_events}
            label="Recorded Inventory"
            detail={
              store.has_inventory_events
                ? `${store.inventory_events_count} events — last ${daysSinceLastInventory === 0 ? 'today' : `${daysSinceLastInventory}d ago`}`
                : `No inventory events — last was ${daysSinceLastInventory > 30 ? '30+ days ago' : `${daysSinceLastInventory}d ago`}`
            }
            icon={Package}
            tooltip="At least 1 inventory movement (stock-in, stock-out, adjustment, or transfer) must be recorded in the last 7 days."
          />
          <CriterionRow
            passing={store.has_closed_trading_day}
            label="Closed Trading Day"
            detail={
              store.has_closed_trading_day
                ? 'At least 1 day closed this week'
                : 'No days closed in the last 7 days'
            }
            icon={CalendarCheck}
            tooltip="The store must have completed at least 1 end-of-day close (reconciliation) in the last 7 days."
          />
          <CriterionRow
            passing={store.has_zero_critical_failures}
            label="Zero Critical Failures"
            detail={
              store.has_zero_critical_failures
                ? 'No data loss, crashes, or unresolvable sync issues'
                : 'Critical failure detected — see sync events below'
            }
            icon={ShieldCheck}
            tooltip="There must be zero critical failures (unrecoverable data loss, app crashes, or unresolvable sync conflicts) in the last 7 days."
          />
        </div>
      </CardContent>
    </Card>
  );
}
