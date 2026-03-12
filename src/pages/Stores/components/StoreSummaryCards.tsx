import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import {
  Store,
  ShieldCheck,
  AlertTriangle,
  Banknote,
  ArrowRightLeft,
  ClipboardCheck,
} from 'lucide-react';
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
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  tooltip: string;
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

    return [
      {
        label: 'Total Stores',
        value: `${total}`,
        detail: `Across all locations`,
        icon: Store,
        iconColor: 'text-brand-600',
        iconBg: 'bg-bg-brand-secondary',
        tooltip: 'Total number of stores connected to the RetailStack platform.',
      },
      {
        label: 'Fully Operational',
        value: `${healthy}/${total}`,
        detail: `${Math.round((healthy / total) * 100)}% of stores`,
        icon: ShieldCheck,
        iconColor: 'text-success-600',
        iconBg: 'bg-success-50',
        tooltip:
          'Stores meeting all 4 criteria in the last 7 days: processed sales, recorded inventory, closed trading days, and zero critical failures.',
      },
      {
        label: 'Needs Attention',
        value: `${attention}`,
        detail:
          attention === 0
            ? 'All stores healthy'
            : `${attention} store${attention > 1 ? 's' : ''} failing criteria`,
        icon: AlertTriangle,
        iconColor: attention > 0 ? 'text-warning-600' : 'text-success-600',
        iconBg: attention > 0 ? 'bg-warning-50' : 'bg-success-50',
        tooltip:
          'Stores that are missing at least one operational criteria. These need investigation.',
      },
      {
        label: 'Combined GMV',
        value: formatCurrency(totalGmv),
        detail: `Avg ${formatCurrency(Math.round(totalGmv / total))}/store`,
        icon: Banknote,
        iconColor: 'text-green-600',
        iconBg: 'bg-green-50',
        tooltip:
          'Total Gross Merchandise Value processed across all stores in the rolling 7-day window.',
      },
      {
        label: 'Avg Reconciliation',
        value: `${avgReconciliation}%`,
        detail: `${mockStores.filter(s => s.reconciliation_rate < 85).length} below 85% threshold`,
        icon: ArrowRightLeft,
        iconColor: avgReconciliation >= 85 ? 'text-blue-600' : 'text-warning-600',
        iconBg: avgReconciliation >= 85 ? 'bg-blue-50' : 'bg-warning-50',
        tooltip:
          'Average reconciliation rate across all stores. Stores below 85% are flagged as needing attention.',
      },
      {
        label: 'Stores with Decisions',
        value: `${storesWithDecisions}/${total}`,
        detail: `${Math.round((storesWithDecisions / total) * 100)}% engagement`,
        icon: ClipboardCheck,
        iconColor: 'text-purple-600',
        iconBg: 'bg-purple-50',
        tooltip:
          'Stores where owners made business decisions (price changes, stock adjustments, inventory counts, or purchase orders) in the last 7 days. This is the strongest engagement signal.',
      },
    ];
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="transition-shadow duration-200 hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-text-tertiary">{card.label}</span>
                    <InfoTooltip content={card.tooltip} />
                  </div>
                  <div
                    className={`flex size-7 items-center justify-center rounded-lg ${card.iconBg}`}
                  >
                    <Icon className={`size-3.5 ${card.iconColor}`} />
                  </div>
                </div>
                <span className="text-xl font-bold tracking-tight text-text-primary">
                  {card.value}
                </span>
                <span className="text-xs text-text-tertiary">{card.detail}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
