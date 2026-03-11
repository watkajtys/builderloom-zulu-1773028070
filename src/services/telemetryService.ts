import { TelemetryLog } from '../hooks/useTelemetryLogs';
import { mockTelemetryLogs } from './mockTelemetryData';

export const telemetryService = {
  getLogs: async (): Promise<TelemetryLog[]> => {
    // Phase 3: Abstracted service layer. In the future, this will fetch from PocketBase
    return Promise.resolve(mockTelemetryLogs);
  },
  
  getStats: async () => {
    return Promise.resolve({
      totalLogs: 12482,
      errorRate: 0.02,
      errorCount: 0,
      warningCount: 0,
    });
  }
};
