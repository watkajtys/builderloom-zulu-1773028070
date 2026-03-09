
import { generateSmoothPath } from '../utils/chartUtils';

interface InferenceChartProps {
  primaryData: number[];
  secondaryData: number[];
}

export function InferenceChart({ primaryData, secondaryData }: InferenceChartProps) {
  return (
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
  );
}
