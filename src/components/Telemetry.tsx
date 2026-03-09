import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTelemetryLogs } from '../hooks/useTelemetryLogs';

export function Telemetry() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeLevels = searchParams.get('levels')?.split(',') || ['INFO', 'ERROR', 'WARN', 'DEBUG', 'THOUGHT'];
  const { logs, stats } = useTelemetryLogs();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-obsidian text-white font-sans">
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
            
            {(isFilterOpen || true) && ( // Use CSS hover group-hover:block instead of state to match design's simple hover, but keeping state for deeper control if needed.
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
                        let colorClass = 'border-slate-500/30 text-slate-400 bg-slate-500/10';
                        if (isActive) {
                          if (level === 'ERROR') colorClass = 'border-rose-500/30 text-rose-400 bg-rose-500/10';
                          else if (level === 'INFO') colorClass = 'border-electric-blue/30 text-electric-blue bg-electric-blue/10';
                          else if (level === 'WARN') colorClass = 'border-amber-500/30 text-amber-400 bg-amber-500/10';
                          else if (level === 'THOUGHT') colorClass = 'border-synth-magenta/30 text-neon-purple bg-synth-magenta/10';
                          else colorClass = 'border-zinc-grey/30 text-zinc-grey bg-zinc-grey/10';
                        }
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

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0c0e12]">
        <div className="p-6">
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="col-span-3 p-5 bg-dark-surface rounded-xl border border-border-muted shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">Log Volume Over Time</h3>
                  <p className="text-xl font-bold mt-1 text-white">{stats.totalLogs.toLocaleString()} <span className="text-[10px] text-zinc-grey font-normal ml-1">events/min</span></p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-synth-magenta shadow-[0_0_8px_#BC13FE]"></div>
                    <span className="text-[9px] font-bold text-zinc-grey uppercase">Ingestion</span>
                  </div>
                </div>
              </div>
              <div className="h-16 w-full flex items-end gap-[2px]">
                {/* Mock Chart Data */}
                {[30, 45, 35, 60, 75, 90, 65, 40, 55, 80, 45, 30, 20, 40, 60].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-t h-[${h}%] ${h > 50 && h < 95 ? 'bg-synth-magenta opacity-80 shadow-[0_0_10px_#BC13FE33]' : h >= 95 ? 'bg-synth-magenta shadow-[0_0_10px_#BC13FE44]' : 'bg-white/10'}`} style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
            
            <div className="p-5 bg-dark-surface rounded-xl border border-border-muted shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">Error Rate</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-rose-500">{stats.errorRate}%</span>
                  <span className="text-[10px] text-electric-blue font-bold flex items-center">
                    <span className="material-symbols-outlined text-xs">trending_down</span> 4%
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-border-muted">
                <span className="text-[9px] font-bold text-zinc-grey uppercase">Avg Response</span>
                <p className="text-sm font-semibold text-white">124ms</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-surface border border-border-muted rounded-xl overflow-hidden shadow-sm">
            <div className="sticky top-0 z-10 bg-obsidian border-b border-border-muted py-2 px-4 text-[10px] font-bold text-zinc-grey uppercase tracking-widest flex">
              <div className="w-40 shrink-0">Timestamp (UTC)</div>
              <div className="w-24 shrink-0 text-center">Level</div>
              <div className="flex-1 px-4">Message (JSON Payload)</div>
            </div>
            
            <div className="flex flex-col">
              {filteredLogs.map((log, i) => {
                let levelClass = 'bg-zinc-grey/10 text-zinc-grey';
                if (log.log_level === 'INFO') levelClass = 'bg-electric-blue/10 text-electric-blue';
                if (log.log_level === 'ERROR') levelClass = 'bg-rose-500/10 text-rose-500';
                if (log.log_level === 'WARN') levelClass = 'bg-amber-500/10 text-amber-500';
                if (log.log_level === 'DEBUG') levelClass = 'bg-white/10 text-white';
                if (log.log_level === 'THOUGHT') levelClass = 'bg-synth-magenta/10 text-neon-purple';

                return (
                  <div key={log.id || i} className="flex items-center border-b border-border-muted hover:bg-white/5 transition-colors px-4 py-2 font-mono text-[11px] group">
                    <div className="w-40 shrink-0 text-zinc-grey">{log.timestamp}</div>
                    <div className="w-24 shrink-0 flex justify-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${levelClass}`}>{log.log_level}</span>
                    </div>
                    {/* Hanging indent implemented here via negative text-indent and positive padding-left */}
                    <div className="flex-1 px-4 text-slate-300 break-all -indent-[10px] pl-[10px]">
                      <span className="text-slate-500">{'{'}</span> 
                      {Object.entries(log.payload || {}).map(([k, v], idx, arr) => (
                        <span key={k}>
                          <span className="text-electric-blue">"{k}"</span>: 
                          <span className={typeof v === 'number' ? 'text-neon-purple' : typeof v === 'string' && log.log_level === 'ERROR' ? 'text-rose-400' : 'text-emerald-400'}>
                            {typeof v === 'string' ? `"${v}"` : v}
                          </span>
                          {idx < arr.length - 1 ? ', ' : ' '}
                        </span>
                      ))}
                      <span className="text-slate-500">{'}'}</span>
                    </div>
                  </div>
                );
              })}
              {filteredLogs.length === 0 && (
                <div className="px-4 py-8 text-center text-zinc-grey text-xs font-mono">No logs match the current filters.</div>
              )}
            </div>
          </div>

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
      </div>

      <footer className="h-10 border-t border-border-muted bg-obsidian flex items-center justify-between px-6 flex-shrink-0 text-[10px] font-bold text-zinc-grey uppercase">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">database</span>
            <span>Elastic Index: US-EAST-1-PROD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">memory</span>
            <span>CPU: 24%</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>V2.4.1-Stable</span>
          <div className="w-2 h-2 rounded-full bg-electric-blue shadow-[0_0_8px_#00F2FF]"></div>
        </div>
      </footer>
    </div>
  );
}
