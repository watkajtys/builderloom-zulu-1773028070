import { Network, Box, Code2, Database } from 'lucide-react';
import { CodeQualityHeader } from './CodeQualityHeader';
import { RepositoryRow } from './RepositoryRow';
import { CodeQualityStats } from './CodeQualityStats';
import { Footer } from './Footer';

export function CodeQuality() {
  const repositories = [
    {
      name: 'zulu-factory-core-v2',
      type: 'Production / Go-lang',
      coverage: 98.2,
      grade: 'A+',
      lastCommit: '4m ago',
      author: 'ac-0x2',
      icon: Network,
      coverageColorClass: 'bg-electric-blue',
      coverageShadowClass: 'shadow-[0_0_8px_rgba(0,242,255,0.4)]',
      lintTrendHeights: ['h-[40%]', 'h-[30%]', 'h-[60%]', 'h-[20%]', 'h-[15%]', 'h-[10%]'],
      lintTrendColors: ['bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-electric-blue opacity-100'],
    },
    {
      name: 'gateway-proxy-handler',
      type: 'Infrastructure / Rust',
      coverage: 84.5,
      grade: 'B',
      lastCommit: '18m ago',
      author: 'jd-0xf',
      icon: Box,
      coverageColorClass: 'bg-electric-blue/70',
      lintTrendHeights: ['h-[80%]', 'h-[90%]', 'h-[70%]', 'h-[75%]', 'h-[60%]', 'h-[55%]'],
      lintTrendColors: ['bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60'],
    },
    {
      name: 'neural-weight-distributor',
      type: 'AI Layer / Python',
      coverage: 91.0,
      grade: 'A',
      lastCommit: '1h ago',
      author: 'system-bot',
      icon: Code2,
      coverageColorClass: 'bg-electric-blue',
      coverageShadowClass: 'shadow-[0_0_4px_rgba(0,242,255,0.2)]',
      lintTrendHeights: ['h-[20%]', 'h-[25%]', 'h-[15%]', 'h-[10%]', 'h-[12%]', 'h-[8%]'],
      lintTrendColors: ['bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-neon-purple opacity-60', 'bg-electric-blue opacity-100'],
    },
    {
      name: 'vector-storage-adapter',
      type: 'Persistence / C++',
      coverage: 72.4,
      grade: 'C+',
      lastCommit: '3h ago',
      author: 'unknown-0x',
      icon: Database,
      coverageColorClass: 'bg-zinc-600',
      lintTrendHeights: ['h-[40%]', 'h-[50%]', 'h-[60%]', 'h-[65%]', 'h-[75%]', 'h-[90%]'],
      lintTrendColors: ['bg-zinc-500', 'bg-zinc-500', 'bg-zinc-500', 'bg-zinc-500', 'bg-zinc-500', 'bg-neon-purple opacity-100'],
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-obsidian text-white font-sans h-full w-full">
      <CodeQualityHeader />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Active Repositories</h3>
            <p className="text-[10px] text-zinc-grey uppercase tracking-widest">Tracking 14 production modules across 3 regions</p>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-dark-surface border border-border-muted text-[9px] font-mono text-zinc-400 rounded">SORT: COVERAGE DESC</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-bold text-zinc-grey uppercase tracking-widest border-b border-border-muted mb-2">
            <div className="col-span-4">Module Name</div>
            <div className="col-span-3">Test Coverage</div>
            <div className="col-span-2 text-center">Lint Trend</div>
            <div className="col-span-1 text-right">Complexity</div>
            <div className="col-span-2 text-right">Last Commit</div>
          </div>
          
          {repositories.map((repo, idx) => (
            <RepositoryRow key={idx} {...repo} />
          ))}
        </div>
        
        <CodeQualityStats />
      </div>
      
      <Footer 
        zone="CLOUD-NATIVE-X86"
        loadOrCpu="Automated Linting: Enabled"
        version="V2.4.1-Stable"
        transparentBackground={true}
      />
    </div>
  );
}
