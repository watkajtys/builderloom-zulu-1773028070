import { ComponentType } from 'react';
import { LucideProps, CheckCircle, TrendingDown, BadgeCheck, AlertTriangle } from 'lucide-react';

interface RepositoryRowProps {
  name: string;
  type: string;
  coverage: number;
  grade: string;
  lastCommit: string;
  author: string;
  icon: ComponentType<LucideProps>;
  coverageColorClass: string;
  coverageShadowClass?: string;
  lintTrendHeights: string[];
  lintTrendColors: string[];
  isActive?: boolean;
}

export function RepositoryRow({
  name,
  type,
  coverage,
  grade,
  isActive = false
}: RepositoryRowProps) {
  let statusIcon = <CheckCircle size={14} className="text-electric-blue" />;
  if (grade === 'B') {
    statusIcon = <TrendingDown size={14} className="text-zinc-500" />;
  } else if (grade === 'A') {
    statusIcon = <BadgeCheck size={14} className="text-electric-blue" />;
  } else if (grade.startsWith('C')) {
    statusIcon = <AlertTriangle size={14} className="text-neon-purple" />;
  }
  
  const containerClasses = isActive
    ? "p-4 border-b border-border-muted bg-[#135bec]/5 border-l-2 border-l-[#135bec] cursor-pointer"
    : "p-4 border-b border-border-muted hover:bg-white/5 cursor-pointer group";
    
  const textNameClasses = isActive
    ? "text-xs font-bold text-white font-mono"
    : "text-xs font-bold text-zinc-300 font-mono group-hover:text-white transition-colors";

  return (
    <div className={containerClasses}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className={textNameClasses}>{name}</h3>
          <p className="text-[9px] text-zinc-500 uppercase mt-1">{type}</p>
        </div>
        {statusIcon}
      </div>
      <div className="mt-3 flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[9px] text-zinc-500 font-bold uppercase">Cov</span>
          <span className={`text-xs font-mono font-bold ${coverage > 90 ? 'text-electric-blue' : coverage > 80 ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {coverage.toFixed(1)}%
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-zinc-500 font-bold uppercase">Cmplx</span>
          <span className={`text-xs font-mono font-bold ${grade.startsWith('A') ? (isActive ? 'text-zinc-300' : 'text-zinc-400') : grade.startsWith('B') ? 'text-zinc-400' : 'text-neon-purple'}`}>
            {grade}
          </span>
        </div>
      </div>
    </div>
  );
}
