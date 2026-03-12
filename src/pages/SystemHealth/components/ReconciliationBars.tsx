import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import type { ReconciliationByStore } from '@/services/types/metrics';

interface ReconciliationBarsProps {
  stores: ReconciliationByStore[];
  threshold: number;
  platformAvg: number;
}

export function ReconciliationBars({ stores, threshold, platformAvg }: ReconciliationBarsProps) {
  const belowCount = stores.filter(s => s.below_threshold).length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Reconciliation by Store — Last 30 Days
              </CardTitle>
              <InfoTooltip content="Percentage of trading days closed with balanced sales and cash records. A store drifting from reconciliation is the earliest churn signal. The vertical line marks the 85% alert threshold." />
            </div>
            <CardDescription className="mt-0.5 text-xs">
              Hover over a bar for detailed day counts. Sorted from highest to lowest.
            </CardDescription>
          </div>
          <span className="text-xs text-text-tertiary">
            Platform avg: <span className="font-semibold text-text-primary">{platformAvg}%</span>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {stores.map(store => {
            const barColor = store.below_threshold ? '#f59e0b' : '#16a34a';

            return (
              <Tooltip key={store.store_id}>
                <TooltipTrigger asChild>
                  <div className="group flex items-center gap-3">
                    {/* Store name */}
                    <span className="w-40 shrink-0 truncate text-xs font-medium text-text-secondary">
                      {store.store_name}
                    </span>

                    {/* Bar container */}
                    <div className="relative flex-1">
                      <div className="h-5 w-full overflow-hidden rounded bg-bg-secondary">
                        <div
                          className="h-full rounded transition-all duration-500 ease-out"
                          style={{
                            width: `${store.rate}%`,
                            backgroundColor: barColor,
                            opacity: 0.75,
                          }}
                        />
                      </div>
                      {/* Threshold marker */}
                      <div
                        className="absolute top-0 h-5 w-px bg-text-primary/20"
                        style={{ left: `${threshold}%` }}
                      />
                    </div>

                    {/* Rate label */}
                    <div className="flex w-16 items-center justify-end gap-1">
                      <span
                        className={`text-xs font-semibold ${
                          store.below_threshold ? 'text-warning-700' : 'text-success-700'
                        }`}
                      >
                        {store.rate}%
                      </span>
                      {store.below_threshold && (
                        <Badge variant="warning" className="px-1 py-0 text-[10px]">
                          Low
                        </Badge>
                      )}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {store.balanced_days} of {store.total_days} trading days balanced
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {belowCount > 0 && (
          <p className="mt-4 text-xs text-warning-700">
            {belowCount} store{belowCount > 1 ? 's' : ''} below {threshold}% threshold
          </p>
        )}
      </CardContent>
    </Card>
  );
}
