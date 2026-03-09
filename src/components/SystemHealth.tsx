import React from 'react';
import { MetricCard } from './MetricCard';
import { WorkerNode } from './WorkerNode';
import { TelemetryStream } from './TelemetryStream';

export function SystemHealth() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="w-[60%] flex flex-col border-r border-border-muted bg-obsidian overflow-y-auto custom-scrollbar">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Hardware_State // Real-time</h2>
            <div className="flex gap-1">
              <button className="p-1 rounded text-slate-500 hover:text-electric-blue transition-colors">
                <span className="material-symbols-outlined text-sm">refresh</span>
              </button>
              <button className="p-1 rounded text-slate-500 hover:text-electric-blue transition-colors">
                <span className="material-symbols-outlined text-sm">open_in_full</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="CPU_CORE_LOAD"
              icon="memory"
              value="24.8"
              unit="%"
              change="2.5"
              trend="down"
              percentage={24.8}
              color="blue"
            />
            <MetricCard
              title="MEMORY_ALLOC"
              icon="equalizer"
              value="4.2"
              unit="GB"
              change="0.8"
              trend="up"
              percentage={62}
              color="purple"
            />
          </div>

          <div className="p-6 bg-dark-surface border border-border-muted rounded-lg">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Inference Throughput</h3>
                <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-tighter font-mono">Factory Node Aggregation [REQ/S]</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-electric-blue"></div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Primary</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-purple"></div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Secondary</span>
                </div>
              </div>
            </div>

            <div className="h-[220px] w-full relative">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
                <defs>
                  <linearGradient id="blueGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0, 242, 255, 0.2)" />
                    <stop offset="100%" stopColor="rgba(0, 242, 255, 0)" />
                  </linearGradient>
                  <linearGradient id="purpleGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(188, 19, 254, 0.2)" />
                    <stop offset="100%" stopColor="rgba(188, 19, 254, 0)" />
                  </linearGradient>
                </defs>
                <path d="M0,80 Q50,70 100,50 T200,40 T300,60 T400,30 L400,100 L0,100 Z" fill="url(#blueGrad)" />
                <path d="M0,80 Q50,70 100,50 T200,40 T300,60 T400,30" fill="none" stroke="#00F2FF" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 4px rgba(0,242,255,0.5))' }} />
                <path d="M0,90 Q80,80 150,70 T250,80 T350,50 T400,60" fill="none" stroke="#BC13FE" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 4px rgba(188,19,254,0.5))' }} strokeDasharray="4 4" />
              </svg>

              <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-[8px] font-mono font-bold text-slate-600 py-1">
                <span>2.0K</span>
                <span>1.0K</span>
                <span>0.0K</span>
              </div>
            </div>

            <div className="flex justify-between mt-4 text-[8px] font-mono font-bold text-slate-600 uppercase">
              <span>14:20:00</span>
              <span>14:25:00</span>
              <span>14:30:00</span>
              <span>14:35:00</span>
              <span>14:40:00</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Worker_Nodes</h3>
            <div className="grid grid-cols-3 gap-3">
              <WorkerNode id="NODE-01" status="ONLINE" />
              <WorkerNode id="NODE-02" status="STANDBY" />
              <WorkerNode id="NODE-03" status="SYNCING" />
            </div>
          </div>
        </div>
      </div>
      <TelemetryStream />
    </div>
  );
}
