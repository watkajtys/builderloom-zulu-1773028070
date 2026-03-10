import { ReactNode } from 'react';

export interface PageHeaderProps {
  titlePrimary?: string;
  titleSecondary?: string;
  statusIndicator?: ReactNode;
  rightContent?: ReactNode;
  leftContent?: ReactNode;
  transparentBackground?: boolean;
}

export function PageHeader({ 
  titlePrimary, 
  titleSecondary, 
  statusIndicator, 
  rightContent,
  leftContent,
  transparentBackground = false
}: PageHeaderProps) {
  return (
    <header className={`h-14 border-b border-border-muted ${transparentBackground ? 'bg-obsidian/50 backdrop-blur-md' : 'bg-obsidian'} flex items-center justify-between px-6 flex-shrink-0 z-20`}>
      <div className="flex items-center gap-6">
        {leftContent}
        {!leftContent && titlePrimary && (
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
            {titlePrimary} {titleSecondary && <span className="mx-1">/</span>} <span className="text-white">{titleSecondary}</span>
          </h2>
        )}
        {statusIndicator && (
          <>
            <div className="h-4 w-px bg-border-muted"></div>
            <div className="flex items-center gap-4">
              {statusIndicator}
            </div>
          </>
        )}
      </div>
      {rightContent && (
        <div className="flex items-center gap-6">
          {rightContent}
        </div>
      )}
    </header>
  );
}
