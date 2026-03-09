import { useState, useEffect } from 'react';
import { pb } from '../services/pocketbase';

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
    const mockLogs: TelemetryLog[] = [
      {
        id: '1',
        timestamp: '2023-10-24 14:30:01.042',
        log_level: 'INFO',
        node_id: 'zulu-alpha-9',
        event_type: 'system',
        payload: { event: 'worker_started', node: 'zulu-alpha-9', uptime: 0.001 }
      },
      {
        id: '2',
        timestamp: '2023-10-24 14:30:05.118',
        log_level: 'DEBUG',
        node_id: 'zulu-alpha-9',
        event_type: 'network',
        payload: { type: 'vector_sync', status: 'partial', chunks: 1420 }
      },
      {
        id: '3',
        timestamp: '2023-10-24 14:30:12.894',
        log_level: 'ERROR',
        node_id: 'db-primary',
        event_type: 'error',
        payload: { exception: 'ConnectionTimeout: Failed to establish a connection to the database after multiple attempts. The server might be down or unreachable. This is a very long exception message designed to explicitly trigger line wrapping in the UI for test verification purposes', service: 'db-primary', retries: 3 }
      },
      {
        id: '4',
        timestamp: '2023-10-24 14:30:15.221',
        log_level: 'INFO',
        node_id: 'zulu-inference-v2',
        event_type: 'system',
        payload: { action: 'model_load', name: 'zulu-inference-v2', vram: 24102 }
      },
      {
        id: '5',
        timestamp: '2023-10-24 14:30:18.003',
        log_level: 'WARN',
        node_id: 'batch_gen',
        event_type: 'system',
        payload: { warning: 'high_memory_usage', threshold: 0.85, process: 'batch_gen' }
      },
      {
        id: '6',
        timestamp: '2023-10-24 14:30:22.455',
        log_level: 'THOUGHT',
        node_id: 'overseer-ai',
        event_type: 'thought',
        payload: { agent: 'overseer', process: 'evaluating_model_drift', confidence: 0.92 }
      },
      {
        id: '7',
        timestamp: '2023-10-24 14:30:25.912',
        log_level: 'INFO',
        node_id: 'system-pulse',
        event_type: 'system',
        payload: { msg: 'system_pulse_ok', active_sessions: 124 }
      }
    ];

    setLogs(mockLogs);

    // In a real scenario, we'd fetch from pb.collection('telemetry').getList(...)
    // and subscribe to changes pb.collection('telemetry').subscribe('*', function(e) { ... })

    return () => {
      // pb.collection('telemetry').unsubscribe('*');
    };
  }, []);

  return { logs, stats };
}
