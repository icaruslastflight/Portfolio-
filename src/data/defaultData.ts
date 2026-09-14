import { Category, PortfolioItem, AuthorProfile, ExportDeck, ManagedAsset, WorkExperience, SkillGroup } from '../types';

export const DEFAULT_AUTHOR_PROFILE: AuthorProfile = {
  name: 'Brice Anthony Morneau',
  title: 'Creative Technologist // Technical Director // Experience Designer',
  email: 'events.bricem@gmail.com',
  phone: '(412) 376-7138',
  location: 'Pittsburgh, PA 15204 (Transit-Accessible & Tour-Ready • Regional Hub: PIT)',
  website: 'primordial-portfolio.netlify.app',
  github: 'https://github.com/icaruslastflight',
  linkedin: 'https://linkedin.com/in/bricemorneau',
  education:
    'Technical & Engineering Coursework — Community College of Allegheny County (CCAC), Pittsburgh, PA',
  summary:
    'Bridging physical computing, real-time generative graphics, automated concert lighting, high-output laser systems, and modular LED displays. 10+ years deploying resilient systems for stadium tours, immersive museums, and DJ Mag Top 100 venues. Pittsburgh urban core base (transit-accessible, instant on-call access to downtown hotel, venue, and theater districts; valid U.S. passport for international runs; all tour-contracted travel originates from Pittsburgh International Airport PIT).'
};

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat_concert_festivals',
    name: 'Concert Tours & Live Festivals',
    description: 'Headline tour punt busking, festival FOH video engineering, 12G-SDI routing, and FB4 laser distribution.',
    color: 'indigo',
    icon: 'Sparkles'
  },
  {
    id: 'cat_nightclubs_residencies',
    name: 'Nightclubs & Venue Residencies',
    description: 'Permanent superclub video systems, 16 curved LED walls, kinetic hoists, and daily show execution.',
    color: 'sky',
    icon: 'Briefcase'
  },
  {
    id: 'cat_immersive_art',
    name: 'Immersive Art & Architectural AV',
    description: 'Large-scale multi-projector edge blending, museum timber joinery, hidden wire chases, and sensory environments.',
    color: 'violet',
    icon: 'Layers'
  },
  {
    id: 'cat_kinetic_fabrication',
    name: 'Kinetic Hardware & Staging',
    description: 'Mechanical gear reductions, optical rotary encoders, DMX flame poofers, and bespoke timber structures.',
    color: 'amber',
    icon: 'Zap'
  },
  {
    id: 'cat_corporate_vip',
    name: 'Corporate Activations & VIP Events',
    description: 'High-visibility corporate activations, kinetic DMX winches, and multi-channel RF wireless coordination.',
    color: 'emerald',
    icon: 'ShieldCheck'
  },
  {
    id: 'cat_rd_visuals',
    name: 'R&D & Volumetric Visuals',
    description: '3D Gaussian Splats, TouchDesigner GLSL compute shaders, and Vectorworks 3D rigging analyses.',
    color: 'rose',
    icon: 'Cpu'
  }
];

export const DEFAULT_ITEMS: PortfolioItem[] = [
  // --- THE 10 PRIMORDIAL VIDEO CASE STUDIES ---
  {
    id: 'case-01-xperience',
    type: 'video',
    title: '01 // Spatial & Practical FX — The Xperience',
    subtitle: 'Botanical Night-Park Mapping & Flame FX',
    location: 'Koh Samui, Thailand',
    roleTag: 'Lead Mapping & Lighting Designer',
    categoryId: 'cat_immersive_art',
    date: '2024',
    content:
      'Engineered technical blueprints for a botanical night-park: 3D statue projection mapping (Luna, Embrace, Ticha) using 5k–10k lumen laser engines, TouchDesigner sensor-driven interactive forest pathways, and synchronized DMX flame poofers/spires pyrotechnics over weatherized fiber links.',
    mediaFilename: 'proposal.mp4',
    videoUrl: 'proposal.mp4',
    auxiliaryAssets: [
      { label: 'Blueprint', filename: 'Master Presentation (PDF)', fileType: 'pdf' },
      { label: 'Video', filename: 'proposal.mp4', fileType: 'video' }
    ],
    tags: ['3D Surface Mapping', 'Sensor Networks', 'Fiber Infrastructure', 'DMX Pyrotechnics'],
    metrics: [
      { label: 'Laser Engines', value: '5k–10k Lumens' },
      { label: 'Link Infrastructure', value: 'Fiber Optic' }
    ],
    starred: true,
    createdAt: Date.now() - 10000,
    updatedAt: Date.now() - 10000
  },
  {
    id: 'case-02-artechouse',
    type: 'image',
    title: '02 // Immersive Installation — Artechouse Magentaverse',
    subtitle: 'Structural Joinery & Interactive LED Arrays',
    location: 'Miami, FL',
    roleTag: 'Lead Scenic Carpenter & LED Tech',
    categoryId: 'cat_immersive_art',
    date: '2022',
    content:
      'Constructed museum-grade structural timber joinery, false staging, and hidden wire chases to house interactive LED arrays. Calibrated multi-surface projection throws across curved architectural walls receiving real-time generative TouchDesigner visual feeds.',
    mediaFilename: 'MVIMG_20220202_023036.jpg',
    imageUrl: 'MVIMG_20220202_023036.jpg',
    mediaDisplayMode: 'side_by_side',
    imageGroups: [
      {
        id: 'grp-arte-01',
        name: 'Structural Timber Joinery & Wire Chases',
        context: 'Engineered museum-grade timber joinery and concealed wiring chases behind curved architectural partition walls to hide power supplies and low-voltage signal distribution.',
        images: [
          {
            id: 'img-arte-1',
            filename: 'FB_IMG_1642078742431.jpg',
            caption: 'False Wall Framing & Wire Loom',
            context: 'Pre-drilled timber studs with fire-retardant conduit'
          },
          {
            id: 'img-arte-2',
            filename: 'MVIMG_20220202_023036.jpg',
            caption: 'Architectural Curve Fit',
            context: 'Laser-leveled curvature inspection before LED panel mounting'
          }
        ]
      },
      {
        id: 'grp-arte-02',
        name: 'Interactive LED & Projection Throw',
        context: 'Calibrated 3D multi-surface projection geometry aligned with high-density LED arrays responding to real-time generative visual feeds.',
        images: [
          {
            id: 'img-arte-3',
            filename: 'FB_IMG_1645751783221.jpg',
            caption: 'Interactive Magentaverse Visuals',
            context: 'Real-time TouchDesigner GLSL pipeline feeding 4K laser engines'
          }
        ]
      }
    ],
    auxiliaryAssets: [
      { label: 'Rigging', filename: 'FB_IMG_1642078742431.jpg', fileType: 'image' },
      { label: 'Gallery', filename: 'FB_IMG_1645751783221.jpg', fileType: 'image' }
    ],
    tags: ['Architectural Joinery', 'Interactive LED Arrays', 'Optical Calibration', 'Wire Chases'],
    metrics: [
      { label: 'Display Technology', value: 'Interactive LED + Laser Proj' },
      { label: 'Visual Pipeline', value: 'Real-time TouchDesigner' }
    ],
    starred: true,
    createdAt: Date.now() - 9000,
    updatedAt: Date.now() - 9000
  },
  {
    id: 'case-03-story-portal',
    type: 'image',
    title: '03 // Kinetic Hardware & Show Control — Story Portal',
    subtitle: 'Steampunk Rotary Encoders & Pyro Relay Sequences',
    location: 'Festival Stage',
    roleTag: 'Lead Hardware Fabricator & Systems Eng',
    categoryId: 'cat_kinetic_fabrication',
    date: '2023',
    content:
      'Engineered an interactive steampunk stage centerpiece: fabricated a mechanical gear reduction wheel integrated with optical rotary encoders. Participant turning sequences microcontroller relays firing timed DMX flame poofers, spinning cogs, haze, and lighting sweeps protected by manual E-stops.',
    mediaFilename: 'portal build.jpg',
    imageUrl: 'portal build.jpg',
    mediaDisplayMode: 'slides',
    imageGroups: [
      {
        id: 'grp-portal-01',
        name: 'Kinetic Gearbox & Rotary Encoder Assembly',
        context: 'Bench-fabricated gear reduction wheel linked to industrial optical encoders, translating physical user rotation into DMX lighting sweeps and safe flame bursts.',
        images: [
          {
            id: 'img-portal-1',
            filename: 'portal build.jpg',
            caption: 'Gear Reduction Fabrication',
            context: 'Mechanical cog integration on welded steel frame'
          },
          {
            id: 'img-portal-2',
            filename: 'portal upright.jpg',
            caption: 'Upright Portal Rigging',
            context: 'Upright rigging test on festival mainstage'
          }
        ]
      }
    ],
    auxiliaryAssets: [
      { label: 'Rigging', filename: 'portal upright.jpg', fileType: 'image' },
      { label: 'Bench Test', filename: '20251229_032858.mp4', fileType: 'video' }
    ],
    tags: ['Mechanical Reductions', 'Rotary Encoders', 'Microcontroller Relays', 'DMX Flame E-Stop'],
    metrics: [
      { label: 'Hardware Control', value: 'Microcontroller Relays' },
      { label: 'Safety Interlocks', value: 'Dual Manual E-Stops' }
    ],
    starred: true,
    createdAt: Date.now() - 8000,
    updatedAt: Date.now() - 8000
  },
  {
    id: 'case-04-gaussian-splats',
    type: 'video',
    title: '04 // Procedural Generation — Splats & Point Clouds',
    subtitle: 'Real-Time GPU GLSL Shaders & 3D Volumetric Ingest',
    location: 'Live Concert R&D',
    roleTag: 'Interactive Visuals & GPU Developer',
    categoryId: 'cat_rd_visuals',
    date: '2025',
    content:
      'Real-time generative visual systems executing TouchDesigner GLSL compute shaders. Modulates LiDAR point clouds in response to audio frequencies/OSC, with live 60 FPS ingest of 3D Gaussian Splats delivering fluid volumetric flight manipulation.',
    mediaFilename: '20250814_062511.mp4',
    videoUrl: '20250814_062511.mp4',
    auxiliaryAssets: [
      { label: 'Flight', filename: '20250814_062511.mp4', fileType: 'video' },
      { label: 'Splat Ingest', filename: '20251212_214229.mp4', fileType: 'video' }
    ],
    tags: ['3D Gaussian Splatting', 'LiDAR Spatial Capture', 'GLSL Compute Shaders', 'TouchDesigner'],
    metrics: [
      { label: 'Render Performance', value: '60 FPS Lock-Step' },
      { label: 'Input Protocols', value: 'OSC & Live Audio FFT' }
    ],
    starred: true,
    createdAt: Date.now() - 7000,
    updatedAt: Date.now() - 7000
  },
  {
    id: 'case-05-republic-club',
    type: 'video',
    title: '05 // AV Architecture & Show Control — Republic Club',
    subtitle: 'DJ Mag Top 100 Venue Automation & Curved LED Matrix',
    location: 'Pattaya, Thailand',
    roleTag: 'Technical Director / Dept Head',
    categoryId: 'cat_nightclubs_residencies',
    date: '2025',
    content:
      'Directed technical production for a DJ Mag Top 100 venue (7 nights/week): 16 curved LED walls, 50+ moving heads, Pangolin lasers, and motorized kinetic ceiling hoist (The Cube). Standardized Resolume DXV3 codecs and authored SOPs for component-level PSU bench repairs.',
    mediaFilename: '20250720_064924.mp4',
    videoUrl: '20250720_064924.mp4',
    auxiliaryAssets: [
      { label: 'Media Server Matrix', filename: 'IMG_20250506_210434.jpg', fileType: 'image' },
      { label: 'Live Drop', filename: '20250822_230315.mp4', fileType: 'video' }
    ],
    tags: ['16 Curved LED Walls', 'Resolume Arena 7', 'Kinetic Automation', 'PSU Bench Soldering'],
    metrics: [
      { label: 'Show Schedule', value: '7 Nights / Week (0 Downtime)' },
      { label: 'Active Rig', value: '16 LED Walls • 50+ Moving Heads' }
    ],
    starred: true,
    createdAt: Date.now() - 6000,
    updatedAt: Date.now() - 6000
  },
  {
    id: 'case-06-home-bass',
    type: 'image',
    title: '06 // Experiential Rigging & 3D Pre-Vis — Home Bass',
    subtitle: '270° Poolside Wrap-Around Global Truss Engineering',
    location: 'Orlando, FL',
    roleTag: 'Lead Staging Designer & Rigging Specialist',
    categoryId: 'cat_concert_festivals',
    date: '2023',
    content:
      'Engineered structural rigging for a 270° poolside wrap-around stage. Modeled 3D Vectorworks pre-vis and calculated load schedules across Global Truss F34 box truss (1,121 lbs truss, 876.7 lbs fixtures: 18x Clay Paky Sharpy, 10x Martin MAC Aura) with ground-support outriggers.',
    mediaFilename: 'PXL_20231110_053549559.MP.jpg',
    imageUrl: 'PXL_20231110_053549559.MP.jpg',
    mediaDisplayMode: 'background',
    imageGroups: [
      {
        id: 'grp-homebass-01',
        name: 'Poolside Truss Elevation & Sightlines',
        context: 'Volumetric Vectorworks modeling ensured zero sightline clipping for hotel balcony VIP suites while supporting 1,121 lbs dead hang.',
        images: [
          {
            id: 'img-hb-1',
            filename: 'PXL_20231007_201420456~2.jpg',
            caption: 'Vectorworks 3D Pre-Vis CAD',
            context: 'Truss elevation and fixture throw simulation'
          },
          {
            id: 'img-hb-2',
            filename: 'PXL_20231012_150749153.jpg',
            caption: 'Load Schedule Calculations',
            context: 'Stamped point load distributions'
          }
        ]
      }
    ],
    auxiliaryAssets: [
      { label: 'CAD', filename: 'PXL_20231007_201420456~2.jpg', fileType: 'image' },
      { label: 'Schedule', filename: 'PXL_20231012_150749153.jpg', fileType: 'image' }
    ],
    tags: ['270° Wrap Geometry', 'Global Truss F34', 'Load Calculations', 'Vectorworks Spotlight'],
    metrics: [
      { label: 'Truss Dead Hang', value: '1,121 lbs F34' },
      { label: 'Fixture Load', value: '876.7 lbs Dynamic' }
    ],
    starred: true,
    createdAt: Date.now() - 5000,
    updatedAt: Date.now() - 5000
  },
  {
    id: 'case-07-hijinx',
    type: 'image',
    title: '07 // Space Optimization & Volumetric CAD — HiJinx',
    subtitle: 'Warehouse Column Obstruction Integration & Sightline Drafting',
    location: 'Philadelphia, PA',
    roleTag: 'Stage Systems & Volumetric CAD',
    categoryId: 'cat_concert_festivals',
    date: '2023',
    content:
      'Overcame dense warehouse concrete column constraints via volumetric CAD modeling. Mapped 3D sightline cones and wrapped structural pillars with box truss fixture arrays, turning venue obstructions into dynamic lighting frames with balanced atmospheric haze dispersion.',
    mediaFilename: 'PXL_20231221_062201175.jpg',
    imageUrl: 'PXL_20231221_062201175.jpg',
    auxiliaryAssets: [
      { label: 'Wireframe', filename: 'PXL_20231220_034827931.jpg', fileType: 'image' },
      { label: 'Plan', filename: 'PXL_20231221_012509504.jpg', fileType: 'image' }
    ],
    tags: ['Volumetric CAD', 'Column Integration', 'Sightline Drafting', 'Haze Dispersion'],
    metrics: [
      { label: 'Structural Modeling', value: 'Volumetric Sightlines' },
      { label: 'Venue Geometry', value: 'Concrete Pillar Clamping' }
    ],
    starred: true,
    createdAt: Date.now() - 4000,
    updatedAt: Date.now() - 4000
  },
  {
    id: 'case-08-gecko',
    type: 'image',
    title: '08 // Corporate Activation — Gecko Robotics',
    subtitle: 'Kinetic DMX Winch Canopy & Infinity-Mirror Dance Floor',
    location: 'Pittsburgh, PA',
    roleTag: 'Lead Automation & LED Install Engineer',
    categoryId: 'cat_corporate_vip',
    date: '2024',
    content:
      'Turnkey execution of a corporate technology activation: programmed DMX winch arrays to articulate an overhead kinetic LED canopy and engineered a reinforced sub-floor infinity-mirror dance floor using heavy load-bearing one-way tempered acrylics.',
    mediaFilename: 'PXL_20240613_225455832.jpg',
    imageUrl: 'PXL_20240613_225455832.jpg',
    auxiliaryAssets: [
      { label: 'Schematic', filename: 'Screenshot_20240513-232800.jpg', fileType: 'image' },
      { label: 'Sub-frame', filename: 'PXL_20240613_203421747.jpg', fileType: 'image' }
    ],
    tags: ['Kinetic DMX Winches', 'Infinity Mirror Floor', 'Load-Bearing Acrylic', '3D-to-Build Execution'],
    metrics: [
      { label: 'Automation', value: 'DMX Kinetic Winches' },
      { label: 'Subfloor Surface', value: 'Tempered One-Way Acrylic' }
    ],
    starred: true,
    createdAt: Date.now() - 3000,
    updatedAt: Date.now() - 3000
  },
  {
    id: 'case-09-underground',
    type: 'image',
    title: '09 // Laser & Lighting Design — Underground Rigs',
    subtitle: 'Tri-Computer FOH Busking Rig & FB4 Network Distribution',
    location: 'Live Concert Tours',
    roleTag: 'LD, Live Busker & Laser Tech',
    categoryId: 'cat_concert_festivals',
    date: '2024',
    content:
      'High-tempo console busking and FB4 laser rigging for headline bass acts (Ternion Sound, Buku). Engineered a unified FOH control map routing bidirectional MIDI/OSC from a single Akai APC40 across three networked computers controlling ChamSys, Resolume, and Pangolin BEYOND.',
    mediaFilename: 'FB_IMG_1781974753842.jpg',
    imageUrl: 'FB_IMG_1781974753842.jpg',
    auxiliaryAssets: [
      { label: 'Ternion Sound', filename: 'FB_IMG_1781974777064~2.jpg', fileType: 'image' },
      { label: 'Buku', filename: 'FB_IMG_1781974819871.jpg', fileType: 'image' }
    ],
    tags: ['Pangolin BEYOND / FB4', 'Akai APC40 Tri-Computer', 'ChamSys / ONYX', 'Concert Punt Busking'],
    metrics: [
      { label: 'FOH Network', value: '3 Computers on 1 Akai APC40' },
      { label: 'Laser Control', value: 'Pangolin FB4 Network' }
    ],
    starred: true,
    createdAt: Date.now() - 2000,
    updatedAt: Date.now() - 2000
  },
  {
    id: 'case-10-bespoke',
    type: 'image',
    title: '10 // Custom Fabrication & Bespoke Installations',
    subtitle: 'Modular Timber Pergola Bars & Concealed Electrical Channels',
    location: 'Commercial Builds',
    roleTag: 'Lead Carpenter & Systems Fabricator',
    categoryId: 'cat_kinetic_fabrication',
    date: '2023',
    content:
      'Handcrafted architectural AV installations: free-standing modular rustic timber pergola bars with concealed power channels, real-time sound-reactive projection-mapped commercial studio murals, and mechanical kinetic staging prototypes.',
    mediaFilename: 'Wedding bar.jpg',
    imageUrl: 'Wedding bar.jpg',
    auxiliaryAssets: [
      { label: 'Bench Test', filename: '20251229_032858.mp4', fileType: 'video' },
      { label: 'Joinery', filename: '127451-738829428.mp4', fileType: 'video' }
    ],
    tags: ['Timber Joinery', 'Concealed Electrical', 'Studio Projection', 'Hardware Prototyping'],
    metrics: [
      { label: 'Structural Joinery', value: 'Timber Post & Beam' },
      { label: 'Wire Management', value: '100% Concealed Channels' }
    ],
    starred: true,
    createdAt: Date.now() - 1000,
    updatedAt: Date.now() - 1000
  },

  // --- TOURING & FIELD SHOW PROJECTS ---
  {
    id: 'proj_touring_v1',
    type: 'project',
    title: 'Touring Video Engineer & V1 Subcontractor',
    subtitle: 'Baseband 12G-SDI, NDI 5.5 & Redundant Media Server Sync',
    location: 'National & Regional Tours',
    roleTag: 'Touring V1 / Lead Video Engineer',
    categoryId: 'cat_concert_festivals',
    date: '2019 – Present',
    content:
      'Contracted as Lead Video Engineer (V1) and Media Server Programmer for high-tempo live concert tours, electronic music festivals, and corporate general sessions. Designed end-to-end baseband and IP video routing pipelines deploying Blackmagic ATEM Constellation 8K switchers, Decimator MD-HX converters, and AJA Genlock sync generators. Delivered rock-solid multi-output rendering from primary and hot-standby Resolume and TouchDesigner machines with hardware-switched seamless failover.',
    tags: ['Touring V1', 'Blackmagic Constellation', 'SMPTE Timecode', 'Failover Sync', '12G-SDI'],
    metrics: [
      { label: 'Switch Latency', value: '<1 frame seamless failover' },
      { label: 'Signal Standards', value: '12G-SDI / 4K60 / NDI 5.5' }
    ],
    starred: true,
    createdAt: Date.now() - 95000,
    updatedAt: Date.now() - 95000
  },
  {
    id: 'proj_vangogh',
    type: 'project',
    title: 'Immersive Van Gogh Exhibition — Site Lead & Systems Calibration',
    subtitle: '64-Projector Christie Digital Laser Matrix & Geometry Warping',
    location: 'Pittsburgh, PA (32,000 sq ft Exhibition)',
    roleTag: 'Site Lead & Systems Engineer',
    categoryId: 'cat_immersive_art',
    date: '2021 – 2022',
    content:
      'Directly supervised the technical installation, calibration, and 7-day operational integrity of a 64-projector Christie Digital laser system spread across 32,000 sq ft of exhibition galleries. Led a 32-technician integration crew during structural rigging, cable tray runs, and projector alignment. Maintained seamless edge-blending matrices, geometric corner-pin warping, and multi-server synchronization over 14 hours of continuous daily runtime.',
    tags: ['Christie Digital', '64 Projectors', '32,000 sq ft', 'Edge-Blending', 'Site Lead'],
    metrics: [
      { label: 'Projector Count', value: '64 calibrated laser units' },
      { label: 'Daily Runtime', value: '14 continuous hours/day' },
      { label: 'Crew Supervised', value: '32 technicians' }
    ],
    starred: true,
    createdAt: Date.now() - 90000,
    updatedAt: Date.now() - 90000
  },
  {
    id: 'proj_f1_miami',
    type: 'project',
    title: 'Red Bull Racing F1 Miami GP — VIP Paddock Video & RF Audio',
    subtitle: 'Formula 1 Miami Grand Prix • Hard Rock Stadium Paddock',
    roleTag: 'Lead Video & RF Audio Engineer',
    location: 'Miami, FL',
    categoryId: 'cat_corporate_vip',
    date: 'May 2022',
    content:
      'Engineered high-profile hospitality video distribution and multi-channel RF audio for Red Bull Racing during the inaugural Miami Grand Prix. Managed 14 channels of Shure Axient Digital wireless microphones and IEMs amid extreme RF congestion within the Formula 1 team paddock. Routed camera feeds and live telemetry graphics to VIP LED arrays with zero RF dropouts.',
    tags: ['F1 Miami GP', 'Shure Axient Digital', 'Paddock Video', 'RF Coordination'],
    metrics: [
      { label: 'RF Dropouts', value: '0 in extreme paddock RF interference' },
      { label: 'Axient Channels', value: '14 coordinated frequencies' }
    ],
    starred: true,
    createdAt: Date.now() - 85000,
    updatedAt: Date.now() - 85000
  }
];

export const DEFAULT_WORK_EXPERIENCE: WorkExperience[] = [
  {
    id: 'exp_republic_club',
    role: 'Lead Video Engineer & Technical Director',
    companyOrVenue: 'Republic Club Pattaya (DJ Mag Top 100)',
    location: 'Pattaya, Thailand',
    startDate: 'Jan 2025',
    endDate: 'Present',
    current: true,
    employmentType: 'Residency / Dept Head',
    description:
      'Department Head overseeing all video engineering, LED processing, and live visual playback across the facility 7 nights per week. Directing daily show execution, international headliner video support, and rapid preventative hardware maintenance.',
    highlights: [
      'Manage daily operations for 16 curved LED walls, 50+ moving fixtures, Pangolin FB4 lasers, and motorized kinetic ceiling hoist (The Cube)',
      'Program and busk live visual sets in Resolume Arena 7 alongside international guest headliners and resident DJs',
      'Conduct component-level SMD repairs on LED modules, power supply rebuilds, and firmware flashing on receiving cards',
      'Maintain 0% show downtime across high-tempo 7-day operating schedule'
    ],
    skillsUsed: ['Resolume Arena 7', 'Brompton SX40', 'NovaStar MX40 Pro', 'Pangolin BEYOND', 'Kinetic Automation', 'SMD Soldering'],
    keyMetrics: [
      { label: 'Show Downtime', value: '0% across all club operational runs' },
      { label: 'LED Surfaces', value: '16 custom curved walls synchronized' }
    ],
    starred: true,
    createdAt: Date.now() - 100000,
    updatedAt: Date.now() - 100000
  },
  {
    id: 'exp_touring_v1',
    role: 'Touring Video Engineer & V1 Subcontractor',
    companyOrVenue: 'Freelance & Festival Circuits',
    location: 'National & Regional Tours',
    startDate: '2019',
    endDate: 'Present',
    current: true,
    employmentType: 'Touring Contract',
    description:
      'Lead Video Engineer (V1) and Media Server Programmer for high-tempo live concert tours, electronic music festivals, and corporate keynote general sessions.',
    highlights: [
      'Designed end-to-end baseband and IP video routing pipelines deploying Blackmagic ATEM Constellation 8K switchers and Decimator converters',
      'Delivered rock-solid multi-output rendering from primary and hot-standby Resolume and TouchDesigner machines with hardware seamless failover',
      'Synchronized multi-camera switching, graphics overlays, and SMPTE LTC timecode feeds under high-pressure live environments'
    ],
    skillsUsed: ['Touring V1', 'Blackmagic Constellation', 'SMPTE Timecode', 'Failover Sync', '12G-SDI', 'Resolume Arena 7'],
    keyMetrics: [
      { label: 'Switch Latency', value: '<1 frame seamless failover' },
      { label: 'Signal Standards', value: '12G-SDI / 4K60 / NDI 5.5' }
    ],
    starred: true,
    createdAt: Date.now() - 95000,
    updatedAt: Date.now() - 95000
  },
  {
    id: 'exp_vangogh',
    role: 'Site Lead & Lead Video Systems Engineer',
    companyOrVenue: 'Immersive Van Gogh Exhibition (Lighthouse Immersive)',
    location: 'Pittsburgh, PA (32,000 sq ft Exhibition)',
    startDate: '2021',
    endDate: '2022',
    current: false,
    employmentType: 'Site Lead',
    description:
      'Supervised technical installation, calibration, and 7-day operational integrity of a 64-projector Christie Digital laser system spread across 32,000 sq ft of exhibition galleries.',
    highlights: [
      'Directed a 32-technician integration crew during structural rigging, cable tray runs, and projector alignment',
      'Maintained seamless edge-blending matrices, geometric corner-pin warping, and multi-server synchronization over 14 continuous hours/day',
      'Achieved 100% projection uptime throughout the multi-month high-attendance museum run'
    ],
    skillsUsed: ['Christie Digital GS Series', 'Edge-Blending', 'Geometry Warping', 'Multi-Server Sync', 'Crew Management'],
    keyMetrics: [
      { label: 'Projector Count', value: '64 calibrated laser units' },
      { label: 'Daily Runtime', value: '14 continuous hours/day' },
      { label: 'Crew Supervised', value: '32 technicians' }
    ],
    starred: true,
    createdAt: Date.now() - 90000,
    updatedAt: Date.now() - 90000
  },
  {
    id: 'exp_f1_miami',
    role: 'Lead Video & RF Audio Engineer',
    companyOrVenue: 'Red Bull Racing F1 Miami GP Activation',
    location: 'Hard Rock Stadium Paddock • Miami, FL',
    startDate: 'May 2022',
    endDate: 'May 2022',
    current: false,
    employmentType: 'VIP Activation Lead',
    description:
      'Engineered high-profile hospitality video distribution and multi-channel RF audio for Red Bull Racing during the inaugural Miami Grand Prix.',
    highlights: [
      'Managed 14 channels of Shure Axient Digital wireless microphones and IEMs amid extreme RF congestion in the Formula 1 team paddock',
      'Routed live track camera feeds and telemetry graphics to VIP LED arrays with zero RF dropouts',
      'Coordinated direct frequency spectrum clearing with official FIA and venue RF coordinators'
    ],
    skillsUsed: ['Shure Axient Digital', 'WWB6 Frequency Coordination', 'Baseband SDI Video', 'VIP Hospitality AV'],
    keyMetrics: [
      { label: 'RF Dropouts', value: '0 in extreme paddock RF interference' },
      { label: 'Axient Channels', value: '14 coordinated frequencies' }
    ],
    starred: true,
    createdAt: Date.now() - 85000,
    updatedAt: Date.now() - 85000
  },
  {
    id: 'exp_illume',
    role: 'Stagehand Manager & Lead AV Specialist',
    companyOrVenue: 'Illume Lighting & Event Design',
    location: 'Pittsburgh, PA',
    startDate: '2016',
    endDate: '2022',
    current: false,
    employmentType: 'Staff / Department Management',
    description:
      'Six-year staff tenure running crew and shop operations for a Pittsburgh lighting and event design house, covering corporate galas, concerts, and venue installations.',
    highlights: [
      'Promoted to management within 4 months; directed crew onboarding, hands-on technical skill development, and role assignments',
      'Staffed and led crews across hundreds of corporate galas, concerts, and venue installations',
      'Managed shop prep, equipment maintenance logs, rental returns, and cable hygiene',
      'Ensured all outgoing lighting and video gear was tested and show-ready before dispatch'
    ],
    skillsUsed: ['Crew Leadership & Onboarding', 'Shop Prep & Gear Testing', 'Equipment Maintenance Logs', 'Rental Logistics'],
    keyMetrics: [
      { label: 'Time to Management', value: 'Promoted within 4 months' },
      { label: 'Tenure', value: '6 years (2016–2022)' }
    ],
    starred: false,
    createdAt: Date.now() - 80000,
    updatedAt: Date.now() - 80000
  }
];

export const DEFAULT_SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'skill_grp_lighting_consoles',
    name: 'Lighting Consoles & Automated Fixture Service',
    icon: 'Lightbulb',
    color: 'amber',
    description: 'Live console busking, DMX/Art-Net/sACN distribution, and component-level moving-head servicing.',
    highlightMetric: { label: 'Rig Scale', value: '150+ Automated Fixtures' },
    skills: [
      {
        id: 'sk_chamsys_onyx',
        name: 'ChamSys MagicQ & Obsidian ONYX',
        proficiency: 'Expert',
        description: 'Live console busking, punt pages, dynamic colour and position palettes, and show-file maintenance under nightly high-tempo operation.',
        keywords: ['MagicQ', 'Obsidian ONYX', 'Punt Pages', 'Live Busking', 'Palettes']
      },
      {
        id: 'sk_dmx_networks',
        name: 'DMX512-A, Art-Net, sACN & RDM',
        proficiency: 'Expert',
        description: 'Universe patching and distribution over Art-Net and sACN, RDM device management, Pathport nodes, Luminex switches, and opto-isolated splitters.',
        keywords: ['DMX512-A', 'Art-Net', 'sACN', 'RDM', 'Pathport', 'Luminex']
      },
      {
        id: 'sk_moving_head_service',
        name: 'Automated Moving Head Service',
        proficiency: 'Expert',
        description: 'Tear-downs and optical maintenance on Robe, Clay Paky, Martin and Chauvet Professional fixtures: optical de-fogging, pan/tilt belt tensioning, stepper motor calibration, and multimeter tracing.',
        keywords: ['Robe', 'Clay Paky', 'Martin', 'Chauvet', 'Belt Tensioning', 'Stepper Calibration']
      },
      {
        id: 'sk_atmospherics',
        name: 'Atmospherics & Stage SFX',
        proficiency: 'Advanced',
        description: 'Hazers, low-lying fog, cold sparks, and DMX flame effects, run with SFX safety clearance and venue coordination.',
        keywords: ['Hazers', 'Low Fog', 'Cold Sparks', 'DMX Flame', 'SFX Clearance']
      },
      {
        id: 'sk_showcontrol_apc40',
        name: 'Integrated Show Control',
        proficiency: 'Advanced',
        description: 'Akai APC40 tri-computer control matrix routing bidirectional MIDI and OSC to trigger console overrides, multi-layer Resolume playback, and Pangolin lasers at locked 60 FPS.',
        keywords: ['Akai APC40', 'MIDI', 'OSC', 'Tri-Computer Sync', '60 FPS']
      }
    ],
    createdAt: Date.now() - 82000,
    updatedAt: Date.now() - 82000
  },
  {
    id: 'skill_grp_media_servers',
    name: 'Media Servers & Real-Time Generative Engines',
    icon: 'Layers',
    color: 'violet',
    description: 'Real-time rendering engines, canvas slice routing, SMPTE LTC timecode lock, and GPU compute shaders.',
    highlightMetric: { label: 'Performance', value: 'Locked 60 FPS' },
    skills: [
      {
        id: 'sk_resolume',
        name: 'Resolume Arena 7',
        proficiency: 'Master',
        yearsOfExperience: '10+ Years',
        description: 'Advanced canvas slice routing, DMX lumiverse mapping, Art-Net/sACN, OSC, SMPTE LTC audio timecode lock, and multi-display desktop spanning.',
        keywords: ['Slice Routing', 'Art-Net', 'SMPTE LTC', 'OSC', 'DMX Mapping']
      },
      {
        id: 'sk_touchdesigner',
        name: 'TouchDesigner',
        proficiency: 'Expert',
        yearsOfExperience: '6+ Years',
        description: 'Generative visual pipelines, LiDAR point cloud modulation, sensor ingest, GLSL shaders, and audio-reactive instancing.',
        keywords: ['GLSL Shaders', 'Point Clouds', 'OSC Telemetry', 'Sensors']
      },
      {
        id: 'sk_madmapper',
        name: 'MadMapper & Multi-Display',
        proficiency: 'Expert',
        yearsOfExperience: '7+ Years',
        description: 'Spatial architectural projection mapping, 3D surface masking, LED pixel tape universe routing, and desktop spanning.',
        keywords: ['Spatial Warping', 'Pixel Tape', 'DMX Universes', 'Multi-Display']
      },
      {
        id: 'sk_codecs',
        name: 'Video Codecs & Transcoding',
        proficiency: 'Master',
        yearsOfExperience: '10+ Years',
        description: 'Resolume DXV 3 Normal/High Quality, Apple ProRes 422 Proxy/LT/HQ, HAP, NotchLC, and 48kHz WAV audio channel decoupling.',
        keywords: ['DXV 3', 'Apple ProRes', 'HAP', 'NotchLC', '48kHz WAV']
      }
    ],
    createdAt: Date.now() - 80000,
    updatedAt: Date.now() - 80000
  },
  {
    id: 'skill_grp_led_processing',
    name: 'LED Display Hardware & Video Processing',
    icon: 'Monitor',
    color: 'emerald',
    description: 'Industry-standard processor configuration, raster calculation, seam balancing, and touring tile deployment.',
    highlightMetric: { label: 'Alignment', value: 'Pixel-Accurate 4K' },
    skills: [
      {
        id: 'sk_brompton',
        name: 'Brompton Technology',
        proficiency: 'Master',
        yearsOfExperience: '8+ Years',
        description: 'Tessera SX40, S8, M2; pixel-accurate raster calculation, OSCA seam brightness compensation, mixed-batch calibration, and genlock.',
        keywords: ['Tessera SX40', 'OSCA Seam Compensation', 'S8 / M2', 'Genlock']
      },
      {
        id: 'sk_novastar',
        name: 'NovaStar Flagship Processors',
        proficiency: 'Master',
        yearsOfExperience: '9+ Years',
        description: 'MCTRL4K, MX40 Pro, NovaPro UHD Jr, VX1000; screen configuration, cabinet firmware upgrading, and NovaLCT calibration.',
        keywords: ['MX40 Pro', 'MCTRL4K', 'Cabinet Firmware', 'NovaLCT']
      },
      {
        id: 'sk_tile_hardware',
        name: 'Touring Tile Hardware & Ground Support',
        proficiency: 'Expert',
        yearsOfExperience: '8+ Years',
        description: 'Rigging, ground-supporting, curving, and servicing touring tiles: ROE Visual (Carbon, Vanish, Black Pearl), Absen (Polaris, Neptune), and Infiled panels.',
        keywords: ['ROE Visual', 'Absen', 'Infiled', 'Curved Arrays', 'Ground Support']
      }
    ],
    createdAt: Date.now() - 75000,
    updatedAt: Date.now() - 75000
  },
  {
    id: 'skill_grp_video_engineering',
    name: 'Video Engineering & Signal Routing',
    icon: 'Cpu',
    color: 'sky',
    description: 'Baseband 12G-SDI, IP video pipelines, timecode synchronization, and live multi-camera switching.',
    highlightMetric: { label: 'Failover', value: '<1 Frame Seamless' },
    skills: [
      {
        id: 'sk_atem',
        name: 'Blackmagic ATEM Switching',
        proficiency: 'Master',
        yearsOfExperience: '8+ Years',
        description: 'ATEM Constellation 8K, 12G-SDI baseband routing matrices, multiviewer design, camera CCU shading, and macros.',
        keywords: ['ATEM Constellation', '12G-SDI', 'Multiviewer', 'CCU Control']
      },
      {
        id: 'sk_converters',
        name: 'Video Converters & Standards',
        proficiency: 'Master',
        yearsOfExperience: '10+ Years',
        description: 'Decimator MD-HX, AJA Genlock sync generators, frame rate cross-conversion, EDID management, and signal buffering.',
        keywords: ['Decimator MD-HX', 'AJA Genlock', 'EDID Handshake', 'Frame Conversion']
      },
      {
        id: 'sk_smpte',
        name: 'SMPTE Timecode & Audio Lock',
        proficiency: 'Expert',
        yearsOfExperience: '8+ Years',
        description: 'SMPTE LTC linear timecode distribution, audio-to-video lock, DAW synchronization, and latency compensation.',
        keywords: ['SMPTE LTC', 'DAW Sync', 'Audio Lock', 'Latency Compensation']
      },
      {
        id: 'sk_net_protocols',
        name: 'Network Protocols & IP Video',
        proficiency: 'Advanced',
        yearsOfExperience: '6+ Years',
        description: 'NDI 5.5, Art-Net, sACN, OSC bidirectional routing, managed Gigabit switches, VLAN isolation, and Dante audio fundamentals.',
        keywords: ['NDI 5.5', 'Art-Net', 'sACN', 'OSC', 'VLAN Isolation']
      }
    ],
    createdAt: Date.now() - 70000,
    updatedAt: Date.now() - 70000
  },
  {
    id: 'skill_grp_bench_repair',
    name: 'Component-Level Electronics & Field Bench Repair',
    icon: 'Wrench',
    color: 'rose',
    description: 'Safe capacitor discharge, power supply diagnostics, micro-soldering, and firmware restoration.',
    highlightMetric: { label: 'Capital Saved', value: '$4,200 via 17 Rebuilds' },
    skills: [
      {
        id: 'sk_psu_rebuild',
        name: 'SMPS Power Supply Rebuilds',
        proficiency: 'Expert',
        yearsOfExperience: '7+ Years',
        description: 'Safe high-voltage capacitor discharge, bridge rectifier replacement, PWM switching controller diagnostics, and transformer rebuilds. 17 units restored.',
        keywords: ['17 PSU Rebuilds', 'Capacitor Discharge', 'PWM Controllers', 'Safety']
      },
      {
        id: 'sk_smd_soldering',
        name: 'Micro-Soldering & SMD Repair',
        proficiency: 'Expert',
        yearsOfExperience: '8+ Years',
        description: 'Surface-mount 0603/0805 passives replacement, damaged LED diodes, ribbon cable repair, and PCB trace reconstruction under microscope.',
        keywords: ['SMD Soldering', '0603/0805 Passives', 'Mini-LED Diodes', 'PCB Tracing']
      },
      {
        id: 'sk_firmware',
        name: 'Firmware Flashing & Recovery',
        proficiency: 'Advanced',
        yearsOfExperience: '5+ Years',
        description: 'UART serial flashing, EEPROM recovery for bricked receiving cards, and controller firmware repair in field conditions.',
        keywords: ['UART Serial', 'EEPROM Recovery', 'Firmware Unbricking']
      }
    ],
    createdAt: Date.now() - 65000,
    updatedAt: Date.now() - 65000
  },
  {
    id: 'skill_grp_lasers_automation',
    name: 'Theatrical Lasers & Kinetic Automation',
    icon: 'Zap',
    color: 'amber',
    description: 'Pangolin BEYOND networks, series-wired safety interlocks, and motorized kinetic stage automation.',
    highlightMetric: { label: 'Safety Record', value: '100% Compliant' },
    skills: [
      {
        id: 'sk_pangolin',
        name: 'Pangolin BEYOND & FB4 Network',
        proficiency: 'Expert',
        yearsOfExperience: '6+ Years',
        description: 'Pangolin BEYOND and QuickShow software, FB4 network hardware distribution, beam attenuation masks, and concert busking integration.',
        keywords: ['Pangolin BEYOND', 'FB4 Network', 'Beam Masks', 'Live Busking']
      },
      {
        id: 'sk_laser_safety',
        name: 'Laser Safety & FDA/CDRH Variance',
        proficiency: 'Master',
        yearsOfExperience: '6+ Years',
        description: 'Series NC emergency stop (E-stop) interlock loops, manual reset latches, zone masking, and operating under designated Laser Safety Officer (LSO) oversight.',
        keywords: ['Series E-Stop', 'FDA/CDRH Variance', 'LSO Compliance', 'Zone Masking']
      },
      {
        id: 'sk_kinetic_auto',
        name: 'Kinetic Stage Automation',
        proficiency: 'Advanced',
        yearsOfExperience: '4+ Years',
        description: 'DMX kinetic hoists, motorized winches, optical rotary encoders, microcontroller relays, and safety override interlocks.',
        keywords: ['DMX Hoists', 'Rotary Encoders', 'Microcontrollers', 'Safety Interlocks']
      }
    ],
    createdAt: Date.now() - 60000,
    updatedAt: Date.now() - 60000
  },
  {
    id: 'skill_grp_power_rigging',
    name: 'Power Distribution, Rigging & Staging',
    icon: 'ShieldCheck',
    color: 'slate',
    description: '3-phase power safety, truss dead hangs, MEWP access, and structural carpentry.',
    highlightMetric: { label: 'Power Distro', value: '100A–400A 3-Phase' },
    skills: [
      {
        id: 'sk_power_distro',
        name: '3-Phase Power Distribution',
        proficiency: 'Expert',
        yearsOfExperience: '9+ Years',
        description: '100A–400A Cam-Lock distribution, leg phase balancing, neutral protection, GFCI compliance, and multimeter line diagnostics.',
        keywords: ['Cam-Lock Distro', 'Phase Balancing', 'Neutral Protection', 'Multimeter']
      },
      {
        id: 'sk_rigging_vworks',
        name: 'Rigging & Vectorworks Spotlight',
        proficiency: 'Expert',
        yearsOfExperience: '8+ Years',
        description: 'Global Truss F34, stamped point loads, shackle/span-set ratings, dead hangs, outriggers, and Vectorworks Spotlight 3D pre-vis drafting.',
        keywords: ['Vectorworks Spotlight', 'F34 Truss', 'Load Calculations', 'Dead Hangs']
      },
      {
        id: 'sk_scenic_carpentry',
        name: 'Scenic Carpentry & Architectural Joinery',
        proficiency: 'Master',
        yearsOfExperience: '10+ Years',
        description: 'Timber post-and-beam joinery, concealed wire chases, stage decks, false walls, and StageRight commercial platforms.',
        keywords: ['Timber Joinery', 'Concealed Chases', 'Stage Decks', 'False Walls']
      }
    ],
    createdAt: Date.now() - 55000,
    updatedAt: Date.now() - 55000
  }
];


export const DEFAULT_EXPORT_DECK: ExportDeck = {
  id: 'deck-primordial-portfolio',
  name: 'Primordial Video — Case Studies & Technical Portfolio',
  targetType: 'primordial_html',
  layout: 'primordial_dark',
  assetPathStrategy: 'assets_folder',
  itemIds: [
    'case-01-xperience',
    'case-02-artechouse',
    'case-03-story-portal',
    'case-04-gaussian-splats',
    'case-05-republic-club',
    'case-06-home-bass',
    'case-07-hijinx',
    'case-08-gecko',
    'case-09-underground',
    'case-10-bespoke',
    'proj_touring_v1',
    'proj_vangogh',
    'proj_f1_miami'
  ],
  includeImages: true,
  includeMetrics: true,
  includeTags: true
};

export const DEFAULT_MANAGED_ASSETS: ManagedAsset[] = [
  { filename: 'proposal.mp4', fileType: 'video', associatedProjectTitle: '01 // Spatial & Practical FX — The Xperience' },
  { filename: 'MVIMG_20220202_023036.jpg', fileType: 'image', associatedProjectTitle: '02 // Immersive Installation — Artechouse Magentaverse' },
  { filename: 'FB_IMG_1642078742431.jpg', fileType: 'image', associatedProjectTitle: '02 // Artechouse (Rigging)' },
  { filename: 'FB_IMG_1645751783221.jpg', fileType: 'image', associatedProjectTitle: '02 // Artechouse (Gallery)' },
  { filename: 'portal build.jpg', fileType: 'image', associatedProjectTitle: '03 // Kinetic Hardware — Story Portal' },
  { filename: 'portal upright.jpg', fileType: 'image', associatedProjectTitle: '03 // Story Portal (Rigging)' },
  { filename: '20251229_032858.mp4', fileType: 'video', associatedProjectTitle: '03 // Story Portal (Bench Test)' },
  { filename: '20250814_062511.mp4', fileType: 'video', associatedProjectTitle: '04 // Splats & Point Clouds (Flight)' },
  { filename: '20251212_214229.mp4', fileType: 'video', associatedProjectTitle: '04 // Splats & Point Clouds (Splat Ingest)' },
  { filename: '20250720_064924.mp4', fileType: 'video', associatedProjectTitle: '05 // Republic Club (AV Architecture)' },
  { filename: 'IMG_20250506_210434.jpg', fileType: 'image', associatedProjectTitle: '05 // Republic Club (Media Matrix)' },
  { filename: '20250822_230315.mp4', fileType: 'video', associatedProjectTitle: '05 // Republic Club (Live Drop)' },
  { filename: 'PXL_20231110_053549559.MP.jpg', fileType: 'image', associatedProjectTitle: '06 // Home Bass (Live Poolside Stage)' },
  { filename: 'PXL_20231007_201420456~2.jpg', fileType: 'image', associatedProjectTitle: '06 // Home Bass (CAD)' },
  { filename: 'PXL_20231012_150749153.jpg', fileType: 'image', associatedProjectTitle: '06 // Home Bass (Schedule)' },
  { filename: 'PXL_20231221_062201175.jpg', fileType: 'image', associatedProjectTitle: '07 // HiJinx (Live Stage)' },
  { filename: 'PXL_20231220_034827931.jpg', fileType: 'image', associatedProjectTitle: '07 // HiJinx (Wireframe)' },
  { filename: 'PXL_20231221_012509504.jpg', fileType: 'image', associatedProjectTitle: '07 // HiJinx (Plan)' },
  { filename: 'PXL_20240613_225455832.jpg', fileType: 'image', associatedProjectTitle: '08 // Gecko Robotics (Corporate Activation)' },
  { filename: 'Screenshot_20240513-232800.jpg', fileType: 'image', associatedProjectTitle: '08 // Gecko Robotics (Schematic)' },
  { filename: 'PXL_20240613_203421747.jpg', fileType: 'image', associatedProjectTitle: '08 // Gecko Robotics (Sub-frame)' },
  { filename: 'FB_IMG_1781974753842.jpg', fileType: 'image', associatedProjectTitle: '09 // Underground Rigs (Live Laser Grid)' },
  { filename: 'FB_IMG_1781974777064~2.jpg', fileType: 'image', associatedProjectTitle: '09 // Underground Rigs (Ternion Sound)' },
  { filename: 'FB_IMG_1781974819871.jpg', fileType: 'image', associatedProjectTitle: '09 // Underground Rigs (Buku)' },
  { filename: 'Wedding bar.jpg', fileType: 'image', associatedProjectTitle: '10 // Custom Fabrication (Modular Timber Bar)' },
  { filename: '127451-738829428.mp4', fileType: 'video', associatedProjectTitle: '10 // Custom Fabrication (Joinery)' }
];
