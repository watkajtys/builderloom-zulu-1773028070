import { Filter } from 'lucide-react';
import { ViewTabs } from '../ViewTabs';
import { TopNavUtility } from '../TopNavUtility';
import { ArchitectFinding } from '../../types/architect';

export const CodeQualityStatusIndicator = () => (
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 rounded-full bg-electric-blue shadow-[0_0_8px_#00F2FF]"></div>
    <span className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">
      Deep Audit Mode Active
    </span>
  </div>
);

export const CodeQualityLeftContent = () => (
  <ViewTabs activeTab="code-quality" title="Repository Pulse" />
);

interface CodeQualityRightContentProps {
  architectFindings: ArchitectFinding[];
}

export const CodeQualityRightContent = ({ architectFindings }: CodeQualityRightContentProps) => (
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
