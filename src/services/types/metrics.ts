// ── Metric types for the RetailStack Metrics Framework ──

export interface StoreOperationalStatus {
  store_id: string;
  store_name: string;
  location: string;
  has_sales: boolean;
  has_inventory_events: boolean;
  has_closed_trading_day: boolean;
  has_zero_critical_failures: boolean;
  is_fully_operational: boolean;
  gmv: number;
  reconciliation_rate: number;
  sync_reliability_rate: number;
  decision_actions_count: number;
  last_inventory_event_date: string | null;
  inventory_events_count: number;
  // Store metadata
  created_at: string;
  owner_name: string;
  owner_phone: string;
  store_type: 'supermarket' | 'mini_mart' | 'kiosk' | 'wholesale';
  total_skus: number;
  pos_terminals: number;
  staff_count: number;
  subscription_plan: 'starter' | 'growth' | 'enterprise';
}

export interface NorthStarMetric {
  fully_operational_stores: number;
  total_stores: number;
  operational_rate: number;
  change_vs_last_period: number;
  criteria_breakdown: {
    sales: { passing: number; total: number };
    inventory: { passing: number; total: number };
    day_close: { passing: number; total: number };
    no_failures: { passing: number; total: number };
  };
}

export interface EconomicMetrics {
  total_gmv: number;
  gmv_change_pct: number;
  revenue_at_1pct: number;
  gmv_per_operational_store: number;
  gmv_per_store_change_pct: number;
}

export interface DepthMetrics {
  inventory_events_per_1m_gmv: number;
  inventory_events_trend: 'rising' | 'flat' | 'declining';
  total_inventory_events: number;
  weekly_stores_with_decisions: number;
  total_stores: number;
  decision_rate: number;
}

export interface TrustMetrics {
  reconciliation_completion_rate: number;
  balanced_closed_days: number;
  total_closed_days: number;
  reconciliation_threshold: number;
  stores_below_threshold: number;
  sync_reliability_rate: number;
  successfully_synced: number;
  total_events_attempted: number;
  resolved_via_retry: number;
  unrecoverable_conflicts: number;
  sync_threshold: number;
  sync_incident_threshold: number;
  last_updated: string;
}

export interface TrendDataPoint {
  date: string;
  label: string;
  gmv: number;
  operational_stores: number;
  total_stores: number;
}

export interface SyncTimelinePoint {
  hour: string;
  rate: number;
  events_total: number;
  events_failed: number;
}

export interface CriticalFailure {
  id: string;
  timestamp: string;
  store_id: string;
  store_name: string;
  failure_type: 'data_loss' | 'app_crash' | 'unresolvable_sync';
  status: 'resolved' | 'investigating' | 'open';
  description: string;
}

export interface ReconciliationByStore {
  store_id: string;
  store_name: string;
  rate: number;
  balanced_days: number;
  total_days: number;
  below_threshold: boolean;
}

export interface BusinessGrowthMetrics {
  stores_current: number;
  stores_target: number;
  target_deadline_days: number;
  new_stores_7d: number;
  new_stores_change: number;
  pipeline_count: number;
  live_count: number;
  rs_revenue_7d: number;
  rs_revenue_change_pct: number;
  mrr_estimate: number;
  retention_4wk: number;
  churn_risk_count: number;
  sticky_4wk_plus: number;
}

export interface RetentionMetrics {
  active_stores_7d: number;
  total_stores: number;
  avg_time_to_operational_days: number;
  prev_cohort_days: number;
  churn_risk_stores: number;
  churn_risk_reason: string;
}

export interface OverviewMetrics {
  north_star: NorthStarMetric;
  economic: EconomicMetrics;
  depth: DepthMetrics;
  trust: TrustMetrics;
  trends: TrendDataPoint[];
  business_growth: BusinessGrowthMetrics;
  retention: RetentionMetrics;
}

export interface SystemHealthData {
  sync_reliability: TrustMetrics;
  sync_timeline: SyncTimelinePoint[];
  critical_failures: CriticalFailure[];
  reconciliation_by_store: ReconciliationByStore[];
}

export type PeriodFilter = '7d' | '14d' | '30d';
