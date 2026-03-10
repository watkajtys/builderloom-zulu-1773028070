import { useTelemetry } from '../hooks/useTelemetry';
import { useTelemetryLogs } from '../hooks/useTelemetryLogs';
import { Footer } from './Footer';
import { InfrastructureStack } from './InfrastructureStack';
import { HardwarePulse } from './HardwarePulse';
import { SystemHealthHeader } from './SystemHealthHeader';

export function SystemHealth() {
  const { chartData } = useTelemetry();
  const { logs, stats } = useTelemetryLogs();

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#0d1117] text-slate-100 font-sans h-full w-full">
      <SystemHealthHeader />
      
      <div className="flex-1 flex overflow-hidden">
        <InfrastructureStack />
        <HardwarePulse chartData={chartData} stats={stats} logs={logs} />
      </div>
      
      <Footer 
        zone="US-EAST-1-PROD"
        loadOrCpu="Stable"
        version="V2.4.1-Stable"
        transparentBackground={true}
      />
    </div>
  );
}
