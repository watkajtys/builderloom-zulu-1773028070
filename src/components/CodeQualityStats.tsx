import { History, ShieldAlert, CheckSquare } from 'lucide-react';

export function CodeQualityStats() {
  return (
    <div className="mt-8 grid grid-cols-3 gap-6">
      <div className="bg-dark-surface/40 border border-border-muted p-5 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <History size={16} className="text-electric-blue" />
          <h4 className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">
            Build Velocity
          </h4>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-mono font-bold text-white">4.2</span>
          <span className="text-[10px] text-zinc-grey uppercase font-bold">
            commits/day/dev
          </span>
        </div>
        <div className="mt-4 flex gap-1 items-end h-8">
          <div className="w-full bg-white/5 h-[40%]"></div>
          <div className="w-full bg-white/5 h-[60%]"></div>
          <div className="w-full bg-white/5 h-[55%]"></div>
          <div className="w-full bg-white/5 h-[80%]"></div>
          <div className="w-full bg-electric-blue/40 h-[90%]"></div>
        </div>
      </div>

      <div className="bg-dark-surface/40 border border-border-muted p-5 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert size={16} className="text-neon-purple" />
          <h4 className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">
            Active Vulnerabilities
          </h4>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-mono font-bold text-white">0</span>
          <span className="text-[10px] text-electric-blue uppercase font-bold">
            Critical
          </span>
        </div>
        <p className="mt-2 text-[10px] text-zinc-grey uppercase">
          3 low-level dependencies outdated
        </p>
      </div>

      <div className="bg-dark-surface/40 border border-border-muted p-5 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <CheckSquare size={16} className="text-electric-blue" />
          <h4 className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">
            Pull Request Cycle
          </h4>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-mono font-bold text-white">2.4h</span>
          <span className="text-[10px] text-zinc-grey uppercase font-bold">
            avg review
          </span>
        </div>
        <div className="mt-4 w-full h-1 bg-black/40 rounded-full overflow-hidden">
          <div className="w-[85%] h-full bg-electric-blue"></div>
        </div>
      </div>
    </div>
  );
}
