import { Filter, Search } from 'lucide-react';
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
          <div className="shrink-0 flex items-center justify-between mb-8">
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
          
          <div className="shrink-0 h-[250px] border border-border-muted rounded-xl bg-dark-surface/40 p-6 flex flex-col relative overflow-hidden">
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
            
            <div className="flex-1 relative z-10 flex">
              <div className="flex flex-col justify-between text-[9px] font-mono text-zinc-500 py-1 pr-4 text-right min-w-[40px]">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
              <div className="flex-1 relative h-full">
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
              <div className="flex flex-col justify-between text-[9px] font-mono text-zinc-500 py-1 pl-4 min-w-[40px]">
                <span>1.00</span>
                <span>0.75</span>
                <span>0.50</span>
                <span>0.25</span>
                <span>0.00</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between px-2 pl-12 pr-12">
              <span className="text-[9px] font-mono text-zinc-600">SEP 24</span>
              <span className="text-[9px] font-mono text-zinc-600">OCT 01</span>
              <span className="text-[9px] font-mono text-zinc-600">OCT 08</span>
              <span className="text-[9px] font-mono text-zinc-600">OCT 15</span>
              <span className="text-[9px] font-mono text-zinc-600">OCT 22</span>
              <span className="text-[9px] font-mono text-zinc-300">TODAY</span>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col min-h-[250px] bg-dark-surface/30 border border-border-muted rounded-lg overflow-hidden mt-6">
            <div className="flex items-center px-4 border-b border-border-muted bg-obsidian/20">
              <button className="border-b-2 border-electric-blue text-electric-blue py-3 px-4 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                Current Findings
                <span className="bg-neon-purple text-white text-[9px] px-1.5 py-0.5 rounded-full shadow-[0_0_8px_#BC13FE]">{architectFindings?.length || 0}</span>
              </button>
              <button className="border-b-2 border-transparent text-zinc-grey hover:text-zinc-300 py-3 px-4 text-[10px] font-bold uppercase tracking-widest">Metrics Overview</button>
              <button className="border-b-2 border-transparent text-zinc-grey hover:text-zinc-300 py-3 px-4 text-[10px] font-bold uppercase tracking-widest">Historical Debt</button>
              <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-zinc-grey font-bold uppercase tracking-wider">Maintainability</span>
                  <span className="text-xs font-mono font-bold text-electric-blue">88%</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-muted/50 bg-black/10">
                    <th className="px-6 py-3 text-[9px] font-bold text-zinc-grey uppercase tracking-widest">Issue / Component</th>
                    <th className="px-6 py-3 text-[9px] font-bold text-zinc-grey uppercase tracking-widest w-24 text-center">Severity</th>
                    <th className="px-6 py-3 text-[9px] font-bold text-zinc-grey uppercase tracking-widest w-32 text-right">Debt Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-muted/30 font-mono">
                  {architectFindings?.flatMap(finding => 
                    finding.static_violations?.map((issue, idx) => (
                      <tr key={`${finding.id}-${idx}`} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-white">{issue.message}</span>
                            <span className="text-[10px] text-zinc-grey">{finding.filepath}{issue.line ? `:${issue.line}` : ''}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 border text-[9px] font-bold rounded ${
                            issue.type === 'error' || issue.type === 'critical' ? 'border-neon-purple/40 bg-neon-purple/10 text-neon-purple' :
                            issue.type === 'warning' || issue.type === 'high' ? 'border-orange-500/40 bg-orange-500/10 text-orange-500' :
                            issue.type === 'medium' ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-500' :
                            'border-electric-blue/40 bg-electric-blue/10 text-electric-blue'
                          }`}>
                            {(issue.type || 'info').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-xs font-bold text-zinc-300">{issue.type === 'error' ? '4.5h' : issue.type === 'warning' ? '2.0h' : '0.5h'}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="shrink-0 grid grid-cols-3 gap-6 mt-6">
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
