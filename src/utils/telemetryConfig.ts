export interface LogLevelConfig {
  id: string;
  code: string;
  streamColor: string;
  streamMessageColor: string;
  gridClass: string;
  filterClass: string;
}

export const LOG_LEVELS: Record<string, LogLevelConfig> = {
  INFO: {
    id: 'INFO',
    code: 'INF',
    streamColor: 'text-electric-blue',
    streamMessageColor: '',
    gridClass: 'bg-electric-blue/10 text-electric-blue',
    filterClass: 'border-electric-blue/30 text-electric-blue bg-electric-blue/10'
  },
  ERROR: {
    id: 'ERROR',
    code: 'ERR',
    streamColor: 'text-red-500',
    streamMessageColor: 'text-red-400 font-bold underline decoration-red-900',
    gridClass: 'bg-rose-500/10 text-rose-500',
    filterClass: 'border-rose-500/30 text-rose-400 bg-rose-500/10'
  },
  WARN: {
    id: 'WARN',
    code: 'WRN',
    streamColor: 'text-amber-500',
    streamMessageColor: 'text-amber-200/80',
    gridClass: 'bg-amber-500/10 text-amber-500',
    filterClass: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
  },
  DEBUG: {
    id: 'DEBUG',
    code: 'DBG',
    streamColor: 'text-neon-purple',
    streamMessageColor: 'text-slate-500',
    gridClass: 'bg-white/10 text-white',
    filterClass: 'border-zinc-grey/30 text-zinc-grey bg-zinc-grey/10' // fallback if not in active?
  },
  THOUGHT: {
    id: 'THOUGHT',
    code: 'THO',
    streamColor: 'text-synth-magenta',
    streamMessageColor: 'text-slate-300',
    gridClass: 'bg-synth-magenta/10 text-neon-purple',
    filterClass: 'border-synth-magenta/30 text-neon-purple bg-synth-magenta/10'
  }
};

const DEFAULT_CONFIG: LogLevelConfig = {
  id: 'SYS',
  code: 'SYS',
  streamColor: 'text-electric-blue',
  streamMessageColor: '',
  gridClass: 'bg-zinc-grey/10 text-zinc-grey',
  filterClass: 'border-zinc-grey/30 text-zinc-grey bg-zinc-grey/10'
};

export function getLogLevelConfig(level: string): LogLevelConfig {
  return LOG_LEVELS[level.toUpperCase()] || { ...DEFAULT_CONFIG, id: level.toUpperCase() };
}

export function formatLogMessage(payload: Record<string, any> | undefined | null): string {
  if (!payload) return '';
  if (payload.exception) {
    return `${payload.exception} :: retrying...`;
  } else if (payload.warning) {
    return `WARNING: ${payload.warning} threshold: ${payload.threshold}`;
  } else if (payload.event) {
    return `${payload.event}: ${payload.node}`;
  } else if (payload.type) {
    return `${payload.type} sync: [${payload.status}]`;
  } else if (payload.action) {
    return `${payload.action} [OK]`;
  } else if (payload.process) {
    return `${payload.process}`;
  } else if (payload.msg) {
    return `${payload.msg}`;
  } else {
    return JSON.stringify(payload);
  }
}
