import { ReactNode } from 'react';
import { PageHeader, PageHeaderProps } from './PageHeader';
import { Footer } from './Footer';

interface PageLayoutProps extends PageHeaderProps {
  children: ReactNode;
  footerZone?: string;
  footerLoadOrCpu?: string;
  footerVersion?: string;
  footerTransparentBackground?: boolean;
  contentClassName?: string;
  containerClassName?: string;
}

export function PageLayout({
  children,
  titlePrimary,
  titleSecondary,
  statusIndicator,
  rightContent,
  leftContent,
  transparentBackground = false,
  footerZone,
  footerLoadOrCpu,
  footerVersion,
  footerTransparentBackground = false,
  contentClassName = "flex-1 overflow-y-auto custom-scrollbar",
  containerClassName = "bg-obsidian"
}: PageLayoutProps) {
  return (
    <div className={`flex-1 flex flex-col min-w-0 overflow-hidden relative text-white font-sans h-full w-full ${containerClassName}`}>
      <PageHeader 
        titlePrimary={titlePrimary}
        titleSecondary={titleSecondary}
        statusIndicator={statusIndicator}
        rightContent={rightContent}
        leftContent={leftContent}
        transparentBackground={transparentBackground}
      />
      
      <div className={contentClassName}>
        {children}
      </div>
      
      <Footer 
        zone={footerZone}
        loadOrCpu={footerLoadOrCpu}
        version={footerVersion}
        transparentBackground={footerTransparentBackground}
      />
    </div>
  );
}
