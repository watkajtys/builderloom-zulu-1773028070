import React, { useState } from 'react';
import { getLogLevelConfig } from '../utils/telemetryConfig';

interface TelemetryHeaderProps {
  activeLevels: string[];
  toggleLevel: (level: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function TelemetryHeader({ activeLevels, toggleLevel, searchQuery, setSearchQuery }: TelemetryHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <header className="h-14 border-b border-border-muted bg-obsidian flex items-center justify-between px-6 flex-shrink-0 z-20">
      <div className="flex items-center gap-6">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Telemetry / <span className="text-white">Log Grid</span></h2>
        <div className="h-4 w-px bg-border-muted"></div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-electric-blue animate-pulse shadow-[0_0_8px_#00F2FF]"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Streaming</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative group">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-muted hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">filter_alt</span>
            <span className="text-[11px] font-bold uppercase tracking-wider">Filters</span>
          </button>
          
          {(isFilterOpen || true) && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-dark-surface border border-border-muted rounded-xl shadow-2xl p-4 hidden group-hover:block z-50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter Config</h4>
                <span className="material-symbols-outlined text-sm text-slate-500">settings</span>
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
          )}
        </div>
        <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-grey">
          <span className="material-symbols-outlined text-[20px]">file_download</span>
        </button>
      </div>
    </header>
  );
}
