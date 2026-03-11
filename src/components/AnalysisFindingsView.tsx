import { Network, Activity, ShieldAlert, ChevronDown } from 'lucide-react';
import { ArchitectFinding } from '../types/architect';

interface AnalysisFindingsViewProps {
  architectFindings: ArchitectFinding[];
}

export function AnalysisFindingsView({ architectFindings }: AnalysisFindingsViewProps) {
  const hasRealFindings = architectFindings && architectFindings.length > 0 && architectFindings.some(f => f.static_violations && f.static_violations.length > 0);

  return (
    <div className="w-[60%] flex flex-col bg-[#0d1117] overflow-hidden">
      <div className="p-4 border-b border-border-muted flex items-center justify-between bg-dark-surface/10">
        <div className="flex items-center gap-3">
          <Activity size={18} className="text-electric-blue" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Analysis Findings: <span className="font-mono text-electric-blue">zulu-factory-core-v2</span></h3>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-0.5 bg-dark-surface border border-border-muted text-[9px] font-mono text-zinc-grey rounded">EXPAND ALL</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        
        {/* Structural Rules Category */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Network size={14} className="text-zinc-grey" />
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">Category: Structural Rules</h5>
          </div>
          <div className="space-y-4 font-mono">
            {hasRealFindings ? (
              architectFindings.flatMap(finding => 
                finding.static_violations?.map((issue, idx) => (
                  <div key={`real-${idx}`} className="group">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 py-1">
                      <ChevronDown size={16} className="text-zinc-grey" />
                      <span>{issue.symbol}</span>
                      <span className={`text-[9px] px-1.5 border rounded ${
                        issue.type === 'error' ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/30' :
                        issue.type === 'warning' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                        'bg-slate-600/10 text-slate-400 border-border-muted'
                      }`}>
                        {(issue.type || 'info').toUpperCase()}
                      </span>
                    </div>
                    <div className="relative ml-4 pl-4 border-l border-border-muted/50 before:content-[''] before:absolute before:left-0 before:top-3 before:w-3 before:border-t before:border-border-muted/50">
                      <div className="text-[11px] text-zinc-grey py-2 border-b border-border-muted/30">
                        <p className="mb-1 text-slate-300">{issue.message}</p>
                        <p className="text-[10px]">Location: <code className="text-electric-blue">{finding.filepath}</code>{issue.line ? `:${issue.line}` : ''}</p>
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : (
              <>
                <div className="group">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 py-1">
                    <ChevronDown size={16} className="text-zinc-grey" />
                    <span>Circular Dependency Detection</span>
                    <span className="text-[9px] px-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 rounded">MEDIUM</span>
                  </div>
                  <div className="relative ml-4 pl-4 border-l border-border-muted/50 before:content-[''] before:absolute before:left-0 before:top-3 before:w-3 before:border-t before:border-border-muted/50">
                    <div className="text-[11px] text-zinc-grey py-2 border-b border-border-muted/30">
                      <p className="mb-1 text-slate-300">Potential cyclic reference found in <code className="text-electric-blue">/pkg/internal/factory</code></p>
                      <p className="text-[10px]">Reference: Factory -&gt; WorkerPool -&gt; Factory (Init stage)</p>
                    </div>
                  </div>
                </div>
                <div className="group">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 py-1">
                    <ChevronDown size={16} className="text-zinc-grey" />
                    <span>Interface Violation</span>
                    <span className="text-[9px] px-1.5 bg-slate-600 text-slate-400 border border-border-muted rounded">LOW</span>
                  </div>
                  <div className="relative ml-4 pl-4 border-l border-border-muted/50 before:content-[''] before:absolute before:left-0 before:top-3 before:w-3 before:border-t before:border-border-muted/50">
                    <div className="text-[11px] text-zinc-grey py-2">
                      <p className="text-slate-300">Non-compliant implementation of <code className="text-electric-blue">DataProcessor</code></p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Performance Analysis Category */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} className="text-zinc-grey" />
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">Category: Performance Analysis</h5>
          </div>
          <div className="space-y-4 font-mono">
            <div className="group">
              <div className="flex items-center gap-2 text-xs font-semibold text-neon-purple shadow-[0_0_10px_rgba(188,19,254,0.2)] py-1">
                <ChevronDown size={16} />
                <span>Bottleneck: N+1 Database Access Pattern</span>
                <span className="text-[9px] px-1.5 bg-neon-purple/20 text-neon-purple border border-neon-purple/40 rounded">CRITICAL</span>
              </div>
              <div className="relative ml-4 pl-4 border-l border-neon-purple/30 before:content-[''] before:absolute before:left-0 before:top-3 before:w-3 before:border-t before:border-neon-purple/30">
                <div className="text-[11px] py-2 border-b border-border-muted/30">
                  <p className="mb-1 text-slate-300 italic">Major architectural bottleneck detected in record ingestion loop.</p>
                  <div className="bg-black/50 p-2 rounded border border-border-muted my-2">
                    <p className="text-neon-purple mb-1 font-bold">{`// Trace Analysis`}</p>
                    <p className="text-zinc-grey">at system.ingest.v2.Processor.Process(Batch data)</p>
                    <p className="text-zinc-grey">{`-> Call loop: 124ms avg latency per element`}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Compliance Category */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert size={14} className="text-zinc-grey" />
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">Category: Security Compliance</h5>
          </div>
          <div className="space-y-4 font-mono">
            <div className="group">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 py-1">
                <ChevronDown size={16} className="text-zinc-grey" />
                <span>Secret Hardcoding Analysis</span>
                <span className="text-[9px] px-1.5 bg-electric-blue/10 text-electric-blue border border-electric-blue/30 rounded">SECURE</span>
              </div>
              <div className="relative ml-4 pl-4 border-l border-border-muted/50 before:content-[''] before:absolute before:left-0 before:top-3 before:w-3 before:border-t before:border-border-muted/50">
                <div className="text-[11px] text-zinc-grey py-2">
                  <p className="text-slate-400">Entropy scan passed. No plain-text secrets found in configuration layers.</p>
                </div>
              </div>
            </div>
            <div className="group">
              <div className="flex items-center gap-2 text-xs font-semibold text-neon-purple shadow-[0_0_10px_rgba(188,19,254,0.2)] py-1">
                <ChevronDown size={16} />
                <span>Unsanitized Reflection Exposure</span>
                <span className="text-[9px] px-1.5 bg-neon-purple/20 text-neon-purple border border-neon-purple/40 rounded">CRITICAL</span>
              </div>
              <div className="relative ml-4 pl-4 border-l border-neon-purple/30 before:content-[''] before:absolute before:left-0 before:top-3 before:w-3 before:border-t before:border-neon-purple/30">
                <div className="text-[11px] py-2">
                  <p className="text-slate-300">Dynamic loading from user-controlled manifest in <code className="text-electric-blue">plugin_loader.go</code></p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
