import { useState, useMemo } from 'react';
import PageHelmet from '@/common/PageHelmet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { GenericTable } from '@/components/organisms/GenericTable';
import { columns } from './components/columns';
import { StoreDetailDrawer } from './components/StoreDetailDrawer';
import { StoreSummaryCards } from './components/StoreSummaryCards';
import { mockStores } from '@/services/mock/metrics-data';
import type { StoreOperationalStatus } from '@/services/types/metrics';

type StoreFilter = 'all' | 'healthy' | 'attention';

const Stores = () => {
  const [filter, setFilter] = useState<StoreFilter>('all');
  const [selectedStore, setSelectedStore] = useState<StoreOperationalStatus | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const healthyCount = mockStores.filter(s => s.is_fully_operational).length;
  const attentionCount = mockStores.length - healthyCount;

  // Sort: failing stores first, then apply filter
  const filteredStores = useMemo(() => {
    const filtered = mockStores.filter(store => {
      if (filter === 'healthy') return store.is_fully_operational;
      if (filter === 'attention') return !store.is_fully_operational;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (a.is_fully_operational === b.is_fully_operational) return 0;
      return a.is_fully_operational ? 1 : -1;
    });
  }, [filter]);

  const handleRowClick = (store: StoreOperationalStatus) => {
    setSelectedStore(store);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <PageHelmet title="Stores — RetailStack Metrics" description="Store health breakdown" />
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-text-primary">Stores</h1>
              <InfoTooltip content="A store is 'Fully Operational' only if all four conditions are met in the last 7 days: processed sales, recorded inventory movements, closed at least one trading day, and had zero critical system failures." />
            </div>
            <p className="text-sm text-text-tertiary">
              Per-store operational health breakdown. Stores needing attention are shown first.
            </p>
          </div>
          <Select value={filter} onValueChange={v => setFilter(v as StoreFilter)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores ({mockStores.length})</SelectItem>
              <SelectItem value="healthy">Healthy ({healthyCount})</SelectItem>
              <SelectItem value="attention">Needs Attention ({attentionCount})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary cards */}
        <StoreSummaryCards />

        {/* Helper text */}
        <p className="text-xs text-text-quaternary">
          Click a row to see full store details. Click column headers to sort. Reconciliation below
          85% and sync below 99% are flagged.
        </p>

        {/* GenericTable */}
        <GenericTable
          data={filteredStores}
          columns={columns}
          showPagination={false}
          onRowClick={handleRowClick}
          emptyState={
            <div className="text-center">
              <h2 className="text-lg font-semibold text-text-primary">No stores found</h2>
              <p className="text-sm text-text-tertiary">
                No stores match the current filter criteria.
              </p>
            </div>
          }
        />
      </div>

      {/* Store detail drawer */}
      <StoreDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        store={selectedStore}
      />
    </>
  );
};

export default Stores;
