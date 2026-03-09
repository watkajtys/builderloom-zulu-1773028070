
import { Search, Bell } from 'lucide-react';

export function TopNavUtility() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative group">
        <input 
          className="h-7 pl-3 pr-8 text-[10px] bg-dark-surface border border-border-muted rounded-md text-slate-300 focus:border-electric-blue focus:ring-1 focus:ring-electric-blue w-64 transition-all font-mono placeholder:text-zinc-grey" 
          placeholder="SEARCH_ZULU_SYSTEMS..." 
          type="text" 
        />
        <Search 
          size={14} 
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-grey group-focus-within:text-electric-blue transition-colors" 
        />
      </div>
      <button 
        className="h-7 w-7 flex items-center justify-center bg-dark-surface border border-border-muted rounded-md text-zinc-grey hover:text-electric-blue hover:border-electric-blue transition-all"
        aria-label="Notifications"
      >
        <Bell size={14} />
      </button>
    </div>
  );
}
