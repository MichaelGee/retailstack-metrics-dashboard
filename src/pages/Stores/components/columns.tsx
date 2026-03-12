import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TableColumnHeader } from '@/components/organisms/GenericTable/TableColumnHeader';
import type { StoreOperationalStatus } from '@/services/types/metrics';

function formatNaira(value: number): string {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`;
  return `₦${value}`;
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
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
    id: 'stage',
    header: 'Stage',
    cell: ({ row }) => {
      const store = row.original;
      // At Risk if not operational OR reconciliation below 85% for 2+ weeks
      const isAtRisk = !store.is_fully_operational || store.reconciliation_rate < 85;
      return (
        <span className={`text-sm font-medium ${isAtRisk ? 'text-error-600' : 'text-success-600'}`}>
          {isAtRisk ? 'At Risk' : 'Active'}
        </span>
      );
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
    accessorKey: 'reconciliation_rate',
    header: ({ column }) => <TableColumnHeader column={column} title="Reconciliation" />,
    cell: ({ row }) => {
      const rate = row.getValue('reconciliation_rate') as number;
      return (
        <div className="flex items-center gap-2">
          <Progress
            value={rate}
            className="h-2 w-16"
            style={
              { '--progress-color': rate >= 85 ? '#16a34a' : '#f59e0b' } as React.CSSProperties
            }
          />
          <span
            className={`text-sm font-medium ${rate >= 85 ? 'text-success-700' : 'text-warning-700'}`}
          >
            {rate}%
          </span>
        </div>
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
    id: 'days_onboard',
    header: ({ column }) => <TableColumnHeader column={column} title="Days Onboard" />,
    accessorFn: row => daysSince(row.created_at),
    cell: ({ row }) => {
      const days = daysSince(row.original.created_at);
      return <span className="text-sm text-text-secondary">{days}d</span>;
    },
  },
  {
    accessorKey: 'decision_actions_count',
    header: ({ column }) => <TableColumnHeader column={column} title="Decisions" />,
    cell: ({ row }) => {
      const count = row.getValue('decision_actions_count') as number;
      return (
        <span
          className={`text-sm ${count > 0 ? 'font-medium text-brand-600' : 'text-text-quaternary'}`}
        >
          {count > 0 ? `${count} this week` : 'None'}
        </span>
      );
    },
  },
];
