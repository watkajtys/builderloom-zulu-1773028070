import React from 'react';
import { MetricCard } from './MetricCard';
import { WorkerNode } from './WorkerNode';
import { TelemetryStream } from './TelemetryStream';
import { InferenceChart } from './InferenceChart';
import { useTelemetry } from '../hooks/useTelemetry';
import { useTelemetryLogs } from '../hooks/useTelemetryLogs';

export function SystemHealth() {
  const { primaryData, secondaryData } = useTelemetry();
  const { logs } = useTelemetryLogs();

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

          <InferenceChart primaryData={primaryData} secondaryData={secondaryData} />

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
      <TelemetryStream logs={logs} />
    </div>
  );
}
