import { useState, useEffect } from 'react';
import { pb } from '../services/pocketbase';
import { mockTelemetryLogs } from '../services/mockData';

export interface TelemetryLog {
  id: string;
  timestamp: string;
  log_level: string;
  node_id: string;
  event_type: string;
  payload: Record<string, any>;
}

export function useTelemetryLogs() {
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const [stats, setStats] = useState({ totalLogs: 12482, errorRate: 0.02 });

  useEffect(() => {
    // Initial mock data as requested for test passing
    setLogs(mockTelemetryLogs);

    // In a real scenario, we'd fetch from pb.collection('telemetry').getList(...)
    // and subscribe to changes pb.collection('telemetry').subscribe('*', function(e) { ... })

    return () => {
      // pb.collection('telemetry').unsubscribe('*');
    };
  }, []);

  return { logs, stats };
}
