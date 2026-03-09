import React from 'react';

interface MetricCardProps {
  title: string;
  icon: string;
  value: string;
  unit: string;
  change: string;
  trend: 'up' | 'down';
  percentage: number;
  color: 'blue' | 'purple';
}

export function MetricCard({ title, icon, value, unit, change, trend, percentage, color }: MetricCardProps) {
  const isBlue = color === 'blue';
  const colorClass = isBlue ? 'electric-blue' : 'neon-purple';
  const bgClass = isBlue ? 'bg-electric-blue/5' : 'bg-neon-purple/5';
  const textClass = isBlue ? 'text-electric-blue' : 'text-neon-purple';
  const fillClass = isBlue ? 'bg-electric-blue' : 'bg-neon-purple';
  const shadowClass = isBlue ? 'shadow-[0_0_8px_rgba(0,242,255,0.8)]' : 'shadow-[0_0_8px_rgba(188,19,254,0.8)]';
  const bgBadgeClass = isBlue ? 'bg-electric-blue/10' : 'bg-neon-purple/10';
  const neonBorderClass = isBlue ? 'neon-border-blue' : '';

  return (
    <div className={`p-4 bg-dark-surface border border-border-muted rounded-lg relative overflow-hidden group ${neonBorderClass}`}>
      <div className={`absolute top-0 right-0 w-16 h-16 ${bgClass} -mr-8 -mt-8 rounded-full blur-2xl`}></div>
      <div className="flex justify-between items-start mb-4">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{title}</span>
        <span className={`material-symbols-outlined ${textClass} text-lg`}>{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-white tracking-tighter">
          {value}<span className="text-xs text-slate-500 ml-1">{unit}</span>
        </span>
        <span className={`text-[10px] ${textClass} font-bold flex items-center ${bgBadgeClass} px-1.5 py-0.5 rounded`}>
          <span className="material-symbols-outlined text-[10px] mr-1">
            {trend === 'up' ? 'arrow_upward' : 'arrow_downward'}
          </span>
          {trend === 'up' ? '+' : '-'}{change}
        </span>
      </div>
      <div className="mt-4 h-1 bg-obsidian rounded-full overflow-hidden">
        <div className={`h-full ${fillClass} rounded-full ${shadowClass}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
