import { useSearchParams, useLocation } from 'react-router-dom';
import { SystemHealth } from './SystemHealth';
import { CodeQuality } from './CodeQuality';
import { SteeringOverlay } from './SteeringOverlay';

type Tab = 'system-health' | 'code-quality';

export function HealthDashboard() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const activeTab = (searchParams.get('tab') as Tab) || 'system-health';

  return (
    <div className="flex flex-col h-full w-full bg-obsidian text-white" data-testid="health-dashboard-shell">
      {location.pathname === '/dashboard' && <SteeringOverlay />}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'system-health' ? (
          <div className="h-full w-full flex relative">
             <div className="absolute inset-0 z-0 flex" data-testid="placeholder-system-health">
               <SystemHealth />
             </div>
          </div>
        ) : (
          <div className="h-full w-full flex relative" data-testid="placeholder-code-quality">
             <div className="absolute inset-0 z-0 flex">
               <CodeQuality />
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
