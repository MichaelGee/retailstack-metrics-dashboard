import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import type { ReconciliationDay } from '@/services/mock/store-detail-data';

interface ReconciliationHistoryProps {
  data: ReconciliationDay[];
  rate: number;
}

function formatNaira(value: number): string {
  return `₦${Math.abs(value).toLocaleString()}`;
}

export function ReconciliationHistory({ data, rate }: ReconciliationHistoryProps) {
  const closedDays = data.filter(d => d.status !== 'not_closed');
  const balancedDays = data.filter(d => d.status === 'balanced');
  const unbalancedDays = data.filter(d => d.status === 'unbalanced');

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Reconciliation History
              </CardTitle>
              <InfoTooltip content="Each square represents one day. Green = cash matched sales. Red = discrepancy. Gray = store closed (Sunday)." />
            </div>
            <CardDescription className="text-xs">
              Last 30 days — {balancedDays.length} balanced, {unbalancedDays.length} unbalanced,{' '}
              {data.length - closedDays.length} closed
            </CardDescription>
          </div>
          <span
            className={`text-lg font-bold ${rate >= 85 ? 'text-success-700' : 'text-warning-700'}`}
          >
            {rate}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Heat map grid */}
        <div className="flex flex-wrap gap-1">
          {data.map((day, i) => {
            const color =
              day.status === 'balanced'
                ? 'bg-success-400'
                : day.status === 'unbalanced'
                  ? 'bg-error-400'
                  : 'bg-bg-tertiary';

            return (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <div
                    className={`size-5 rounded-sm ${color} cursor-default transition-opacity hover:opacity-80`}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="text-left">
                  <p className="text-xs font-medium">{day.label}</p>
                  {day.status === 'not_closed' ? (
                    <p className="text-xs text-text-quaternary">Store closed</p>
                  ) : (
                    <>
                      <p className="text-xs">
                        {day.status === 'balanced' ? 'Balanced' : 'Unbalanced'}
                      </p>
                      <p className="text-xs text-text-quaternary">
                        Sales: {formatNaira(day.recorded_sales)} · Cash:{' '}
                        {formatNaira(day.declared_cash)}
                      </p>
                      {day.difference !== 0 && (
                        <p
                          className={`text-xs ${Math.abs(day.difference) > 500 ? 'text-error-400' : 'text-text-quaternary'}`}
                        >
                          Diff: {day.difference > 0 ? '+' : '-'}
                          {formatNaira(day.difference)}
                        </p>
                      )}
                    </>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-4 text-xs text-text-quaternary">
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-sm bg-success-400" />
            <span>Balanced</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-sm bg-error-400" />
            <span>Unbalanced</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-sm bg-bg-tertiary" />
            <span>Closed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
