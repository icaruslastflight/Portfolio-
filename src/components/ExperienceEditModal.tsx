import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2, Briefcase, MapPin, Calendar, Award } from 'lucide-react';
import { WorkExperience, MetricItem } from '../types';

interface ExperienceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience?: WorkExperience | null;
  onSave: (experience: WorkExperience) => void;
}

export const ExperienceEditModal: React.FC<ExperienceEditModalProps> = ({
  isOpen,
  onClose,
  experience,
  onSave
}) => {
  const [role, setRole] = useState('');
  const [companyOrVenue, setCompanyOrVenue] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [current, setCurrent] = useState(false);
  const [employmentType, setEmploymentType] = useState('Residency / Dept Head');
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState('');
  const [skillsUsed, setSkillsUsed] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [keyMetrics, setKeyMetrics] = useState<MetricItem[]>([]);
  const [newMetricLabel, setNewMetricLabel] = useState('');
  const [newMetricValue, setNewMetricValue] = useState('');
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    if (experience) {
      setRole(experience.role || '');
      setCompanyOrVenue(experience.companyOrVenue || '');
      setLocation(experience.location || '');
      setStartDate(experience.startDate || '');
      setEndDate(experience.endDate || '');
      setCurrent(experience.current || false);
      setEmploymentType(experience.employmentType || 'Residency / Dept Head');
      setDescription(experience.description || '');
      setHighlights(experience.highlights ? [...experience.highlights] : []);
      setSkillsUsed(experience.skillsUsed ? [...experience.skillsUsed] : []);
      setKeyMetrics(experience.keyMetrics ? [...experience.keyMetrics] : []);
      setStarred(experience.starred || false);
    } else {
      setRole('');
      setCompanyOrVenue('');
      setLocation('');
      setStartDate('');
      setEndDate('Present');
      setCurrent(true);
      setEmploymentType('Residency / Dept Head');
      setDescription('');
      setHighlights(['']);
      setSkillsUsed([]);
      setKeyMetrics([]);
      setStarred(false);
    }
  }, [experience, isOpen]);

  if (!isOpen) return null;

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setHighlights([...highlights, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skillsUsed.includes(newSkill.trim())) {
      setSkillsUsed([...skillsUsed, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillsUsed(skillsUsed.filter((s) => s !== skill));
  };

  const handleAddMetric = () => {
    if (newMetricLabel.trim() && newMetricValue.trim()) {
      setKeyMetrics([...keyMetrics, { label: newMetricLabel.trim(), value: newMetricValue.trim() }]);
      setNewMetricLabel('');
      setNewMetricValue('');
    }
  };

  const handleRemoveMetric = (index: number) => {
    setKeyMetrics(keyMetrics.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim() || !companyOrVenue.trim()) return;

    const updated: WorkExperience = {
      id: experience ? experience.id : `exp_${Date.now()}`,
      role: role.trim(),
      companyOrVenue: companyOrVenue.trim(),
      location: location.trim(),
      startDate: startDate.trim(),
      endDate: current ? 'Present' : endDate.trim(),
      current,
      employmentType: employmentType.trim(),
      description: description.trim(),
      highlights: highlights.filter((h) => h.trim().length > 0),
      skillsUsed: skillsUsed.filter((s) => s.trim().length > 0),
      keyMetrics,
      starred,
      createdAt: experience ? experience.createdAt : Date.now(),
      updatedAt: Date.now()
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2 text-indigo-400">
            <Briefcase className="w-5 h-5" />
            <h2 className="text-lg font-semibold text-white">
              {experience ? 'Edit Work Experience & Venue Role' : 'Add New Work Experience / Venue Role'}
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-300">
          {/* Role & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Role Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Lead Video Engineer & Technical Director"
                required
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Company, Venue, or Circuit <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={companyOrVenue}
                onChange={(e) => setCompanyOrVenue(e.target.value)}
                placeholder="e.g. Republic Club Pattaya (DJ Mag Top 100)"
                required
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Location & Employment Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Pattaya, Thailand or Pittsburgh, PA"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Employment / Contract Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Residency / Dept Head">Residency / Dept Head</option>
                <option value="Touring Contract">Touring Contract</option>
                <option value="Site Lead">Site Lead</option>
                <option value="VIP Activation Lead">VIP Activation Lead</option>
                <option value="Freelance Subcontractor">Freelance Subcontractor</option>
                <option value="Permanent Installation">Permanent Installation</option>
              </select>
            </div>
          </div>

          {/* Dates & Current */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-slate-950/40 p-3.5 rounded-lg border border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Start Date
              </label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="e.g. Jan 2025"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">End Date</label>
              <input
                type="text"
                value={current ? 'Present' : endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={current}
                placeholder="e.g. Present or 2022"
                className={`w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 ${
                  current ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div className="flex items-center pb-2">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-indigo-300">
                <input
                  type="checkbox"
                  checked={current}
                  onChange={(e) => {
                    setCurrent(e.target.checked);
                    if (e.target.checked) setEndDate('Present');
                  }}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                Currently Working Here / Active
              </label>
            </div>
          </div>

          {/* Overview Description */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Role Overview & Scope</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the department responsibilities, scale of systems managed, and day-to-day leadership..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Operational Highlights & Accomplishments
            </label>
            <div className="space-y-2 mb-2">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-800/60 p-2 rounded border border-slate-700/60">
                  <span className="text-indigo-400 mt-0.5">•</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const updated = [...highlights];
                      updated[idx] = e.target.value;
                      setHighlights(updated);
                    }}
                    className="flex-1 bg-transparent text-white focus:outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(idx)}
                    className="text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddHighlight();
                  }
                }}
                placeholder="Add bullet point achievement and press Enter..."
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddHighlight}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" /> Add Bullet
              </button>
            </div>
          </div>

          {/* Skills & Systems Used */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Show Systems & Technologies Used</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skillsUsed.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-950/60 border border-indigo-700/50 text-indigo-300 rounded text-xs"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-400 text-indigo-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="e.g. Resolume Arena 7, Brompton SX40, 12G-SDI..."
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" /> Add Tag
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Key Operational Metrics (Optional)
            </label>
            <div className="space-y-1.5 mb-2">
              {keyMetrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-800/40 px-3 py-1.5 rounded border border-slate-700/50 text-xs"
                >
                  <span className="text-slate-400">{metric.label}:</span>
                  <span className="font-semibold text-white ml-2">{metric.value}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMetric(idx)}
                    className="text-slate-500 hover:text-rose-400 ml-3"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={newMetricLabel}
                onChange={(e) => setNewMetricLabel(e.target.value)}
                placeholder="Metric label (e.g. Show Downtime)"
                className="bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMetricValue}
                  onChange={(e) => setNewMetricValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMetric();
                    }
                  }}
                  placeholder="Value (e.g. 0% across all runs)"
                  className="flex-1 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddMetric}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Featured / Starred */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={starred}
                onChange={(e) => setStarred(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500 w-4 h-4"
              />
              Star as Featured Career Highlight
            </label>
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
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-600/20 transition-all"
          >
            {experience ? 'Save Changes' : 'Create Experience'}
          </button>
        </div>
      </div>
    </div>
  );
};
