import React, { useState, useId } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Briefcase, 
  Layers, 
  Cpu, 
  User, 
  Check, 
  X, 
  RotateCcw,
  Quote,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight
} from 'lucide-react';
import { AuthorProfile, WorkExperience, SkillGroup, PortfolioItem } from '../types';
import { 
  parseResumeDocument, 
  ResumeAnalysisResult, 
  EvaluatedSkill, 
  EvaluatedExperience, 
  EvaluatedProfileDiff, 
  EvaluatedProject 
} from '../utils/resumeImportService';
import { SAMPLE_TECHNICAL_RESUME } from '../utils/resumeParserFallback';

interface ResumeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AuthorProfile;
  workExperience: WorkExperience[];
  skillGroups: SkillGroup[];
  onCommitIngestion: (result: {
    profileUpdates?: Partial<AuthorProfile>;
    newExperiences: WorkExperience[];
    updatedExperiences: WorkExperience[];
    skillsToAddByGroup: Record<string, EvaluatedSkill[]>; // groupId -> skills
    newSkillGroupsToCreate: Array<{ name: string; skills: EvaluatedSkill[] }>;
    newProjects: PortfolioItem[];
    stats: {
      skillsAdded: number;
      experiencesAdded: number;
      profileFieldsUpdated: number;
    };
  }) => void;
}

export const ResumeImportModal: React.FC<ResumeImportModalProps> = ({
  isOpen,
  onClose,
  profile,
  workExperience,
  skillGroups,
  onCommitIngestion,
}) => {
  const fileInputId = useId();
  const [activeInputTab, setActiveInputTab] = useState<'upload' | 'paste'>('upload');
  const [resumeText, setResumeText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{
    file: File;
    base64?: string;
    mimeType?: string;
  } | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);

  // Review screen navigation
  const [reviewTab, setReviewTab] = useState<'skills' | 'experience' | 'profile' | 'projects'>('skills');
  const [skillFilter, setSkillFilter] = useState<'all' | 'new_only' | 'matched_only'>('all');

  if (!isOpen) return null;

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    if (file.type.includes('pdf') || file.type.includes('image')) {
      reader.onload = () => {
        const result = reader.result as string;
        // Strip data:mime/type;base64,
        const base64Data = result.split(',')[1] || '';
        setUploadedFile({
          file,
          base64: base64Data,
          mimeType: file.type || 'application/pdf',
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Plain text, markdown, json
      reader.onload = () => {
        const textContent = reader.result as string;
        setUploadedFile({
          file,
          mimeType: file.type || 'text/plain',
        });
        setResumeText(textContent);
      };
      reader.readAsText(file);
    }
  };

  // Run AI Analysis
  const handleRunAnalysis = async () => {
    if (!resumeText.trim() && !uploadedFile) return;

    setIsAnalyzing(true);
    setAnalysisStep('Ingesting resume payload and technical credentials...');

    try {
      setTimeout(() => {
        setAnalysisStep('Discerning clearly stated hardware, software & protocols...');
      }, 600);

      setTimeout(() => {
        setAnalysisStep('Extracting venue roles, touring dates & cross-referencing portfolio...');
      }, 1200);

      const result = await parseResumeDocument(
        {
          text: resumeText.trim(),
          fileData: uploadedFile?.base64
            ? {
                mimeType: uploadedFile.mimeType || 'application/pdf',
                base64: uploadedFile.base64,
                fileName: uploadedFile.file.name,
              }
            : undefined,
        },
        profile,
        workExperience,
        skillGroups
      );

      setAnalysisResult(result);
      // Default to skills tab to immediately show the discerned skills as requested
      setReviewTab('skills');
    } catch (err) {
      console.error('Failed to parse resume', err);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // Toggle selection for skills
  const handleToggleSkill = (skillId: string) => {
    if (!analysisResult) return;
    setAnalysisResult({
      ...analysisResult,
      skills: analysisResult.skills.map((s) =>
        s.id === skillId ? { ...s, selected: !s.selected } : s
      ),
    });
  };

  // Change skill target domain
  const handleChangeSkillDomain = (skillId: string, targetDomain: string) => {
    if (!analysisResult) return;
    setAnalysisResult({
      ...analysisResult,
      skills: analysisResult.skills.map((s) =>
        s.id === skillId ? { ...s, targetDomain } : s
      ),
    });
  };

  // Change skill proficiency
  const handleChangeSkillProficiency = (
    skillId: string,
    proficiency: 'Master' | 'Expert' | 'Advanced' | 'Proficient'
  ) => {
    if (!analysisResult) return;
    setAnalysisResult({
      ...analysisResult,
      skills: analysisResult.skills.map((s) =>
        s.id === skillId ? { ...s, proficiency } : s
      ),
    });
  };

  // Select all or select only new skills
  const handleSelectAllSkills = (select: boolean) => {
    if (!analysisResult) return;
    setAnalysisResult({
      ...analysisResult,
      skills: analysisResult.skills.map((s) => ({ ...s, selected: select })),
    });
  };

  const handleSelectOnlyNewSkills = () => {
    if (!analysisResult) return;
    setAnalysisResult({
      ...analysisResult,
      skills: analysisResult.skills.map((s) => ({ ...s, selected: s.isNew })),
    });
  };

  // Toggle selection for experience
  const handleToggleExperience = (expId: string) => {
    if (!analysisResult) return;
    setAnalysisResult({
      ...analysisResult,
      experiences: analysisResult.experiences.map((e) =>
        e.experience.id === expId ? { ...e, selected: !e.selected } : e
      ),
    });
  };

  // Toggle profile diff field
  const handleToggleProfileField = (field: keyof AuthorProfile) => {
    if (!analysisResult) return;
    setAnalysisResult({
      ...analysisResult,
      profileDiffs: analysisResult.profileDiffs.map((d) =>
        d.field === field ? { ...d, selected: !d.selected } : d
      ),
    });
  };

  // Toggle project
  const handleToggleProject = (projId: string) => {
    if (!analysisResult) return;
    setAnalysisResult({
      ...analysisResult,
      projects: analysisResult.projects.map((p) =>
        p.project.id === projId ? { ...p, selected: !p.selected } : p
      ),
    });
  };

  // Commit everything selected to the application state
  const handleCommit = () => {
    if (!analysisResult) return;

    // 1. Profile updates
    const profileUpdates: Partial<AuthorProfile> = {};
    let profileFieldsUpdated = 0;
    for (const p of analysisResult.profileDiffs) {
      if (p.selected && p.isChanged) {
        profileUpdates[p.field] = p.newValue;
        profileFieldsUpdated++;
      }
    }

    // 2. Work Experiences
    const newExperiences: WorkExperience[] = [];
    const updatedExperiences: WorkExperience[] = [];
    for (const exp of analysisResult.experiences) {
      if (exp.selected) {
        if (exp.isDuplicateOrSimilar && exp.matchedExistingId) {
          updatedExperiences.push(exp.experience);
        } else {
          newExperiences.push(exp.experience);
        }
      }
    }

    // 3. Skills routing
    const selectedSkills = analysisResult.skills.filter((s) => s.selected);
    const skillsToAddByGroup: Record<string, EvaluatedSkill[]> = {};
    const unassignedSkills: EvaluatedSkill[] = [];

    for (const s of selectedSkills) {
      // Look for an existing group that matches the targetDomain
      const matchedGroup = skillGroups.find(
        (g) => g.name.toLowerCase() === s.targetDomain.toLowerCase()
      );
      if (matchedGroup) {
        if (!skillsToAddByGroup[matchedGroup.id]) {
          skillsToAddByGroup[matchedGroup.id] = [];
        }
        skillsToAddByGroup[matchedGroup.id].push(s);
      } else {
        unassignedSkills.push(s);
      }
    }

    // Group unassigned skills into new skill groups
    const newSkillGroupsToCreate: Array<{ name: string; skills: EvaluatedSkill[] }> = [];
    const domainGroupMap: Record<string, EvaluatedSkill[]> = {};
    for (const s of unassignedSkills) {
      if (!domainGroupMap[s.targetDomain]) {
        domainGroupMap[s.targetDomain] = [];
      }
      domainGroupMap[s.targetDomain].push(s);
    }
    for (const [name, skills] of Object.entries(domainGroupMap)) {
      newSkillGroupsToCreate.push({ name, skills });
    }

    // 4. Projects
    const newProjects = analysisResult.projects
      .filter((p) => p.selected)
      .map((p) => p.project);

    onCommitIngestion({
      profileUpdates: Object.keys(profileUpdates).length > 0 ? profileUpdates : undefined,
      newExperiences,
      updatedExperiences,
      skillsToAddByGroup,
      newSkillGroupsToCreate,
      newProjects,
      stats: {
        skillsAdded: selectedSkills.length,
        experiencesAdded: newExperiences.length + updatedExperiences.length,
        profileFieldsUpdated,
      },
    });

    onClose();
  };

  // Compute selected stats
  const selectedSkillsCount = analysisResult?.skills.filter((s) => s.selected).length || 0;
  const selectedNewSkillsCount = analysisResult?.skills.filter((s) => s.selected && s.isNew).length || 0;
  const selectedExperiencesCount = analysisResult?.experiences.filter((e) => e.selected).length || 0;
  const selectedProfileUpdatesCount = analysisResult?.profileDiffs.filter((p) => p.selected && p.isChanged).length || 0;
  const selectedProjectsCount = analysisResult?.projects.filter((p) => p.selected).length || 0;

  // Filter skills list
  const filteredSkills = (analysisResult?.skills || []).filter((s) => {
    if (skillFilter === 'new_only') return s.isNew;
    if (skillFilter === 'matched_only') return !s.isNew;
    return true;
  });

  // Group filtered skills by domain
  const domainSkillsMap = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.targetDomain]) {
      acc[skill.targetDomain] = [];
    }
    acc[skill.targetDomain].push(skill);
    return acc;
  }, {} as Record<string, EvaluatedSkill[]>);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-resume-import-title"
    >
      <div className="bg-stone-900 rounded-2xl max-w-4xl w-full border border-stone-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-resume-import-title" className="text-base sm:text-lg font-bold text-stone-100 flex items-center gap-2">
                Resume Ingestion &amp; Technical Skill Discernment
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Gemini AI Powered
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                Import your resume to automatically ingest experience, bio credentials, and discern clearly stated technical skills.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-300 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* STEP 1: Input / Upload Screen */}
          {!analysisResult && (
            <div className="space-y-6">
              {/* Tab Selector: Upload File vs Paste Text */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveInputTab('upload')}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                      activeInputTab === 'upload'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-200 border-stone-800'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Resume File (PDF, DOCX, TXT)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveInputTab('paste')}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                      activeInputTab === 'paste'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-200 border-stone-800'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Paste Resume Text</span>
                  </button>
                </div>

                {/* Quick Sample Button */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveInputTab('paste');
                    setResumeText(SAMPLE_TECHNICAL_RESUME);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                  title="Populate with Brice Morneau's verified live production touring & venue resume"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Load Sample Technical Resume</span>
                </button>
              </div>

              {/* Upload Tab View */}
              {activeInputTab === 'upload' && (
                <div className="space-y-4">
                  <label
                    htmlFor={fileInputId}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      uploadedFile
                        ? 'border-emerald-400 bg-emerald-50/40'
                        : 'border-stone-700 hover:border-sky-400 bg-stone-800/50 hover:bg-sky-50/30'
                    }`}
                  >
                    <input
                      id={fileInputId}
                      type="file"
                      accept=".pdf,.docx,.doc,.txt,.md,.json,image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {uploadedFile ? (
                      <div className="space-y-2">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-stone-100">
                          {uploadedFile.file.name}
                        </h3>
                        <p className="text-xs text-stone-500">
                          {(uploadedFile.file.size / 1024).toFixed(1)} KB • {uploadedFile.file.type || 'Document'}
                        </p>
                        <span className="inline-block mt-2 text-xs text-emerald-700 font-semibold bg-emerald-100/70 px-2.5 py-1 rounded-full">
                          Ready for ingestion. Click &quot;Analyze &amp; Discern Skills&quot; below.
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-stone-800 text-stone-400 flex items-center justify-center mx-auto">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-200">
                            Drop your resume document here, or <span className="text-sky-600 underline">browse</span>
                          </p>
                          <p className="text-xs text-stone-500 mt-1">
                            Supports PDF, DOCX, TXT, or scan image (up to 25MB)
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-[11px] text-stone-500 pt-2">
                          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Private &amp; Secure</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-indigo-600" /> Multimodal Document Parsing</span>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              )}

              {/* Paste Tab View */}
              {activeInputTab === 'paste' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-300">
                      Paste Plaintext, Markdown, or Copied Resume Content:
                    </label>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {resumeText.length} characters • {resumeText.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows={12}
                    placeholder="Paste resume text here with work history, venue roles, and technical equipment..."
                    className="w-full p-4 rounded-xl border border-stone-700 text-xs text-stone-100 font-mono placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-stone-800/30 leading-relaxed"
                  />
                </div>
              )}

              {/* Explanatory Info Box */}
              <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200/80 flex items-start gap-3">
                <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div className="text-xs text-sky-900 leading-relaxed">
                  <p className="font-semibold text-sky-950">How Technical Skill Discernment Works:</p>
                  <p className="mt-0.5 text-sky-800">
                    The ingestion model scans for explicitly stated hardware, media servers, video switchers, LED processors, 
                    lighting desks, and protocols. For each skill found, it captures the exact resume sentence as evidence and 
                    compares it with your existing technical groups so you can review before adding.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Ingestion Review & Discerned Skills Studio */}
          {analysisResult && (
            <div className="space-y-5">
              
              {/* Top Banner Summary */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-stone-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                      Analysis Complete
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-900/10 text-stone-200 border border-white/10">
                      {analysisResult.source === 'gemini_ai' ? 'Gemini 3.8 Flash' : 'AV Intelligent Parser'}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                    Discerned {analysisResult.totalSkillsDiscerned} Clearly Stated Skills across {Object.keys(domainSkillsMap).length} Domains
                  </h3>
                  <p className="text-xs text-stone-300 mt-0.5">
                    {analysisResult.newSkillsCount} new skills detected • {analysisResult.experiences.length} venue/tour roles • {analysisResult.profileDiffs.filter((p) => p.isChanged).length} profile updates
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setAnalysisResult(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-300 hover:text-white bg-stone-900/10 hover:bg-stone-900/20 transition-colors self-start sm:self-center"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Upload Another</span>
                </button>
              </div>

              {/* Review Tabs Navigation */}
              <div className="flex items-center gap-2 border-b border-stone-800 pb-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setReviewTab('skills')}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap border ${
                    reviewTab === 'skills'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-200 border-stone-800'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Discerned Skills</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-800 text-white font-mono">
                    {selectedSkillsCount}/{analysisResult.skills.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setReviewTab('experience')}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap border ${
                    reviewTab === 'experience'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-200 border-stone-800'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Work Experience</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200 text-stone-200 font-mono">
                    {selectedExperiencesCount}/{analysisResult.experiences.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setReviewTab('profile')}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap border ${
                    reviewTab === 'profile'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-200 border-stone-800'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile &amp; Bio</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200 text-stone-200 font-mono">
                    {selectedProfileUpdatesCount}
                  </span>
                </button>

                {analysisResult.projects.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setReviewTab('projects')}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap border ${
                      reviewTab === 'projects'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-200 border-stone-800'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Projects ({selectedProjectsCount})</span>
                  </button>
                )}
              </div>

              {/* TAB 1: DISCERNED TECHNICAL SKILLS */}
              {reviewTab === 'skills' && (
                <div className="space-y-4">
                  {/* Filter & Bulk Select Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-800 p-3 rounded-xl border border-stone-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-500 font-semibold">Filter:</span>
                      <button
                        type="button"
                        onClick={() => setSkillFilter('all')}
                        className={`px-2.5 py-1 rounded-md font-semibold ${
                          skillFilter === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-200/70 text-stone-300 hover:bg-stone-200'
                        }`}
                      >
                        All ({analysisResult.skills.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setSkillFilter('new_only')}
                        className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 ${
                          skillFilter === 'new_only' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        <span>New Only</span>
                        <span className="font-mono">({analysisResult.newSkillsCount})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSkillFilter('matched_only')}
                        className={`px-2.5 py-1 rounded-md font-semibold ${
                          skillFilter === 'matched_only' ? 'bg-sky-700 text-white' : 'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100'
                        }`}
                      >
                        Existing Matched ({analysisResult.matchedSkillsCount})
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectOnlyNewSkills}
                        className="text-emerald-700 hover:text-emerald-900 font-semibold underline underline-offset-2"
                      >
                        Select New Only
                      </button>
                      <span className="text-stone-300">|</span>
                      <button
                        type="button"
                        onClick={() => handleSelectAllSkills(true)}
                        className="text-stone-400 hover:text-stone-100 font-medium"
                      >
                        Select All
                      </button>
                      <span className="text-stone-300">|</span>
                      <button
                        type="button"
                        onClick={() => handleSelectAllSkills(false)}
                        className="text-stone-400 hover:text-stone-100 font-medium"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>

                  {/* Grouped Skills List */}
                  <div className="space-y-6">
                    {(Object.entries(domainSkillsMap) as [string, EvaluatedSkill[]][]).map(([domainName, skills]) => (
                      <div key={domainName} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                          <h4 className="text-xs sm:text-sm font-bold text-stone-100 tracking-tight">
                            {domainName}
                          </h4>
                          <span className="text-[11px] font-semibold text-stone-500">
                            ({skills.length} skills clearly stated)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {skills.map((skill) => (
                            <div
                              key={skill.id}
                              className={`p-3.5 rounded-xl border transition-all ${
                                skill.selected
                                  ? 'bg-stone-900 border-stone-700 shadow-xs'
                                  : 'bg-stone-800/60 border-stone-800 opacity-60'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <input
                                  type="checkbox"
                                  checked={skill.selected}
                                  onChange={() => handleToggleSkill(skill.id)}
                                  className="mt-1 h-4 w-4 rounded-md border-stone-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />

                                <div className="flex-1 min-w-0 space-y-2">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs sm:text-sm font-bold text-stone-100">
                                        {skill.name}
                                      </span>
                                      {skill.isNew ? (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                          New Skill
                                        </span>
                                      ) : (
                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                                          Matches Existing
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                      {/* Proficiency Selector */}
                                      <select
                                        value={skill.proficiency}
                                        onChange={(e) =>
                                          handleChangeSkillProficiency(
                                            skill.id,
                                            e.target.value as any
                                          )
                                        }
                                        className="text-[11px] font-semibold bg-stone-800 border border-stone-700 rounded-md px-2 py-1 text-stone-200 focus:outline-hidden"
                                      >
                                        <option value="Master">Master</option>
                                        <option value="Expert">Expert</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Proficient">Proficient</option>
                                      </select>

                                      <span className="text-[11px] text-stone-500 font-mono">
                                        {skill.yearsOfExperience}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Clearly Stated Evidence Box */}
                                  {skill.clearlyStatedEvidence && (
                                    <div className="p-2.5 rounded-lg bg-stone-800 border border-stone-800/80 text-xs text-stone-300 flex items-start gap-2">
                                      <Quote className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                                      <div className="min-w-0 flex-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-0.5">
                                          Clearly Stated in Resume
                                        </span>
                                        <p className="italic text-stone-200 font-serif leading-relaxed">
                                          &quot;{skill.clearlyStatedEvidence}&quot;
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Description and Keywords */}
                                  <p className="text-xs text-stone-400 leading-normal">
                                    {skill.description}
                                  </p>

                                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100">
                                    <div className="flex flex-wrap gap-1">
                                      {skill.keywords.map((kw) => (
                                        <span
                                          key={kw}
                                          className="text-[10px] bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded font-mono"
                                        >
                                          {kw}
                                        </span>
                                      ))}
                                    </div>

                                    {/* Target Domain Selector */}
                                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                                      <span>Route into:</span>
                                      <select
                                        value={skill.targetDomain}
                                        onChange={(e) =>
                                          handleChangeSkillDomain(skill.id, e.target.value)
                                        }
                                        className="text-[11px] font-medium bg-stone-900 border border-stone-700 rounded px-1.5 py-0.5 text-stone-300 focus:outline-hidden"
                                      >
                                        {skillGroups.map((g) => (
                                          <option key={g.id} value={g.name}>
                                            {g.name}
                                          </option>
                                        ))}
                                        {!skillGroups.some((g) => g.name === skill.targetDomain) && (
                                          <option value={skill.targetDomain}>
                                            + {skill.targetDomain} (New Domain Group)
                                          </option>
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: WORK EXPERIENCE */}
              {reviewTab === 'experience' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <p>Select which work history entries to ingest into your career reference timeline:</p>
                    <span className="font-semibold text-stone-200">
                      {selectedExperiencesCount} of {analysisResult.experiences.length} selected
                    </span>
                  </div>

                  <div className="space-y-3">
                    {analysisResult.experiences.map(({ experience, isDuplicateOrSimilar, selected }) => (
                      <div
                        key={experience.id}
                        className={`p-4 rounded-xl border transition-all ${
                          selected
                            ? 'bg-stone-900 border-stone-700 shadow-xs'
                            : 'bg-stone-800/60 border-stone-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => handleToggleExperience(experience.id)}
                            className="mt-1 h-4 w-4 rounded-md border-stone-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs sm:text-sm font-bold text-stone-100">
                                    {experience.role}
                                  </h4>
                                  {isDuplicateOrSimilar ? (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                                      <AlertCircle className="w-3 h-3 text-amber-600" />
                                      Similar Existing Role
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                      New Role
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-stone-400 font-semibold mt-0.5">
                                  {experience.companyOrVenue} • {experience.location}
                                </p>
                              </div>

                              <span className="text-xs font-mono font-semibold text-stone-400 bg-stone-800 px-2.5 py-1 rounded-md">
                                {experience.startDate} — {experience.endDate}
                              </span>
                            </div>

                            {/* Highlights */}
                            {experience.highlights && experience.highlights.length > 0 && (
                              <ul className="space-y-1 text-xs text-stone-300">
                                {experience.highlights.map((h, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-indigo-500 font-bold">•</span>
                                    <span>{h}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* Skills used */}
                            {experience.skillsUsed && experience.skillsUsed.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {experience.skillsUsed.map((sk) => (
                                  <span
                                    key={sk}
                                    className="text-[10px] font-semibold bg-stone-800 text-stone-300 px-2 py-0.5 rounded-md border border-stone-800"
                                  >
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PROFILE & BIO DIFF */}
              {reviewTab === 'profile' && (
                <div className="space-y-4">
                  <div className="text-xs text-stone-400">
                    Review and update contact details and bio summary from the parsed resume:
                  </div>

                  <div className="border border-stone-800 rounded-xl overflow-hidden divide-y divide-stone-200">
                    {analysisResult.profileDiffs.map((diff) => (
                      <div
                        key={diff.field}
                        className={`p-3.5 flex items-start gap-3 transition-colors ${
                          diff.isChanged ? 'bg-stone-900' : 'bg-stone-800/50 opacity-70'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={diff.selected}
                          disabled={!diff.isChanged}
                          onChange={() => handleToggleProfileField(diff.field)}
                          className="mt-1 h-4 w-4 rounded-md border-stone-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-30"
                        />

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-100">
                              {diff.label}
                            </span>
                            {diff.isChanged ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Updated Value
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-500 font-semibold">
                                Unchanged
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="p-2 rounded bg-stone-800/70 border border-stone-800 text-stone-400">
                              <span className="text-[10px] font-bold uppercase text-stone-400 block">Current</span>
                              <p className="truncate mt-0.5">{diff.currentValue || '—'}</p>
                            </div>
                            <div className={`p-2 rounded border text-stone-200 ${
                              diff.isChanged ? 'bg-emerald-50/50 border-emerald-200 font-medium' : 'bg-stone-800 border-stone-800'
                            }`}>
                              <span className="text-[10px] font-bold uppercase text-emerald-700 block">Resume Parsed</span>
                              <p className="truncate mt-0.5">{diff.newValue || '—'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PROJECTS (IF PRESENT) */}
              {reviewTab === 'projects' && (
                <div className="space-y-3">
                  <p className="text-xs text-stone-400">
                    Notable production projects extracted from the resume that can be added to your Case Studies:
                  </p>
                  <div className="space-y-3">
                    {analysisResult.projects.map(({ project, selected }) => (
                      <div
                        key={project.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          selected
                            ? 'bg-stone-900 border-stone-700 shadow-xs'
                            : 'bg-stone-800/60 border-stone-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => handleToggleProject(project.id)}
                            className="mt-1 h-4 w-4 rounded-md border-stone-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-stone-100">
                              {project.title}
                            </h4>
                            <p className="text-xs text-stone-500 mt-0.5">{project.subtitle} • {project.date}</p>
                            <p className="text-xs text-stone-300 mt-1">{project.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {!analysisResult ? (
            <>
              <p className="text-xs text-stone-500">
                AI extraction identifies all roles, dates, protocols, and clearly stated equipment specs.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-stone-100 bg-stone-900 border border-stone-700 hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isAnalyzing || (!resumeText.trim() && !uploadedFile)}
                  onClick={handleRunAnalysis}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{analysisStep || 'Analyzing Resume...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze &amp; Discern Skills</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-xs text-stone-400">
                <span className="font-bold text-stone-100">Selected for ingestion:</span>{' '}
                <span className="text-indigo-700 font-semibold">{selectedSkillsCount} skills</span> ({selectedNewSkillsCount} new),{' '}
                <span className="text-indigo-700 font-semibold">{selectedExperiencesCount} roles</span>,{' '}
                <span className="text-indigo-700 font-semibold">{selectedProfileUpdatesCount} profile fields</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-stone-100 bg-stone-900 border border-stone-700 hover:bg-stone-800 transition-colors"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleCommit}
                  disabled={selectedSkillsCount === 0 && selectedExperiencesCount === 0 && selectedProfileUpdatesCount === 0 && selectedProjectsCount === 0}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Incorporate into Portfolio ({selectedSkillsCount + selectedExperiencesCount + selectedProfileUpdatesCount} Items)</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
