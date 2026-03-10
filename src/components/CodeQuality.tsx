import { CheckCircle2, Filter, Search, CheckCircle, TrendingDown, BadgeCheck, AlertTriangle } from 'lucide-react';
import { useRepositories } from '../hooks/useRepositories';
import { RepositoryRow } from './RepositoryRow';
import { PageLayout } from './PageLayout';
import { ViewTabs } from './ViewTabs';

export function CodeQuality() {
  const { repositories, architectFindings } = useRepositories();

  const statusIndicator = (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-electric-blue shadow-[0_0_8px_#00F2FF]"></div>
      <span className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">
        Deep Audit Mode Active
      </span>
    </div>
  );

  const leftContent = <ViewTabs activeTab="code-quality" title="Repository Pulse" />;

  const rightContent = (
    <>
      <div className="flex items-center gap-4 border-r border-border-muted pr-6">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">
            Global Coverage
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-mono font-bold text-white tracking-tighter">
              91.4<span className="text-electric-blue">%</span>
            </span>
          </div>
          <div data-testid="architect-findings-count" className="text-[10px] text-zinc-grey mt-2 uppercase tracking-widest font-mono">
            Architect Findings: {architectFindings?.length || 0}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded hover:bg-white/5 text-zinc-grey">
          <Filter size={20} />
        </button>
      </div>
    </>
  );

  return (
    <PageLayout
      leftContent={leftContent}
      statusIndicator={statusIndicator}
      rightContent={rightContent}
      transparentBackground={true}
      footerZone="CLOUD-NATIVE-X86"
      footerLoadOrCpu="Automated Linting: Enabled"
      footerVersion="V2.4.1-Stable"
      footerTransparentBackground={true}
      contentClassName="flex-1 flex overflow-hidden"
    >
        <div className="w-[30%] border-r border-border-muted flex flex-col bg-obsidian/30">
          <div className="p-4 border-b border-border-muted flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">Modules (14)</span>
            <Search size={14} className="text-zinc-grey" />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {repositories.map((repo, idx) => (
              <RepositoryRow key={idx} {...repo} isActive={idx === 0} />
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-obsidian flex flex-col p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-mono font-bold text-white">zulu-factory-core-v2</h2>
                <span className="px-2 py-0.5 bg-electric-blue/10 border border-electric-blue/30 text-[9px] text-electric-blue font-bold rounded">ACTIVE AUDIT</span>
              </div>
              <p className="text-xs text-zinc-400">Analyzing historical trend data for 30-day development cycle</p>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-zinc-grey uppercase">Lines of Code</span>
                <span className="text-sm font-mono font-bold text-white">142,809</span>
              </div>
              <div className="w-px h-8 bg-border-muted"></div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-zinc-grey uppercase">Unit Tests</span>
                <span className="text-sm font-mono font-bold text-white">1,402</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-h-[400px] border border-border-muted rounded-xl bg-dark-surface/40 p-6 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-electric-blue"></div>
                  <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Test Coverage (%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-neon-purple"></div>
                  <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Code Complexity (Cyclomatic)</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-dark-surface border border-border-muted text-[9px] font-bold rounded hover:bg-border-muted">1W</button>
                <button className="px-3 py-1 bg-[#135bec] text-white text-[9px] font-bold rounded">1M</button>
                <button className="px-3 py-1 bg-dark-surface border border-border-muted text-[9px] font-bold rounded hover:bg-border-muted">3M</button>
              </div>
            </div>
            
            <div className="flex-1 relative z-10">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
                <path d="M0,150 L100,140 L200,145 L300,120 L400,110 L500,105 L600,90 L700,95 L800,85 L900,82 L1000,80" fill="none" stroke="#00f3ff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                <path d="M0,150 L100,140 L200,145 L300,120 L400,110 L500,105 L600,90 L700,95 L800,85 L900,82 L1000,80 V300 H0 Z" fill="url(#gradient-cyan)" fillOpacity="0.1"></path>
                <path d="M0,250 L100,245 L200,230 L300,220 L400,225 L500,210 L600,190 L700,185 L800,170 L900,165 L1000,160" fill="none" stroke="#ff00ff" strokeDasharray="8 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                <circle cx="900" cy="82" fill="#00f3ff" r="5"></circle>
                <circle cx="900" cy="165" fill="#ff00ff" r="5"></circle>
                <defs>
                  <linearGradient id="gradient-cyan" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#00f3ff" stopOpacity="1"></stop>
                    <stop offset="100%" stopColor="#00f3ff" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute top-[82px] left-[90%] -translate-x-1/2 -translate-y-full mb-4 bg-dark-surface border border-border-muted p-3 rounded shadow-xl z-20 min-w-[140px]">
                <div className="text-[9px] font-bold text-zinc-grey uppercase mb-2">24 Oct 2023</div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-zinc-300">Coverage</span>
                  <span className="text-xs font-mono font-bold text-electric-blue">98.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-300">Complexity</span>
                  <span className="text-xs font-mono font-bold text-neon-purple">0.42</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-between px-2">
              <span className="text-[9px] font-mono text-zinc-600">SEP 24</span>
              <span className="text-[9px] font-mono text-zinc-600">OCT 01</span>
              <span className="text-[9px] font-mono text-zinc-600">OCT 08</span>
              <span className="text-[9px] font-mono text-zinc-600">OCT 15</span>
              <span className="text-[9px] font-mono text-zinc-600">OCT 22</span>
              <span className="text-[9px] font-mono text-zinc-300">TODAY</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="bg-dark-surface/30 border border-border-muted p-4 rounded-lg">
              <p className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest mb-3">Maintainability Index</p>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-mono font-bold text-white">88</span>
                <span className="text-[10px] text-electric-blue font-bold uppercase mb-1">↑ 2.4%</span>
              </div>
            </div>
            <div className="bg-dark-surface/30 border border-border-muted p-4 rounded-lg">
              <p className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest mb-3">Technical Debt</p>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-mono font-bold text-white">4.2d</span>
                <span className="text-[10px] text-neon-purple font-bold uppercase mb-1">↓ 0.5d</span>
              </div>
            </div>
            <div className="bg-dark-surface/30 border border-border-muted p-4 rounded-lg">
              <p className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest mb-3">Duplication</p>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-mono font-bold text-white">1.8%</span>
                <span className="text-[10px] text-zinc-grey font-bold uppercase mb-1">STABLE</span>
              </div>
            </div>
          </div>
        </div>
    </PageLayout>
  );
}
