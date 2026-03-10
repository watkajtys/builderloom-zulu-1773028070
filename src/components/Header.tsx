import { TopNavUtility } from './TopNavUtility';
import { PageHeader } from './PageHeader';

export function Header() {
  const leftContent = (
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
  );

  return (
    <PageHeader
      leftContent={leftContent}
      rightContent={<TopNavUtility />}
      transparentBackground={false}
    />
  );
}
