import { Database, Cpu } from 'lucide-react';

interface FooterProps {
  zone?: string;
  loadOrCpu?: string;
  version?: string;
  transparentBackground?: boolean;
}

export function Footer({ 
  zone = 'US-EAST-1-PROD', 
  loadOrCpu = 'Stable', 
  version = 'V2.4.1-Stable',
  transparentBackground = false 
}: FooterProps) {
  return (
    <footer className={`h-10 border-t border-border-muted ${transparentBackground ? 'bg-obsidian/80' : 'bg-obsidian'} flex items-center justify-between px-6 flex-shrink-0 text-[10px] font-bold text-zinc-grey uppercase tracking-widest`}>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Database size={14} />
          <span>Zone: {zone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu size={14} />
          <span>{loadOrCpu.includes('CPU') ? loadOrCpu : `System Load: ${loadOrCpu}`}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span>Zulu OS {version}</span>
        <div className="w-2 h-2 rounded-full bg-electric-blue shadow-[0_0_8px_#00F2FF]"></div>
      </div>
    </footer>
  );
}
