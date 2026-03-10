import { useState, useEffect } from 'react';

export function useTelemetry() {
  const [primaryData, setPrimaryData] = useState<number[]>([40, 60, 45, 75, 50, 80, 65, 85, 70, 90, 80, 95, 85, 90, 80, 75]);
  const [secondaryData, setSecondaryData] = useState<number[]>([30, 40, 35, 50, 40, 60, 50, 70, 60, 75, 65, 80, 75, 80, 70, 65]);

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

  // Compute chartData directly in the hook
  const chartLength = 16;
  const recentPrimary = primaryData.slice(-chartLength);
  const recentSecondary = secondaryData.slice(-chartLength);
  
  const chartData = Array.from({ length: chartLength }).map((_, i) => {
    const dataIndex = i - (chartLength - recentPrimary.length);
    if (dataIndex >= 0) {
      const p = recentPrimary[dataIndex];
      const s = recentSecondary[dataIndex];
      return { 
        c: Math.max(5, Math.min(95, p)), // scale nicely
        m: Math.max(10, Math.min(100, s + 20)), // make m higher than c usually
        s1: p > 70,
        s2: s > 60,
        o: Math.min(100, Math.round(s / 10) * 10)
      };
    }
    return { c: 5, m: 10, s1: false, s2: false, o: 20 }; // default
  });

  return { primaryData, secondaryData, chartData };
}
