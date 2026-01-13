import { ReactNode } from 'react';
import AdBanner from '../common/AdBanner';

interface AdLayoutProps {
  children: ReactNode;
}

export default function AdLayout({ children }: AdLayoutProps) {
  return (
    <div className="flex justify-center w-full min-h-screen">
      {/* Left Sidebar (Ads) - Visible on XL screens */}
      {/* Sticky positioning ensures ads stay visible while scrolling */}
      <aside className="hidden xl:flex flex-col w-[340px] sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto p-4 gap-6 border-r border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 scrollbar-hide">
         <div className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider mb-2">Advertisement</div>
         <AdBanner />
         <AdBanner />
         <AdBanner />
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full min-w-0 px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Right Sidebar (Ads) - Visible on XL screens */}
      <aside className="hidden xl:flex flex-col w-[340px] sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto p-4 gap-6 border-l border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 scrollbar-hide">
         <div className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider mb-2">Advertisement</div>
         <AdBanner />
         <AdBanner />
         <AdBanner />
      </aside>
    </div>
  );
}
