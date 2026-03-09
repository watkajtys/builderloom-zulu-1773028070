

interface WorkerNodeProps {
  id: string;
  status: 'ONLINE' | 'STANDBY' | 'SYNCING';
}

export function WorkerNode({ id, status }: WorkerNodeProps) {
  let borderColor = '';
  let statusColor = '';
  let dotColor = '';
  let textOpacity = '';
  let shadowClass = '';

  switch (status) {
    case 'ONLINE':
      borderColor = 'border-l-electric-blue border-l-2';
      statusColor = 'text-electric-blue';
      dotColor = 'bg-electric-blue';
      shadowClass = 'shadow-[0_0_8px_#00f2ff]';
      break;
    case 'STANDBY':
      borderColor = '';
      statusColor = 'text-slate-500';
      dotColor = 'bg-slate-700';
      textOpacity = 'text-opacity-50';
      break;
    case 'SYNCING':
      borderColor = 'border-l-neon-purple border-l-2';
      statusColor = 'text-neon-purple';
      dotColor = 'bg-neon-purple';
      shadowClass = 'shadow-[0_0_8px_#bc13fe]';
      break;
  }

  return (
    <div className={`p-3 bg-dark-surface border border-border-muted rounded flex items-center justify-between ${borderColor}`}>
      <div className="flex flex-col">
        <span className={`text-[10px] font-black text-white uppercase tracking-tighter ${textOpacity}`}>{id}</span>
        <span className={`text-[8px] ${statusColor} font-bold uppercase tracking-tighter`}>{status}</span>
      </div>
      <div className={`w-1.5 h-1.5 rounded-full ${dotColor} ${shadowClass}`}></div>
    </div>
  );
}
