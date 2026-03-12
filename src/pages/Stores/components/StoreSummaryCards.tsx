import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { mockStores } from '@/services/mock/metrics-data';

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`;
  return `₦${value.toLocaleString()}`;
}

interface SummaryCard {
  label: string;
  value: string;
  detail: string;
  tooltip: string;
  valueColor?: string;
}

export function StoreSummaryCards() {
  const cards: SummaryCard[] = useMemo(() => {
    const total = mockStores.length;
    const healthy = mockStores.filter(s => s.is_fully_operational).length;
    const attention = total - healthy;
    const totalGmv = mockStores.reduce((sum, s) => sum + s.gmv, 0);
    const avgReconciliation = Math.round(
      mockStores.reduce((sum, s) => sum + s.reconciliation_rate, 0) / total
    );
    const storesWithDecisions = mockStores.filter(s => s.decision_actions_count > 0).length;
    const churnRisk = mockStores.filter(s => s.reconciliation_rate < 85).length;

    return [
      {
        label: 'Total',
        value: `${total}`,
        detail: 'All locations',
        tooltip: 'Total number of stores connected to the RetailStack platform.',
      },
      {
        label: 'Operational',
        value: `${healthy}/${total}`,
        detail: `${Math.round((healthy / total) * 100)}% of stores`,
        tooltip:
          'Stores meeting all 4 criteria in the last 7 days: processed sales, recorded inventory, closed trading days, and zero critical failures.',
      },
      {
        label: 'Attention',
        value: `${attention}`,
        detail: 'Failing criteria',
        tooltip:
          'Stores that are missing at least one operational criteria. These need investigation.',
      },
      {
        label: 'GMV',
        value: formatCurrency(totalGmv),
        detail: `Avg ${formatCurrency(Math.round(totalGmv / total))}/store`,
        tooltip:
          'Total Gross Merchandise Value processed across all stores in the rolling 7-day window.',
      },
      {
        label: 'Avg Recon',
        value: `${avgReconciliation}%`,
        detail: `${mockStores.filter(s => s.reconciliation_rate < 85).length} below 85%`,
        tooltip:
          'Average reconciliation rate across all stores. Stores below 85% are flagged as needing attention.',
      },
      {
        label: 'Decisions',
        value: `${storesWithDecisions}/${total}`,
        detail: `${Math.round((storesWithDecisions / total) * 100)}% engagement`,
        tooltip:
          'Stores where owners made business decisions this week. This is the strongest engagement signal.',
      },
      {
        label: 'Churn Risk',
        value: `${churnRisk}`,
        detail: '2wk+ below threshold',
        valueColor: churnRisk > 0 ? 'text-error-600' : undefined,
        tooltip:
          'Stores below the reconciliation threshold for 2+ consecutive weeks. These are at risk of churning off the platform.',
      },
    ];
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
      {cards.map(card => (
        <Card key={card.label} className="transition-shadow duration-200 hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
                  {card.label}
                </span>
                <InfoTooltip content={card.tooltip} />
              </div>
              <span
                className={`text-xl font-bold tracking-tight ${card.valueColor ?? 'text-text-primary'}`}
              >
                {card.value}
              </span>
              <span className="text-xs text-text-tertiary">{card.detail}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
