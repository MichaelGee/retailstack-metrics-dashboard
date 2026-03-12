import { useMemo } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { X, MapPin, Store, Calendar } from 'lucide-react';
import type { StoreOperationalStatus } from '@/services/types/metrics';
import { getMockStoreDetail } from '@/services/mock/store-detail-data';
import { OperationalStatus } from './OperationalStatus';
import { KeyMetrics } from './KeyMetrics';
import { GmvChart } from './GmvChart';
import { ReconciliationHistory } from './ReconciliationHistory';
import { InventorySection } from './InventorySection';
import { DecisionActionsLog } from './DecisionActionsLog';
import { SyncEventsLog } from './SyncEventsLog';
import { ActivityTimeline } from './ActivityTimeline';
import { StoreInfo } from './StoreInfo';

interface StoreDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  store: StoreOperationalStatus | null;
}

export function StoreDetailDrawer({ isOpen, onClose, store }: StoreDetailDrawerProps) {
  const detail = useMemo(() => {
    if (!store) return null;
    return getMockStoreDetail(store);
  }, [store]);

  if (!store || !detail) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="ml-auto flex h-full w-[60rem] min-w-[60rem] max-w-[60rem] flex-col rounded-l-lg">
        {/* Close button */}
        <DrawerClose asChild>
          <Button variant="tertiaryGray" iconOnly className="absolute right-4 top-4 z-10 size-8">
            <X className="size-4" />
          </Button>
        </DrawerClose>

        {/* Header */}
        <DrawerHeader className="shrink-0 border-b border-border-secondary pr-16">
          <div className="flex items-center gap-3">
            <Card className="flex size-10 items-center justify-center rounded-lg">
              <Store className="size-5 text-text-primary" />
            </Card>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <DrawerTitle>{store.store_name}</DrawerTitle>
                {store.is_fully_operational ? (
                  <Badge variant="positive">Healthy</Badge>
                ) : (
                  <Badge variant="warning">Needs Attention</Badge>
                )}
              </div>
              <DrawerDescription className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {store.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  Since{' '}
                  {new Date(store.created_at).toLocaleDateString('en-NG', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        {/* Scrollable content with tabs */}
        <ScrollArea className="flex-1">
          <Tabs defaultValue="overview" className="flex h-full flex-col">
            <div className="sticky top-0 z-20 shrink-0 border-b border-border-secondary bg-bg-primary px-6 py-4">
              <TabsList className="h-auto w-fit rounded-lg border bg-transparent p-0">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="reliability">Reliability</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 p-6 pb-12">
              {/* Tab: Overview */}
              <TabsContent value="overview" className="mt-0">
                <div className="flex flex-col gap-5">
                  {/* Store information */}
                  <StoreInfo store={store} />

                  {/* Key metrics grid */}
                  <KeyMetrics detail={detail} />

                  {/* Operational criteria */}
                  <OperationalStatus
                    store={store}
                    daysSinceLastInventory={detail.summary.days_since_last_inventory}
                  />

                  {/* Activity timeline */}
                  <ActivityTimeline items={detail.activity_timeline} />
                </div>
              </TabsContent>

              {/* Tab: Financials */}
              <TabsContent value="financials" className="mt-0">
                <div className="flex flex-col gap-5">
                  <KeyMetrics detail={detail} />
                  <GmvChart data={detail.daily_gmv} />
                  <ReconciliationHistory
                    data={detail.reconciliation_history}
                    rate={store.reconciliation_rate}
                  />
                </div>
              </TabsContent>

              {/* Tab: Inventory */}
              <TabsContent value="inventory" className="mt-0">
                <div className="flex flex-col gap-5">
                  <InventorySection
                    breakdown={detail.inventory_breakdown}
                    recentEvents={detail.recent_inventory_events}
                    totalEvents={store.inventory_events_count}
                  />
                  <DecisionActionsLog actions={detail.decision_actions} />
                </div>
              </TabsContent>

              {/* Tab: Reliability */}
              <TabsContent value="reliability" className="mt-0">
                <div className="flex flex-col gap-5">
                  <SyncEventsLog
                    events={detail.sync_events}
                    syncRate={store.sync_reliability_rate}
                  />
                  <ReconciliationHistory
                    data={detail.reconciliation_history}
                    rate={store.reconciliation_rate}
                  />
                </div>
              </TabsContent>

              {/* Tab: Activity */}
              <TabsContent value="activity" className="mt-0">
                <div className="flex flex-col gap-5">
                  <ActivityTimeline items={detail.activity_timeline} />
                  <DecisionActionsLog actions={detail.decision_actions} />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
