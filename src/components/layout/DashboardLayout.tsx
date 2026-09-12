import React, { useState, useEffect } from 'react';
import { FolderSync, Menu, X, PanelRight } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  rightPanel?: React.ReactNode;
  onGlobalDrop?: (files: FileList | File[]) => void;
  isGlobalDragging?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebar,
  rightPanel,
  onGlobalDrop,
  isGlobalDragging
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  // Close sidebars on resize if moving to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
        setIsRightPanelOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      className="flex flex-col lg:flex-row h-screen overflow-hidden bg-stone-950 text-stone-100"
      onDragOver={(e) => {
        if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
          e.preventDefault();
        }
      }}
      onDrop={(e) => {
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          e.preventDefault();
          onGlobalDrop?.(e.dataTransfer.files);
        }
      }}
    >
      {/* Global Drag Overlay */}
      {isGlobalDragging && (
        <div className="fixed inset-0 z-[100] bg-stone-950/80 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none border-2 border-dashed border-sky-500/50 m-4 rounded-3xl">
          <FolderSync className="w-16 h-16 text-sky-400 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-white mb-2">Drop Assets Anywhere</h2>
          <p className="text-stone-400">Instantly ingest to the Primordial Asset Hub</p>
        </div>
      )}

      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-stone-800 bg-stone-900 shrink-0 z-40">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 text-stone-400 hover:text-stone-200 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-sm font-bold tracking-tight text-stone-100">Portfolio Hub</span>
        {rightPanel && (
          <button 
            onClick={() => setIsRightPanelOpen(true)}
            className="p-2 -mr-2 text-stone-400 hover:text-stone-200 transition-colors"
          >
            <PanelRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Mobile Overlays */}
      {(isSidebarOpen || isRightPanelOpen) && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => {
            setIsSidebarOpen(false);
            setIsRightPanelOpen(false);
          }}
        />
      )}

      {/* Left Sidebar (Navigation & Tools) */}
      <nav className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        lg:relative lg:transform-none lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        glass-panel border-y-0 border-l-0 border-r border-stone-800 flex flex-col h-full w-[280px] lg:w-[260px] shrink-0 pane-scroll bg-stone-950 lg:bg-stone-900/60
      `}>
        {/* Mobile Sidebar Close */}
        <div className="lg:hidden flex justify-end p-2 border-b border-stone-800">
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-stone-400 hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Render Sidebar Content - Wrap in div that closes sidebar on click in mobile */}
        <div className="flex-1 overflow-hidden flex flex-col" onClick={(e) => {
          // If they click a button (nav item), close the sidebar
          if ((e.target as HTMLElement).closest('button')) {
            setIsSidebarOpen(false);
          }
        }}>
          {sidebar}
        </div>
      </nav>

      {/* Center Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-full bg-stone-950 pane-scroll relative z-10">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
          {children}
        </div>
      </main>

      {/* Right Context Panel (Inspector / Editor / Asset Drop) */}
      {rightPanel && (
        <aside className={`
          fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out
          lg:relative lg:transform-none lg:translate-x-0
          ${isRightPanelOpen ? 'translate-x-0' : 'translate-x-full'}
          glass-panel border-y-0 border-r-0 border-l border-stone-800 flex flex-col h-full w-[320px] lg:w-[380px] shrink-0 pane-scroll bg-stone-950 lg:bg-stone-900/50
        `}>
          <div className="lg:hidden flex justify-start p-2 border-b border-stone-800">
            <button onClick={() => setIsRightPanelOpen(false)} className="p-2 text-stone-400 hover:text-stone-200">
              <X className="w-5 h-5" />
            </button>
          </div>
          {rightPanel}
        </aside>
      )}
    </div>
  );
};
