
import { DisplayLog } from '../hooks/useTelemetryLogs';
import { Terminal, SlidersHorizontal } from 'lucide-react';

interface TelemetryStreamProps {
  logs: DisplayLog[];
}

export function TelemetryStream({ logs: displayLogs }: TelemetryStreamProps) {
  return (
    <div className="w-[40%] flex flex-col bg-obsidian border-l border-border-muted overflow-hidden">
      <div className="h-10 px-4 flex items-center justify-between border-b border-border-muted bg-dark-surface/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-electric-blue" />
          <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Telemetry_Stream</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-electric-blue animate-pulse"></div>
            <span className="text-[8px] font-black text-electric-blue uppercase tracking-widest">LIVE</span>
          </div>
          <button className="text-slate-500 hover:text-white transition-colors">
            <SlidersHorizontal size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 font-mono text-[10px] leading-[1.6] space-y-1 bg-obsidian">
        {displayLogs.map((log, index) => (
          <div key={index} className="flex p-1 border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group relative pl-[104px]">
            <span className="absolute left-1 top-1 text-slate-600 w-16 uppercase">{log.time}</span>
            <span className={`absolute left-[76px] top-1 ${log.color} w-10 font-bold`}>[{log.level}]</span>
            <span className={`flex-1 break-words ${log.messageColor || 'text-slate-400 group-hover:text-slate-200'} ${log.isError ? 'text-red-400 font-bold underline decoration-red-900' : ''}`}>
              {log.message}
            </span>
          </div>
        ))}
      </div>

      <div className="h-12 border-t border-border-muted bg-dark-surface flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <input className="bg-obsidian border-border-muted text-[10px] h-7 rounded px-3 focus:border-electric-blue focus:ring-0 w-44 text-slate-400 font-mono" placeholder="FILTER_STREAM..." type="text" />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[8px] font-mono text-slate-500 uppercase">1.2k events/hr</span>
          {/* De-emphasized EXPORT button as requested */}
          <button className="bg-dark-surface border border-border-muted text-zinc-grey text-[9px] font-black px-4 py-1.5 rounded uppercase hover:text-white hover:bg-white/5 transition-colors">
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
