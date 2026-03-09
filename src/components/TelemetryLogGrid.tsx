import React from 'react';
import { TelemetryLog } from '../hooks/useTelemetryLogs';

interface TelemetryLogGridProps {
  filteredLogs: TelemetryLog[];
}

export function TelemetryLogGrid({ filteredLogs }: TelemetryLogGridProps) {
  return (
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
  );
}
