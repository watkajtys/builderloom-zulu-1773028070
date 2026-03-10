import { Network, Box, Code2, Database } from 'lucide-react';
import { TelemetryLog } from '../hooks/useTelemetryLogs';
import { RepositoryData } from '../hooks/useRepositories';

export const mockTelemetryLogs: TelemetryLog[] = [
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

export interface StackMetric {
  label: string;
  value: string;
}

export interface StackItem {
  id: string;
  icon: any; // Using any for icon component type here to simplify
  title: string;
  subtitle: string;
  percentage: number;
  percentageLabel: string;
  barColorClass: string;
  metrics: StackMetric[];
}

import { Cpu } from 'lucide-react';

export const mockStackData: StackItem[] = [
  {
    id: 'compute',
    icon: Cpu,
    title: 'Compute Clusters',
    subtitle: 'NV-A100 Series',
    percentage: 85,
    percentageLabel: 'utilization',
    barColorClass: 'bg-electric-blue shadow-[0_0_8px_#00F2FF]',
    metrics: [
      { label: 'Node Count', value: '128 Total' },
      { label: 'Avg Temp', value: '42°C' },
    ],
  },
  {
    id: 'vector',
    icon: Database,
    title: 'Vector Storage',
    subtitle: 'Distributed NVMe',
    percentage: 62,
    percentageLabel: 'capacity',
    barColorClass: 'bg-electric-blue/60',
    metrics: [
      { label: 'Latency', value: '0.8ms' },
      { label: 'IOPS', value: '1.2M' },
    ],
  },
  {
    id: 'gateway',
    icon: Network,
    title: 'API Gateway',
    subtitle: 'High Availability',
    percentage: 94,
    percentageLabel: 'uptime',
    barColorClass: 'bg-electric-blue shadow-[0_0_4px_#00F2FF]',
    metrics: [
      { label: 'Throughput', value: '45k req/s' },
      { label: 'Active Conn', value: '8.4k' },
    ],
  },
];

export const mockRepositories: RepositoryData[] = [
  {
    name: 'zulu-factory-core-v2',
    type: 'Production / Go-lang',
    coverage: 98.2,
    grade: 'A+',
    lastCommit: '4m ago',
    author: 'ac-0x2',
    icon: Network,
    coverageColorClass: 'bg-electric-blue',
    coverageShadowClass: 'shadow-[0_0_8px_rgba(0,242,255,0.4)]',
    lintTrendHeights: ['h-[40%]', 'h-[30%]', 'h-[60%]', 'h-[20%]', 'h-[15%]', 'h-[10%]'],
    lintTrendColors: ['bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-electric-blue opacity-100'],
  },
  {
    name: 'gateway-proxy-handler',
    type: 'Infrastructure / Rust',
    coverage: 84.5,
    grade: 'B',
    lastCommit: '18m ago',
    author: 'jd-0xf',
    icon: Box,
    coverageColorClass: 'bg-electric-blue/70',
    lintTrendHeights: ['h-[80%]', 'h-[90%]', 'h-[70%]', 'h-[75%]', 'h-[60%]', 'h-[55%]'],
    lintTrendColors: ['bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60'],
  },
  {
    name: 'neural-weight-distributor',
    type: 'AI Layer / Python',
    coverage: 91.0,
    grade: 'A',
    lastCommit: '1h ago',
    author: 'system-bot',
    icon: Code2,
    coverageColorClass: 'bg-electric-blue',
    coverageShadowClass: 'shadow-[0_0_4px_rgba(0,242,255,0.2)]',
    lintTrendHeights: ['h-[20%]', 'h-[25%]', 'h-[15%]', 'h-[10%]', 'h-[12%]', 'h-[8%]'],
    lintTrendColors: ['bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-electric-blue opacity-100'],
  },
  {
    name: 'vector-storage-adapter',
    type: 'Persistence / C++',
    coverage: 72.4,
    grade: 'C+',
    lastCommit: '3h ago',
    author: 'unknown-0x',
    icon: Database,
    coverageColorClass: 'bg-zinc-600',
    lintTrendHeights: ['h-[40%]', 'h-[50%]', 'h-[60%]', 'h-[65%]', 'h-[75%]', 'h-[90%]'],
    lintTrendColors: ['bg-zinc-500', 'bg-zinc-500', 'bg-zinc-500', 'bg-zinc-500', 'bg-zinc-500', 'bg-neon-purple opacity-100'],
  },
];
