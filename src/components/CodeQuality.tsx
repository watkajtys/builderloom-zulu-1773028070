import { CheckCircle2, Filter } from 'lucide-react';
import { useRepositories } from '../hooks/useRepositories';
import { RepositoryRow } from './RepositoryRow';
import { CodeQualityStats } from './CodeQualityStats';
import { PageLayout } from './PageLayout';
import { ViewTabs } from './ViewTabs';

export function CodeQuality() {
  const { repositories, architectFindings } = useRepositories();

  const statusIndicator = (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-electric-blue shadow-[0_0_8px_#00F2FF]"></div>
      <span className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">
        Scanning Repositories...
      </span>
    </div>
  );

  const leftContent = <ViewTabs activeTab="code-quality" title="Repository Pulse" />;

  const rightContent = (
    <>
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
          <div data-testid="architect-findings-count" className="text-[10px] text-zinc-grey mt-2 uppercase tracking-widest font-mono">
            Architect Findings: {architectFindings?.length || 0}
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
      contentClassName="flex-1 overflow-y-auto custom-scrollbar p-6"
    >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Active Repositories</h3>
            <p className="text-[10px] text-zinc-grey uppercase tracking-widest">Tracking 14 production modules across 3 regions</p>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-dark-surface border border-border-muted text-[9px] font-mono text-zinc-400 rounded">SORT: COVERAGE DESC</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-bold text-zinc-grey uppercase tracking-widest border-b border-border-muted mb-2">
            <div className="col-span-4">Module Name</div>
            <div className="col-span-3">Test Coverage</div>
            <div className="col-span-2 text-center">Lint Trend</div>
            <div className="col-span-1 text-right">Complexity</div>
            <div className="col-span-2 text-right">Last Commit</div>
          </div>
          
          {repositories.map((repo, idx) => (
            <RepositoryRow key={idx} {...repo} />
          ))}
        </div>
        
        <CodeQualityStats />
    </PageLayout>
  );
}
