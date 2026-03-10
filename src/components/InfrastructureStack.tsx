import { mockStackData } from '../services/mockData';

export function InfrastructureStack() {
  return (
    <div className="w-[40%] border-r border-border-muted flex flex-col overflow-y-auto custom-scrollbar p-6 space-y-4 bg-obsidian/40">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-bold text-zinc-grey uppercase tracking-[0.2em]">Infrastructure Stack</h3>
        <span className="text-[10px] font-mono text-electric-blue bg-electric-blue/10 px-2 py-0.5 rounded">{mockStackData.length} ACTIVE</span>
      </div>
      
      {mockStackData.map((item) => {
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
