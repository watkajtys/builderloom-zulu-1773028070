import { useState } from 'react';
import { HeartPulse, Code2 } from 'lucide-react';
import { SystemHealth } from './SystemHealth';

type Tab = 'system-health' | 'code-quality';

export function HealthDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('system-health');

  return (
    <div className="flex flex-col h-full w-full bg-obsidian text-white" data-testid="health-dashboard-shell">
      {/* Header Tabs */}
      <div className="flex border-b border-border-muted p-4 space-x-4">
        <button
          onClick={() => setActiveTab('system-health')}
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
          onClick={() => setActiveTab('code-quality')}
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
             <div className="absolute inset-0 z-0">
               <SystemHealth />
             </div>
             <div className="absolute inset-4 z-10 pointer-events-none border-2 border-dashed border-zinc-700/50 rounded-lg flex items-center justify-center bg-black/5" data-testid="placeholder-system-health">
              <div className="text-zinc-500/50 font-mono text-sm flex flex-col items-center gap-2">
                <HeartPulse size={32} className="text-zinc-600/50" />
                <span>[ SYSTEM HEALTH MODULE MOUNTED ]</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full w-full border-2 border-dashed border-zinc-700 rounded-lg flex items-center justify-center bg-black/20" data-testid="placeholder-code-quality">
            <div className="text-zinc-500 font-mono text-sm flex flex-col items-center gap-2">
              <Code2 size={32} className="text-zinc-600" />
              <span>[ CODE QUALITY MODULE ]</span>
              <span className="text-xs">Mount point ready</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
