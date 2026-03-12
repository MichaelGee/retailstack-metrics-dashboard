import type {
  OverviewMetrics,
  StoreOperationalStatus,
  SystemHealthData,
  SyncTimelinePoint,
  PeriodFilter,
} from '@/services/types/metrics';

// ── Store-level mock data (matches spec examples) ──

export const mockStores: StoreOperationalStatus[] = [
  {
    store_id: 's1',
    store_name: 'Store A — Ikeja Branch',
    location: 'Ikeja, Lagos',
    has_sales: true,
    has_inventory_events: true,
    has_closed_trading_day: true,
    has_zero_critical_failures: true,
    is_fully_operational: true,
    gmv: 2_800_000,
    reconciliation_rate: 96,
    sync_reliability_rate: 99.9,
    decision_actions_count: 2,
    last_inventory_event_date: '2026-03-11',
    inventory_events_count: 145,
    created_at: '2025-06-15',
    owner_name: 'Adebayo Ogundimu',
    owner_phone: '+234 803 456 7890',
    store_type: 'supermarket',
    total_skus: 1_420,
    pos_terminals: 3,
    staff_count: 12,
    subscription_plan: 'enterprise',
  },
  {
    store_id: 's2',
    store_name: 'Store B — Lekki Branch',
    location: 'Lekki, Lagos',
    has_sales: true,
    has_inventory_events: false,
    has_closed_trading_day: true,
    has_zero_critical_failures: true,
    is_fully_operational: false,
    gmv: 1_200_000,
    reconciliation_rate: 78,
    sync_reliability_rate: 99.8,
    decision_actions_count: 0,
    last_inventory_event_date: '2026-02-28',
    inventory_events_count: 0,
    created_at: '2025-09-22',
    owner_name: 'Chioma Nwosu',
    owner_phone: '+234 810 234 5678',
    store_type: 'mini_mart',
    total_skus: 580,
    pos_terminals: 1,
    staff_count: 4,
    subscription_plan: 'starter',
  },
  {
    store_id: 's3',
    store_name: 'Store C — Victoria Island',
    location: 'VI, Lagos',
    has_sales: true,
    has_inventory_events: true,
    has_closed_trading_day: true,
    has_zero_critical_failures: false,
    is_fully_operational: false,
    gmv: 1_950_000,
    reconciliation_rate: 74,
    sync_reliability_rate: 98.5,
    decision_actions_count: 0,
    last_inventory_event_date: '2026-03-10',
    inventory_events_count: 98,
    created_at: '2025-08-03',
    owner_name: 'Emeka Achebe',
    owner_phone: '+234 705 678 1234',
    store_type: 'supermarket',
    total_skus: 920,
    pos_terminals: 2,
    staff_count: 8,
    subscription_plan: 'growth',
  },
  {
    store_id: 's4',
    store_name: 'Store D — Surulere Branch',
    location: 'Surulere, Lagos',
    has_sales: true,
    has_inventory_events: true,
    has_closed_trading_day: true,
    has_zero_critical_failures: true,
    is_fully_operational: true,
    gmv: 2_100_000,
    reconciliation_rate: 94,
    sync_reliability_rate: 99.9,
    decision_actions_count: 3,
    last_inventory_event_date: '2026-03-12',
    inventory_events_count: 156,
    created_at: '2025-05-10',
    owner_name: 'Folake Adeyemi',
    owner_phone: '+234 812 345 6789',
    store_type: 'supermarket',
    total_skus: 1_180,
    pos_terminals: 2,
    staff_count: 10,
    subscription_plan: 'enterprise',
  },
  {
    store_id: 's5',
    store_name: 'Store E — Yaba Branch',
    location: 'Yaba, Lagos',
    has_sales: true,
    has_inventory_events: true,
    has_closed_trading_day: true,
    has_zero_critical_failures: true,
    is_fully_operational: true,
    gmv: 1_850_000,
    reconciliation_rate: 92,
    sync_reliability_rate: 99.7,
    decision_actions_count: 1,
    last_inventory_event_date: '2026-03-11',
    inventory_events_count: 122,
    created_at: '2025-07-28',
    owner_name: 'Ibrahim Musa',
    owner_phone: '+234 806 789 0123',
    store_type: 'mini_mart',
    total_skus: 740,
    pos_terminals: 2,
    staff_count: 6,
    subscription_plan: 'growth',
  },
  {
    store_id: 's6',
    store_name: 'Store F — Apapa Branch',
    location: 'Apapa, Lagos',
    has_sales: true,
    has_inventory_events: true,
    has_closed_trading_day: true,
    has_zero_critical_failures: true,
    is_fully_operational: true,
    gmv: 1_600_000,
    reconciliation_rate: 88,
    sync_reliability_rate: 99.6,
    decision_actions_count: 0,
    last_inventory_event_date: '2026-03-09',
    inventory_events_count: 110,
    created_at: '2025-10-14',
    owner_name: 'Grace Okafor',
    owner_phone: '+234 814 567 8901',
    store_type: 'wholesale',
    total_skus: 320,
    pos_terminals: 1,
    staff_count: 5,
    subscription_plan: 'growth',
  },
  {
    store_id: 's7',
    store_name: 'Store G — Ajah Branch',
    location: 'Ajah, Lagos',
    has_sales: true,
    has_inventory_events: true,
    has_closed_trading_day: true,
    has_zero_critical_failures: true,
    is_fully_operational: true,
    gmv: 1_500_000,
    reconciliation_rate: 91,
    sync_reliability_rate: 99.8,
    decision_actions_count: 0,
    last_inventory_event_date: '2026-03-10',
    inventory_events_count: 130,
    created_at: '2025-11-02',
    owner_name: 'Tunde Bakare',
    owner_phone: '+234 808 901 2345',
    store_type: 'kiosk',
    total_skus: 210,
    pos_terminals: 1,
    staff_count: 2,
    subscription_plan: 'starter',
  },
  {
    store_id: 's8',
    store_name: 'Store H — Festac Branch',
    location: 'Festac, Lagos',
    has_sales: true,
    has_inventory_events: true,
    has_closed_trading_day: true,
    has_zero_critical_failures: true,
    is_fully_operational: true,
    gmv: 1_500_000,
    reconciliation_rate: 89,
    sync_reliability_rate: 99.9,
    decision_actions_count: 0,
    last_inventory_event_date: '2026-03-11',
    inventory_events_count: 129,
    created_at: '2025-12-01',
    owner_name: 'Ngozi Eze',
    owner_phone: '+234 816 012 3456',
    store_type: 'mini_mart',
    total_skus: 650,
    pos_terminals: 1,
    staff_count: 3,
    subscription_plan: 'starter',
  },
];

// ── Aggregated overview metrics ──

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getMockOverviewMetrics(period: PeriodFilter): OverviewMetrics {
  const operationalStores = mockStores.filter(s => s.is_fully_operational);
  const totalGmv = mockStores.reduce((sum, s) => sum + s.gmv, 0);
  const totalInventoryEvents = mockStores.reduce((sum, s) => sum + s.inventory_events_count, 0);

  return {
    north_star: {
      fully_operational_stores: operationalStores.length,
      total_stores: mockStores.length,
      operational_rate: Math.round((operationalStores.length / mockStores.length) * 100),
      change_vs_last_period: 2,
      criteria_breakdown: {
        sales: {
          passing: mockStores.filter(s => s.has_sales).length,
          total: mockStores.length,
        },
        inventory: {
          passing: mockStores.filter(s => s.has_inventory_events).length,
          total: mockStores.length,
        },
        day_close: {
          passing: mockStores.filter(s => s.has_closed_trading_day).length,
          total: mockStores.length,
        },
        no_failures: {
          passing: mockStores.filter(s => s.has_zero_critical_failures).length,
          total: mockStores.length,
        },
      },
    },
    economic: {
      total_gmv: totalGmv,
      gmv_change_pct: 12,
      revenue_at_1pct: totalGmv * 0.01,
      gmv_per_operational_store: Math.round(totalGmv / operationalStores.length),
      gmv_per_store_change_pct: 5,
    },
    depth: {
      inventory_events_per_1m_gmv:
        Math.round((totalInventoryEvents / totalGmv) * 1_000_000 * 10) / 10,
      inventory_events_trend: 'rising',
      total_inventory_events: totalInventoryEvents,
      weekly_stores_with_decisions: mockStores.filter(s => s.decision_actions_count > 0).length,
      total_stores: mockStores.length,
      decision_rate: Math.round(
        (mockStores.filter(s => s.decision_actions_count > 0).length / mockStores.length) * 100
      ),
    },
    trust: {
      reconciliation_completion_rate: 90,
      balanced_closed_days: 162,
      total_closed_days: 180,
      reconciliation_threshold: 85,
      stores_below_threshold: mockStores.filter(s => s.reconciliation_rate < 85).length,
      sync_reliability_rate: 99.7,
      successfully_synced: 4079,
      total_events_attempted: 4090,
      resolved_via_retry: 28,
      unrecoverable_conflicts: 11,
      sync_threshold: 99,
      sync_incident_threshold: 98,
      last_updated: new Date().toISOString(),
    },
    trends: generateTrendData(),
  };
}

function generateTrendData() {
  const weeks = [
    { label: 'Jan 20', gmv: 10_200_000, op: 4, total: 7 },
    { label: 'Jan 27', gmv: 11_000_000, op: 5, total: 7 },
    { label: 'Feb 3', gmv: 11_800_000, op: 5, total: 8 },
    { label: 'Feb 10', gmv: 12_300_000, op: 5, total: 8 },
    { label: 'Feb 17', gmv: 12_900_000, op: 4, total: 8 },
    { label: 'Feb 24', gmv: 13_100_000, op: 5, total: 8 },
    { label: 'Mar 3', gmv: 13_800_000, op: 5, total: 8 },
    { label: 'Mar 10', gmv: 14_500_000, op: 6, total: 8 },
  ];

  return weeks.map(w => ({
    date: `2026-${w.label.replace(/\s/g, '-')}`,
    label: w.label,
    gmv: w.gmv,
    operational_stores: w.op,
    total_stores: w.total,
  }));
}

// ── Sync timeline (hourly for last 24h) ──

function generateSyncTimeline(): SyncTimelinePoint[] {
  const points: SyncTimelinePoint[] = [];
  for (let i = 23; i >= 0; i--) {
    const hour = new Date();
    hour.setHours(hour.getHours() - i);
    const total = 150 + Math.floor(Math.random() * 50);
    const failureRate = Math.random() * 0.008;
    const failed = Math.floor(total * failureRate);
    points.push({
      hour: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      rate: Math.round(((total - failed) / total) * 10000) / 100,
      events_total: total,
      events_failed: failed,
    });
  }
  return points;
}

export function getMockSystemHealth(): SystemHealthData {
  return {
    sync_reliability: {
      reconciliation_completion_rate: 90,
      balanced_closed_days: 162,
      total_closed_days: 180,
      reconciliation_threshold: 85,
      stores_below_threshold: mockStores.filter(s => s.reconciliation_rate < 85).length,
      sync_reliability_rate: 99.7,
      successfully_synced: 4079,
      total_events_attempted: 4090,
      resolved_via_retry: 28,
      unrecoverable_conflicts: 11,
      sync_threshold: 99,
      sync_incident_threshold: 98,
      last_updated: new Date().toISOString(),
    },
    sync_timeline: generateSyncTimeline(),
    critical_failures: [],
    reconciliation_by_store: mockStores
      .map(s => ({
        store_id: s.store_id,
        store_name: s.store_name,
        rate: s.reconciliation_rate,
        balanced_days: Math.round((s.reconciliation_rate / 100) * 22),
        total_days: 22,
        below_threshold: s.reconciliation_rate < 85,
      }))
      .sort((a, b) => b.rate - a.rate),
  };
}
