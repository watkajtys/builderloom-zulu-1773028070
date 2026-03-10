import { ShieldAlert, Terminal, CheckCircle2, History, CheckSquare, Bug, Code2, Network, Box, Database, Filter } from 'lucide-react';

export function CodeQuality() {
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-obsidian text-white font-sans h-full w-full">
      <header className="h-14 border-b border-border-muted bg-obsidian/50 backdrop-blur-md flex items-center justify-between px-6 flex-shrink-0 z-20">
        <div className="flex items-center gap-6">
          <h2 className="text-xs font-bold text-zinc-grey uppercase tracking-[0.2em]">Code Quality / <span className="text-white">Repository Pulse</span></h2>
          <div className="h-4 w-px bg-border-muted"></div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-electric-blue shadow-[0_0_8px_#00F2FF]"></div>
              <span className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">Scanning Repositories...</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-border-muted pr-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">Global Health</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono font-bold text-white tracking-tighter">94.2<span className="text-electric-blue">%</span></span>
                <div className="w-8 h-8 rounded-full p-[2px]" style={{ background: 'conic-gradient(from 0deg, #00F2FF 94.2%, #111111 0%)' }}>
                  <div className="w-full h-full rounded-full bg-dark-surface flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-electric-blue" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-electric-blue/20 hover:bg-electric-blue/30 text-electric-blue text-[10px] font-bold px-3 py-1.5 rounded border border-electric-blue/30 uppercase tracking-widest transition-all">Manual Scan</button>
            <button className="p-2 rounded hover:bg-white/5 text-zinc-grey">
              <Filter size={20} />
            </button>
          </div>
        </div>
      </header>
      
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
          
          {/* Row 1 */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-dark-surface border border-border-muted rounded hover:border-zinc-grey transition-colors items-center group">
            <div className="col-span-4 flex items-center gap-3">
              <Network size={20} className="text-zinc-grey group-hover:text-electric-blue transition-colors" />
              <div>
                <p className="text-xs font-bold text-white font-mono">zulu-factory-core-v2</p>
                <p className="text-[9px] text-zinc-grey uppercase">Production / Go-lang</p>
              </div>
            </div>
            <div className="col-span-3 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div className="w-[98%] h-full bg-electric-blue shadow-[0_0_8px_rgba(0,242,255,0.4)]"></div>
              </div>
              <span className="text-[11px] font-mono font-bold text-electric-blue">98.2%</span>
            </div>
            <div className="col-span-2 flex justify-center">
              <div className="flex items-end gap-[2px] h-[20px]">
                <div className="w-[3px] bg-neon-purple opacity-60 h-[40%]"></div>
                <div className="w-[3px] bg-neon-purple opacity-60 h-[30%]"></div>
                <div className="w-[3px] bg-neon-purple opacity-60 h-[60%]"></div>
                <div className="w-[3px] bg-neon-purple opacity-60 h-[20%]"></div>
                <div className="w-[3px] bg-neon-purple opacity-60 h-[15%]"></div>
                <div className="w-[3px] bg-electric-blue opacity-100 h-[10%]"></div>
              </div>
            </div>
            <div className="col-span-1 text-right">
              <span className="text-[11px] font-mono text-zinc-300">A+</span>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-[10px] font-mono text-zinc-400">4m ago</p>
              <p className="text-[9px] text-zinc-500 uppercase">by ac-0x2</p>
            </div>
          </div>
          
          {/* Row 2 */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-dark-surface border border-border-muted rounded hover:border-zinc-grey transition-colors items-center group">
            <div className="col-span-4 flex items-center gap-3">
              <Box size={20} className="text-zinc-grey group-hover:text-electric-blue transition-colors" />
              <div>
                <p className="text-xs font-bold text-white font-mono">gateway-proxy-handler</p>
                <p className="text-[9px] text-zinc-grey uppercase">Infrastructure / Rust</p>
              </div>
            </div>
            <div className="col-span-3 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div className="w-[84%] h-full bg-electric-blue/70"></div>
              </div>
              <span className="text-[11px] font-mono font-bold text-zinc-300">84.5%</span>
            </div>
            <div className="col-span-2 flex justify-center">
              <div className="flex items-end gap-[2px] h-[20px]">
                <div className="w-[3px] bg-neon-purple opacity-60 h-[80%]"></div>
                <div className="w-[3px] bg-neon-purple opacity-60 h-[90%]"></div>
                <div className="w-[3px] bg-neon-purple opacity-60 h-[70%]"></div>
                <div className="w-[3px] bg-neon-purple opacity-60 h-[75%]"></div>
                <div className="w-[3px] bg-neon-purple opacity-60 h-[60%]"></div>
                <div className="w-[3px] bg-neon-purple opacity-60 h-[55%]"></div>
              </div>
            </div>
            <div className="col-span-1 text-right">
              <span className="text-[11px] font-mono text-zinc-300">B</span>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-[10px] font-mono text-zinc-400">18m ago</p>
              <p className="text-[9px] text-zinc-500 uppercase">by jd-0xf</p>
            </div>
          </div>
          
          {/* Row 3 */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-dark-surface border border-border-muted rounded hover:border-zinc-grey transition-colors items-center group">
            <div className="col-span-4 flex items-center gap-3">
              <Code2 size={20} className="text-zinc-grey group-hover:text-electric-blue transition-colors" />
              <div>
                <p className="text-xs font-bold text-white font-mono">neural-weight-distributor</p>
                <p className="text-[9px] text-zinc-grey uppercase">AI Layer / Python</p>
              </div>
            </div>
            <div className="col-span-3 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div className="w-[91%] h-full bg-electric-blue shadow-[0_0_4px_rgba(0,242,255,0.2)]"></div>
              </div>
              <span className="text-[11px] font-mono font-bold text-electric-blue">91.0%</span>
            </div>
            <div className="col-span-2 flex justify-center">
              <div className="flex items-end gap-[2px] h-[20px]">
                <div className="w-[3px] bg-neon-purple opacity-60 h-[20%]"></div>
                <div className="w-[3px] bg-neon-purple opacity-60 h-[25%]"></div>
                <div className="w-[3px] bg-neon-purple opacity-60 h-[15%]"></div>
                <div className="w-[3px] bg-neon-purple opacity-60 h-[10%]"></div>
                <div className="w-[3px] bg-neon-purple opacity-60 h-[12%]"></div>
                <div className="w-[3px] bg-electric-blue opacity-100 h-[8%]"></div>
              </div>
            </div>
            <div className="col-span-1 text-right">
              <span className="text-[11px] font-mono text-zinc-300">A</span>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-[10px] font-mono text-zinc-400">1h ago</p>
              <p className="text-[9px] text-zinc-500 uppercase">by system-bot</p>
            </div>
          </div>
          
          {/* Row 4 */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-dark-surface border border-border-muted rounded hover:border-zinc-grey transition-colors items-center group">
            <div className="col-span-4 flex items-center gap-3">
              <Database size={20} className="text-zinc-grey group-hover:text-electric-blue transition-colors" />
              <div>
                <p className="text-xs font-bold text-white font-mono">vector-storage-adapter</p>
                <p className="text-[9px] text-zinc-grey uppercase">Persistence / C++</p>
              </div>
            </div>
            <div className="col-span-3 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div className="w-[72%] h-full bg-zinc-600"></div>
              </div>
              <span className="text-[11px] font-mono font-bold text-zinc-500">72.4%</span>
            </div>
            <div className="col-span-2 flex justify-center">
              <div className="flex items-end gap-[2px] h-[20px]">
                <div className="w-[3px] bg-zinc-500 h-[40%]"></div>
                <div className="w-[3px] bg-zinc-500 h-[50%]"></div>
                <div className="w-[3px] bg-zinc-500 h-[60%]"></div>
                <div className="w-[3px] bg-zinc-500 h-[65%]"></div>
                <div className="w-[3px] bg-zinc-500 h-[75%]"></div>
                <div className="w-[3px] bg-neon-purple opacity-100 h-[90%]"></div>
              </div>
            </div>
            <div className="col-span-1 text-right">
              <span className="text-[11px] font-mono text-zinc-500">C+</span>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-[10px] font-mono text-zinc-400">3h ago</p>
              <p className="text-[9px] text-zinc-500 uppercase">by unknown-0x</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="bg-dark-surface/40 border border-border-muted p-5 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <History size={16} className="text-electric-blue" />
              <h4 className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">Build Velocity</h4>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-white">4.2</span>
              <span className="text-[10px] text-zinc-grey uppercase font-bold">commits/day/dev</span>
            </div>
            <div className="mt-4 flex gap-1 items-end h-8">
              <div className="w-full bg-white/5 h-[40%]"></div>
              <div className="w-full bg-white/5 h-[60%]"></div>
              <div className="w-full bg-white/5 h-[55%]"></div>
              <div className="w-full bg-white/5 h-[80%]"></div>
              <div className="w-full bg-electric-blue/40 h-[90%]"></div>
            </div>
          </div>
          
          <div className="bg-dark-surface/40 border border-border-muted p-5 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert size={16} className="text-neon-purple" />
              <h4 className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">Active Vulnerabilities</h4>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-white">0</span>
              <span className="text-[10px] text-electric-blue uppercase font-bold">Critical</span>
            </div>
            <p className="mt-2 text-[10px] text-zinc-grey uppercase">3 low-level dependencies outdated</p>
          </div>
          
          <div className="bg-dark-surface/40 border border-border-muted p-5 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <CheckSquare size={16} className="text-electric-blue" />
              <h4 className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest">Pull Request Cycle</h4>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-white">2.4h</span>
              <span className="text-[10px] text-zinc-grey uppercase font-bold">avg review</span>
            </div>
            <div className="mt-4 w-full h-1 bg-black/40 rounded-full overflow-hidden">
              <div className="w-[85%] h-full bg-electric-blue"></div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="h-10 border-t border-border-muted bg-obsidian/80 flex items-center justify-between px-6 flex-shrink-0 text-[10px] font-bold text-zinc-grey uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Terminal size={14} />
            <span>Runtime: CLOUD-NATIVE-X86</span>
          </div>
          <div className="flex items-center gap-2">
            <Bug size={14} />
            <span>Automated Linting: Enabled</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>Zulu OS V2.4.1-Stable</span>
          <div className="w-2 h-2 rounded-full bg-electric-blue shadow-[0_0_8px_#00F2FF]"></div>
        </div>
      </footer>
    </div>
  );
}
