import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { CheckCircle2, XCircle } from 'lucide-react';
import { TableColumnHeader } from '@/components/organisms/GenericTable/TableColumnHeader';
import type { StoreOperationalStatus } from '@/services/types/metrics';

function StatusIcon({ passing }: { passing: boolean }) {
  return passing ? (
    <div className="flex justify-center">
      <CheckCircle2 className="size-4 text-success-500" />
    </div>
  ) : (
    <div className="flex justify-center">
      <XCircle className="size-4 text-error-500" />
    </div>
  );
}

function formatNaira(value: number): string {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`;
  return `₦${value}`;
}

function HeaderWithInfo({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <div className="flex items-center gap-1 text-center">
      <span>{label}</span>
      <InfoTooltip content={tooltip} side="bottom" />
    </div>
  );
}

export const columns: ColumnDef<StoreOperationalStatus, unknown>[] = [
  {
    accessorKey: 'store_name',
    header: ({ column }) => <TableColumnHeader column={column} title="Store" />,
    cell: ({ row }) => {
      const store = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-text-primary">{store.store_name}</span>
          <span className="text-xs text-text-tertiary">{store.location}</span>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: 'is_fully_operational',
    header: 'Status',
    cell: ({ row }) => {
      const isOperational = row.getValue('is_fully_operational') as boolean;
      return isOperational ? (
        <Badge variant="positive">Healthy</Badge>
      ) : (
        <Badge variant="warning">Needs Attention</Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(String(row.getValue(id)));
    },
  },
  {
    accessorKey: 'gmv',
    header: ({ column }) => <TableColumnHeader column={column} title="GMV (7d)" />,
    cell: ({ row }) => (
      <span className="text-sm font-medium text-text-primary">
        {formatNaira(row.getValue('gmv') as number)}
      </span>
    ),
  },
  {
    accessorKey: 'has_sales',
    header: () => (
      <HeaderWithInfo
        label="Sales"
        tooltip="Has the store processed at least 1 transaction in the last 7 days?"
      />
    ),
    cell: ({ row }) => <StatusIcon passing={row.getValue('has_sales') as boolean} />,
    enableSorting: false,
  },
  {
    accessorKey: 'has_inventory_events',
    header: () => (
      <HeaderWithInfo
        label="Inventory"
        tooltip="Has the store recorded at least 1 inventory event (stock-in, stock-out, adjustment, or transfer) in the last 7 days?"
      />
    ),
    cell: ({ row }) => <StatusIcon passing={row.getValue('has_inventory_events') as boolean} />,
    enableSorting: false,
  },
  {
    accessorKey: 'has_closed_trading_day',
    header: () => (
      <HeaderWithInfo
        label="Day Close"
        tooltip="Has the store successfully closed at least 1 trading day in the last 7 days?"
      />
    ),
    cell: ({ row }) => <StatusIcon passing={row.getValue('has_closed_trading_day') as boolean} />,
    enableSorting: false,
  },
  {
    accessorKey: 'has_zero_critical_failures',
    header: () => (
      <HeaderWithInfo
        label="No Failures"
        tooltip="Zero critical system failures in the last 7 days. A critical failure is unrecoverable data loss, app crash requiring manual restart, or unresolvable sync conflict."
      />
    ),
    cell: ({ row }) => (
      <StatusIcon passing={row.getValue('has_zero_critical_failures') as boolean} />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'reconciliation_rate',
    header: ({ column }) => <TableColumnHeader column={column} title="Reconciliation" />,
    cell: ({ row }) => {
      const rate = row.getValue('reconciliation_rate') as number;
      return (
        <span
          className={`text-sm font-medium ${rate >= 85 ? 'text-success-700' : 'text-warning-700'}`}
        >
          {rate}%
        </span>
      );
    },
  },
  {
    accessorKey: 'sync_reliability_rate',
    header: ({ column }) => <TableColumnHeader column={column} title="Sync" />,
    cell: ({ row }) => {
      const rate = row.getValue('sync_reliability_rate') as number;
      return (
        <span
          className={`text-sm font-medium ${
            rate >= 99 ? 'text-success-700' : rate >= 98 ? 'text-warning-700' : 'text-error-700'
          }`}
        >
          {rate}%
        </span>
      );
    },
  },
  {
    accessorKey: 'decision_actions_count',
    header: ({ column }) => <TableColumnHeader column={column} title="Decisions" />,
    cell: ({ row }) => {
      const count = row.getValue('decision_actions_count') as number;
      return (
        <span className={`text-sm ${count > 0 ? 'text-text-primary' : 'text-text-quaternary'}`}>
          {count > 0 ? `${count} this week` : 'None'}
        </span>
      );
    },
  },
];
