import { useState, useEffect } from 'react';
import PageHelmet from '@/common/PageHelmet';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { RefreshCw } from 'lucide-react';
import { SyncReliabilityChart } from './components/SyncReliabilityChart';
import { FailuresLog } from './components/FailuresLog';
import { ReconciliationBars } from './components/ReconciliationBars';
import { getMockSystemHealth } from '@/services/mock/metrics-data';

const REFRESH_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

const SystemHealth = () => {
  const [data, setData] = useState(() => getMockSystemHealth());
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setData(getMockSystemHealth());
      setLastRefresh(new Date());
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <PageHelmet
        title="System Health — RetailStack Metrics"
        description="Real-time system health monitoring"
      />
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-text-primary">System Health</h1>
              <InfoTooltip content="This page monitors data sync reliability and reconciliation accuracy. Sync data refreshes every 15 minutes. Below 99% sync triggers a warning; below 98% is a production incident." />
            </div>
            <p className="text-sm text-text-tertiary">
              Real-time reliability monitoring. Data on this page refreshes more frequently than
              other metrics.
            </p>
          </div>
          <Badge variant="outline" className="gap-1.5">
            <RefreshCw className="size-3 text-text-quaternary" />
            Auto-refresh every 15 min · Last:{' '}
            {lastRefresh.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Badge>
        </div>

        {/* Sync Reliability */}
        <SyncReliabilityChart metrics={data.sync_reliability} timeline={data.sync_timeline} />

        {/* Critical Failures */}
        <FailuresLog failures={data.critical_failures} />

        {/* Reconciliation by Store */}
        <ReconciliationBars
          stores={data.reconciliation_by_store}
          threshold={data.sync_reliability.reconciliation_threshold}
          platformAvg={data.sync_reliability.reconciliation_completion_rate}
        />
      </div>
    </>
  );
};

export default SystemHealth;
