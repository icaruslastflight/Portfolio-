import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Edit2,
  Trash2,
  Search,
  Layers,
  Award,
  Sparkles,
  Tag,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SkillGroup, SkillItem } from '../types';

interface SkillsViewProps {
  skillGroups: SkillGroup[];
  onAddSkillGroup: () => void;
  onEditSkillGroup: (group: SkillGroup) => void;
  onDeleteSkillGroup: (groupId: string) => void;
  onAddSkillToGroup: (groupId: string) => void;
  onEditSkill: (groupId: string, skill: SkillItem) => void;
  onDeleteSkill: (groupId: string, skillId: string) => void;
  onOpenResumeImport?: () => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({
  skillGroups,
  onAddSkillGroup,
  onEditSkillGroup,
  onDeleteSkillGroup,
  onAddSkillToGroup,
  onEditSkill,
  onDeleteSkill,
  onOpenResumeImport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProficiency, setSelectedProficiency] = useState<string>('all');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    skillGroups.forEach((g) => {
      map[g.id] = true;
    });
    return map;
  });

  const toggleGroupExpand = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const getProficiencyBadge = (proficiency: string) => {
    switch (proficiency) {
      case 'Master':
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-400" /> Master (10+ Yrs)
          </span>
        );
      case 'Expert':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-violet-400" /> Expert
          </span>
        );
      case 'Advanced':
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30">
            Advanced
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Proficient
          </span>
        );
    }
  };

  // Filter groups and their skills
  const filteredGroups = skillGroups
    .map((grp) => {
      const filteredSkills = grp.skills.filter((sk) => {
        const matchesSearch =
          sk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (sk.description && sk.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (sk.keywords && sk.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()))) ||
          grp.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesProficiency =
          selectedProficiency === 'all' || sk.proficiency.toLowerCase() === selectedProficiency.toLowerCase();

        return matchesSearch && matchesProficiency;
      });

      return {
        ...grp,
        skills: filteredSkills
      };
    })
    .filter((grp) => grp.skills.length > 0 || searchTerm === '');

  const totalSkillsCount = skillGroups.reduce((acc, g) => acc + g.skills.length, 0);
  const masterSkillsCount = skillGroups.reduce(
    (acc, g) => acc + g.skills.filter((s) => s.proficiency === 'Master').length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header Banner & Stats */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Cpu className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">Technical Skills & Show Systems</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                Editable Show Engineering Matrix
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-2xl">
              Categorized by technical disciplines: Media Servers, LED Processing, Signal Routing, Electronics Bench Repair, Lasers & Automation, and Staging.
              Maintained separate from individual job case studies.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onOpenResumeImport && (
              <button
                type="button"
                onClick={onOpenResumeImport}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-violet-950/80 hover:bg-violet-900 text-violet-200 hover:text-white rounded-lg text-xs font-semibold border border-violet-700/60 transition-all shadow-sm"
                title="Import resume to discern clearly stated technical skills"
              >
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>Import Resume</span>
              </button>
            )}
            <button
              onClick={onAddSkillGroup}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Domain Group
            </button>
            <button
              onClick={() => {
                if (skillGroups.length > 0) {
                  onAddSkillToGroup(skillGroups[0].id);
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-violet-600/20"
            >
              <Plus className="w-4 h-4" /> Add Skill
            </button>
          </div>
        </div>

        {/* Quick Stats Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-2.5">
            <span className="text-xs text-slate-400 block mb-0.5">Technical Domains</span>
            <span className="text-lg font-bold text-white">{skillGroups.length} Disciplines</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-2.5">
            <span className="text-xs text-slate-400 block mb-0.5">Total Verified Skills</span>
            <span className="text-lg font-bold text-violet-400">{totalSkillsCount} Skills</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-2.5">
            <span className="text-xs text-slate-400 block mb-0.5">Master Tier Proficiencies</span>
            <span className="text-lg font-bold text-amber-400">{masterSkillsCount} Master</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-2.5">
            <span className="text-xs text-slate-400 block mb-0.5">Live Playback Standard</span>
            <span className="text-lg font-bold text-emerald-400">Locked 60 FPS</span>
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
            placeholder="Search skills, protocols, codecs, hardware..."
            className="w-full bg-slate-800/70 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setSelectedProficiency('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              selectedProficiency === 'all'
                ? 'bg-violet-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Tiers ({totalSkillsCount})
          </button>
          <button
            onClick={() => setSelectedProficiency('master')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              selectedProficiency === 'master'
                ? 'bg-violet-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Master (10+ Yrs)
          </button>
          <button
            onClick={() => setSelectedProficiency('expert')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              selectedProficiency === 'expert'
                ? 'bg-violet-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Expert
          </button>
          <button
            onClick={() => setSelectedProficiency('advanced')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              selectedProficiency === 'advanced'
                ? 'bg-violet-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      {/* Skill Groups List */}
      <div className="space-y-6">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-xl p-8">
            <Cpu className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white mb-1">No skills match your search criteria</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Try searching for a different keyword or reset the proficiency filter.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedProficiency('all');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredGroups.map((group) => {
            const isExpanded = expandedGroups[group.id] !== false;
            return (
              <div
                key={group.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-all"
              >
                {/* Group Header */}
                <div className="p-4 sm:p-5 bg-slate-950/70 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleGroupExpand(group.id)}
                      className="text-slate-400 hover:text-white transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white tracking-tight">{group.name}</h3>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                          {group.skills.length} {group.skills.length === 1 ? 'Skill' : 'Skills'}
                        </span>
                        {group.highlightMetric && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hidden md:inline-block">
                            {group.highlightMetric.label}: {group.highlightMetric.value}
                          </span>
                        )}
                      </div>
                      {group.description && (
                        <p className="text-xs text-slate-400 mt-0.5">{group.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => onAddSkillToGroup(group.id)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Skill
                    </button>
                    <button
                      onClick={() => onEditSkillGroup(group)}
                      title="Edit Group Details"
                      className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-slate-700/60 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Delete group "${group.name}" and all its ${group.skills.length} skills?`
                          )
                        ) {
                          onDeleteSkillGroup(group.id);
                        }
                      }}
                      title="Delete Group"
                      className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-700/60 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Skills Grid */}
                {isExpanded && (
                  <div className="p-4 sm:p-5">
                    {group.skills.length === 0 ? (
                      <div className="text-center py-6 text-slate-500 text-xs">
                        No skills in this group. Click "Add Skill" above to add one.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {group.skills.map((skill) => (
                          <div
                            key={skill.id}
                            className="bg-slate-950/40 border border-slate-800/90 rounded-lg p-4 hover:border-slate-700 transition-all flex flex-col justify-between group"
                          >
                            <div className="space-y-2">
                              {/* Header & Badges */}
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                                    {skill.name}
                                  </h4>
                                  {skill.yearsOfExperience && (
                                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                      <Clock className="w-3 h-3 text-slate-500" />
                                      {skill.yearsOfExperience}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {getProficiencyBadge(skill.proficiency)}
                                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => onEditSkill(group.id, skill)}
                                      title="Edit Skill"
                                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm(`Delete skill "${skill.name}"?`)) {
                                          onDeleteSkill(group.id, skill.id);
                                        }
                                      }}
                                      title="Delete Skill"
                                      className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Description */}
                              {skill.description && (
                                <p className="text-xs text-slate-300 leading-relaxed">{skill.description}</p>
                              )}
                            </div>

                            {/* Keywords Chips */}
                            {skill.keywords && skill.keywords.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3 pt-2.5 border-t border-slate-800/60">
                                {skill.keywords.map((kw) => (
                                  <span
                                    key={kw}
                                    className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                                  >
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
