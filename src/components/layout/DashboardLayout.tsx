import React from 'react';
import { Layers, Briefcase, Sparkles, Film, User, Globe, FolderSync, Plus, Search, Archive } from 'lucide-react';

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
  return (
    <div 
      className="flex h-screen overflow-hidden bg-stone-950 text-stone-100"
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

      {/* Left Sidebar (Navigation & Tools) */}
      <nav className="glass-panel border-y-0 border-l-0 flex flex-col h-full w-[260px] shrink-0 pane-scroll">
        {sidebar}
      </nav>

      {/* Center Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-full bg-stone-950 pane-scroll relative">
        <div className="w-full max-w-5xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>

      {/* Right Context Panel (Inspector / Editor / Asset Drop) */}
      {rightPanel && (
        <aside className="glass-panel border-y-0 border-r-0 flex flex-col h-full w-[380px] shrink-0 pane-scroll bg-stone-900/50">
          {rightPanel}
        </aside>
      )}
    </div>
  );
};
