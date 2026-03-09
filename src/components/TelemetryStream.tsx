import React from 'react';

export function TelemetryStream() {
  const logs = [
    { time: '14:30:01', level: 'SYS', color: 'text-electric-blue', message: 'Garbage collection triggered: +245MB heap' },
    { time: '14:30:12', level: 'SYS', color: 'text-electric-blue', message: 'Handshake initialized: LB_ALPHA <-> NODE_07' },
    { time: '14:30:15', level: 'DBG', color: 'text-neon-purple', message: 'WS_CONN_ESTABLISHED IP::219.0.4.11', messageColor: 'text-slate-500' },
    { time: '14:30:24', level: 'INF', color: 'text-electric-blue', message: 'Weights sync: llama-3-70b-zulu [OK]' },
    { time: '14:30:35', level: 'WRN', color: 'text-amber-500', message: 'LATENCY_THRESHOLD_EXCEEDED API_GATEWAY: 450ms', messageColor: 'text-amber-200/80' },
    { time: '14:30:42', level: 'SYS', color: 'text-electric-blue', message: 'Heartbeat: 12/12 workers active' },
    { time: '14:30:51', level: 'DBG', color: 'text-neon-purple', message: 'Cache_Purge: 1,420 entries (TTL)', messageColor: 'text-slate-500' },
    { time: '14:31:05', level: 'INF', color: 'text-electric-blue', message: 'LB_REGION: us-east-1 balance confirmed' },
    { time: '14:31:12', level: 'ERR', color: 'text-red-500', message: 'VECTOR_STORE_CONNECTION_REFUSED :: retrying...', isError: true },
    { time: '14:31:18', level: 'DBG', color: 'text-neon-purple', message: 'Auto_Optimize: analyzing Pool-B fragments', messageColor: 'text-slate-500' },
    { time: '14:31:25', level: 'SYS', color: 'text-electric-blue', message: 'DEPLOY_COMPLETE: v2.4.1-alpha LIVE', messageColor: 'text-white font-bold' },
  ];

  return (
    <div className="w-[40%] flex flex-col bg-obsidian border-l border-border-muted overflow-hidden">
      <div className="h-10 px-4 flex items-center justify-between border-b border-border-muted bg-dark-surface/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-electric-blue text-sm">terminal</span>
          <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Telemetry_Stream</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-electric-blue animate-pulse"></div>
            <span className="text-[8px] font-black text-electric-blue uppercase tracking-widest">LIVE</span>
          </div>
          <button className="text-slate-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm">tune</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 font-mono text-[10px] leading-[1.6] space-y-1 bg-obsidian">
        {logs.map((log, index) => (
          <div key={index} className="flex gap-3 p-1 border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group">
            <span className="text-slate-600 shrink-0 w-16 uppercase">{log.time}</span>
            <span className={`${log.color} shrink-0 w-10 font-bold`}>[{log.level}]</span>
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
