import { Settings } from 'lucide-react';
import { useTelemetry } from '../hooks/useTelemetry';
import { useTelemetryLogs } from '../hooks/useTelemetryLogs';
import { InfrastructureStack } from './InfrastructureStack';
import { HardwarePulse } from './HardwarePulse';
import { PageLayout } from './PageLayout';

export function SystemHealth() {
  const { chartData } = useTelemetry();
  const { logs, stats } = useTelemetryLogs();

  const statusIndicator = (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-electric-blue animate-pulse shadow-[0_0_8px_#00F2FF]"></div>
      <span className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">Real-time Pulse Active</span>
    </div>
  );

  const rightContent = (
    <>
      <div className="flex items-center gap-3 px-3 py-1.5 rounded bg-dark-surface border border-border-muted">
        <span className="text-[10px] font-bold text-zinc-grey uppercase">Refresh rate:</span>
        <span className="font-mono text-[11px] text-electric-blue">500ms</span>
      </div>
      <button className="p-2 rounded hover:bg-white/5 text-zinc-grey transition-colors">
        <Settings size={20} />
      </button>
    </>
  );

  return (
    <PageLayout
      titlePrimary="System Health"
      titleSecondary="Split-View Monitoring"
      statusIndicator={statusIndicator}
      rightContent={rightContent}
      transparentBackground={true}
      footerZone="US-EAST-1-PROD"
      footerLoadOrCpu="Stable"
      footerVersion="V2.4.1-Stable"
      footerTransparentBackground={true}
      contentClassName="flex-1 flex overflow-hidden"
      containerClassName="bg-[#0d1117]"
    >
      <InfrastructureStack />
      <HardwarePulse chartData={chartData} stats={stats} logs={logs} />
    </PageLayout>
  );
}
