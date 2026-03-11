
import { NavLink, useLocation } from 'react-router-dom';
import { Webhook, Activity, Kanban, Map, Cpu, Database, LayoutDashboard } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-border-muted flex flex-col bg-obsidian flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-electric-blue flex items-center justify-center text-obsidian shadow-lg shadow-electric-blue/20">
            <Webhook size={20} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold leading-tight uppercase tracking-tight text-white">Zulu AI</h1>
            <p className="text-[10px] text-zinc-grey uppercase tracking-widest font-semibold">Factory OS</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-electric-blue/10 text-electric-blue' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
          <Activity size={20} />
          <span className="text-sm font-medium">Telemetry</span>
        </NavLink>
        <NavLink to="/system-health" data-testid="sidebar-system-health" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive && !location.search.includes('tab=code-quality') ? 'bg-electric-blue/10 text-electric-blue' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
          <LayoutDashboard size={20} className={location.pathname === '/system-health' && !location.search.includes('tab=code-quality') ? 'fill-[1]' : ''} />
          <span className="text-sm font-semibold">System Control</span>
        </NavLink>
        <NavLink to="/system-health?tab=code-quality" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${location.pathname === '/system-health' && location.search.includes('tab=code-quality') ? 'bg-electric-blue/10 text-electric-blue' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
          <Map size={20} className={location.pathname === '/system-health' && location.search.includes('tab=code-quality') ? 'fill-[1]' : ''} />
          <span className="text-sm font-semibold">Architect Explorer</span>
        </NavLink>
        <NavLink to="/workflow" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-electric-blue/10 text-electric-blue' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
          <Kanban size={20} />
          <span className="text-sm font-medium">Workflow</span>
        </NavLink>

        <div className="pt-6 pb-2">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Development</p>
        </div>
        <NavLink to="/ci-cd" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-electric-blue/10 text-electric-blue' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
          <Activity size={20} />
          <span className="text-sm font-medium">CI/CD Pipelines</span>
        </NavLink>
        <NavLink to="/repo-sync" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-electric-blue/10 text-electric-blue' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
          <Database size={20} />
          <span className="text-sm font-medium">Repository Sync</span>
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
