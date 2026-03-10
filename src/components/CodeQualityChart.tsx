export function CodeQualityChart() {
  return (
    <div className="shrink-0 h-[250px] border border-border-muted rounded-xl bg-dark-surface/40 p-6 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-electric-blue"></div>
            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Test Coverage (%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neon-purple"></div>
            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Code Complexity (Cyclomatic)</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-dark-surface border border-border-muted text-[9px] font-bold rounded hover:bg-border-muted">1W</button>
          <button className="px-3 py-1 bg-[#135bec] text-white text-[9px] font-bold rounded">1M</button>
          <button className="px-3 py-1 bg-dark-surface border border-border-muted text-[9px] font-bold rounded hover:bg-border-muted">3M</button>
        </div>
      </div>
      
      <div className="flex-1 relative z-10 flex">
        <div className="flex flex-col justify-between text-[9px] font-mono text-zinc-500 py-1 pr-4 text-right min-w-[40px]">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
        <div className="flex-1 relative h-full">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
            <path d="M0,150 L100,140 L200,145 L300,120 L400,110 L500,105 L600,90 L700,95 L800,85 L900,82 L1000,80" fill="none" stroke="#00f3ff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
            <path d="M0,150 L100,140 L200,145 L300,120 L400,110 L500,105 L600,90 L700,95 L800,85 L900,82 L1000,80 V300 H0 Z" fill="url(#gradient-cyan)" fillOpacity="0.1"></path>
            <path d="M0,250 L100,245 L200,230 L300,220 L400,225 L500,210 L600,190 L700,185 L800,170 L900,165 L1000,160" fill="none" stroke="#ff00ff" strokeDasharray="8 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
            <circle cx="900" cy="82" fill="#00f3ff" r="5"></circle>
            <circle cx="900" cy="165" fill="#ff00ff" r="5"></circle>
            <defs>
              <linearGradient id="gradient-cyan" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#00f3ff" stopOpacity="1"></stop>
                <stop offset="100%" stopColor="#00f3ff" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute top-[82px] left-[90%] -translate-x-1/2 -translate-y-full mb-4 bg-dark-surface border border-border-muted p-3 rounded shadow-xl z-20 min-w-[140px]">
            <div className="text-[9px] font-bold text-zinc-grey uppercase mb-2">24 Oct 2023</div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-zinc-300">Coverage</span>
              <span className="text-xs font-mono font-bold text-electric-blue">98.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-300">Complexity</span>
              <span className="text-xs font-mono font-bold text-neon-purple">0.42</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between text-[9px] font-mono text-zinc-500 py-1 pl-4 min-w-[40px]">
          <span>1.00</span>
          <span>0.75</span>
          <span>0.50</span>
          <span>0.25</span>
          <span>0.00</span>
        </div>
      </div>
      <div className="mt-4 flex justify-between px-2 pl-12 pr-12">
        <span className="text-[9px] font-mono text-zinc-600">SEP 24</span>
        <span className="text-[9px] font-mono text-zinc-600">OCT 01</span>
        <span className="text-[9px] font-mono text-zinc-600">OCT 08</span>
        <span className="text-[9px] font-mono text-zinc-600">OCT 15</span>
        <span className="text-[9px] font-mono text-zinc-600">OCT 22</span>
        <span className="text-[9px] font-mono text-zinc-300">TODAY</span>
      </div>
    </div>
  );
}
