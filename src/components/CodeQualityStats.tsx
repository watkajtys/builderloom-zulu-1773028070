export function CodeQualityStats() {
  return (
    <div className="shrink-0 grid grid-cols-3 gap-6 mt-6">
      <div className="bg-dark-surface/30 border border-border-muted p-4 rounded-lg">
        <p className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest mb-3">Maintainability Index</p>
        <div className="flex items-end gap-3">
          <span className="text-3xl font-mono font-bold text-white">88</span>
          <span className="text-[10px] text-electric-blue font-bold uppercase mb-1">↑ 2.4%</span>
        </div>
      </div>
      <div className="bg-dark-surface/30 border border-border-muted p-4 rounded-lg">
        <p className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest mb-3">Technical Debt</p>
        <div className="flex items-end gap-3">
          <span className="text-3xl font-mono font-bold text-white">4.2d</span>
          <span className="text-[10px] text-neon-purple font-bold uppercase mb-1">↓ 0.5d</span>
        </div>
      </div>
      <div className="bg-dark-surface/30 border border-border-muted p-4 rounded-lg">
        <p className="text-[10px] font-bold text-zinc-grey uppercase tracking-widest mb-3">Duplication</p>
        <div className="flex items-end gap-3">
          <span className="text-3xl font-mono font-bold text-white">1.8%</span>
          <span className="text-[10px] text-zinc-grey font-bold uppercase mb-1">STABLE</span>
        </div>
      </div>
    </div>
  );
}
