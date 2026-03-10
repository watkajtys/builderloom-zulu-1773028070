import { Settings, Activity, Code2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useTelemetry } from '../hooks/useTelemetry';
import { useTelemetryLogs } from '../hooks/useTelemetryLogs';
import { InfrastructureStack } from './InfrastructureStack';
import { HardwarePulse } from './HardwarePulse';
import { PageLayout } from './PageLayout';

export function SystemHealth() {
  const { chartData } = useTelemetry();
  const { logs, stats } = useTelemetryLogs();
  const [, setSearchParams] = useSearchParams();

  const statusIndicator = (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-electric-blue animate-pulse shadow-[0_0_8px_#00F2FF]"></div>
      <span className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">Real-time Pulse Active</span>
    </div>
  );

  const leftContent = (
    <div className="flex items-center gap-6">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex-shrink-0">Repository Pulse</h2>
      <div className="flex p-1 bg-black/40 rounded-lg border border-border-muted">
        <button
          className="flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all relative bg-dark-surface text-white shadow-sm border border-border-muted"
          data-testid="tab-system-health"
        >
          <Activity size={14} />
          System Health
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'code-quality' })}
          className="flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all relative text-slate-500 hover:text-slate-300"
          data-testid="tab-code-quality"
        >
          <Code2 size={14} />
          Code Quality
        </button>
      </div>
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
      leftContent={leftContent}
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
