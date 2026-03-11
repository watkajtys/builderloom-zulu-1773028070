import { Download } from 'lucide-react';
import { TopNavUtility } from '../TopNavUtility';
import { TelemetryFilterPopover } from '../TelemetryFilterPopover';

export const TelemetryStatusIndicator = () => (
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 rounded-full bg-electric-blue animate-pulse shadow-[0_0_8px_#00F2FF]"></div>
    <span className="text-[10px] font-bold text-slate-500 uppercase">Streaming</span>
  </div>
);

export const TelemetryLeftContent = () => (
  <div className="flex items-center gap-8">
    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
      Telemetry <span className="mx-1">/</span> <span className="text-white">Log Grid</span>
    </h2>
    <nav className="flex items-center gap-4">
      <button className="text-[10px] font-black text-electric-blue border-b border-electric-blue pb-0.5 tracking-widest uppercase">Health</button>
      <button className="text-[10px] font-bold text-slate-500 hover:text-white tracking-widest uppercase transition-colors">Logs</button>
      <button className="text-[10px] font-bold text-slate-500 hover:text-white tracking-widest uppercase transition-colors">Nodes</button>
    </nav>
    <div className="flex items-center gap-2">
      <div className="w-1 h-1 rounded-full bg-electric-blue animate-pulse"></div>
      <span className="text-[9px] font-black text-electric-blue uppercase tracking-tighter neon-glow-blue">Engine Active</span>
    </div>
  </div>
);

interface TelemetryRightContentProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  activeLevels: string[];
  toggleLevel: (level: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const TelemetryRightContent = ({
  isFilterOpen,
  setIsFilterOpen,
  activeLevels,
  toggleLevel,
  searchQuery,
  setSearchQuery
}: TelemetryRightContentProps) => (
  <>
    <TopNavUtility />
    <TelemetryFilterPopover 
      isFilterOpen={isFilterOpen}
      setIsFilterOpen={setIsFilterOpen}
      activeLevels={activeLevels}
      toggleLevel={toggleLevel}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />
    <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-grey">
      <Download size={20} />
    </button>
  </>
);
