import { Settings } from 'lucide-react';

export function SystemHealthHeader() {
  return (
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
  );
}
