import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TelemetryLog } from './useTelemetryLogs';

export function useTelemetryFilter(logs: TelemetryLog[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeLevels = searchParams.get('levels')?.split(',') || ['INFO', 'ERROR', 'WARN', 'DEBUG', 'THOUGHT'];
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const filteredLogs = useMemo(() => {
    return logs.filter(log => 
      activeLevels.includes(log.log_level) &&
      (searchQuery === '' || JSON.stringify(log).toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [logs, activeLevels, searchQuery]);

  return {
    activeLevels,
    searchQuery,
    setSearchQuery,
    isFilterOpen,
    setIsFilterOpen,
    toggleLevel,
    filteredLogs
  };
}
