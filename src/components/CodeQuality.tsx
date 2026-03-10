import { Filter, Search } from 'lucide-react';
import { useRepositories } from '../hooks/useRepositories';
import { RepositoryRow } from './RepositoryRow';
import { PageLayout } from './PageLayout';
import { ViewTabs } from './ViewTabs';
import { CodeQualityChart } from './CodeQualityChart';
import { CodeQualityStats } from './CodeQualityStats';
import { CodeQualityFindingsTable } from './CodeQualityFindingsTable';
import { TopNavUtility } from './TopNavUtility';

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
      <TopNavUtility />
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
          
          <CodeQualityChart />
          
          <CodeQualityFindingsTable architectFindings={architectFindings} />
          
          <CodeQualityStats />
        </div>
    </PageLayout>
  );
}
