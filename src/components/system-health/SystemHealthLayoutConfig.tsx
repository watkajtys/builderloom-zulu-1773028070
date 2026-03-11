import { Settings } from 'lucide-react';
import { ViewTabs } from '../ViewTabs';
import { TopNavUtility } from '../TopNavUtility';

export const SystemHealthStatusIndicator = () => (
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 rounded-full bg-electric-blue animate-pulse shadow-[0_0_8px_#00F2FF]"></div>
    <span className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">Real-time Pulse Active</span>
  </div>
);

export const SystemHealthLeftContent = () => (
  <ViewTabs activeTab="system-health" title="Split-View Monitoring" />
);

export const SystemHealthRightContent = () => (
  <>
    <TopNavUtility />
    <div className="flex items-center gap-3 px-3 py-1.5 rounded bg-dark-surface border border-border-muted">
      <span className="text-[10px] font-bold text-zinc-grey uppercase">Refresh rate:</span>
      <span className="font-mono text-[11px] text-electric-blue">500ms</span>
    </div>
    <button className="p-2 rounded hover:bg-white/5 text-zinc-grey transition-colors">
      <Settings size={20} />
    </button>
  </>
);
