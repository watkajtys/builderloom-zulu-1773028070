interface HardwarePulseBarProps {
  c: number;
  m: number;
  s1: boolean;
  s2: boolean;
  o: number;
}

export function HardwarePulseBar({ c, m, s1, s2, o }: HardwarePulseBarProps) {
  const processLoadOpacityClass = 
    o === 20 ? 'bg-neon-purple/20' : 
    o === 30 ? 'bg-neon-purple/30' : 
    o === 40 ? 'bg-neon-purple/40' : 
    o === 50 ? 'bg-neon-purple/50' : 
    o === 60 ? 'bg-neon-purple/60' : 
    o === 70 ? 'bg-neon-purple/70' : 
    o === 80 ? 'bg-neon-purple/80' : 
    o === 100 ? 'bg-neon-purple' : 'bg-neon-purple/50';

  return (
    <div className="flex-1 flex flex-col justify-end gap-[2px]">
      <div 
        className={`w-full rounded-sm ${s2 ? 'shadow-[0_0_15px_#BC13FE44]' : ''} ${processLoadOpacityClass}`} 
        style={{ height: `${m}%` }}
      />
      <div 
        className={`w-full bg-electric-blue rounded-sm ${s1 ? 'shadow-[0_0_10px_#00F2FF44]' : ''}`} 
        style={{ height: `${c}%` }}
      />
    </div>
  );
}
