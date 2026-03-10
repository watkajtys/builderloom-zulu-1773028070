
import { NavLink, useLocation } from 'react-router-dom';
import { Webhook, Activity, HeartPulse, Kanban, Map, Cpu, Database, Code2 } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab');

  return (
    <aside className="w-60 border-r border-border-muted flex flex-col bg-obsidian flex-shrink-0">
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-electric-blue flex items-center justify-center text-obsidian rounded-sm">
            <Webhook size={18} className="font-bold" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs font-black leading-tight uppercase tracking-tighter text-white">Zulu <span className="text-electric-blue">AI</span></h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Factory OS</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-0.5">
        <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded transition-all group ${isActive ? 'bg-electric-blue/5 text-electric-blue border-l-2 border-electric-blue' : 'text-slate-400 hover:text-electric-blue hover:bg-white/5'}`}>
          <Activity size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">Telemetry</span>
        </NavLink>
        <NavLink to="/health?tab=system-health" className={() => `flex items-center gap-3 px-3 py-2 rounded transition-all ${location.pathname === '/health' && (activeTab === 'system-health' || !activeTab) ? 'bg-electric-blue/5 text-electric-blue border-l-2 border-electric-blue' : 'text-slate-400 hover:text-electric-blue hover:bg-white/5'}`}>
          <HeartPulse size={18} className="fill-[1]" />
          <span className="text-xs font-bold uppercase tracking-wider neon-glow-blue">Health</span>
        </NavLink>
        <NavLink to="/health?tab=code-quality" className={() => `flex items-center gap-3 px-3 py-2 rounded transition-all ${location.pathname === '/health' && activeTab === 'code-quality' ? 'bg-electric-blue/5 text-electric-blue border-l-2 border-electric-blue' : 'text-slate-400 hover:text-electric-blue hover:bg-white/5'}`}>
          <Code2 size={18} className="fill-[1]" />
          <span className="text-xs font-bold uppercase tracking-wider">Code Quality</span>
        </NavLink>
        <NavLink to="/kanban" className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:text-neon-purple hover:bg-white/5 transition-all">
          <Kanban size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">Kanban</span>
        </NavLink>
        <NavLink to="/roadmap" className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          <Map size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">Roadmap</span>
        </NavLink>

        <div className="pt-6 pb-2">
          <p className="px-3 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Infrastructure</p>
        </div>
        <NavLink to="/clusters" className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          <Cpu size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">Clusters</span>
        </NavLink>
        <NavLink to="/vectors" className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          <Database size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">Vectors</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-border-muted">
        <div className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer">
          <img alt="User" className="w-7 h-7 rounded-sm grayscale hover:grayscale-0 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8n2h3FHCtOYJgNIdatiF69XTnXeYK_8v8XvBV9-uj5-l0xDi-DlFv5R3hmB4kjeBAEo_nHuSMbBPzreqJQ_E-QLvDOZFjhId4dhVfYduM-e1pcOQNWuH-58yqJjtnusOUZ4PXGSIvIOn0xqDPidd9c6EynCKftvMCtVN-jbP72BROVKVJFnd3FQPYKdDGIIwDsHgDaSBVS79Sq0b_C5TLNBDddZertU0g9Qkq9XHUDF4qjvRQxf6Gekh9EPy0XNvtXv7fWGP2guT6" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-white truncate">ALEX_CHEN</p>
            <p className="text-[9px] text-electric-blue/70 truncate uppercase tracking-tighter">Priority-Zero</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
