import { Activity, Code2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

interface ViewTabsProps {
  activeTab: 'system-health' | 'code-quality';
  title: string;
}

export function ViewTabs({ activeTab, title }: ViewTabsProps) {
  const [, setSearchParams] = useSearchParams();

  return (
    <div className="flex items-center gap-6">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex-shrink-0">
        {title}
      </h2>
      <div className="flex p-1 bg-black/40 rounded-lg border border-border-muted">
        <button
          onClick={() => {
            if (activeTab !== 'system-health') {
              setSearchParams(params => {
                params.delete('tab');
                return params;
              });
            }
          }}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all relative ${
            activeTab === 'system-health'
              ? 'bg-dark-surface text-white shadow-sm border border-border-muted'
              : 'text-slate-500 hover:text-slate-300'
          }`}
          data-testid="tab-system-health"
        >
          <Activity size={14} />
          System Health
          {activeTab !== 'system-health' && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-neon-purple rounded-full border-2 border-obsidian animate-pulse shadow-[0_0_8px_#BC13FE]"></span>
          )}
        </button>
        <button
          onClick={() => {
            if (activeTab !== 'code-quality') {
              setSearchParams({ tab: 'code-quality' });
            }
          }}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all relative ${
            activeTab === 'code-quality'
              ? 'bg-dark-surface text-white shadow-sm border border-border-muted'
              : 'text-slate-500 hover:text-slate-300'
          }`}
          data-testid="tab-code-quality"
        >
          <Code2 size={14} />
          Code Quality
        </button>
      </div>
    </div>
  );
}
