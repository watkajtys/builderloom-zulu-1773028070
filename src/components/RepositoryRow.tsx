import { ComponentType } from 'react';
import { LucideProps } from 'lucide-react';

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
  lintTrendHeights: string[]; // array of strings like "h-[40%]"
  lintTrendColors: string[]; // array of classes like "bg-neon-purple opacity-60"
}

export function RepositoryRow({
  name,
  type,
  coverage,
  grade,
  lastCommit,
  author,
  icon: Icon,
  coverageColorClass,
  coverageShadowClass,
  lintTrendHeights,
  lintTrendColors,
}: RepositoryRowProps) {
  const coverageWidth = `${coverage}%`;
  return (
    <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-dark-surface border border-border-muted rounded hover:border-zinc-grey transition-colors items-center group">
      <div className="col-span-4 flex items-center gap-3">
        <Icon size={20} className="text-zinc-grey group-hover:text-electric-blue transition-colors" />
        <div>
          <p className="text-xs font-bold text-white font-mono">{name}</p>
          <p className="text-[9px] text-zinc-grey uppercase">{type}</p>
        </div>
      </div>
      <div className="col-span-3 flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
          <div
            className={`h-full ${coverageColorClass} ${coverageShadowClass || ''}`}
            style={{ width: coverageWidth }}
          ></div>
        </div>
        <span
          className={`text-[11px] font-mono font-bold ${
            coverage > 90 ? 'text-electric-blue' : coverage > 80 ? 'text-zinc-300' : 'text-zinc-500'
          }`}
        >
          {coverage.toFixed(1)}%
        </span>
      </div>
      <div className="col-span-2 flex justify-center">
        <div className="flex items-end gap-[2px] h-[20px]">
          {lintTrendHeights.map((heightClass, idx) => (
            <div
              key={idx}
              className={`w-[3px] ${lintTrendColors[idx]} ${heightClass}`}
            ></div>
          ))}
        </div>
      </div>
      <div className="col-span-1 text-right">
        <span
          className={`text-[11px] font-mono ${
            grade.startsWith('A') ? 'text-zinc-300' : grade.startsWith('B') ? 'text-zinc-300' : 'text-zinc-500'
          }`}
        >
          {grade}
        </span>
      </div>
      <div className="col-span-2 text-right">
        <p className="text-[10px] font-mono text-zinc-400">{lastCommit}</p>
        <p className="text-[9px] text-zinc-500 uppercase">by {author}</p>
      </div>
    </div>
  );
}
