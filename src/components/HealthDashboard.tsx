import { useSearchParams } from 'react-router-dom';
import { HeartPulse, Code2 } from 'lucide-react';
import { SystemHealth } from './SystemHealth';
import { CodeQuality } from './CodeQuality';

type Tab = 'system-health' | 'code-quality';

export function HealthDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as Tab) || 'system-health';

  return (
    <div className="flex flex-col h-full w-full bg-obsidian text-white" data-testid="health-dashboard-shell">
      {/* Header Tabs */}
      <div className="flex border-b border-border-muted p-4 space-x-4">
        <button
          onClick={() => setSearchParams({ tab: 'system-health' })}
          data-testid="tab-system-health"
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'system-health'
              ? 'bg-electric-blue/10 text-electric-blue border border-electric-blue/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <HeartPulse size={16} />
          <span className="text-sm font-semibold tracking-wide">System Health</span>
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'code-quality' })}
          data-testid="tab-code-quality"
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'code-quality'
              ? 'bg-electric-blue/10 text-electric-blue border border-electric-blue/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Code2 size={16} />
          <span className="text-sm font-semibold tracking-wide">Code Quality</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'system-health' ? (
          <div className="h-full w-full flex relative">
             <div className="absolute inset-0 z-0 flex" data-testid="placeholder-system-health">
               <SystemHealth />
             </div>
          </div>
        ) : (
          <div className="h-full w-full flex relative" data-testid="placeholder-code-quality">
             <div className="absolute inset-0 z-0 flex">
               <CodeQuality />
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
