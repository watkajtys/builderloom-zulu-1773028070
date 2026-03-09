import React from 'react';

interface TelemetryStatsProps {
  stats: {
    totalLogs: number;
    errorRate: number;
  };
}

export function TelemetryStats({ stats }: TelemetryStatsProps) {
  return (
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
  );
}
