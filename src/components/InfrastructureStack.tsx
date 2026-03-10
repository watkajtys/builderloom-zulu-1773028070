import { Cpu, Database, Network } from 'lucide-react';
import { ComponentType } from 'react';

interface Metric {
  label: string;
  value: string;
}

interface StackItem {
  id: string;
  icon: ComponentType<any>;
  title: string;
  subtitle: string;
  percentage: number;
  percentageLabel: string;
  barColorClass: string;
  metrics: Metric[];
}

const stackData: StackItem[] = [
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

export function InfrastructureStack() {
  return (
    <div className="w-[40%] border-r border-border-muted flex flex-col overflow-y-auto custom-scrollbar p-6 space-y-4 bg-obsidian/40">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-bold text-zinc-grey uppercase tracking-[0.2em]">Infrastructure Stack</h3>
        <span className="text-[10px] font-mono text-electric-blue bg-electric-blue/10 px-2 py-0.5 rounded">{stackData.length} ACTIVE</span>
      </div>
      
      {stackData.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.id} className="p-5 bg-dark-surface border border-border-muted rounded-lg hover:border-slate-600 transition-colors group relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(from 0deg, #00F2FF ${item.percentage}%, transparent 0%)` }}>
                  <div className="absolute w-10 h-10 bg-dark-surface rounded-full"></div>
                  <Icon size={18} className="text-electric-blue z-10" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">{item.title}</h4>
                  <p className="text-[10px] text-zinc-grey uppercase font-bold tracking-widest">{item.subtitle}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-lg font-bold text-electric-blue">{item.percentage}%</span>
                <p className="text-[9px] text-zinc-grey uppercase font-bold">{item.percentageLabel}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${item.barColorClass}`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {item.metrics.map((metric, index) => (
                  <div key={index} className="bg-black/20 p-2 rounded">
                    <p className="text-[9px] text-zinc-grey uppercase font-bold">{metric.label}</p>
                    <p className="font-mono text-xs text-white">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
