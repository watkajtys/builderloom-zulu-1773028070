import { Cpu, Network, Database } from 'lucide-react';

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
