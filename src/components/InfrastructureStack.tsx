import { Cpu, Database, Network } from 'lucide-react';

export function InfrastructureStack() {
  return (
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
  );
}
