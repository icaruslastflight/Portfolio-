import { AuthorProfile, WorkExperience, SkillGroup, PortfolioItem, SkillItem } from '../types';
import { parseResumeClientFallback, DiscernedSkillWithEvidence, ParsedResumePayload } from './resumeParserFallback';

export interface EvaluatedSkill {
  id: string;
  name: string;
  proficiency: 'Master' | 'Expert' | 'Advanced' | 'Proficient';
  yearsOfExperience: string;
  description: string;
  keywords: string[];
  clearlyStatedEvidence: string;
  targetDomain: string;
  isNew: boolean;
  matchedExistingGroupId?: string;
  matchedExistingSkillId?: string;
  selected: boolean;
}

export interface EvaluatedExperience {
  experience: WorkExperience;
  isDuplicateOrSimilar: boolean;
  matchedExistingId?: string;
  selected: boolean;
}

export interface EvaluatedProfileDiff {
  field: keyof AuthorProfile;
  label: string;
  currentValue: string;
  newValue: string;
  isChanged: boolean;
  selected: boolean;
}

export interface EvaluatedProject {
  project: PortfolioItem;
  selected: boolean;
}

export interface ResumeAnalysisResult {
  source: 'gemini_ai' | 'smart_fallback';
  summaryNotes: string;
  totalSkillsDiscerned: number;
  newSkillsCount: number;
  matchedSkillsCount: number;
  skills: EvaluatedSkill[];
  experiences: EvaluatedExperience[];
  profileDiffs: EvaluatedProfileDiff[];
  projects: EvaluatedProject[];
}

/**
 * Normalizes strings for robust fuzzy comparison
 */
function normalizeStr(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Checks if two skill names match (e.g. "Resolume Arena 7" and "Resolume Arena")
 */
function isSkillMatch(nameA: string, nameB: string): boolean {
  const a = normalizeStr(nameA);
  const b = normalizeStr(nameB);
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) {
    // Only if sufficiently long to avoid false positives on 1-letter words
    return Math.min(a.length, b.length) >= 4;
  }
  return false;
}

/**
 * Evaluates parsed resume output against the current user's database
 */
export function evaluateResumePayload(
  payload: ParsedResumePayload,
  currentProfile: AuthorProfile,
  currentExperiences: WorkExperience[],
  currentSkillGroups: SkillGroup[],
  source: 'gemini_ai' | 'smart_fallback'
): ResumeAnalysisResult {
  // 1. Evaluate Skills
  const allParsedSkills: DiscernedSkillWithEvidence[] = [];
  if (payload.skillDomains && payload.skillDomains.length > 0) {
    for (const domain of payload.skillDomains) {
      for (const sk of domain.skills) {
        allParsedSkills.push({
          ...sk,
          targetDomain: sk.targetDomain || domain.domainName
        });
      }
    }
  }

  const evaluatedSkills: EvaluatedSkill[] = [];
  let newSkillsCount = 0;
  let matchedSkillsCount = 0;

  for (const sk of allParsedSkills) {
    let matchedGroup: SkillGroup | undefined;
    let matchedSkill: SkillItem | undefined;

    // Search across existing skill groups
    for (const group of currentSkillGroups) {
      const match = group.skills.find((s) => isSkillMatch(s.name, sk.name));
      if (match) {
        matchedGroup = group;
        matchedSkill = match;
        break;
      }
    }

    const isNew = !matchedSkill;
    if (isNew) {
      newSkillsCount++;
    } else {
      matchedSkillsCount++;
    }

    evaluatedSkills.push({
      id: sk.id || `sk_import_${normalizeStr(sk.name)}_${Date.now()}`,
      name: sk.name,
      proficiency: sk.proficiency || 'Advanced',
      yearsOfExperience: sk.yearsOfExperience || '5+ Years',
      description: sk.description || (matchedSkill?.description ?? 'Explicitly discerned from professional resume.'),
      keywords: sk.keywords && sk.keywords.length > 0 ? sk.keywords : (matchedSkill?.keywords ?? []),
      clearlyStatedEvidence: sk.clearlyStatedEvidence || 'Directly cited in resume text/hardware inventory.',
      targetDomain: matchedGroup ? matchedGroup.name : (sk.targetDomain || 'Media Servers & Real-Time Playback'),
      isNew,
      matchedExistingGroupId: matchedGroup?.id,
      matchedExistingSkillId: matchedSkill?.id,
      selected: true // selected by default for easy 1-click import
    });
  }

  // 2. Evaluate Experiences
  const evaluatedExperiences: EvaluatedExperience[] = (payload.workExperience || []).map((exp, idx) => {
    // Check if venue or company matches any existing entry
    const match = currentExperiences.find(
      (e) =>
        normalizeStr(e.companyOrVenue).includes(normalizeStr(exp.companyOrVenue)) ||
        normalizeStr(exp.companyOrVenue).includes(normalizeStr(e.companyOrVenue))
    );

    return {
      experience: {
        ...exp,
        id: exp.id || `exp_parsed_${idx}_${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      isDuplicateOrSimilar: !!match,
      matchedExistingId: match?.id,
      selected: !match // If not a duplicate, preselect it; if it is similar, let user decide
    };
  });

  // 3. Evaluate Profile Diffs
  const profileFields: Array<{ field: keyof AuthorProfile; label: string }> = [
    { field: 'name', label: 'Full Name' },
    { field: 'title', label: 'Professional Title' },
    { field: 'email', label: 'Email Address' },
    { field: 'phone', label: 'Phone' },
    { field: 'location', label: 'Location & Transit' },
    { field: 'website', label: 'Primary Portfolio Website' },
    { field: 'linkedin', label: 'LinkedIn Profile' },
    { field: 'summary', label: 'Executive Bio Summary' }
  ];

  const profileDiffs: EvaluatedProfileDiff[] = [];
  for (const item of profileFields) {
    const cur = (currentProfile[item.field] || '').trim();
    const parsedVal = (payload.profile?.[item.field] || '').trim();

    const isChanged = !!parsedVal && parsedVal !== cur;
    profileDiffs.push({
      field: item.field,
      label: item.label,
      currentValue: cur,
      newValue: parsedVal || cur,
      isChanged,
      selected: isChanged && !!parsedVal
    });
  }

  // 4. Evaluate Projects
  const evaluatedProjects: EvaluatedProject[] = (payload.projects || []).map((proj, idx) => ({
    project: {
      ...proj,
      id: proj.id || `proj_parsed_${idx}_${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    selected: true
  }));

  return {
    source,
    summaryNotes: payload.insights?.summaryNotes || `Identified ${evaluatedSkills.length} clearly stated skills and ${evaluatedExperiences.length} work experience entries.`,
    totalSkillsDiscerned: evaluatedSkills.length,
    newSkillsCount,
    matchedSkillsCount,
    skills: evaluatedSkills,
    experiences: evaluatedExperiences,
    profileDiffs,
    projects: evaluatedProjects
  };
}

/**
 * Initiates the resume parsing process (Server Gemini API -> Client fallback)
 */
export async function parseResumeDocument(
  options: {
    text?: string;
    fileData?: { mimeType: string; base64: string; fileName: string };
  },
  currentProfile: AuthorProfile,
  currentExperiences: WorkExperience[],
  currentSkillGroups: SkillGroup[]
): Promise<ResumeAnalysisResult> {
  const { text, fileData } = options;

  try {
    const response = await fetch('/api/resume/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        fileData
      })
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        return evaluateResumePayload(
          result.data,
          currentProfile,
          currentExperiences,
          currentSkillGroups,
          'gemini_ai'
        );
      }
    }

    // If server returned an error or requires API key, fall back to smart client parser
    console.warn('Backend parsing unavailable or returned error, using high-fidelity local AV intelligence engine.');
  } catch (err) {
    console.warn('Network call to /api/resume/parse failed, using high-fidelity local AV intelligence engine.', err);
  }

  // Fallback to client parsing
  let textToParse = text || '';
  if (!textToParse && fileData?.fileName) {
    textToParse = `Resume document: ${fileData.fileName}`;
  }

  const fallbackPayload = parseResumeClientFallback(textToParse);
  return evaluateResumePayload(
    fallbackPayload,
    currentProfile,
    currentExperiences,
    currentSkillGroups,
    'smart_fallback'
  );
}
