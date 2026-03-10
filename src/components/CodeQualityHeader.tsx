import { CheckCircle2, Filter } from 'lucide-react';

export function CodeQualityHeader() {
  return (
    <header className="h-14 border-b border-border-muted bg-obsidian/50 backdrop-blur-md flex items-center justify-between px-6 flex-shrink-0 z-20">
      <div className="flex items-center gap-6">
        <h2 className="text-xs font-bold text-zinc-grey uppercase tracking-[0.2em]">
          Code Quality / <span className="text-white">Repository Pulse</span>
        </h2>
        <div className="h-4 w-px bg-border-muted"></div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-electric-blue shadow-[0_0_8px_#00F2FF]"></div>
            <span className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">
              Scanning Repositories...
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-border-muted pr-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">
              Global Health
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-mono font-bold text-white tracking-tighter">
                94.2<span className="text-electric-blue">%</span>
              </span>
              <div
                className="w-8 h-8 rounded-full p-[2px]"
                style={{ background: 'conic-gradient(from 0deg, #00F2FF 94.2%, #111111 0%)' }}
              >
                <div className="w-full h-full rounded-full bg-dark-surface flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-electric-blue" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-electric-blue/20 hover:bg-electric-blue/30 text-electric-blue text-[10px] font-bold px-3 py-1.5 rounded border border-electric-blue/30 uppercase tracking-widest transition-all">
            Manual Scan
          </button>
          <button className="p-2 rounded hover:bg-white/5 text-zinc-grey">
            <Filter size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
