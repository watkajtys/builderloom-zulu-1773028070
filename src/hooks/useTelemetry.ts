import { useState, useEffect } from 'react';

export function useTelemetry() {
  const [primaryData, setPrimaryData] = useState<number[]>([40, 60, 45, 75, 50, 80, 65, 85, 70, 90, 80, 95]);
  const [secondaryData, setSecondaryData] = useState<number[]>([30, 40, 35, 50, 40, 60, 50, 70, 60, 75, 65, 80]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrimaryData(prev => {
        const next = [...prev.slice(1)];
        // Add random fluctuation between -15 and +15, bounded 20-100
        const lastVal = prev[prev.length - 1];
        let newVal = lastVal + (Math.random() * 30 - 15);
        newVal = Math.max(20, Math.min(100, newVal));
        next.push(newVal);
        return next;
      });
      
      setSecondaryData(prev => {
        const next = [...prev.slice(1)];
        // Add random fluctuation bounded 10-85
        const lastVal = prev[prev.length - 1];
        let newVal = lastVal + (Math.random() * 25 - 12);
        newVal = Math.max(10, Math.min(85, newVal));
        next.push(newVal);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { primaryData, secondaryData };
}
