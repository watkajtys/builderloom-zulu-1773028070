import { TrendingUp, Verified } from 'lucide-react';
import { TelemetryStream } from './TelemetryStream';
import { TelemetryLog } from '../hooks/useTelemetryLogs';
import { HardwarePulseBar } from './HardwarePulseBar';

interface HardwarePulseProps {
  chartData: { c: number; m: number; s1: boolean; s2: boolean; o: number }[];
  stats: {
    totalLogs: number;
    errorCount?: number;
    warningCount?: number;
  };
  logs: TelemetryLog[];
}

export function HardwarePulse({ chartData, stats, logs }: HardwarePulseProps) {
  return (
    <div className="w-[60%] flex flex-col p-6 space-y-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[10px] font-bold text-zinc-grey uppercase tracking-[0.2em]">Hardware Pulse</h3>
          <p className="text-[10px] text-zinc-grey font-mono mt-1">STREAMING://hard-pulse-node-01.local</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-electric-blue shadow-[0_0_8px_#00F2FF]"></div>
            <span className="text-[9px] font-bold text-zinc-grey uppercase">Input Buffer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_8px_#BC13FE]"></div>
            <span className="text-[9px] font-bold text-zinc-grey uppercase">Process Load</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-dark-surface border border-border-muted rounded-xl p-6 relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="flex-1 relative flex items-end justify-between gap-px mb-4">
          {chartData.map((h, i) => (
            <HardwarePulseBar key={i} {...h} />
          ))}
        </div>
        <div className="flex justify-between font-mono text-[9px] text-zinc-grey uppercase">
          <span>T-300ms</span>
          <span>T-200ms</span>
          <span>T-100ms</span>
          <span className="text-electric-blue font-bold">Now</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-dark-surface border border-border-muted p-4 rounded-lg">
          <p className="text-[9px] font-bold text-zinc-grey uppercase tracking-widest mb-1">Total Logs Processed</p>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xl font-bold text-neon-purple">{stats.totalLogs}</span>
            <TrendingUp size={14} className="text-neon-purple" />
          </div>
        </div>
        <div className="bg-dark-surface border border-border-muted p-4 rounded-lg">
          <p className="text-[9px] font-bold text-zinc-grey uppercase tracking-widest mb-1">Signal Integrity</p>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xl font-bold text-electric-blue">
              {stats.errorCount !== undefined ? Math.max(0, 100 - (stats.errorCount * 0.5)).toFixed(2) : "100.00"}%
            </span>
            <Verified size={14} className="text-electric-blue" />
          </div>
        </div>
        <div className="bg-dark-surface border border-border-muted p-4 rounded-lg">
          <p className="text-[9px] font-bold text-zinc-grey uppercase tracking-widest mb-1">Active Warnings</p>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xl font-bold text-white">{stats.warningCount || 0}</span>
            <span className="text-[10px] text-zinc-grey uppercase">optimal</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 mt-6 border border-border-muted rounded-xl overflow-hidden bg-obsidian">
        <TelemetryStream logs={logs} />
      </div>
    </div>
  );
}
