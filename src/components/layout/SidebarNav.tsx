import React from 'react';
import { Layers, Briefcase, Sparkles, Film, User, Globe, Search, Archive, Target } from 'lucide-react';
import { AuthorProfile } from '../../types';

interface SidebarNavProps {
  profile: AuthorProfile;
  currentView: string;
  onChangeView: (view: any) => void;
  counts: {
    projects: number;
    experience: number;
    skills: number;
    assets: number;
    jobs: number;
    deck: number;
  };
  onOpenProfile: () => void;
  onOpenHtmlStudio: () => void;
  onDownloadZip: () => void;
  onSearchChange: (q: string) => void;
  searchQuery: string;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  profile,
  currentView,
  onChangeView,
  counts,
  onOpenProfile,
  onOpenHtmlStudio,
  onDownloadZip,
  onSearchChange,
  searchQuery
}) => {
  const navItems = [
    { id: 'jobs', label: 'Job Board', icon: Target, count: counts.jobs, activeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    { id: 'projects', label: 'Projects & Jobs', icon: Layers, count: counts.projects, activeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30' },
    { id: 'experience', label: 'Work Experience', icon: Briefcase, count: counts.experience, activeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
    { id: 'skills', label: 'Technical Skills', icon: Sparkles, count: counts.skills, activeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/30' },
    { id: 'bulk_media', label: 'Asset Studio', icon: Film, count: counts.assets, activeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  ];

  return (
    <div className="flex flex-col h-full p-4">
      {/* Brand & Author */}
      <div className="mb-6 flex items-center gap-3 select-none">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-stone-800 to-stone-700 border border-stone-600 flex items-center justify-center text-white shadow-lg shrink-0 cursor-pointer" onClick={onOpenProfile}>
          <Briefcase className="w-5 h-5 text-stone-300" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-stone-100">{profile.name}</h1>
          <p className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">{profile.title}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search items..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-stone-600 focus:bg-stone-800 transition-colors"
        />
      </div>

      {/* Main Nav */}
      <div className="space-y-1.5 flex-1">
        <h3 className="text-[10px] font-mono text-stone-500 uppercase tracking-wider mb-2 px-2">Core Entities</h3>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all border border-transparent ${
                isActive 
                  ? item.activeColor
                  : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? '' : 'opacity-70'}`} />
                <span>{item.label}</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isActive ? 'bg-black/20' : 'bg-stone-800'}`}>
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Generation & Actions */}
      <div className="mt-auto space-y-2 pt-4 border-t border-stone-800/60">
        <h3 className="text-[10px] font-mono text-stone-500 uppercase tracking-wider mb-2 px-2">Export Hub</h3>
        <button
          onClick={onOpenHtmlStudio}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-sky-900/20 hover:bg-sky-900/40 text-sky-300 border border-sky-900/50 transition-colors text-xs font-semibold"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>Generation Hub</span>
          </div>
          <span className="text-[10px] bg-sky-900/60 px-1.5 py-0.5 rounded">{counts.deck} queued</span>
        </button>
        <button
          onClick={onDownloadZip}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-900 transition-colors text-xs"
        >
          <Archive className="w-4 h-4 opacity-70" />
          <span>Download Netlify ZIP</span>
        </button>
      </div>
    </div>
  );
};
