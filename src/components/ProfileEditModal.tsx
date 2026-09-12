import React, { useState, useEffect } from 'react';
import { AuthorProfile } from '../types';
import { X, User, Mail, Phone, MapPin, Globe, Github, Linkedin } from 'lucide-react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AuthorProfile;
  onSaveProfile: (profile: AuthorProfile) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  const [formData, setFormData] = useState<AuthorProfile>(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div 
        id="profile-edit-modal-dialog"
        className="bg-stone-900 w-full max-w-xl max-h-[90vh] rounded-2xl shadow-2xl border border-stone-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-800/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-100 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              <span>Resume &amp; Portfolio Profile</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              This information heads your exported HTML site and Markdown resume.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-200 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Elena Rostova"
                className="w-full px-3 py-2 rounded-lg border border-stone-700 text-stone-100 bg-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Professional Headline / Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Senior Product Designer"
                className="w-full px-3 py-2 rounded-lg border border-stone-700 text-stone-100 bg-stone-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <span>Email</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@domain.com"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-700 text-stone-100 text-xs bg-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>Phone</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-700 text-stone-100 text-xs bg-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>Location</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="San Francisco, CA"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-700 text-stone-100 text-xs bg-stone-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-stone-400" />
                <span>Personal Website</span>
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-1.5 rounded-lg border border-stone-700 text-stone-100 text-xs bg-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5 text-stone-400" />
                <span>LinkedIn URL</span>
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-1.5 rounded-lg border border-stone-700 text-stone-100 text-xs bg-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center gap-1">
                <Github className="w-3.5 h-3.5 text-stone-400" />
                <span>GitHub URL</span>
              </label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-1.5 rounded-lg border border-stone-700 text-stone-100 text-xs bg-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Professional Summary / Bio
            </label>
            <textarea
              rows={4}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Highlight your core expertise, career objectives, leadership philosophy..."
              className="w-full px-3 py-2 rounded-lg border border-stone-700 text-stone-100 text-xs sm:text-sm leading-relaxed bg-stone-900"
            />
          </div>

          <div className="pt-2 text-right">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
