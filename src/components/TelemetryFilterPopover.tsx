import { Filter, Settings } from 'lucide-react';
import { getLogLevelConfig } from '../utils/telemetryConfig';

interface TelemetryFilterPopoverProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  activeLevels: string[];
  toggleLevel: (level: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function TelemetryFilterPopover({
  isFilterOpen,
  setIsFilterOpen,
  activeLevels,
  toggleLevel,
  searchQuery,
  setSearchQuery
}: TelemetryFilterPopoverProps) {
  return (
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
  );
}
