import type { StoreOperationalStatus } from '@/services/types/metrics';

// ── Per-store detail types ──

export interface DailyGmv {
  date: string;
  label: string;
  gmv: number;
  transactions: number;
}

export interface ReconciliationDay {
  date: string;
  label: string;
  status: 'balanced' | 'unbalanced' | 'not_closed';
  declared_cash: number;
  recorded_sales: number;
  difference: number;
}

export interface InventoryBreakdown {
  type: 'stock_in' | 'stock_out' | 'adjustment' | 'transfer';
  label: string;
  count: number;
  percentage: number;
}

export interface DecisionAction {
  id: string;
  timestamp: string;
  type: 'price_change' | 'stock_adjustment' | 'inventory_count' | 'purchase_order';
  description: string;
  details: string;
  performed_by: string;
}

export interface SyncEvent {
  id: string;
  timestamp: string;
  event_type: 'transaction' | 'inventory';
  status: 'success' | 'retried' | 'failed';
  description: string;
  resolution?: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  category: 'sale' | 'inventory' | 'reconciliation' | 'decision' | 'sync' | 'failure';
  title: string;
  description: string;
}

export interface StoreDetail {
  store: StoreOperationalStatus;
  daily_gmv: DailyGmv[];
  reconciliation_history: ReconciliationDay[];
  inventory_breakdown: InventoryBreakdown[];
  recent_inventory_events: { date: string; label: string; count: number }[];
  decision_actions: DecisionAction[];
  sync_events: SyncEvent[];
  activity_timeline: ActivityItem[];
  summary: {
    avg_daily_gmv: number;
    peak_day_gmv: number;
    peak_day_label: string;
    total_transactions_7d: number;
    avg_transactions_per_day: number;
    days_since_last_inventory: number;
    reconciliation_streak: number;
    total_sync_events_7d: number;
    sync_success_rate: number;
  };
}

// ── Generate 30 days of daily GMV ──

function generateDailyGmv(baseGmv: number): DailyGmv[] {
  const days: DailyGmv[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const variance = 0.6 + Math.random() * 0.8;
    const dailyGmv = Math.round((baseGmv / 7) * variance);
    const transactions = Math.round(dailyGmv / 4500 + Math.random() * 20);
    days.push({
      date: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }),
      gmv: dailyGmv,
      transactions,
    });
  }
  return days;
}

// ── Generate reconciliation history (last 30 days) ──

function generateReconciliationHistory(rate: number): ReconciliationDay[] {
  const days: ReconciliationDay[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const dayOfWeek = date.getDay();
    // Skip Sundays (store closed)
    if (dayOfWeek === 0) {
      days.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-NG', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        status: 'not_closed',
        declared_cash: 0,
        recorded_sales: 0,
        difference: 0,
      });
      continue;
    }

    const isBalanced = Math.random() * 100 < rate;
    const sales = 300_000 + Math.round(Math.random() * 200_000);
    const diff = isBalanced
      ? Math.round((Math.random() - 0.5) * 400)
      : Math.round((Math.random() - 0.5) * 8000);

    days.push({
      date: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' }),
      status: isBalanced ? 'balanced' : 'unbalanced',
      declared_cash: sales + diff,
      recorded_sales: sales,
      difference: diff,
    });
  }
  return days;
}

// ── Generate inventory breakdown ──

function generateInventoryBreakdown(totalEvents: number): InventoryBreakdown[] {
  const stockIn = Math.round(totalEvents * 0.35);
  const stockOut = Math.round(totalEvents * 0.3);
  const adjustment = Math.round(totalEvents * 0.2);
  const transfer = totalEvents - stockIn - stockOut - adjustment;

  return [
    {
      type: 'stock_in',
      label: 'Stock In',
      count: stockIn,
      percentage: Math.round((stockIn / totalEvents) * 100),
    },
    {
      type: 'stock_out',
      label: 'Stock Out',
      count: stockOut,
      percentage: Math.round((stockOut / totalEvents) * 100),
    },
    {
      type: 'adjustment',
      label: 'Adjustment',
      count: adjustment,
      percentage: Math.round((adjustment / totalEvents) * 100),
    },
    {
      type: 'transfer',
      label: 'Transfer',
      count: transfer,
      percentage: Math.round((transfer / totalEvents) * 100),
    },
  ];
}

// ── Generate daily inventory events (last 14 days) ──

function generateRecentInventoryEvents(
  totalEvents: number
): { date: string; label: string; count: number }[] {
  const days: { date: string; label: string; count: number }[] = [];
  const now = new Date();
  const avgPerDay = totalEvents / 7;
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }),
      count: Math.max(0, Math.round(avgPerDay * (0.3 + Math.random() * 1.4))),
    });
  }
  return days;
}

// ── Generate decision actions ──

function generateDecisionActions(count: number): DecisionAction[] {
  if (count === 0) return [];

  const types: DecisionAction['type'][] = [
    'price_change',
    'stock_adjustment',
    'inventory_count',
    'purchase_order',
  ];
  const typeLabels: Record<DecisionAction['type'], string> = {
    price_change: 'Price Change',
    stock_adjustment: 'Stock Adjustment',
    inventory_count: 'Inventory Count',
    purchase_order: 'Purchase Order',
  };
  const typeDescriptions: Record<DecisionAction['type'], string[]> = {
    price_change: [
      'Updated price for "Peak Milk Tin 400g" from ₦850 to ₦900',
      'Bulk price update: 12 items in "Beverages" category',
      'Marked down "Indomie Chicken 70g" by 5% for clearance',
      'Increased price of "Golden Penny Spaghetti 500g" to ₦650',
    ],
    stock_adjustment: [
      'Adjusted "Dano Milk 400g" quantity: -3 units (damaged goods)',
      'Corrected stock count for "Milo 500g": 24 → 22 units',
      'Wrote off 5 units of "Power Oil 3.5L" (expired)',
      'Added 10 units of "Maggi Star" (found in storage)',
    ],
    inventory_count: [
      'Full inventory count completed: 342 SKUs verified',
      'Partial count: "Beverages" section — 89 items counted',
      'Spot check: "Canned Goods" aisle — 3 discrepancies found',
      'Weekly cycle count completed: 98.5% accuracy',
    ],
    purchase_order: [
      'PO #2847 submitted to "Dangote Distributors" — ₦450,000',
      'PO #2848 to "Chi Limited" for 200 units assorted drinks',
      'Emergency restock order: "Golden Penny Flour 2kg" × 50',
      'Monthly standing order renewed with "Nestle Nigeria"',
    ],
  };

  const actions: DecisionAction[] = [];
  const now = new Date();
  for (let i = 0; i < Math.min(count * 2, 8); i++) {
    const type = types[i % types.length];
    const descriptions = typeDescriptions[type];
    const hoursAgo = Math.round(Math.random() * 168);
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);

    actions.push({
      id: `da-${i}`,
      timestamp: timestamp.toISOString(),
      type,
      description: typeLabels[type],
      details: descriptions[i % descriptions.length],
      performed_by: 'Store Manager',
    });
  }

  return actions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ── Generate sync events ──

function generateSyncEvents(syncRate: number): SyncEvent[] {
  const events: SyncEvent[] = [];
  const now = new Date();

  for (let i = 0; i < 20; i++) {
    const hoursAgo = Math.random() * 168;
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    const roll = Math.random() * 100;
    const isTransaction = Math.random() > 0.4;

    let status: SyncEvent['status'];
    let description: string;
    let resolution: string | undefined;

    if (roll < syncRate - 1) {
      status = 'success';
      description = isTransaction
        ? `Transaction #${Math.floor(1000 + Math.random() * 9000)} synced`
        : `Inventory event synced (${['stock_in', 'stock_out', 'adjustment'][Math.floor(Math.random() * 3)]})`;
    } else if (roll < syncRate) {
      status = 'retried';
      description = isTransaction
        ? `Transaction #${Math.floor(1000 + Math.random() * 9000)} sync failed, retrying`
        : 'Inventory update failed on first attempt';
      resolution = 'Resolved after 2 retry attempts';
    } else {
      status = 'failed';
      description = isTransaction
        ? `Transaction #${Math.floor(1000 + Math.random() * 9000)} — conflict detected`
        : 'Inventory adjustment rejected — stale data';
      resolution = 'Flagged as unrecoverable conflict — manual review required';
    }

    events.push({
      id: `sync-${i}`,
      timestamp: timestamp.toISOString(),
      event_type: isTransaction ? 'transaction' : 'inventory',
      status,
      description,
      resolution,
    });
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ── Generate activity timeline ──

function generateActivityTimeline(store: StoreOperationalStatus): ActivityItem[] {
  const items: ActivityItem[] = [];
  const now = new Date();

  // Sales activities
  for (let i = 0; i < 6; i++) {
    const hoursAgo = Math.random() * 72;
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    const amount = Math.round(2000 + Math.random() * 15000);
    items.push({
      id: `act-sale-${i}`,
      timestamp: timestamp.toISOString(),
      category: 'sale',
      title: 'Sale completed',
      description: `₦${amount.toLocaleString()} — ${Math.ceil(Math.random() * 8)} items`,
    });
  }

  // Inventory activities
  if (store.has_inventory_events) {
    for (let i = 0; i < 4; i++) {
      const hoursAgo = Math.random() * 96;
      const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      const types = [
        'Stock received: 24 units of "Peak Milk 400g"',
        'Stock out: 6 units of "Milo 500g" sold',
        'Adjustment: corrected count for "Maggi Star"',
        'Transfer: 12 units moved to storage',
      ];
      items.push({
        id: `act-inv-${i}`,
        timestamp: timestamp.toISOString(),
        category: 'inventory',
        title: 'Inventory event',
        description: types[i % types.length],
      });
    }
  }

  // Reconciliation activities
  if (store.has_closed_trading_day) {
    for (let i = 0; i < 3; i++) {
      const daysAgo = i + 1;
      const timestamp = new Date(now);
      timestamp.setDate(timestamp.getDate() - daysAgo);
      timestamp.setHours(21, 30, 0);
      const balanced = Math.random() * 100 < store.reconciliation_rate;
      items.push({
        id: `act-recon-${i}`,
        timestamp: timestamp.toISOString(),
        category: 'reconciliation',
        title: balanced ? 'Day closed — balanced' : 'Day closed — unbalanced',
        description: balanced
          ? 'Cash declared matches recorded sales within tolerance'
          : `₦${Math.round(Math.random() * 5000).toLocaleString()} discrepancy between cash and sales`,
      });
    }
  }

  // Decision activities
  if (store.decision_actions_count > 0) {
    const hoursAgo = Math.random() * 48;
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    items.push({
      id: 'act-decision-1',
      timestamp: timestamp.toISOString(),
      category: 'decision',
      title: 'Business decision made',
      description: `${store.decision_actions_count} decision action${store.decision_actions_count > 1 ? 's' : ''} this week`,
    });
  }

  // Sync events
  items.push({
    id: 'act-sync-1',
    timestamp: new Date(now.getTime() - Math.random() * 3600000).toISOString(),
    category: 'sync',
    title: 'Data sync completed',
    description: `${store.sync_reliability_rate}% reliability — all recent events synced`,
  });

  // Failure events
  if (!store.has_zero_critical_failures) {
    const hoursAgo = 24 + Math.random() * 120;
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    items.push({
      id: 'act-failure-1',
      timestamp: timestamp.toISOString(),
      category: 'failure',
      title: 'Critical failure detected',
      description: 'Unresolvable sync conflict — 1 transaction could not be reconciled with server',
    });
  }

  return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ── Main function: get store detail ──

export function getMockStoreDetail(store: StoreOperationalStatus): StoreDetail {
  const dailyGmv = generateDailyGmv(store.gmv);
  const totalTransactions = dailyGmv.slice(-7).reduce((sum, d) => sum + d.transactions, 0);
  const last7dGmv = dailyGmv.slice(-7);
  const peakDay = last7dGmv.reduce((max, d) => (d.gmv > max.gmv ? d : max), last7dGmv[0]);

  const lastInventoryDate = store.last_inventory_event_date
    ? Math.ceil(
        (Date.now() - new Date(store.last_inventory_event_date).getTime()) / (1000 * 60 * 60 * 24)
      )
    : 999;

  const reconHistory = generateReconciliationHistory(store.reconciliation_rate);
  const closedDays = reconHistory.filter(d => d.status !== 'not_closed');
  const balancedStreak = (() => {
    let streak = 0;
    for (let i = closedDays.length - 1; i >= 0; i--) {
      if (closedDays[i].status === 'balanced') streak++;
      else break;
    }
    return streak;
  })();

  const syncEvents = generateSyncEvents(store.sync_reliability_rate);
  const syncSuccessCount = syncEvents.filter(e => e.status === 'success').length;

  return {
    store,
    daily_gmv: dailyGmv,
    reconciliation_history: reconHistory,
    inventory_breakdown: generateInventoryBreakdown(store.inventory_events_count || 1),
    recent_inventory_events: generateRecentInventoryEvents(store.inventory_events_count),
    decision_actions: generateDecisionActions(store.decision_actions_count),
    sync_events: syncEvents,
    activity_timeline: generateActivityTimeline(store),
    summary: {
      avg_daily_gmv: Math.round(store.gmv / 7),
      peak_day_gmv: peakDay.gmv,
      peak_day_label: peakDay.label,
      total_transactions_7d: totalTransactions,
      avg_transactions_per_day: Math.round(totalTransactions / 7),
      days_since_last_inventory: lastInventoryDate,
      reconciliation_streak: balancedStreak,
      total_sync_events_7d: syncEvents.length,
      sync_success_rate: Math.round((syncSuccessCount / syncEvents.length) * 100),
    },
  };
}
