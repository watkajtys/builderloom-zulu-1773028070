import { Download } from 'lucide-react';
import { useTelemetryLogs } from '../hooks/useTelemetryLogs';
import { useTelemetryFilter } from '../hooks/useTelemetryFilter';
import { TelemetryStats } from './TelemetryStats';
import { TelemetryLogGrid } from './TelemetryLogGrid';
import { PageLayout } from './PageLayout';
import { TopNavUtility } from './TopNavUtility';
import { TelemetryFilterPopover } from './TelemetryFilterPopover';

export function Telemetry() {
  const { logs, stats } = useTelemetryLogs();
  const {
    activeLevels,
    searchQuery,
    setSearchQuery,
    isFilterOpen,
    setIsFilterOpen,
    toggleLevel,
    filteredLogs
  } = useTelemetryFilter(logs);

  const statusIndicator = (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-electric-blue animate-pulse shadow-[0_0_8px_#00F2FF]"></div>
      <span className="text-[10px] font-bold text-slate-500 uppercase">Streaming</span>
    </div>
  );

  const rightContent = (
    <>
      <TopNavUtility />
      <TelemetryFilterPopover 
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        activeLevels={activeLevels}
        toggleLevel={toggleLevel}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-grey">
        <Download size={20} />
      </button>
    </>
  );

  const leftContent = (
    <div className="flex items-center gap-8">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
        Telemetry <span className="mx-1">/</span> <span className="text-white">Log Grid</span>
      </h2>
      <nav className="flex items-center gap-4">
        <button className="text-[10px] font-black text-electric-blue border-b border-electric-blue pb-0.5 tracking-widest uppercase">Health</button>
        <button className="text-[10px] font-bold text-slate-500 hover:text-white tracking-widest uppercase transition-colors">Logs</button>
        <button className="text-[10px] font-bold text-slate-500 hover:text-white tracking-widest uppercase transition-colors">Nodes</button>
      </nav>
      <div className="flex items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-electric-blue animate-pulse"></div>
        <span className="text-[9px] font-black text-electric-blue uppercase tracking-tighter neon-glow-blue">Engine Active</span>
      </div>
    </div>
  );

  return (
    <PageLayout
      leftContent={leftContent}
      statusIndicator={statusIndicator}
      rightContent={rightContent}
      transparentBackground={false}
      footerZone="US-EAST-1-PROD"
      footerLoadOrCpu="CPU: 24%"
      footerVersion="V2.4.1-Stable"
      footerTransparentBackground={false}
      contentClassName="flex-1 overflow-y-auto custom-scrollbar bg-[#0c0e12]"
    >
        <div className="p-6">
          <TelemetryStats stats={stats} />
          <TelemetryLogGrid filteredLogs={filteredLogs} />

          <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-zinc-grey uppercase tracking-widest px-1">
            <div className="flex gap-4">
              <span>Showing {filteredLogs.length} of {stats.totalLogs} logs</span>
              <span className="text-electric-blue cursor-pointer hover:underline">Load more</span>
            </div>
            <div className="flex gap-2">
              <span className="text-zinc-grey">Auto-refresh: 5s</span>
            </div>
          </div>
        </div>
    </PageLayout>
  );
}
