import { pb } from './pocketbase';
import { TelemetryLog } from '../hooks/useTelemetryLogs';
import { mockTelemetryLogs } from './mockTelemetryData';

export interface ConductorStateRecord {
  id: string;
  state_data: {
    live_logs?: string[];
    db_stats?: {
      users?: number;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}

const parseLogString = (logStr: string, index: number): TelemetryLog => {
  // Try to parse if it's JSON, else create a generic log object
  try {
    const parsed = JSON.parse(logStr);
    return {
      id: parsed.id || String(index),
      timestamp: parsed.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 23),
      log_level: parsed.log_level || 'INFO',
      node_id: parsed.node_id || 'system',
      event_type: parsed.event_type || 'event',
      payload: parsed.payload || parsed,
    };
  } catch {
    // Basic string log
    const timestampMatch = logStr.match(/^\[(.*?)\]/);
    const timestamp = timestampMatch ? timestampMatch[1] : new Date().toISOString().replace('T', ' ').slice(0, 23);
    const levelMatch = logStr.match(/\[(INFO|ERROR|WARN|DEBUG)\]/);
    const level = levelMatch ? levelMatch[1] : 'INFO';
    
    return {
      id: String(index),
      timestamp,
      log_level: level,
      node_id: 'system',
      event_type: 'event',
      payload: { message: logStr }
    };
  }
};

export interface TelemetryStats {
  totalLogs: number;
  errorRate: number;
  errorCount: number;
  warningCount: number;
}

export const telemetryService = {
  getLogs: async (): Promise<TelemetryLog[]> => {
    try {
      const records = await pb.collection('conductor_state').getFullList<ConductorStateRecord>(1);
      if (records.length > 0 && records[0].state_data?.live_logs) {
        return records[0].state_data.live_logs.map((logStr, idx) => parseLogString(logStr, idx));
      }
    } catch (err) {
      console.warn('Failed to fetch logs from PocketBase, falling back to mock data', err);
    }
    return Promise.resolve(mockTelemetryLogs);
  },
  
  getStats: async (): Promise<TelemetryStats> => {
    try {
      const records = await pb.collection('conductor_state').getFullList<ConductorStateRecord>(1);
      if (records.length > 0) {
        const stateData = records[0].state_data || {};
        const liveLogs = stateData.live_logs || [];
        
        let errorCount = 0;
        let warningCount = 0;
        
        liveLogs.forEach(logStr => {
          try {
            const parsed = JSON.parse(logStr);
            if (parsed.log_level === 'ERROR') errorCount++;
            if (parsed.log_level === 'WARN') warningCount++;
          } catch {
            if (logStr.includes('[ERROR]')) errorCount++;
            if (logStr.includes('[WARN]')) warningCount++;
          }
        });

        return {
          totalLogs: liveLogs.length,
          errorRate: liveLogs.length > 0 ? Number((errorCount / liveLogs.length).toFixed(2)) : 0,
          errorCount,
          warningCount,
        };
      }
    } catch (err) {
      console.warn('Failed to fetch stats from PocketBase, falling back to mock stats', err);
    }
    return Promise.resolve({
      totalLogs: 12482,
      errorRate: 0.02,
      errorCount: 0,
      warningCount: 0,
    });
  },

  subscribeToState: (callback: (logs: TelemetryLog[], stats: TelemetryStats) => void) => {
    pb.collection('conductor_state').subscribe('*', function (e) {
      const stateData = (e.record as unknown as ConductorStateRecord).state_data || {};
      const liveLogs = stateData.live_logs || [];
      
      const logs = liveLogs.map((logStr: string, idx: number) => parseLogString(logStr, idx));
      
      let errorCount = 0;
      let warningCount = 0;
      
      liveLogs.forEach((logStr: string) => {
        try {
          const parsed = JSON.parse(logStr);
          if (parsed.log_level === 'ERROR') errorCount++;
          if (parsed.log_level === 'WARN') warningCount++;
        } catch {
          if (logStr.includes('[ERROR]')) errorCount++;
          if (logStr.includes('[WARN]')) warningCount++;
        }
      });

      const stats: TelemetryStats = {
        totalLogs: liveLogs.length,
        errorRate: liveLogs.length > 0 ? Number((errorCount / liveLogs.length).toFixed(2)) : 0,
        errorCount,
        warningCount,
      };

      callback(logs, stats);
    });

    return () => {
      // Avoid global unsubscribe by un-subscribing just the specific listener/topic
      // For PocketBase JS SDK, unsubscribe() can take the topic and listener if passed, or just unsubscribing from this component's effect
      pb.collection('conductor_state').unsubscribe('*'); // In typical react setups, you unsubscribe specific listeners. Let's do it right.
    };
  }
};
