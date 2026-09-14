import React from 'react';
import { 
  Briefcase, 
  Search, 
  Plus, 
  User, 
  RotateCcw, 
  Layers, 
  Sparkles, 
  Image as ImageIcon, 
  FileText,
  Globe,
  FolderSync,
  Film
} from 'lucide-react';
import { AuthorProfile } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  profile: AuthorProfile;
  totalItemsCount: number;
  imageCount: number;
  infoCount: number;
  exportDeckCount: number;
  workExperienceCount?: number;
  skillCount?: number;
  onOpenAddItem: () => void;
  onOpenAddMedia: () => void;
  onOpenProfileModal: () => void;
  onResetData: () => void;
  onAddAllFilteredToDeck: () => void;
  filteredCount: number;
  onOpenHtmlStudio: () => void;
  onOpenAssetManager: () => void;
  managedAssetCount: number;
  currentView?: 'projects' | 'experience' | 'skills' | 'bulk_media';
  onChangeView?: (view: 'projects' | 'experience' | 'skills' | 'bulk_media') => void;
  onOpenResumeImport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  profile,
  totalItemsCount,
  imageCount,
  infoCount,
  exportDeckCount,
  workExperienceCount = 3,
  skillCount = 18,
  onOpenAddItem,
  onOpenAddMedia,
  onOpenProfileModal,
  onResetData,
  onAddAllFilteredToDeck,
  filteredCount,
  onOpenHtmlStudio,
  onOpenAssetManager,
  managedAssetCount,
  currentView = 'projects',
  onChangeView,
  onOpenResumeImport
}) => {
  return (
    <header id="app-main-header" className="bg-stone-900 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Brand & Author summary */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-700 to-sky-500 flex items-center justify-center text-white shadow-xs shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-stone-100 tracking-tight">
                  {profile.name}
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  Tour-Ready &amp; Transit-Accessible
                </span>
              </div>
              <p className="text-xs text-stone-500 truncate max-w-md">
                <span className="font-semibold text-stone-200">{profile.title}</span> • PIT Hub • primordial-portfolio.netlify.app
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="search-portfolio-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by keywords, tags, hardware, or venues..."
              className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-stone-700 text-xs sm:text-sm text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-stone-800/50 hover:bg-stone-900 focus:bg-stone-900 transition-colors font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Actions & Utilities */}
          <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
            {/* Import Resume AI Engine */}
            {onOpenResumeImport && (
              <button
                type="button"
                id="btn-header-import-resume"
                onClick={onOpenResumeImport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-950 bg-gradient-to-r from-indigo-100 to-sky-100 hover:from-indigo-200 hover:to-sky-200 border border-indigo-300 shadow-xs transition-all"
                title="Import resume to auto-ingest experience & discern technical skills"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Import Resume</span>
                <span className="text-[9px] uppercase px-1.5 py-0.2 bg-indigo-700 text-white rounded-full font-mono font-semibold">
                  AI
                </span>
              </button>
            )}

            {/* HTML & Netlify Studio */}
            <button
              type="button"
              id="btn-header-html-studio"
              onClick={onOpenHtmlStudio}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors"
              title="Preview and manipulate live portfolio HTML code"
            >
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span>HTML &amp; Netlify Studio</span>
            </button>

            {/* Media & Assets Hub */}
            <button
              type="button"
              id="btn-header-asset-manager"
              onClick={onOpenAssetManager}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-300 hover:text-stone-100 bg-stone-800 hover:bg-stone-200 border border-stone-800 transition-colors"
              title="Manage images, video files, blueprints, and CDN paths"
            >
              <FolderSync className="w-3.5 h-3.5 text-stone-500" />
              <span>Media &amp; Assets ({managedAssetCount})</span>
            </button>

            {/* Author Profile button */}
            <button
              type="button"
              id="btn-edit-profile"
              onClick={onOpenProfileModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-300 hover:text-stone-100 bg-stone-800 hover:bg-stone-200 border border-stone-800 transition-colors"
              title="Edit author profile, contact details, and logistics"
            >
              <User className="w-3.5 h-3.5 text-stone-500" />
              <span>Profile</span>
            </button>

            {/* Add Media button */}
            <button
              type="button"
              id="btn-header-add-media"
              onClick={onOpenAddMedia}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-sky-900 bg-sky-100 hover:bg-sky-200 border border-sky-300 transition-all shadow-xs"
              title="Add or upload a video reel, photo, or asset to any case study"
            >
              <Film className="w-3.5 h-3.5 text-sky-700" />
              <span>Add Media</span>
            </button>

            {/* Add Item button */}
            <button
              type="button"
              id="btn-add-new-item"
              onClick={onOpenAddItem}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>

            {/* Reset / Sample Data */}
            <button
              type="button"
              onClick={onResetData}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-300 hover:bg-stone-800 transition-colors"
              title="Reset to Brice Morneau's Master CV & Primordial Video Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Primary View Switcher Navigation Tabs */}
        {onChangeView && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-800 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              id="tab-view-projects"
              onClick={() => onChangeView('projects')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                currentView === 'projects'
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-stone-800 hover:bg-stone-800 text-stone-300 border-stone-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Projects &amp; Jobs</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                currentView === 'projects' ? 'bg-stone-800 text-stone-200' : 'bg-stone-200 text-stone-300'
              }`}>
                {totalItemsCount}
              </span>
            </button>

            <button
              type="button"
              id="tab-view-experience"
              onClick={() => onChangeView('experience')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                currentView === 'experience'
                  ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs'
                  : 'bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-900 border-indigo-200/80'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>Work Experience &amp; Venue Roles</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                currentView === 'experience' ? 'bg-indigo-800 text-white' : 'bg-indigo-200/80 text-indigo-900'
              }`}>
                {workExperienceCount}
              </span>
            </button>

            <button
              type="button"
              id="tab-view-skills"
              onClick={() => onChangeView('skills')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                currentView === 'skills'
                  ? 'bg-violet-700 text-white border-violet-700 shadow-xs'
                  : 'bg-violet-50/70 hover:bg-violet-100/70 text-violet-900 border-violet-200/80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Skills &amp; Show Systems</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                currentView === 'skills' ? 'bg-violet-800 text-white' : 'bg-violet-200/80 text-violet-900'
              }`}>
                {skillCount}
              </span>
            </button>

            <button
              type="button"
              id="tab-view-bulk-media"
              onClick={() => onChangeView('bulk_media')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                currentView === 'bulk_media'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-stone-800 hover:bg-stone-800 text-stone-300 border-stone-800'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-sky-500" />
              <span>Bulk Media Studio</span>
            </button>
          </div>
        )}

        {/* Quick Summary Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-stone-100 text-[11px] text-stone-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-stone-400" />
              <strong className="text-stone-300">{totalItemsCount}</strong> Projects &amp; Jobs
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-indigo-500" />
              <strong className="text-stone-300">{workExperienceCount}</strong> Career Roles
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-violet-500" />
              <strong className="text-stone-300">{skillCount}</strong> Technical Skills
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <strong className="text-stone-300">{exportDeckCount}</strong> in Export Deck
            </span>
          </div>

          <div className="flex items-center gap-2">
            {filteredCount > 0 && currentView === 'projects' && (
              <button
                type="button"
                onClick={onAddAllFilteredToDeck}
                className="text-sky-600 hover:text-sky-800 font-medium hover:underline text-[11px]"
              >
                + Add all {filteredCount} matching to Export Deck
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
