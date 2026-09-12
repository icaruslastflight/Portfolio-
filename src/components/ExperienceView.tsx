import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  MapPin,
  Star,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Award,
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';
import { WorkExperience } from '../types';

interface ExperienceViewProps {
  workExperience: WorkExperience[];
  onAddExperience: () => void;
  onEditExperience: (exp: WorkExperience) => void;
  onDeleteExperience: (id: string) => void;
  onToggleStar: (id: string) => void;
  onOpenResumeImport?: () => void;
}

export const ExperienceView: React.FC<ExperienceViewProps> = ({
  workExperience,
  onAddExperience,
  onEditExperience,
  onDeleteExperience,
  onToggleStar,
  onOpenResumeImport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredExperience = workExperience.filter((exp) => {
    const matchesSearch =
      exp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.companyOrVenue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.skillsUsed.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      filterType === 'all' ||
      (filterType === 'current' && exp.current) ||
      (filterType === 'starred' && exp.starred) ||
      exp.employmentType?.toLowerCase().includes(filterType.toLowerCase());

    return matchesSearch && matchesType;
  });

  const totalPositions = workExperience.length;
  const currentPositions = workExperience.filter((e) => e.current).length;
  const starredPositions = workExperience.filter((e) => e.starred).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Briefcase className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">Work Experience & Venue Roles</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                Direct Career Chronology
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-2xl">
              Chronological leadership positions, venue residencies, site lead tenures, and touring contracts.
              Maintained separate from individual technical projects and case studies.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto self-start md:self-auto">
            {onOpenResumeImport && (
              <button
                type="button"
                onClick={onOpenResumeImport}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 hover:text-white rounded-lg text-sm font-semibold border border-indigo-700/60 transition-all shadow-sm"
                title="Import resume to auto-ingest experience and discern skills"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Import Resume</span>
              </button>
            )}
            <button
              onClick={onAddExperience}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>
        </div>

        {/* Quick Stats Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-2.5">
            <span className="text-xs text-slate-400 block mb-0.5">Total Career Roles</span>
            <span className="text-lg font-bold text-white">{totalPositions}</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-2.5">
            <span className="text-xs text-slate-400 block mb-0.5">Active Residencies / Leads</span>
            <span className="text-lg font-bold text-emerald-400">{currentPositions} Current</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-2.5">
            <span className="text-xs text-slate-400 block mb-0.5">Featured Highlights</span>
            <span className="text-lg font-bold text-amber-400">{starredPositions} Starred</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-2.5">
            <span className="text-xs text-slate-400 block mb-0.5">Operating Track Record</span>
            <span className="text-lg font-bold text-indigo-400">10+ Years</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search roles, venues, skills, tech..."
            className="w-full bg-slate-800/70 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Roles ({workExperience.length})
          </button>
          <button
            onClick={() => setFilterType('current')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filterType === 'current'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Active & Current ({currentPositions})
          </button>
          <button
            onClick={() => setFilterType('starred')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filterType === 'starred'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Starred Highlights ({starredPositions})
          </button>
        </div>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {filteredExperience.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-xl p-8">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white mb-1">No work experience entries match your filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Try adjusting your search query or reset the filter to view all career history.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredExperience.map((exp) => (
            <div
              key={exp.id}
              className={`bg-slate-900/90 border rounded-xl overflow-hidden transition-all shadow-md hover:shadow-xl ${
                exp.starred
                  ? 'border-indigo-500/40 hover:border-indigo-500/70 bg-gradient-to-br from-slate-900/90 via-slate-900/90 to-indigo-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 sm:p-6 border-b border-slate-800/70 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">{exp.role}</h3>
                    {exp.current && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active Present
                      </span>
                    )}
                    {exp.employmentType && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                        {exp.employmentType}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span className="font-medium text-slate-200">{exp.companyOrVenue}</span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {exp.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-indigo-300/80">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-start">
                  <button
                    onClick={() => onToggleStar(exp.id)}
                    title={exp.starred ? 'Remove Star' : 'Star as Career Highlight'}
                    className={`p-2 rounded-lg border transition-colors ${
                      exp.starred
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                        : 'bg-slate-800/70 border-slate-700/60 text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                    }`}
                  >
                    <Star className="w-4 h-4" fill={exp.starred ? 'currentColor' : 'none'} />
                  </button>

                  <button
                    onClick={() => onEditExperience(exp)}
                    title="Edit Experience"
                    className="p-2 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete experience record for "${exp.role} at ${exp.companyOrVenue}"?`)) {
                        onDeleteExperience(exp.id);
                      }
                    }}
                    title="Delete Experience"
                    className="p-2 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 space-y-5">
                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed">{exp.description}</p>

                {/* Highlights */}
                {exp.highlights && exp.highlights.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                      Key Responsibilities & Operational Accomplishments
                    </h4>
                    <ul className="space-y-1.5">
                      {exp.highlights.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-normal">
                          <span className="text-indigo-400 font-bold mt-0.5">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Metrics */}
                {exp.keyMetrics && exp.keyMetrics.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                    {exp.keyMetrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between"
                      >
                        <span className="text-xs text-slate-400">{metric.label}</span>
                        <span className="text-xs font-bold text-white ml-2">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills Used Tags */}
                {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-slate-500" /> Systems:
                    </span>
                    {exp.skillsUsed.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] px-2 py-0.5 rounded bg-indigo-950/40 text-indigo-300 border border-indigo-800/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
