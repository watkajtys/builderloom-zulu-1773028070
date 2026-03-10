import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTelemetryLogs } from '../hooks/useTelemetryLogs';
import { TelemetryHeader } from './TelemetryHeader';
import { TelemetryStats } from './TelemetryStats';
import { TelemetryLogGrid } from './TelemetryLogGrid';
import { Footer } from './Footer';

export function Telemetry() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeLevels = searchParams.get('levels')?.split(',') || ['INFO', 'ERROR', 'WARN', 'DEBUG', 'THOUGHT'];
  const { logs, stats } = useTelemetryLogs();
  const [searchQuery, setSearchQuery] = useState('');

  const toggleLevel = (level: string) => {
    const newLevels = activeLevels.includes(level)
      ? activeLevels.filter(l => l !== level)
      : [...activeLevels, level];
    
    if (newLevels.length > 0) {
      setSearchParams({ levels: newLevels.join(',') });
    } else {
      searchParams.delete('levels');
      setSearchParams(searchParams);
    }
  };

  const filteredLogs = logs.filter(log => 
    activeLevels.includes(log.log_level) &&
    (searchQuery === '' || JSON.stringify(log).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-obsidian text-white font-sans">
      <TelemetryHeader 
        activeLevels={activeLevels} 
        toggleLevel={toggleLevel} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0c0e12]">
        <div className="p-6">
          <TelemetryStats stats={stats} />
          <TelemetryLogGrid filteredLogs={filteredLogs} />

          <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-zinc-grey uppercase tracking-widest px-1">
            <div className="flex gap-4">
              <span>Showing {filteredLogs.length} of {stats.totalLogs} logs</span>
              <span className="text-electric-blue cursor-pointer hover:underline">Load more</span>
            </div>
            <div className="flex gap-2">
              <span className="text-zinc-grey">Auto-refresh: 5s</span>
            </div>
          </div>
        </div>
      </div>

      <Footer 
        zone="US-EAST-1-PROD"
        loadOrCpu="CPU: 24%"
        version="V2.4.1-Stable"
        transparentBackground={false}
      />
    </div>
  );
}
