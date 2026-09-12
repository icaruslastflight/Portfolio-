import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Cpu, Wrench, Layers, Tag, Award, Sparkles } from 'lucide-react';
import { SkillItem, SkillGroup } from '../types';

interface SkillEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill?: SkillItem | null;
  groupId: string;
  skillGroups: SkillGroup[];
  onSaveSkill: (groupId: string, skill: SkillItem) => void;
}

export const SkillEditModal: React.FC<SkillEditModalProps> = ({
  isOpen,
  onClose,
  skill,
  groupId,
  skillGroups,
  onSaveSkill
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState(groupId);
  const [name, setName] = useState('');
  const [proficiency, setProficiency] = useState<'Master' | 'Expert' | 'Advanced' | 'Proficient'>('Master');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    setSelectedGroupId(groupId);
    if (skill) {
      setName(skill.name || '');
      setProficiency(skill.proficiency || 'Master');
      setYearsOfExperience(skill.yearsOfExperience || '');
      setDescription(skill.description || '');
      setKeywords(skill.keywords ? [...skill.keywords] : []);
    } else {
      setName('');
      setProficiency('Master');
      setYearsOfExperience('8+ Years');
      setDescription('');
      setKeywords([]);
    }
  }, [skill, groupId, isOpen]);

  if (!isOpen) return null;

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updatedSkill: SkillItem = {
      id: skill ? skill.id : `sk_${Date.now()}`,
      name: name.trim(),
      proficiency,
      yearsOfExperience: yearsOfExperience.trim() || undefined,
      description: description.trim() || undefined,
      keywords: keywords.filter((k) => k.trim().length > 0)
    };

    onSaveSkill(selectedGroupId, updatedSkill);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2 text-violet-400">
            <Cpu className="w-5 h-5" />
            <h2 className="text-lg font-semibold text-white">
              {skill ? 'Edit Technical Skill' : 'Add Technical Skill'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm text-slate-300">
          {/* Target Group */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Skill Group / Domain</label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500 text-xs"
            >
              {skillGroups.map((grp) => (
                <option key={grp.id} value={grp.id}>
                  {grp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Name */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Skill or Technology Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Resolume Arena 7 or Brompton SX40"
              required
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
            />
          </div>

          {/* Proficiency & Years */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Proficiency Tier</label>
              <select
                value={proficiency}
                onChange={(e) =>
                  setProficiency(e.target.value as 'Master' | 'Expert' | 'Advanced' | 'Proficient')
                }
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500 text-xs"
              >
                <option value="Master">Master (10+ Years / Industry Lead)</option>
                <option value="Expert">Expert (5-8+ Years / Daily Practice)</option>
                <option value="Advanced">Advanced (3-5 Years / High Competence)</option>
                <option value="Proficient">Proficient (Operational Knowledge)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Experience Span</label>
              <input
                type="text"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                placeholder="e.g. 10+ Years or Active Daily"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Technical Description & Operational Capabilities
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="e.g. Advanced canvas slice routing, DMX lumiverse mapping, Art-Net/sACN, OSC, SMPTE LTC timecode lock..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-violet-400" /> Keywords & Protocols
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-950/60 border border-violet-700/50 text-violet-300 rounded text-xs"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="hover:text-rose-400 text-violet-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                placeholder="e.g. DXV 3, Art-Net, SMPTE, OSC..."
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" /> Add Keyword
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-violet-600/20 transition-all"
          >
            {skill ? 'Save Skill' : 'Add Skill'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface SkillGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group?: SkillGroup | null;
  onSaveGroup: (group: SkillGroup) => void;
}

export const SkillGroupModal: React.FC<SkillGroupModalProps> = ({
  isOpen,
  onClose,
  group,
  onSaveGroup
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('violet');
  const [metricLabel, setMetricLabel] = useState('');
  const [metricValue, setMetricValue] = useState('');

  useEffect(() => {
    if (group) {
      setName(group.name || '');
      setDescription(group.description || '');
      setColor(group.color || 'violet');
      setMetricLabel(group.highlightMetric?.label || '');
      setMetricValue(group.highlightMetric?.value || '');
    } else {
      setName('');
      setDescription('');
      setColor('violet');
      setMetricLabel('');
      setMetricValue('');
    }
  }, [group, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updatedGroup: SkillGroup = {
      id: group ? group.id : `skill_grp_${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      highlightMetric:
        metricLabel.trim() && metricValue.trim()
          ? { label: metricLabel.trim(), value: metricValue.trim() }
          : undefined,
      skills: group ? group.skills : [],
      createdAt: group ? group.createdAt : Date.now(),
      updatedAt: Date.now()
    };

    onSaveGroup(updatedGroup);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2 text-violet-400">
            <Layers className="w-5 h-5" />
            <h2 className="text-lg font-semibold text-white">
              {group ? 'Edit Technical Skill Group' : 'Add Skill Domain Group'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm text-slate-300">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Group Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Media Servers & Generative Engines"
              required
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Domain Scope & Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="e.g. Real-time rendering engines, canvas slice routing, SMPTE LTC timecode lock..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Highlight Metric Label</label>
              <input
                type="text"
                value={metricLabel}
                onChange={(e) => setMetricLabel(e.target.value)}
                placeholder="e.g. Performance"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Highlight Metric Value</label>
              <input
                type="text"
                value={metricValue}
                onChange={(e) => setMetricValue(e.target.value)}
                placeholder="e.g. Locked 60 FPS"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-violet-600/20 transition-all"
          >
            {group ? 'Save Group' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
};
