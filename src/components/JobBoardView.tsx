import React, { useState } from 'react';
import { JobMatch, JobType } from '../types';
import { Briefcase, MapPin, Building2, ExternalLink, Sparkles, CheckCircle2, XCircle, Search, Filter, Plus, ChevronRight, FileText } from 'lucide-react';

interface JobBoardViewProps {
  jobs: JobMatch[];
  onAddJob: () => void;
  onEditJob: (job: JobMatch) => void;
  onDeleteJob: (id: string) => void;
  onGenerateApplication: (job: JobMatch) => void;
}

export const JobBoardView: React.FC<JobBoardViewProps> = ({
  jobs,
  onAddJob,
  onEditJob,
  onDeleteJob,
  onGenerateApplication
}) => {
  const [filterType, setFilterType] = useState<JobType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || job.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: JobMatch['status']) => {
    switch(status) {
      case 'open': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'applied': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'interviewing': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'offer': return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      case 'rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-stone-500/10 text-stone-400 border-stone-500/20';
    }
  };

  const getTypeLabel = (type: JobType) => {
    switch(type) {
      case 'local': return 'Local';
      case 'international': return 'International';
      case 'touring': return 'Touring';
      case 'remote': return 'Remote';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-100 tracking-tight">Intelligent Job Board</h2>
          <p className="text-sm text-stone-400">Match verified portfolio assets to touring & local positions.</p>
        </div>
        <button
          onClick={onAddJob}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Position
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 p-1 rounded-lg">
          {(['all', 'local', 'international', 'touring', 'remote'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${
                filterType === type 
                  ? 'bg-stone-700 text-stone-100 shadow' 
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        
        <div className="relative w-64">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-stone-600 focus:bg-stone-800 transition-colors"
          />
        </div>
      </div>

      {/* Job Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden hover:border-sky-500/30 transition-all flex flex-col md:flex-row">
            
            {/* Core Info */}
            <div className="p-5 flex-1 border-b md:border-b-0 md:border-r border-stone-800">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2 cursor-pointer hover:text-sky-400 transition-colors" onClick={() => onEditJob(job)}>
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-xs text-stone-400">
                    <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase border ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                  <span className="text-[10px] bg-stone-800 text-stone-300 px-2.5 py-1 rounded">
                    {getTypeLabel(job.type)}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-stone-300 line-clamp-2 leading-relaxed mb-4">
                {job.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {job.matchedSkills.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> {skill}
                  </span>
                ))}
                {job.missingSkills.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] border border-rose-500/20">
                    <XCircle className="w-3 h-3" /> {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Matching & Actions Pane */}
            <div className="w-full md:w-80 bg-stone-900/50 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Match Analysis
                  </h4>
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center border border-stone-700 relative overflow-hidden">
                      <div 
                        className={`absolute bottom-0 left-0 right-0 bg-emerald-500/20`}
                        style={{ height: `${job.matchScore}%` }}
                      />
                      <span className="text-xs font-bold text-stone-200 z-10">{job.matchScore}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-stone-400 italic mb-4">
                  "{job.matchRationale}"
                </p>
              </div>

              <div className="space-y-2 mt-4">
                <button
                  onClick={() => onGenerateApplication(job)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-sky-900/30 hover:bg-sky-900/50 text-sky-400 border border-sky-900/50 text-xs font-bold transition-all shadow-sm group"
                >
                  <FileText className="w-4 h-4" />
                  1-Click Tailored App
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0" />
                </button>
                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors"
                  >
                    View Original Posting
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="p-12 text-center text-stone-500 bg-stone-900/50 rounded-xl border border-stone-800 border-dashed">
            No matching jobs found. Try adjusting your filters or search.
          </div>
        )}
      </div>
    </div>
  );
};
