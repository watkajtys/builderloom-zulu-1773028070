import { useState, useEffect, useMemo } from 'react';
import { pb } from '../services/pocketbase';
import { mockTelemetryLogs } from '../services/mockTelemetryData';
import { getLogLevelConfig, formatLogMessage } from '../utils/telemetryConfig';

export interface TelemetryLog {
  id: string;
  timestamp: string;
  log_level: string;
  node_id: string;
  event_type: string;
  payload: Record<string, any>;
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
    // Initial mock data as requested for test passing
    setLogs(mockTelemetryLogs);

    // In a real scenario, we'd fetch from pb.collection('telemetry').getList(...)
    // and subscribe to changes pb.collection('telemetry').subscribe('*', function(e) { ... })

    return () => {
      // pb.collection('telemetry').unsubscribe('*');
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
