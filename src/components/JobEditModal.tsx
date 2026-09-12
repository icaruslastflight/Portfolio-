import React, { useState, useEffect } from 'react';
import { JobMatch, JobStatus, JobType } from '../types';
import { X, Sparkles, Building2, MapPin, Link as LinkIcon, DollarSign } from 'lucide-react';

interface JobEditModalProps {
  isOpen: boolean;
  job: JobMatch | null;
  onClose: () => void;
  onSave: (job: JobMatch) => void;
}

export const JobEditModal: React.FC<JobEditModalProps> = ({
  isOpen,
  job,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<JobMatch>>({
    title: '',
    company: '',
    location: '',
    type: 'local',
    status: 'open',
    url: '',
    salary: '',
    description: '',
    matchScore: 85,
    matchRationale: 'Strong alignment with past technical roles.',
    matchedSkills: [],
    missingSkills: []
  });

  const [matchedSkillInput, setMatchedSkillInput] = useState('');
  const [missingSkillInput, setMissingSkillInput] = useState('');

  useEffect(() => {
    if (job) {
      setFormData(job);
    } else {
      setFormData({
        title: '',
        company: '',
        location: '',
        type: 'local',
        status: 'open',
        url: '',
        salary: '',
        description: '',
        matchScore: 85,
        matchRationale: '',
        matchedSkills: [],
        missingSkills: []
      });
    }
  }, [job, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company) return;
    
    onSave({
      ...formData,
      id: job?.id || crypto.randomUUID(),
      dateAdded: job?.dateAdded || Date.now(),
      updatedAt: Date.now(),
    } as JobMatch);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-full">
        <div className="flex items-center justify-between p-4 border-b border-stone-800 shrink-0 bg-stone-900/50">
          <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
            {job ? 'Edit Job Match' : 'Add Job Match'}
          </h2>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto pane-scroll space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Job Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                placeholder="e.g. Lead Technical Director"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Company</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  placeholder="e.g. Live Nation"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  placeholder="e.g. Los Angeles, CA"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Job Type & Status</label>
              <div className="flex gap-2">
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as JobType })}
                  className="flex-1 px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                >
                  <option value="local">Local</option>
                  <option value="international">International</option>
                  <option value="touring">Touring</option>
                  <option value="remote">Remote</option>
                </select>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as JobStatus })}
                  className="flex-1 px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                >
                  <option value="open">Open</option>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">URL</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={formData.url || ''}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>
             <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Salary/Rate</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.salary || ''}
                  onChange={e => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  placeholder="$150k - $180k"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all resize-none"
              placeholder="Paste job description..."
            />
          </div>

          <div className="border-t border-stone-800 pt-6 space-y-4">
             <div className="flex items-center gap-2 mb-2">
               <Sparkles className="w-4 h-4 text-amber-400" />
               <h3 className="text-sm font-bold text-stone-200">AI Match Context</h3>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Match Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.matchScore}
                    onChange={e => setFormData({ ...formData, matchScore: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Rationale</label>
                  <input
                    type="text"
                    value={formData.matchRationale}
                    onChange={e => setFormData({ ...formData, matchRationale: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                    placeholder="Why this fits..."
                  />
                </div>
             </div>
          </div>

        </div>

        <div className="p-4 border-t border-stone-800 bg-stone-900 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-lg transition-all"
          >
            Save Job
          </button>
        </div>
      </div>
    </div>
  );
};
