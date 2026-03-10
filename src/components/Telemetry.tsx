import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getLogLevelConfig } from '../utils/telemetryConfig';
import { Filter, Settings, Download } from 'lucide-react';
import { useTelemetryLogs } from '../hooks/useTelemetryLogs';
import { TelemetryStats } from './TelemetryStats';
import { TelemetryLogGrid } from './TelemetryLogGrid';
import { PageLayout } from './PageLayout';
import { TopNavUtility } from './TopNavUtility';

export function Telemetry() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeLevels = searchParams.get('levels')?.split(',') || ['INFO', 'ERROR', 'WARN', 'DEBUG', 'THOUGHT'];
  const { logs, stats } = useTelemetryLogs();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleLevel = (level: string) => {
    const newLevels = activeLevels.includes(level)
      ? activeLevels.filter(l => l !== level)
      : [...activeLevels, level];
    
    if (newLevels.length > 0) {
      setSearchParams({ levels: newLevels.join(',') });
    } else {
      searchParams.delete('levels');
      setSearchParams(searchParams);
    }
  };

  const filteredLogs = logs.filter(log => 
    activeLevels.includes(log.log_level) &&
    (searchQuery === '' || JSON.stringify(log).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const statusIndicator = (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-electric-blue animate-pulse shadow-[0_0_8px_#00F2FF]"></div>
      <span className="text-[10px] font-bold text-slate-500 uppercase">Streaming</span>
    </div>
  );

  const rightContent = (
    <>
      <TopNavUtility />
      <div className="relative group">
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-muted hover:bg-white/5 transition-all"
        >
          <Filter size={18} />
          <span className="text-[11px] font-bold uppercase tracking-wider">Filters</span>
        </button>
        
        <div className={`absolute right-0 top-full mt-2 w-72 bg-dark-surface/95 backdrop-blur-md border border-zinc-grey/50 ring-1 ring-electric-blue/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-4 z-50 transition-all ${isFilterOpen ? 'block' : 'hidden group-hover:block'}`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter Config</h4>
              <Settings size={14} className="text-slate-500" />
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Log Level</label>
                <div className="flex flex-wrap gap-1.5">
                  {['INFO', 'ERROR', 'WARN', 'DEBUG', 'THOUGHT'].map(level => {
                    const isActive = activeLevels.includes(level);
                    const levelConfig = getLogLevelConfig(level);
                    const colorClass = isActive ? levelConfig.filterClass : 'border-slate-500/30 text-slate-400 bg-slate-500/10';
                    
                    return (
                      <button 
                        key={level}
                        onClick={() => toggleLevel(level)}
                        className={`px-2 py-0.5 rounded border text-[9px] cursor-pointer transition-colors ${colorClass}`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase">JSON Content Search</label>
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-obsidian border border-border-muted text-[10px] h-8 rounded px-2 focus:ring-1 focus:ring-electric-blue focus:border-electric-blue text-white outline-none" 
                  placeholder="e.g. status: 500" 
                  type="text"
                />
              </div>
            </div>
        </div>
      </div>
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
