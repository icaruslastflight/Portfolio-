export type ItemType = 'image' | 'info' | 'project' | 'video';

export type MediaDisplayMode = 'single' | 'background' | 'side_by_side' | 'slides';

export interface GroupedImage {
  id: string;
  filename: string;
  url?: string;
  fileType?: 'image' | 'video';
  caption?: string;
  context?: string; // specific contextual note for this image
}

export interface ImageGroup {
  id: string;
  name: string; // e.g. "Pre-Production & Rigging", "FOH Console & Disguise Rack", "Live Show Execution"
  context?: string; // overarching contextual explanation for this group of images
  displayMode?: 'side_by_side' | 'slides' | 'grid';
  images: GroupedImage[];
}

export interface MetricItem {
  label: string;
  value: string;
}

export interface LinkItem {
  label: string;
  url: string;
}

export interface AuxiliaryAsset {
  id?: string;
  label: string; // e.g. "Blueprint", "CAD", "Rigging", "Bench Test", "Flight", "Wireframe", "Schedule"
  filename: string; // e.g. "proposal.mp4", "portal build.jpg"
  url?: string;
  fileType?: 'image' | 'video' | 'pdf' | 'other';
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string; // e.g., 'indigo', 'emerald', 'amber', 'rose', 'sky', 'violet'
  icon?: string;
}

export interface PortfolioItem {
  id: string;
  type: ItemType;
  title: string;
  subtitle?: string; // e.g. "Senior Product Designer", "Mobile Application"
  categoryId: string;
  date?: string; // e.g. "2023 - 2025" or "Summer 2024"
  location?: string; // e.g. "Koh Samui, Thailand", "Miami, FL", "Pittsburgh, PA"
  roleTag?: string; // e.g. "Lead Mapping & Lighting Designer", "Technical Director"
  content: string; // Detailed description or resume bullet points
  imageUrl?: string;
  videoUrl?: string;
  mediaFilename?: string; // e.g. "proposal.mp4" or "portal build.jpg"
  imageCaption?: string;
  mediaDisplayMode?: MediaDisplayMode; // 'single' | 'background' | 'side_by_side' | 'slides'
  imageGroups?: ImageGroup[]; // Groups of images with contextual narrative
  tags: string[];
  metrics?: MetricItem[];
  links?: LinkItem[];
  auxiliaryAssets?: AuxiliaryAsset[];
  starred?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface AuthorProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  summary: string;
}

export type ExportLayout = 'primordial_dark' | 'modern' | 'minimal' | 'two_column' | 'showcase_grid';
export type ExportTargetType = 'portfolio' | 'resume' | 'combined' | 'primordial_html';

export type AssetPathStrategy = 'relative' | 'assets_folder' | 'netlify_live' | 'embedded';

export interface ExportDeck {
  id: string;
  name: string;
  targetType: ExportTargetType;
  itemIds: string[];
  layout: ExportLayout;
  includeImages: boolean;
  includeMetrics: boolean;
  includeTags: boolean;
  assetPathStrategy?: AssetPathStrategy;
}

export interface WorkExperience {
  id: string;
  role: string; // e.g. "Lead Video Engineer & Technical Director"
  companyOrVenue: string; // e.g. "Republic Club Pattaya (DJ Mag Top 100)"
  location: string; // e.g. "Pattaya, Thailand"
  startDate: string; // e.g. "Jan 2025"
  endDate: string; // e.g. "Present"
  current?: boolean;
  employmentType?: string; // e.g. "Residency / Dept Head", "Touring Contract", "Site Lead", "VIP Activation"
  description: string; // Overview description
  highlights: string[]; // Key operational bullet points
  skillsUsed: string[]; // e.g. ["Resolume Arena 7", "Brompton SX40", "NovaStar", "Kinetic Rigging"]
  keyMetrics?: MetricItem[];
  starred?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface SkillItem {
  id: string;
  name: string; // e.g. "Resolume Arena 7"
  proficiency: 'Master' | 'Expert' | 'Advanced' | 'Proficient';
  yearsOfExperience?: string; // e.g. "10+ Years"
  description?: string; // e.g. "Canvas slice routing, DMX lumiverse mapping, Art-Net/sACN, OSC, SMPTE LTC timecode lock"
  keywords?: string[]; // e.g. ["DXV 3", "Art-Net", "SMPTE", "OSC", "60 FPS"]
}

export interface SkillGroup {
  id: string;
  name: string; // e.g. "Media Servers & Real-Time Playback", "LED Display & Processing", "Electronics Bench Repair"
  icon?: string;
  color?: string;
  description?: string;
  highlightMetric?: { label: string; value: string };
  skills: SkillItem[];
  createdAt: number;
  updatedAt: number;
}

export type JobStatus = 'open' | 'applied' | 'interviewing' | 'rejected' | 'offer';
export type JobType = 'local' | 'international' | 'touring' | 'remote';

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  status: JobStatus;
  url?: string;
  salary?: string;
  description: string;
  matchScore: number;
  matchRationale: string;
  matchedSkills: string[];
  missingSkills: string[];
  dateAdded: number;
  updatedAt: number;
}

export interface ManagedAsset {
  filename: string;
  fileType: 'image' | 'video' | 'pdf' | 'other';
  associatedProjectTitle: string;
  dataUrl?: string; // Base64 data URL
  externalUrl?: string;
  fileSize?: number;
  updatedAt?: number;
}
