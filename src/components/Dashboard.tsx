import React from 'react';

export default function Dashboard() {
  return (
<div className="flex h-full overflow-hidden">
<aside className="w-60 border-r border-border-muted flex flex-col bg-obsidian flex-shrink-0">
<div className="p-5">
<div className="flex items-center gap-3">
<div className="w-7 h-7 bg-electric-blue flex items-center justify-center text-obsidian rounded-sm">
<span className="material-symbols-outlined text-lg font-bold">webhook</span>
</div>
<div className="flex flex-col">
<h1 className="text-xs font-black leading-tight uppercase tracking-tighter text-white">Zulu <span className="text-electric-blue">AI</span></h1>
<p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Factory OS</p>
</div>
</div>
</div>
<nav className="flex-1 px-3 space-y-0.5">
<a className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:text-electric-blue hover:bg-white/5 transition-all group" href="#">
<span className="material-symbols-outlined text-[18px]">analytics</span>
<span className="text-xs font-semibold uppercase tracking-wider">Telemetry</span>
</a>
<a className="flex items-center gap-3 px-3 py-2 rounded bg-electric-blue/5 text-electric-blue border-l-2 border-electric-blue transition-all" href="#">
<span className="material-symbols-outlined text-[18px] fill-[1]">monitor_heart</span>
<span className="text-xs font-bold uppercase tracking-wider neon-glow-blue">System Health</span>
</a>
<a className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:text-neon-purple hover:bg-white/5 transition-all" href="#">
<span className="material-symbols-outlined text-[18px]">view_kanban</span>
<span className="text-xs font-semibold uppercase tracking-wider">Kanban</span>
</a>
<a className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-all" href="#">
<span className="material-symbols-outlined text-[18px]">alt_route</span>
<span className="text-xs font-semibold uppercase tracking-wider">Roadmap</span>
</a>
<div className="pt-6 pb-2">
<p className="px-3 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Infrastructure</p>
</div>
<a className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-all" href="#">
<span className="material-symbols-outlined text-[18px]">memory</span>
<span className="text-xs font-semibold uppercase tracking-wider">Clusters</span>
</a>
<a className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-all" href="#">
<span className="material-symbols-outlined text-[18px]">database</span>
<span className="text-xs font-semibold uppercase tracking-wider">Vectors</span>
</a>
</nav>
<div className="p-4 border-t border-border-muted">
<div className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer">
<img alt="User" className="w-7 h-7 rounded-sm grayscale hover:grayscale-0 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8n2h3FHCtOYJgNIdatiF69XTnXeYK_8v8XvBV9-uj5-l0xDi-DlFv5R3hmB4kjeBAEo_nHuSMbBPzreqJQ_E-QLvDOZFjhId4dhVfYduM-e1pcOQNWuH-58yqJjtnusOUZ4PXGSIvIOn0xqDPidd9c6EynCKftvMCtVN-jbP72BROVKVJFnd3FQPYKdDGIIwDsHgDaSBVS79Sq0b_C5TLNBDddZertU0g9Qkq9XHUDF4qjvRQxf6Gekh9EPy0XNvtXv7fWGP2guT6"/>
<div className="flex-1 min-w-0">
<p className="text-[10px] font-bold text-white truncate">ALEX_CHEN</p>
<p className="text-[9px] text-electric-blue/70 truncate uppercase tracking-tighter">Priority-Zero</p>
</div>
</div>
</div>
</aside>
<main className="flex-1 flex flex-col min-w-0 overflow-hidden">
<header className="h-10 border-b border-border-muted bg-obsidian flex items-center justify-between px-6 flex-shrink-0">
<div className="flex items-center gap-8">
<nav className="flex items-center gap-4">
<button className="text-[10px] font-black text-electric-blue border-b border-electric-blue pb-0.5 tracking-widest uppercase">Health</button>
<button className="text-[10px] font-bold text-slate-500 hover:text-white tracking-widest uppercase transition-colors">Logs</button>
<button className="text-[10px] font-bold text-slate-500 hover:text-white tracking-widest uppercase transition-colors">Nodes</button>
</nav>
<div className="flex items-center gap-2">
<div className="w-1 h-1 rounded-full bg-electric-blue animate-pulse"></div>
<span className="text-[9px] font-black text-electric-blue uppercase tracking-tighter neon-glow-blue">Engine Active</span>
</div>
</div>
<div className="flex items-center gap-4">
<div className="relative">
<input className="h-6 pl-2 pr-8 text-[10px] bg-dark-surface border border-border-muted rounded text-slate-300 focus:border-electric-blue focus:ring-0 w-40 transition-all font-mono" placeholder="SEARCH_ZULU_SYSTEM..." type="text"/>
<span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
</div>
<button className="text-slate-500 hover:text-electric-blue transition-colors">
<span className="material-symbols-outlined text-[18px]">notifications</span>
</button>
</div>
</header>
<div className="flex flex-1 overflow-hidden">
<div className="w-[60%] flex flex-col border-r border-border-muted bg-obsidian overflow-y-auto custom-scrollbar">
<div className="p-6 space-y-6">
<div className="flex items-center justify-between">
<h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Hardware_State // Real-time</h2>
<div className="flex gap-1">
<button className="p-1 rounded text-slate-500 hover:text-electric-blue transition-colors"><span className="material-symbols-outlined text-sm">refresh</span></button>
<button className="p-1 rounded text-slate-500 hover:text-electric-blue transition-colors"><span className="material-symbols-outlined text-sm">open_in_full</span></button>
</div>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="p-4 bg-dark-surface border border-border-muted rounded-lg neon-border-blue relative overflow-hidden group">
<div className="absolute top-0 right-0 w-16 h-16 bg-electric-blue/5 -mr-8 -mt-8 rounded-full blur-2xl"></div>
<div className="flex justify-between items-start mb-4">
<span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">CPU_CORE_LOAD</span>
<span className="material-symbols-outlined text-electric-blue text-lg">memory</span>
</div>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-black text-white tracking-tighter">24.8<span className="text-xs text-slate-500 ml-1">%</span></span>
<span className="text-[10px] text-electric-blue font-bold flex items-center bg-electric-blue/10 px-1.5 py-0.5 rounded">
<span className="material-symbols-outlined text-[10px] mr-1">arrow_downward</span> -2.5
                                </span>
</div>
<div className="mt-4 h-1 bg-obsidian rounded-full overflow-hidden">
<div className="h-full bg-electric-blue rounded-full w-[24.8%] shadow-[0_0_8px_rgba(0,242,255,0.8)]"></div>
</div>
</div>
<div className="p-4 bg-dark-surface border border-border-muted rounded-lg relative overflow-hidden group">
<div className="absolute top-0 right-0 w-16 h-16 bg-neon-purple/5 -mr-8 -mt-8 rounded-full blur-2xl"></div>
<div className="flex justify-between items-start mb-4">
<span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">MEMORY_ALLOC</span>
<span className="material-symbols-outlined text-neon-purple text-lg">equalizer</span>
</div>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-black text-white tracking-tighter">4.2<span className="text-xs text-slate-500 ml-1">GB</span></span>
<span className="text-[10px] text-neon-purple font-bold flex items-center bg-neon-purple/10 px-1.5 py-0.5 rounded">
<span className="material-symbols-outlined text-[10px] mr-1">arrow_upward</span> +0.8
                                </span>
</div>
<div className="mt-4 h-1 bg-obsidian rounded-full overflow-hidden">
<div className="h-full bg-neon-purple rounded-full w-[62%] shadow-[0_0_8px_rgba(188,19,254,0.8)]"></div>
</div>
</div>
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
<stop />
<stop />
</linearGradient>
<linearGradient id="purpleGrad" x1="0" x2="0" y1="0" y2="1">
<stop />
<stop />
</linearGradient>
</defs>
<path />
<path />
<path />
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
<div className="p-3 bg-dark-surface border border-border-muted rounded flex items-center justify-between border-l-2 border-l-electric-blue">
<div className="flex flex-col">
<span className="text-[10px] font-black text-white uppercase tracking-tighter">NODE-01</span>
<span className="text-[8px] text-electric-blue font-bold uppercase tracking-tighter">ONLINE</span>
</div>
<div className="w-1.5 h-1.5 rounded-full bg-electric-blue shadow-[0_0_8px_#00f2ff]"></div>
</div>
<div className="p-3 bg-dark-surface border border-border-muted rounded flex items-center justify-between">
<div className="flex flex-col">
<span className="text-[10px] font-black text-white uppercase tracking-tighter text-opacity-50">NODE-02</span>
<span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">STANDBY</span>
</div>
<div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
</div>
<div className="p-3 bg-dark-surface border border-border-muted rounded flex items-center justify-between border-l-2 border-l-neon-purple">
<div className="flex flex-col">
<span className="text-[10px] font-black text-white uppercase tracking-tighter">NODE-03</span>
<span className="text-[8px] text-neon-purple font-bold uppercase tracking-tighter">SYNCING</span>
</div>
<div className="w-1.5 h-1.5 rounded-full bg-neon-purple shadow-[0_0_8px_#bc13fe]"></div>
</div>
</div>
</div>
</div>
</div>
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
<button className="text-slate-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">tune</span></button>
</div>
</div>
<div className="flex-1 overflow-y-auto custom-scrollbar p-4 font-mono text-[10px] leading-[1.6] space-y-1 bg-obsidian">
<div className="flex gap-3 p-1 border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group">
<span className="text-slate-600 shrink-0 uppercase">14:30:01</span>
<span className="text-electric-blue shrink-0 font-bold">[SYS]</span>
<span className="text-slate-400 group-hover:text-slate-200">Garbage collection triggered: +245MB heap</span>
</div>
<div className="flex gap-3 p-1 border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group">
<span className="text-slate-600 shrink-0 uppercase">14:30:12</span>
<span className="text-electric-blue shrink-0 font-bold">[SYS]</span>
<span className="text-slate-400 group-hover:text-slate-200">Handshake initialized: LB_ALPHA &lt;-&gt; NODE_07</span>
</div>
<div className="flex gap-3 p-1 border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group">
<span className="text-slate-600 shrink-0 uppercase">14:30:15</span>
<span className="text-neon-purple shrink-0 font-bold">[DBG]</span>
<span className="text-slate-500 group-hover:text-slate-200">WS_CONN_ESTABLISHED IP::219.0.4.11</span>
</div>
<div className="flex gap-3 p-1 border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group">
<span className="text-slate-600 shrink-0 uppercase">14:30:24</span>
<span className="text-electric-blue shrink-0 font-bold">[INF]</span>
<span className="text-slate-400 group-hover:text-slate-200">Weights sync: llama-3-70b-zulu [OK]</span>
</div>
<div className="flex gap-3 p-1 border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group">
<span className="text-slate-600 shrink-0 uppercase">14:30:35</span>
<span className="text-amber-500 shrink-0 font-bold">[WRN]</span>
<span className="text-amber-200/80">LATENCY_THRESHOLD_EXCEEDED API_GATEWAY: 450ms</span>
</div>
<div className="flex gap-3 p-1 border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group">
<span className="text-slate-600 shrink-0 uppercase">14:30:42</span>
<span className="text-electric-blue shrink-0 font-bold">[SYS]</span>
<span className="text-slate-400 group-hover:text-slate-200">Heartbeat: 12/12 workers active</span>
</div>
<div className="flex gap-3 p-1 border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group">
<span className="text-slate-600 shrink-0 uppercase">14:30:51</span>
<span className="text-neon-purple shrink-0 font-bold">[DBG]</span>
<span className="text-slate-500 group-hover:text-slate-200">Cache_Purge: 1,420 entries (TTL)</span>
</div>
<div className="flex gap-3 p-1 border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group">
<span className="text-slate-600 shrink-0 uppercase">14:31:05</span>
<span className="text-electric-blue shrink-0 font-bold">[INF]</span>
<span className="text-slate-400 group-hover:text-slate-200">LB_REGION: us-east-1 balance confirmed</span>
</div>
<div className="flex gap-3 p-1 border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group">
<span className="text-slate-600 shrink-0 uppercase">14:31:12</span>
<span className="text-red-500 shrink-0 font-bold">[ERR]</span>
<span className="text-red-400 font-bold underline decoration-red-900">VECTOR_STORE_CONNECTION_REFUSED :: retrying...</span>
</div>
<div className="flex gap-3 p-1 border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group">
<span className="text-slate-600 shrink-0 uppercase">14:31:18</span>
<span className="text-neon-purple shrink-0 font-bold">[DBG]</span>
<span className="text-slate-500 group-hover:text-slate-200">Auto_Optimize: analyzing Pool-B fragments</span>
</div>
<div className="flex gap-3 p-1 border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group">
<span className="text-slate-600 shrink-0 uppercase">14:31:25</span>
<span className="text-electric-blue shrink-0 font-bold">[SYS]</span>
<span className="text-white font-bold">DEPLOY_COMPLETE: v2.4.1-alpha LIVE</span>
</div>
</div>
<div className="h-12 border-t border-border-muted bg-dark-surface flex items-center justify-between px-4 flex-shrink-0">
<div className="flex items-center gap-2">
<input className="bg-obsidian border-border-muted text-[10px] h-7 rounded px-3 focus:border-electric-blue focus:ring-0 w-44 text-slate-400 font-mono" placeholder="FILTER_STREAM..." type="text"/>
</div>
<div className="flex items-center gap-4">
<span className="text-[8px] font-mono text-slate-500 uppercase">1.2k events/hr</span>
<button className="bg-dark-surface border border-border-muted text-zinc-grey text-[9px] font-black px-4 py-1.5 rounded uppercase hover:text-white hover:bg-white/5 transition-colors">Export</button>
</div>
</div>
</div>
</div>
</main>
</div>

  );
}
