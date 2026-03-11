import { Filter } from 'lucide-react';

export function ActiveModulesList() {
  return (
    <div className="w-[40%] border-r border-border-muted overflow-y-auto custom-scrollbar bg-obsidian/30">
      <div className="p-4 border-b border-border-muted flex justify-between items-center bg-dark-surface/20">
        <span className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">Active Modules (14)</span>
        <Filter size={14} className="text-zinc-grey cursor-pointer" />
      </div>
      <div className="divide-y divide-border-muted/50">
        <div className="p-4 bg-electric-blue/5 border-l-2 border-electric-blue cursor-pointer transition-colors group">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-xs font-mono font-bold text-white mb-1">zulu-factory-core-v2</h4>
              <span className="text-[9px] px-1.5 py-0.5 bg-electric-blue/20 text-electric-blue rounded border border-electric-blue/30 uppercase">CORE</span>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-mono font-bold text-white">82.4%</p>
              <div className="w-16 h-1 bg-black/40 rounded-full mt-1">
                <div className="w-[82%] h-full bg-electric-blue shadow-[0_0_4px_#00F2FF]"></div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 text-[10px] text-zinc-grey font-mono">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-neon-purple"></span> 2 Crit</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> 5 Med</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-electric-blue"></span> 12 Low</span>
          </div>
        </div>
        <div className="p-4 hover:bg-white/5 cursor-pointer transition-colors group">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-xs font-mono font-bold text-zinc-300 group-hover:text-white mb-1">gateway-proxy-handler</h4>
              <span className="text-[9px] px-1.5 py-0.5 bg-dark-surface text-zinc-grey rounded border border-border-muted uppercase">INFRA</span>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-mono font-bold text-slate-400">94.1%</p>
              <div className="w-16 h-1 bg-black/40 rounded-full mt-1">
                <div className="w-[94%] h-full bg-electric-blue"></div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 text-[10px] text-zinc-grey font-mono">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span> 0 Crit</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> 1 Med</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-electric-blue"></span> 8 Low</span>
          </div>
        </div>
        <div className="p-4 hover:bg-white/5 cursor-pointer transition-colors group">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-xs font-mono font-bold text-zinc-300 mb-1">neural-weight-distributor</h4>
              <span className="text-[9px] px-1.5 py-0.5 bg-dark-surface text-zinc-grey rounded border border-border-muted uppercase">AI-LAYER</span>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-mono font-bold text-slate-400">89.8%</p>
              <div className="w-16 h-1 bg-black/40 rounded-full mt-1">
                <div className="w-[89%] h-full bg-electric-blue/50"></div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 text-[10px] text-zinc-grey font-mono">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-neon-purple"></span> 1 Crit</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> 3 Med</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-electric-blue"></span> 15 Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}
