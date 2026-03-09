import React, { useState, useEffect } from 'react';
import { MetricCard } from './MetricCard';
import { WorkerNode } from './WorkerNode';
import { TelemetryStream } from './TelemetryStream';

// Generates a smooth SVG path using cubic bezier curves with bottom padding to prevent clipping
const generateSmoothPath = (data: number[], width: number, height: number): string => {
  if (data.length === 0) return '';
  
  // Padding so the stroke doesn't clip the bottom baseline.
  // We'll map values from 0-100 to range between (height - padding) and padding.
  const bottomPadding = 10;
  const topPadding = 5;
  const effectiveHeight = height - bottomPadding - topPadding;
  
  const stepX = width / (data.length - 1);
  
  // Helper to calculate Y coordinates ensuring padding
  const getY = (val: number) => {
    // val is assumed to be 0-100 percentage.
    // When val is 0, y is at height - bottomPadding.
    // When val is 100, y is at topPadding.
    return (height - bottomPadding) - ((val / 100) * effectiveHeight);
  };

  const points = data.map((val, i) => ({
    x: i * stepX,
    y: getY(val)
  }));

  // Start the path
  let path = `M${points[0].x},${points[0].y}`;

  // Add cubic bezier curves
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    
    // Control points to apply slight curve tension (smooth interpolation)
    const cp1x = p0.x + (stepX * 0.4);
    const cp1y = p0.y;
    const cp2x = p1.x - (stepX * 0.4);
    const cp2y = p1.y;

    path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
  }

  return path;
};

export function SystemHealth() {
  // Simulate live telemetry data for chart
  const [primaryData, setPrimaryData] = useState<number[]>([40, 60, 45, 75, 50, 80, 65, 85, 70, 90, 80, 95]);
  const [secondaryData, setSecondaryData] = useState<number[]>([30, 40, 35, 50, 40, 60, 50, 70, 60, 75, 65, 80]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrimaryData(prev => {
        const next = [...prev.slice(1)];
        // Add random fluctuation between -15 and +15, bounded 20-100
        const lastVal = prev[prev.length - 1];
        let newVal = lastVal + (Math.random() * 30 - 15);
        newVal = Math.max(20, Math.min(100, newVal));
        next.push(newVal);
        return next;
      });
      
      setSecondaryData(prev => {
        const next = [...prev.slice(1)];
        // Add random fluctuation bounded 10-85
        const lastVal = prev[prev.length - 1];
        let newVal = lastVal + (Math.random() * 25 - 12);
        newVal = Math.max(10, Math.min(85, newVal));
        next.push(newVal);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
                <path 
                  d={`${generateSmoothPath(primaryData, 400, 100)} L400,100 L0,100 Z`} 
                  fill="url(#blueGrad)" 
                />
                <path 
                  d={generateSmoothPath(primaryData, 400, 100)} 
                  fill="none" 
                  stroke="#00F2FF" 
                  strokeWidth="2" 
                  style={{ filter: 'drop-shadow(0 0 4px rgba(0,242,255,0.5))' }} 
                />
                <path 
                  d={generateSmoothPath(secondaryData, 400, 100)} 
                  fill="none" 
                  stroke="#BC13FE" 
                  strokeWidth="2" 
                  style={{ filter: 'drop-shadow(0 0 4px rgba(188,19,254,0.5))' }} 
                  strokeDasharray="4 4" 
                />
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
