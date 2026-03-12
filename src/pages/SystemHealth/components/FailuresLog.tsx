import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import type { CriticalFailure } from '@/services/types/metrics';

interface FailuresLogProps {
  failures: CriticalFailure[];
}

const failureTypeLabels: Record<CriticalFailure['failure_type'], string> = {
  data_loss: 'Data Loss',
  app_crash: 'App Crash',
  unresolvable_sync: 'Unresolvable Sync',
};

const statusVariants: Record<CriticalFailure['status'], 'positive' | 'warning' | 'negative'> = {
  resolved: 'positive',
  investigating: 'warning',
  open: 'negative',
};

export function FailuresLog({ failures }: FailuresLogProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Critical Failures — Last 7 Days
              </CardTitle>
              <InfoTooltip content="A critical failure is any event where a store loses unrecoverable data, the app crashes requiring manual restart, or a transaction syncs with an unresolvable conflict." />
            </div>
            <CardDescription className="mt-0.5 text-xs">
              Events that directly impact store operations and data integrity.
            </CardDescription>
          </div>
          {failures.length === 0 ? (
            <Badge variant="positive">
              <CheckCircle2 className="mr-1 size-3" />0 failures
            </Badge>
          ) : (
            <Badge variant="negative">
              <ShieldAlert className="mr-1 size-3" />
              {failures.length} failure{failures.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {failures.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="mb-3 size-8 text-success-400" />
            <p className="text-sm font-medium text-text-secondary">No critical failures</p>
            <p className="text-xs text-text-tertiary">All systems operating normally</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {failures.map(f => (
                <TableRow key={f.id}>
                  <TableCell className="whitespace-nowrap text-xs">
                    {new Date(f.timestamp).toLocaleString('en-NG', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell className="text-sm font-medium">{f.store_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{failureTypeLabels[f.failure_type]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[f.status]} className="capitalize">
                      {f.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-xs text-text-tertiary">
                    {f.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
