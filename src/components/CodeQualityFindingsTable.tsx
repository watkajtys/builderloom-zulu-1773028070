import { ArchitectFinding } from '../types/architect';

interface CodeQualityFindingsTableProps {
  architectFindings: ArchitectFinding[];
}

export function CodeQualityFindingsTable({ architectFindings }: CodeQualityFindingsTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-[250px] bg-dark-surface/30 border border-border-muted rounded-lg overflow-hidden mt-6">
      <div className="flex items-center px-4 border-b border-border-muted bg-obsidian/20">
        <button className="border-b-2 border-electric-blue text-electric-blue py-3 px-4 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
          Current Findings
          <span className="bg-neon-purple text-white text-[9px] px-1.5 py-0.5 rounded-full shadow-[0_0_8px_#BC13FE]">{architectFindings?.length || 0}</span>
        </button>
        <button className="border-b-2 border-transparent text-zinc-grey hover:text-zinc-300 py-3 px-4 text-[10px] font-bold uppercase tracking-widest">Metrics Overview</button>
        <button className="border-b-2 border-transparent text-zinc-grey hover:text-zinc-300 py-3 px-4 text-[10px] font-bold uppercase tracking-widest">Historical Debt</button>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-zinc-grey font-bold uppercase tracking-wider">Maintainability</span>
            <span className="text-xs font-mono font-bold text-electric-blue">88%</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-muted/50 bg-black/10">
              <th className="px-6 py-3 text-[9px] font-bold text-zinc-grey uppercase tracking-widest">Issue / Component</th>
              <th className="px-6 py-3 text-[9px] font-bold text-zinc-grey uppercase tracking-widest w-24 text-center">Severity</th>
              <th className="px-6 py-3 text-[9px] font-bold text-zinc-grey uppercase tracking-widest w-32 text-right">Debt Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-muted/30 font-mono">
            {(!architectFindings || architectFindings.length === 0 || architectFindings.every(f => !f.static_violations || f.static_violations.length === 0)) ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-sm font-sans font-bold text-zinc-grey">All clear. No active findings.</span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">System is operating within acceptable parameters</span>
                  </div>
                </td>
              </tr>
            ) : (
              architectFindings.flatMap(finding => 
                finding.static_violations?.map((issue, idx) => (
                  <tr key={`${finding.id}-${idx}`} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-white">{issue.message}</span>
                        <span className="text-[10px] text-zinc-grey">{finding.filepath}{issue.line ? `:${issue.line}` : ''}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 border text-[9px] font-bold rounded ${
                        issue.type === 'error' || issue.type === 'critical' ? 'border-neon-purple/40 bg-neon-purple/10 text-neon-purple' :
                        issue.type === 'warning' || issue.type === 'high' ? 'border-orange-500/40 bg-orange-500/10 text-orange-500' :
                        issue.type === 'medium' ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-500' :
                        'border-electric-blue/40 bg-electric-blue/10 text-electric-blue'
                      }`}>
                        {(issue.type || 'info').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-bold text-zinc-300">{issue.type === 'error' ? '4.5h' : issue.type === 'warning' ? '2.0h' : '0.5h'}</span>
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
