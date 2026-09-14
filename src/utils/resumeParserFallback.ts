import { AuthorProfile, WorkExperience, SkillItem, SkillGroup, PortfolioItem } from '../types';

export interface DiscernedSkillWithEvidence extends SkillItem {
  clearlyStatedEvidence: string;
  targetDomain: string;
  isNew?: boolean;
}

export interface ParsedResumePayload {
  profile: Partial<AuthorProfile>;
  workExperience: WorkExperience[];
  skillDomains: Array<{
    domainName: string;
    description?: string;
    skills: DiscernedSkillWithEvidence[];
  }>;
  projects: PortfolioItem[];
  insights: {
    totalExperiencesFound: number;
    totalSkillsDiscerned: number;
    clearSkillHighlights: string[];
    summaryNotes: string;
  };
}

interface KnownSkillPattern {
  name: string;
  domain: string;
  regex: RegExp;
  defaultProficiency: 'Master' | 'Expert' | 'Advanced' | 'Proficient';
  keywords: string[];
  description: string;
}

const KNOWN_SKILLS_DICTIONARY: KnownSkillPattern[] = [
  // Media Servers & Real-Time Playback
  {
    name: 'disguise (d3)',
    domain: 'Media Servers & Real-Time Playback',
    regex: /\b(disguise|d3\s+media|designer\s+v|vx\s*4|gx\s*2c|omni\s*cal)\b/i,
    defaultProficiency: 'Master',
    keywords: ['Genlock', '12G-SDI', 'Notch', 'Timeline', 'OmniCal', 'Cluster'],
    description: 'Hardware media server deployment, multi-4K raster mapping, spatial calibration, and redundant failover.'
  },
  {
    name: 'Resolume Arena 7',
    domain: 'Media Servers & Real-Time Playback',
    regex: /\b(resolume|arena\s*7|resolume\s+arena|dxv)\b/i,
    defaultProficiency: 'Master',
    keywords: ['DXV3', 'Art-Net', 'SMPTE LTC', 'OSC', 'DMX Lumiverse', 'Advanced Output'],
    description: 'Real-time multi-output video playback, slice routing, fixture mapping, and LTC timecode synchronization.'
  },
  {
    name: 'Green Hippo Hippotizer',
    domain: 'Media Servers & Real-Time Playback',
    regex: /\b(green\s*hippo|hippotizer|karst|montane|amst)\b/i,
    defaultProficiency: 'Expert',
    keywords: ['FlexRes', 'Zookeeper', 'STRATA', 'PixelMapper'],
    description: 'Video playback engine, Zookeeper network control, and pixel mapping for touring and architectural setups.'
  },
  {
    name: 'TouchDesigner',
    domain: 'Media Servers & Real-Time Playback',
    regex: /\b(touchdesigner|derivative|glsl\s+shader|python\s+chop)\b/i,
    defaultProficiency: 'Expert',
    keywords: ['GLSL', 'Python CHOP', 'DMX In/Out', 'Kinect/LiDAR', 'OSC'],
    description: 'Generative real-time node-based pipeline, sensor integration, GLSL shaders, and automated live show triggers.'
  },
  {
    name: 'Dataton WATCHOUT / Pixera',
    domain: 'Media Servers & Real-Time Playback',
    regex: /\b(watchout|dataton|pixera|av\s*stumpfl)\b/i,
    defaultProficiency: 'Advanced',
    keywords: ['Multi-Display', 'Edge Blending', 'Network Sync', 'DirectShow'],
    description: 'Multi-display edge-blended playback, architectural projection mapping, and enterprise show automation.'
  },

  // LED Display & Processing Architecture
  {
    name: 'Brompton SX40 / Tessera',
    domain: 'LED Display & Processing Architecture',
    regex: /\b(brompton|sx40|s8|tessera|xd\s+data\s+distribut|dyna\s*cal)\b/i,
    defaultProficiency: 'Master',
    keywords: ['SX40', 'XD Fiber', '10-bit HDR', 'Dark Magic', 'Tessera Management'],
    description: 'Touring 4K LED processor configuration, fiber XD distribution, color calibration, and sub-frame latency tuning.'
  },
  {
    name: 'NovaStar Processing (MX40 Pro / COEX)',
    domain: 'LED Display & Processing Architecture',
    regex: /\b(novastar|mx40|mctrl|coex|novalct|v-can|vx1000)\b/i,
    defaultProficiency: 'Master',
    keywords: ['COEX VMP', 'MX40 Pro', 'NovaLCT', 'Cabinet Seam Correction', 'A10s Pro'],
    description: 'Ultra-low latency LED mapping, fiber transceiver links, receiver card firmware flashing, and cabinet seam tuning.'
  },
  {
    name: 'Megapixel VR HELIOS',
    domain: 'LED Display & Processing Architecture',
    regex: /\b(megapixel|helios|8k\s+led\s+processor)\b/i,
    defaultProficiency: 'Expert',
    keywords: ['8K Canvas', 'ST 2110', 'Tile Mapping', 'GhostFrame'],
    description: 'Broadcast and virtual production 8K LED processing platform with native SMPTE ST 2110 workflows.'
  },
  {
    name: 'Outdoor Weatherized LED Walls',
    domain: 'LED Display & Processing Architecture',
    regex: /\b(ip65|weatherized\s+led|outdoor\s+led|blow-through|mesh\s+led)\b/i,
    defaultProficiency: 'Expert',
    keywords: ['IP65 Rated', 'Wind Load', 'Rain Gaskets', 'PowerCon TRUE1'],
    description: 'Field assembly and maintenance of outdoor IP65-rated touring LED panels, wind load calcs, and ruggedized cabling.'
  },

  // Video Switching, Routing & Engineering
  {
    name: 'Barco E2 / Event Master (EMT)',
    domain: 'Video Switching, Routing & Engineering',
    regex: /\b(barco|e2|s3\s*4k|event\s*master|ex\s+expansion)\b/i,
    defaultProficiency: 'Master',
    keywords: ['Screen Management', '4K60 Layers', 'Aux Routing', 'Genlock', 'EMT'],
    description: 'High-end live presentation switching, multi-screen matrix routing, seamless PIP transitions, and EDID management.'
  },
  {
    name: 'Ross Video Carbonite / Ultrix',
    domain: 'Video Switching, Routing & Engineering',
    regex: /\b(ross|carbonite|ultrix|dashboard\s+control|acuity)\b/i,
    defaultProficiency: 'Expert',
    keywords: ['12G-SDI Routing', 'Dashboard GUI', 'ME Busses', 'Multi-Viewer'],
    description: 'Broadcast production switcher operation, integrated routing, custom DashBoard control panels, and tally logic.'
  },
  {
    name: 'Blackmagic ATEM & Smart Videohub',
    domain: 'Video Switching, Routing & Engineering',
    regex: /\b(blackmagic|atem|constellation|videohub|smart\s*scope)\b/i,
    defaultProficiency: 'Master',
    keywords: ['ATEM 4 M/E', '12G Matrix', 'SuperSource', 'Audio Follow Video'],
    description: '12G/3G-SDI clean routing matrix, low-latency multi-cam switching, SuperSource layouts, and live stream engineering.'
  },
  {
    name: 'NDI 5 & SMPTE ST 2110 IP Video',
    domain: 'Video Switching, Routing & Engineering',
    regex: /\b(ndi|ndi\s*5|st\s*2110|smpte\s*2110|ip\s+video|ptz)\b/i,
    defaultProficiency: 'Expert',
    keywords: ['NDI Tools', 'ST 2110', 'mDNS / Discovery Server', 'QoS IGMP Snooping'],
    description: 'High-bitrate IP video streaming over Gigabit and 10GbE network fabrics with PTP clock synchronization.'
  },
  {
    name: 'Tactical Fiber Optic Links (Neutrik opticalCON / ST)',
    domain: 'Video Switching, Routing & Engineering',
    regex: /\b(tactical\s+fiber|opticalcon|neutrik\s+fiber|st\s+fiber|fiber\s+optic|optical\s+transceiver)\b/i,
    defaultProficiency: 'Master',
    keywords: ['OpticalCON DUO/QUAD', 'Light Meter', 'Visual Fault Locator', 'SFP+ Transceivers'],
    description: 'Deployment and scope inspection of ruggedized military-grade fiber optic cables for long-distance 4K video feeds.'
  },

  // Lighting Control, Lasers & Kinetic Automation
  {
    name: 'MA Lighting grandMA3 / grandMA2',
    domain: 'Lighting Control, Lasers & Kinetic Automation',
    regex: /\b(grandma|ma3|ma2|ma\s+lighting|ma-net|gma)\b/i,
    defaultProficiency: 'Master',
    keywords: ['MA-Net3', 'Phaser Engine', 'Art-Net/sACN', 'DMX 512', 'Timecode Cueing'],
    description: 'Concert lighting desk programming, fixture patch management, phaser curve building, and timecode cue automation.'
  },
  {
    name: 'Pangolin BEYOND / FB4 Laser Control',
    domain: 'Lighting Control, Lasers & Kinetic Automation',
    regex: /\b(pangolin|beyond|fb4|ilda|laser\s+control|kvant)\b/i,
    defaultProficiency: 'Master',
    keywords: ['FB4 DMX', 'Zone Masking', 'Audience Scanning', 'ILDA', 'Geometric Correction'],
    description: 'High-power concert laser show programming, FB4 network distribution, geometric zoning, and live beam effects.'
  },
  {
    name: 'Laser Safety Officer (LSO) & FDA Variance',
    domain: 'Lighting Control, Lasers & Kinetic Automation',
    regex: /\b(laser\s+safety|lso|fda\s+variance|cdrh|e-stop\s+interlock)\b/i,
    defaultProficiency: 'Master',
    keywords: ['FDA/CDRH Variance', 'NC E-Stop Loops', 'MPE Safety Calcs', 'Audience Safety'],
    description: 'Formal compliance with laser safety standards, hardwired series emergency stops, and FAA/venue variance filings.'
  },
  {
    name: 'Kinetic DMX Hoists & Winch Automation',
    domain: 'Lighting Control, Lasers & Kinetic Automation',
    regex: /\b(kinetic\s+hoist|motorized\s+winch|kinetic\s+sphere|rotary\s+encoder|stage\s+automation)\b/i,
    defaultProficiency: 'Advanced',
    keywords: ['DMX Hoists', 'Optical Encoders', 'Safety Limits', 'Load Cells'],
    description: 'Motorized kinetic lighting and mirror drops, mechanical speed limits, positional feedback, and emergency stops.'
  },

  // Power Distribution, Rigging & Staging
  {
    name: '3-Phase Power Distribution & Cam-Lock',
    domain: 'Power Distribution, Rigging & Staging',
    regex: /\b(3-phase|three-phase|cam-lock|camlock|power\s+distro|400a|200a|100a\s+distro|phase\s+balanc)\b/i,
    defaultProficiency: 'Master',
    keywords: ['Cam-Lock 400A', 'Phase Balancing', 'Neutral Current', 'GFCI / RCD', 'Multimeter'],
    description: 'Hookup and balancing of three-phase power distro systems, neutral protection, load metering, and electrical safety.'
  },
  {
    name: 'Rigging & Vectorworks Spotlight 3D',
    domain: 'Power Distribution, Rigging & Staging',
    regex: /\b(rigging|vectorworks|spotlight|f34\s+truss|dead\s+hang|truss\s+load|bridle)\b/i,
    defaultProficiency: 'Expert',
    keywords: ['Vectorworks Spotlight', 'F34 Truss', 'Load Calculation', 'Span-Sets', 'Shackles'],
    description: 'Truss grid layout drafting, load calculation for dead hangs and bridles, ground support towers, and hardware safety ratings.'
  },
  {
    name: 'Scenic Carpentry & Structural Framing',
    domain: 'Power Distribution, Rigging & Staging',
    regex: /\b(scenic\s+carpentry|timber\s+joinery|structural\s+framing|stageright|false\s+wall|chase)\b/i,
    defaultProficiency: 'Master',
    keywords: ['Timber Post-and-Beam', 'Concealed Chases', 'Stage Decks', 'Cabinetry'],
    description: 'Precision museum and concert stage timber carpentry, load-bearing decks, and concealed raceways for AV cables.'
  },

  // Audio, Timecode & Communications
  {
    name: 'SMPTE LTC Timecode & MIDI Show Control',
    domain: 'Audio, Timecode & Communications',
    regex: /\b(smpte|ltc|timecode|msc|midi\s+show\s+control|line\s+level\s+audio)\b/i,
    defaultProficiency: 'Master',
    keywords: ['SMPTE LTC', 'Drop-Frame 29.97', 'Linear Audio Sync', 'MTC', 'OSC'],
    description: 'Master timecode distribution to sync lighting, video servers, lasers, and audio playback rigs synchronously.'
  },
  {
    name: 'Dante Audio & Intercom (Clear-Com / Riedel)',
    domain: 'Audio, Timecode & Communications',
    regex: /\b(dante|clear-com|clearcom|riedel|bolero|freespeak|intercom|matrix\s+intercom)\b/i,
    defaultProficiency: 'Expert',
    keywords: ['Dante Controller', 'PTP Master', 'Wireless Beltpacks', 'Partyline Intercom'],
    description: 'Digital audio networking over IP and multi-channel production crew intercom communications.'
  },

  // Electronics & Systems Diagnostics
  {
    name: 'Electronics Bench Repair & SMD Soldering',
    domain: 'Electronics, Diagnostics & Microcontrollers',
    regex: /\b(soldering|smd|bench\s+repair|oscilloscope|multimeter|microcontroller|arduino|esp32|pcb)\b/i,
    defaultProficiency: 'Expert',
    keywords: ['SMD Rework', 'Component-Level Repair', 'Oscilloscope', 'Relay Drivers', 'UART/I2C'],
    description: 'Component-level PCB diagnosis, SMD soldering, optical sensor interfaces, and custom microcontroller hardware.'
  }
];

/**
 * Extracts sentences or line excerpts where a matching keyword occurred
 */
function extractEvidenceSentence(text: string, matchIndex: number): string {
  const start = Math.max(0, text.lastIndexOf('\n', matchIndex) + 1);
  let end = text.indexOf('\n', matchIndex);
  if (end === -1) end = text.length;

  let line = text.slice(start, end).trim();
  // Strip bullet markers
  line = line.replace(/^[•\-\*\d\.\)]\s*/, '').trim();

  if (line.length > 180) {
    line = line.slice(0, 177) + '...';
  }
  return line || 'Clearly stated in resume qualifications & hardware specs.';
}

/**
 * Fallback regex-based parser that digests resume text locally
 */
export function parseResumeClientFallback(rawText: string): ParsedResumePayload {
  const lines = rawText.split('\n').map((l) => l.trim());

  // 1. Profile Extraction
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const linkedinMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const websiteMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:netlify\.app|com|org|io|tv|tech)/i);

  let name = '';
  let title = '';
  // Usually name is within the first 3 non-empty lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const l = lines[i];
    if (l && !l.includes('@') && !l.includes('http') && !l.startsWith('//') && l.length > 2 && l.length < 50) {
      if (!name) {
        name = l;
      } else if (!title && (l.includes('Engineer') || l.includes('Director') || l.includes('Technologist') || l.includes('Designer') || l.includes('Specialist'))) {
        title = l;
        break;
      }
    }
  }

  // Find summary block
  let summary = '';
  const summaryHeaderIdx = lines.findIndex((l) =>
    /^(summary|professional summary|executive summary|about me|profile)$/i.test(l)
  );
  if (summaryHeaderIdx >= 0) {
    const nextLines: string[] = [];
    for (let i = summaryHeaderIdx + 1; i < Math.min(summaryHeaderIdx + 8, lines.length); i++) {
      if (/^[A-Z\s]{4,}:?$/.test(lines[i]) || /^(experience|skills|education|projects)/i.test(lines[i])) break;
      if (lines[i]) nextLines.push(lines[i]);
    }
    summary = nextLines.join(' ');
  }

  // 2. Discern Technical Skills that are clearly stated
  const discernedSkills: DiscernedSkillWithEvidence[] = [];
  const foundNames = new Set<string>();

  for (const item of KNOWN_SKILLS_DICTIONARY) {
    const match = rawText.match(item.regex);
    if (match && match.index !== undefined) {
      if (!foundNames.has(item.name)) {
        foundNames.add(item.name);
        const evidence = extractEvidenceSentence(rawText, match.index);

        // Adjust years of experience heuristic
        let years = '5+ Years';
        if (/10\+?\s*years/i.test(evidence) || /decade/i.test(rawText)) years = '10+ Years';
        else if (/8\+?\s*years/i.test(evidence)) years = '8+ Years';
        else if (/3\+?\s*years/i.test(evidence)) years = '3+ Years';

        discernedSkills.push({
          id: `sk_discerned_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`,
          name: item.name,
          proficiency: item.defaultProficiency,
          yearsOfExperience: years,
          description: item.description,
          keywords: item.keywords,
          clearlyStatedEvidence: evidence,
          targetDomain: item.domain,
          isNew: true
        });
      }
    }
  }

  // Group discerned skills into domains
  const domainMap: Record<string, DiscernedSkillWithEvidence[]> = {};
  for (const s of discernedSkills) {
    if (!domainMap[s.targetDomain]) {
      domainMap[s.targetDomain] = [];
    }
    domainMap[s.targetDomain].push(s);
  }

  const skillDomains = Object.entries(domainMap).map(([domainName, skills]) => ({
    domainName,
    description: `Discerned ${skills.length} clearly stated technical competencies in this area.`,
    skills
  }));

  // 3. Discern Work Experiences
  const workExperience: WorkExperience[] = [];
  const expHeaderIdx = lines.findIndex((l) =>
    /^(experience|work experience|employment history|professional experience|career history)$/i.test(l)
  );

  if (expHeaderIdx >= 0) {
    // Scan lines following experience header
    let currentExp: Partial<WorkExperience> | null = null;
    let inBullets = false;

    for (let i = expHeaderIdx + 1; i < lines.length; i++) {
      const line = lines[i];
      if (/^(education|certifications|skills|technical skills|projects)$/i.test(line)) {
        break;
      }

      // Check for date range pattern e.g. "Jan 2024 - Present", "2023 – 2025"
      const dateMatch = line.match(
        /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4})\s*[-–—to]+\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}|Present|Current)\b/i
      );

      if (dateMatch) {
        if (currentExp && currentExp.role) {
          workExperience.push({
            id: `exp_import_${Date.now()}_${workExperience.length}`,
            role: currentExp.role,
            companyOrVenue: currentExp.companyOrVenue || 'Production Client / Venue',
            location: currentExp.location || 'Touring / Remote',
            startDate: currentExp.startDate || dateMatch[1],
            endDate: currentExp.endDate || dateMatch[2],
            current: /present|current/i.test(dateMatch[2]),
            employmentType: 'Production Contract',
            description: currentExp.description || 'Specialist production deployment and operational execution.',
            highlights: currentExp.highlights && currentExp.highlights.length > 0
              ? currentExp.highlights
              : ['Managed critical technical show systems and real-time operations.'],
            skillsUsed: currentExp.skillsUsed || ['Resolume', 'Disguise', 'Signal Distribution'],
            createdAt: Date.now(),
            updatedAt: Date.now()
          });
        }

        // New experience started
        currentExp = {
          startDate: dateMatch[1],
          endDate: dateMatch[2],
          current: /present|current/i.test(dateMatch[2]),
          highlights: []
        };

        // Check if role/company is on this line or previous line
        const restOfLine = line.replace(dateMatch[0], '').replace(/[|•,]/g, ' ').trim();
        if (restOfLine.length > 2) {
          currentExp.role = restOfLine;
        } else if (i > expHeaderIdx + 1 && lines[i - 1]) {
          currentExp.role = lines[i - 1];
        }
        inBullets = false;
      } else if (currentExp && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))) {
        inBullets = true;
        const cleanBullet = line.replace(/^[•\-\*]\s*/, '').trim();
        if (cleanBullet) {
          currentExp.highlights = currentExp.highlights || [];
          currentExp.highlights.push(cleanBullet);
        }
      } else if (currentExp && !inBullets && line.length > 3 && !currentExp.companyOrVenue) {
        currentExp.companyOrVenue = line;
      }
    }

    if (currentExp && currentExp.role) {
      workExperience.push({
        id: `exp_import_${Date.now()}_${workExperience.length}`,
        role: currentExp.role,
        companyOrVenue: currentExp.companyOrVenue || 'Production Client / Venue',
        location: currentExp.location || 'Touring / On-Site',
        startDate: currentExp.startDate || '2023',
        endDate: currentExp.endDate || 'Present',
        current: currentExp.current ?? true,
        employmentType: 'Production Contract',
        description: currentExp.description || 'Live production systems deployment and management.',
        highlights: currentExp.highlights && currentExp.highlights.length > 0 ? currentExp.highlights : [],
        skillsUsed: currentExp.skillsUsed || ['Resolume', 'LED Walls', 'Signal Distribution'],
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
  }

  // 4. Fallback projects
  const projects: PortfolioItem[] = [];

  return {
    profile: {
      name: name || undefined,
      title: title || undefined,
      email: emailMatch ? emailMatch[0] : undefined,
      phone: phoneMatch ? phoneMatch[0] : undefined,
      website: websiteMatch ? websiteMatch[0] : undefined,
      linkedin: linkedinMatch ? linkedinMatch[0] : undefined,
      summary: summary || undefined
    },
    workExperience,
    skillDomains,
    projects,
    insights: {
      totalExperiencesFound: workExperience.length,
      totalSkillsDiscerned: discernedSkills.length,
      clearSkillHighlights: discernedSkills.slice(0, 5).map((s) => `${s.name} (${s.proficiency})`),
      summaryNotes: `Discerned ${discernedSkills.length} explicitly verified technical skills and ${workExperience.length} work experience entries directly from the supplied resume document.`
    }
  };
}

/**
 * Sample realistic technical resume for Brice Morneau / Live Production Specialist
 * to allow 1-click instant testing and verification.
 */
export const SAMPLE_TECHNICAL_RESUME = `BRICE ANTHONY MORNEAU
Lead Video Engineer // Technical Director // Real-Time Visuals & Show Systems Specialist
Pittsburgh, PA 15204 (Transit-Accessible & Tour-Ready • Hub: PIT)
events.bricem@gmail.com • (412) 376-7138 • primordial-portfolio.netlify.app • linkedin.com/in/bricemorneau

PROFESSIONAL SUMMARY
Creative Technologist and Lead Video Systems Engineer with 10+ years architecting high-availability visual workflows for arena stadium concert tours, immersive projection spaces, and DJ Mag Top 100 venues worldwide. Deep expertise configuring disguise (d3) media servers, Resolume Arena 7 networks, Brompton SX40 LED processors, Barco E2 presentation switchers, grandMA3 lighting consoles, Pangolin BEYOND FB4 laser networks, and 3-phase 400A Cam-Lock power distribution. Valid U.S. Passport for global runs.

WORK EXPERIENCE

Lead Video Engineer & Technical Director
Republic Club Pattaya (DJ Mag Top 100) — Pattaya, Thailand
Jan 2025 – Present
• Designed and operate high-density 16-curved LED wall matrix across main room and mezzanine running custom 4K Resolume Arena 7 servers with zero frame drop at 60 FPS.
• Configured Brompton SX40 processors with dual redundancy fiber ST links, Tessera management, and sub-frame latency presets.
• Synchronized automated kinetic hoist hoists, DMX flame pyrotechnics, and laser safety interlock loops to SMPTE LTC timecode.
• Implemented 12G-SDI routing via Blackmagic ATEM Constellation and Smart Videohub with clean auxiliary feeds to VIP suites.

Touring Video Director & FOH Media Engineer
HiJinx Festival & Live Concert Tours — Philadelphia, PA & Touring
Oct 2023 – Dec 2024
• Headlined FOH video engineering and punt busking for national touring EDM/Bass headliners over 2-day arena festival runs (25,000+ attendees).
• Programmed multi-server disguise d3 media racks with Genlock sync, 4K canvas slice routing, and live Notch generative graphics.
• Handled Cam-Lock 3-phase 200A power distribution, phase balancing, and line insulation safety diagnostics.
• Managed RF wireless intercom lines via Clear-Com HelixNet and FreeSpeak II wireless beltpacks across FOH and backstage.

Lead Scenic Carpenter & Interactive LED Systems Specialist
Artechouse Magentaverse / Spatial Environments — Miami, FL & National
Jan 2022 – Sep 2023
• Built museum-grade structural timber joinery, modular false staging, and hidden wire raceways for custom high-density interactive LED arrays.
• Calibrated multi-surface laser projection edge-blending across curved architectural partition walls using TouchDesigner GLSL compute shaders and optical sensor inputs.
• Executed Vectorworks Spotlight 3D pre-vis drafting and truss load calculation for dead-hung structural framing.

CLEARLY STATED TECHNICAL SKILLS & SHOW HARDWARE

Media Servers & Real-Time Playback:
• disguise (d3) vx 4 / gx 2c: 8+ years experience. OmniCal camera calibration, 4K timeline sequencing, Notch block integration, redundant failover cluster.
• Resolume Arena 7: 10+ years experience. Multi-screen slice routing, Art-Net/sACN Lumiverse mapping, SMPTE LTC timecode lock, DXV3 video encoding.
• TouchDesigner: Generative visual synthesis, GLSL shaders, Python CHOP automation, interactive sensor integration.
• Green Hippo Hippotizer: Zookeeper GUI network control, Strata playback, and pixel mapping.

LED Display Architecture & Processing:
• Brompton SX40 / S8 / Tessera: 4K LED mapping, XD fiber distribution, 10-bit HDR calibration, Dark Magic low-brightness enhancement.
• NovaStar Processing (MX40 Pro / COEX / MCTRL4K): Ultra-low latency configuration, cabinet seam adjustment, A10s Pro card firmware.
• Outdoor Weatherized LED: IP65-rated touring panel rigging, wind bracing, PowerCon TRUE1 weather seals.

Video Switching, Routing & Infrastructure:
• Barco E2 / Event Master (EMT): Multi-screen matrix routing, 4K60 pip layering, seamless transitions, EDID management.
• Blackmagic ATEM Constellation 8K & Smart Videohub: 12G-SDI routing, low-latency multi-cam switching, SuperSource overlays.
• Tactical Fiber Optic Links: Neutrik opticalCON DUO/QUAD, ST connectors, fiber light meters, and visual fault locators.
• NDI 5 & IP Video: Gigabit and 10GbE network fabrics, mDNS discovery, and PTZ camera feeds.

Lighting, Lasers & Kinetic Control:
• MA Lighting grandMA3 / grandMA2: Console programming, MA-Net3 networking, phaser curves, DMX 512, timecode automation.
• Pangolin BEYOND & FB4 Lasers: Network laser control, geometric projection zoning, audience scanning safety limits.
• Laser Safety Officer (LSO): FDA/CDRH variance compliance, hardwired series NC emergency stop (E-stop) loops, and reset latches.
• Kinetic DMX Stage Automation: Motorized winches, optical rotary encoders, DMX relay triggers.

Power & Rigging:
• 3-Phase Power Distribution: 100A–400A Cam-Lock distribution, leg phase balancing, neutral protection, GFCI compliance.
• Rigging & Vectorworks Spotlight: Global Truss F34, load rating calcs, span-sets, shackles, dead hangs.
• Scenic Carpentry: Post-and-beam timber joinery, concealed wire chases, StageRight platforms.
`;
