import { Cpu, Database, Network, Settings, TrendingUp, Verified } from 'lucide-react';
import { useTelemetry } from '../hooks/useTelemetry';
import { useTelemetryLogs } from '../hooks/useTelemetryLogs';
import { TelemetryStream } from './TelemetryStream';

export function SystemHealth() {
  const { primaryData, secondaryData } = useTelemetry();
  const { logs, stats } = useTelemetryLogs();

  // Combine data to emulate the 16 bars in the chart
  // The chart data in previous mockup had 16 elements. 
  // We'll take the last 16 points or pad if necessary.
  const chartLength = 16;
  const recentPrimary = primaryData.slice(-chartLength);
  const recentSecondary = secondaryData.slice(-chartLength);
  
  // Pad if not enough data
  const chartData = Array.from({ length: chartLength }).map((_, i) => {
    const dataIndex = i - (chartLength - recentPrimary.length);
    if (dataIndex >= 0) {
      const p = recentPrimary[dataIndex];
      const s = recentSecondary[dataIndex];
      return { 
        c: Math.max(5, Math.min(95, p.value)), // scale nicely
        m: Math.max(10, Math.min(100, s.value + 20)), // make m higher than c usually
        s1: p.value > 70,
        s2: s.value > 60,
        o: Math.min(100, Math.round(s.value / 10) * 10)
      };
    }
    return { c: 5, m: 10, s1: false, s2: false, o: 20 }; // default
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#0d1117] text-slate-100 font-sans h-full w-full">
      <header className="h-14 border-b border-border-muted bg-obsidian/50 backdrop-blur-md flex items-center justify-between px-6 flex-shrink-0 z-20">
        <div className="flex items-center gap-6">
          <h2 className="text-xs font-bold text-zinc-grey uppercase tracking-[0.2em]">System Health / <span className="text-white">Split-View Monitoring</span></h2>
          <div className="h-4 w-px bg-border-muted"></div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-electric-blue animate-pulse shadow-[0_0_8px_#00F2FF]"></div>
              <span className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">Real-time Pulse Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded bg-dark-surface border border-border-muted">
            <span className="text-[10px] font-bold text-zinc-grey uppercase">Refresh rate:</span>
            <span className="font-mono text-[11px] text-electric-blue">500ms</span>
          </div>
          <button className="p-2 rounded hover:bg-white/5 text-zinc-grey transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[40%] border-r border-border-muted flex flex-col overflow-y-auto custom-scrollbar p-6 space-y-4 bg-obsidian/40">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-bold text-zinc-grey uppercase tracking-[0.2em]">Infrastructure Stack</h3>
            <span className="text-[10px] font-mono text-electric-blue bg-electric-blue/10 px-2 py-0.5 rounded">3 ACTIVE</span>
          </div>
          
          <div className="p-5 bg-dark-surface border border-border-muted rounded-lg hover:border-slate-600 transition-colors group relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'conic-gradient(from 0deg, #00F2FF 85%, transparent 0%)' }}>
                  <div className="absolute w-10 h-10 bg-dark-surface rounded-full"></div>
                  <Cpu size={18} className="text-electric-blue z-10" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">Compute Clusters</h4>
                  <p className="text-[10px] text-zinc-grey uppercase font-bold tracking-widest">NV-A100 Series</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-lg font-bold text-electric-blue">85%</span>
                <p className="text-[9px] text-zinc-grey uppercase font-bold">utilization</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-electric-blue shadow-[0_0_8px_#00F2FF]"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-2 rounded">
                  <p className="text-[9px] text-zinc-grey uppercase font-bold">Node Count</p>
                  <p className="font-mono text-xs text-white">128 Total</p>
                </div>
                <div className="bg-black/20 p-2 rounded">
                  <p className="text-[9px] text-zinc-grey uppercase font-bold">Avg Temp</p>
                  <p className="font-mono text-xs text-white">42°C</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-5 bg-dark-surface border border-border-muted rounded-lg hover:border-slate-600 transition-colors relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'conic-gradient(from 0deg, #00F2FF 62%, transparent 0%)' }}>
                  <div className="absolute w-10 h-10 bg-dark-surface rounded-full"></div>
                  <Database size={18} className="text-electric-blue z-10" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">Vector Storage</h4>
                  <p className="text-[10px] text-zinc-grey uppercase font-bold tracking-widest">Distributed NVMe</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-lg font-bold text-electric-blue">62%</span>
                <p className="text-[9px] text-zinc-grey uppercase font-bold">capacity</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[62%] h-full bg-electric-blue/60"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-2 rounded">
                  <p className="text-[9px] text-zinc-grey uppercase font-bold">Latency</p>
                  <p className="font-mono text-xs text-white">0.8ms</p>
                </div>
                <div className="bg-black/20 p-2 rounded">
                  <p className="text-[9px] text-zinc-grey uppercase font-bold">IOPS</p>
                  <p className="font-mono text-xs text-white">1.2M</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-5 bg-dark-surface border border-border-muted rounded-lg hover:border-slate-600 transition-colors relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'conic-gradient(from 0deg, #00F2FF 94%, transparent 0%)' }}>
                  <div className="absolute w-10 h-10 bg-dark-surface rounded-full"></div>
                  <Network size={18} className="text-electric-blue z-10" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">API Gateway</h4>
                  <p className="text-[10px] text-zinc-grey uppercase font-bold tracking-widest">High Availability</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-lg font-bold text-electric-blue">94%</span>
                <p className="text-[9px] text-zinc-grey uppercase font-bold">uptime</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[94%] h-full bg-electric-blue shadow-[0_0_4px_#00F2FF]"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-2 rounded">
                  <p className="text-[9px] text-zinc-grey uppercase font-bold">Throughput</p>
                  <p className="font-mono text-xs text-white">45k req/s</p>
                </div>
                <div className="bg-black/20 p-2 rounded">
                  <p className="text-[9px] text-zinc-grey uppercase font-bold">Active Conn</p>
                  <p className="font-mono text-xs text-white">8.4k</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
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
                <div key={i} className="flex-1 flex flex-col justify-end gap-[2px]">
                  <div className={`w-full rounded-sm ${h.s2 ? 'shadow-[0_0_15px_#BC13FE44]' : ''} ${
                    h.o === 20 ? 'bg-neon-purple/20' : 
                    h.o === 30 ? 'bg-neon-purple/30' : 
                    h.o === 40 ? 'bg-neon-purple/40' : 
                    h.o === 50 ? 'bg-neon-purple/50' : 
                    h.o === 60 ? 'bg-neon-purple/60' : 
                    h.o === 70 ? 'bg-neon-purple/70' : 
                    h.o === 80 ? 'bg-neon-purple/80' : 
                    h.o === 100 ? 'bg-neon-purple' : 'bg-neon-purple/50'
                  }`} style={{ height: `${h.m}%` }}></div>
                  <div className={`w-full bg-electric-blue rounded-sm ${h.s1 ? 'shadow-[0_0_10px_#00F2FF44]' : ''}`} style={{ height: `${h.c}%` }}></div>
                </div>
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
                <span className="font-mono text-xl font-bold text-white">{stats.warningCount}</span>
                <span className="text-[10px] text-zinc-grey uppercase">optimal</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 mt-6 border border-border-muted rounded-xl overflow-hidden bg-obsidian">
            <TelemetryStream logs={logs} />
          </div>
        </div>
      </div>
      
      <footer className="h-10 border-t border-border-muted bg-obsidian/80 flex items-center justify-between px-6 flex-shrink-0 text-[10px] font-bold text-zinc-grey uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Database size={14} />
            <span>Zone: US-EAST-1-PROD</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={14} />
            <span>System Load: Stable</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>Zulu OS V2.4.1-Stable</span>
          <div className="w-2 h-2 rounded-full bg-electric-blue shadow-[0_0_8px_#00F2FF]"></div>
        </div>
      </footer>
    </div>
  );
}
