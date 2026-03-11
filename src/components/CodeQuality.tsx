import { useRepositories } from '../hooks/useRepositories';
import { ActiveModulesList } from './ActiveModulesList';
import { AnalysisFindingsView } from './AnalysisFindingsView';

export function CodeQuality() {
  const { architectFindings } = useRepositories();

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#0d1117] h-full">
      <header className="h-14 border-b border-border-muted bg-obsidian/50 backdrop-blur-md flex items-center justify-between px-6 flex-shrink-0 z-20">
        <div className="flex items-center gap-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">System Health / <span className="text-white font-mono">Architect Findings</span></h2>
          <div className="h-4 w-px bg-border-muted"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse shadow-[0_0_8px_#BC13FE]"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Deep Static Analysis Active</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end border-r border-border-muted pr-6">
            <span className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">Selected Module Health</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-mono font-bold text-white tracking-tighter">82.4<span className="text-neon-purple">%</span></span>
            </div>
            <div data-testid="architect-findings-count" className="text-[10px] text-zinc-grey mt-0.5 uppercase tracking-widest font-mono">
              Architect Findings: {architectFindings?.length || 0}
            </div>
          </div>
          <button className="bg-dark-surface hover:bg-slate-800 text-zinc-300 text-[10px] font-bold px-3 py-1.5 rounded border border-border-muted uppercase tracking-widest transition-all">Export Report</button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <ActiveModulesList />
        <AnalysisFindingsView architectFindings={architectFindings} />
      </div>

      <footer className="h-10 border-t border-border-muted bg-obsidian/80 flex items-center justify-between px-6 flex-shrink-0 text-[10px] font-bold text-zinc-grey uppercase tracking-widest">
        <div className="flex items-center gap-6 font-mono">
          <div className="flex items-center gap-2">
            <span>ARCHITECT-ENGINE: v4.0.2</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Sample Size: 1.2M Lines</span>
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
