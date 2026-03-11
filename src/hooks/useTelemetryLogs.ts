import { useState, useEffect, useMemo } from 'react';
import { telemetryService } from '../services/telemetryService';
import { getLogLevelConfig, formatLogMessage } from '../utils/telemetryConfig';

export interface TelemetryLog {
  id: string;
  timestamp: string;
  log_level: string;
  node_id: string;
  event_type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, unknown>;
}

export interface DisplayLog {
  time: string;
  level: string;
  color: string;
  message: string;
  messageColor: string;
  isError: boolean;
}

export function useTelemetryLogs() {
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const [stats, setStats] = useState({ 
    totalLogs: 12482, 
    errorRate: 0.02,
    errorCount: 0,
    warningCount: 0,
  });

  useEffect(() => {
    let isMounted = true;
    
    telemetryService.getLogs().then(fetchedLogs => {
      if (isMounted) setLogs(fetchedLogs);
    });
    
    telemetryService.getStats().then(fetchedStats => {
      if (isMounted) setStats(fetchedStats);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const displayLogs = useMemo(() => {
    return logs.map(log => {
      const timeMatch = log.timestamp.match(/ (\d{2}:\d{2}:\d{2})/);
      const timeStr = timeMatch ? timeMatch[1] : log.timestamp.split(' ')[1] || log.timestamp;
      const levelConfig = getLogLevelConfig(log.log_level);
      const message = formatLogMessage(log.payload);

      return {
        time: timeStr,
        level: levelConfig.code,
        color: levelConfig.streamColor,
        message,
        messageColor: levelConfig.streamMessageColor,
        isError: log.log_level === 'ERROR'
      };
    });
  }, [logs]);

  const signalIntegrity = useMemo(() => {
    return stats.errorCount !== undefined 
      ? Math.max(0, 100 - (stats.errorCount * 0.5)).toFixed(2) 
      : "100.00";
  }, [stats.errorCount]);

  return { 
    logs, 
    displayLogs, 
    stats: { ...stats, signalIntegrity } 
  };
}
