import React, { useState, useEffect } from 'react';

// ===========================================================================
// BRICE ANTHONY MORNEAU // MOBILE MULTI-SELECT & DRAG-AND-DROP PORTFOLIO (v9)
// Features live site/gallery link buttons on every project card!
// ===========================================================================

const INITIAL_PROJECTS = [
  {
    id: "republic-club",
    title: "Republic Club Pattaya",
    role: "Technical Director & Department Head",
    location: "Pattaya, Thailand // DJ Mag Top 100 #90",
    discipline: "AV Architecture",
    stack: ["Resolume Arena 7 & Alley (DXV3)", "Pangolin BEYOND FB4", "NovaStar CoEX/MX40 Pro", "DMX512/Art-Net", "3-Phase Power Distribution"],
    metrics: [
      { label: "SHOW DOWNTIME", val: "0% Unscheduled" },
      { label: "LED MATRIX", val: "44-Zone Display Architecture" },
      { label: "LIGHTING GRID", val: "150+ DMX Fixtures" },
      { label: "LASER ARRAY", val: "6x Pangolin FB4 RGB" }
    ],
    summary: "Challenge: Unify fragmented video walls, multi-axis kinetic drops, and laser networks into a zero-latency live instrument operated from a single FOH console. Solution: Architected a 44-zone display matrix driven by Resolume Arena 7 DXV3 servers and Pangolin FB4 lasers over sACN/Art-Net with 3-phase power distribution. Outcome: Delivered 60 FPS synced visual execution with 0% unscheduled show downtime across full nightly residency sets.",
    official_links: [
      { label: "Official Club Site & Gallery", url: "https://republic-nightclub.com/", badge: "Official Site" },
      { label: "EDM Addicts Profile & Top 100 Rank", url: "https://edm-addicts.com/club/republic-club-lounge", badge: "Press Feature" }
    ],
    assets: [
      { id: "asset-rep-feature", name: "Republic Club Pattaya Primary Feature", type: "video", isPrimary: true, url: "https://youtu.be/6GY_e4yeLXw?t=17" },
      { id: "asset-rep-4", name: "Republic Club Pattaya Floor Reel (2025-06-14)", type: "video", isPrimary: false, url: "/media/RepublicClub-FloorReel-20250614.mp4" },
      { id: "asset-rep-5", name: "Republic Club Pattaya Floor Reel (2025-04-02)", type: "video", isPrimary: false, url: "/media/RepublicClub-FloorReel-20250402.mp4" },
      { id: "asset-rep-3", name: "44-Zone LED Slice & Rig Matrix", type: "cad", isPrimary: false, url: "https://republic-nightclub.com/" }
    ]
  },
  {
    id: "van-gogh",
    title: "Immersive Van Gogh Exhibition",
    role: "Site Lead & Lead Systems Director",
    location: "Pittsburgh, PA",
    discipline: "360° Volumetric Projection Mapping",
    stack: ["64x Christie DLP Laser Engines", "Datapath FX4", "SMPTE LTC Timecode", "Pipe Grid Rigging", "Aerial Lift Operations"],
    metrics: [
      { label: "CANVAS FOOTPRINT", val: "32,000 sq ft" },
      { label: "PROJECTION ENGINES", val: "64x Christie DLP Laser" },
      { label: "TECHNICAL CREW", val: "32 Technicians Managed" },
      { label: "OPTICAL ALIGNMENT", val: "360° Edge-Blended" }
    ],
    summary: "Challenge: Turn a 32,000 sq ft industrial venue into one continuous 360° canvas without visible seams or timing drift. Solution: Directed a 32-technician deployment of 64 Christie DLP laser engines, Datapath FX4 distribution, optical throw alignment, pipe-grid rigging, and SMPTE LTC synchronization. Outcome: Commissioned a fully edge-blended 360° exhibition system across the complete 32,000 sq ft footprint.",
    official_links: [
      { label: "Lighthouse Immersive Exhibition Portal", url: "https://share.google/NIUcGsQwKLrxDyrW8", badge: "Exhibition Portal" }
    ],
    assets: [
      { id: "asset-vg-1", name: "VanGogh1-StarryNight.jpg (Edge-Blended Gallery)", type: "image", isPrimary: true, url: "/media/VanGogh1-StarryNight.jpg" },
      { id: "asset-vg-2", name: "VanGogh2-AlmondBlossoms.jpg (64-Projector Throw)", type: "image", isPrimary: false, url: "/media/VanGogh2-AlmondBlossoms.jpg" },
      { id: "asset-vg-3", name: "VanGogh3-Irises.webp (Reflective Floor Canvas)", type: "image", isPrimary: false, url: "/media/VanGogh3-Irises.webp" },
      { id: "asset-vg-4", name: "VanGogh4-PoemFloor.jpg (Interactive Gallery Room)", type: "image", isPrimary: false, url: "/media/VanGogh4-PoemFloor.jpg" },
      { id: "asset-vg-5", name: "64-Projector Optical Convergence Blueprint", type: "cad", isPrimary: false, url: "https://www.immersivevangogh.com/" }
    ]
  },
  {
    id: "thexperience",
    title: "TheXperience Botanical Night-Park",
    role: "Lead Projection & Lighting Concept Designer",
    location: "Koh Samui, Thailand",
    discipline: "Spatial Computing",
    stack: ["TouchDesigner GLSL Shaders", "3D Optical Throw Calculations", "DMX Pyrotechnics", "Sensor Networks", "Electric Chain Hoist Rigging"],
    metrics: [
      { label: "NIGHT PARK SPAN", val: "1.2 km Illuminated Path" },
      { label: "MAPPED SCULPTURES", val: "3x 3D Statues (Luna, Embrace, Ticha)" },
      { label: "INTERACTIVE MESH", val: "TouchDesigner Sensor Network" }
    ],
    summary: "Challenge: Connect monumental sculpture, a 1.2 km botanical route, and live flame effects into a coherent after-dark visitor journey. Solution: Designed optical projection studies for three Nathan Hooper statues and linked TouchDesigner sensor networks, lighting, hoist rigging, and DMX pyrotechnics. Outcome: Delivered responsive mapped landmarks and an interactive illuminated path spanning 1.2 km.",
    official_links: [
    ],
    assets: [
      { id: "asset-xp-1", name: "TheXperience2-night (Luna Statue)", type: "image", isPrimary: true, url: "/media/TheXperience2-night.jpg" },
      { id: "asset-xp-2", name: "TheXperience1-statue-Day", type: "image", isPrimary: false, url: "/media/TheXperience1-statue-Day.jpg" },
      { id: "asset-xp-3", name: "TheXperience3-led-forest", type: "image", isPrimary: false, url: "/media/TheXperience3-led-forest.jpg" },
      { id: "asset-xp-4", name: "TheXperience6-panoramic", type: "image", isPrimary: false, url: "/media/TheXperience6.jpg" }
    ]
  },
  {
    id: "story-portal",
    title: "Story Portal Steampunk Kinetic Stage",
    role: "Technical Director & Mechatronic Fabricator",
    location: "Miami, FL // Love Burn Virginia Key",
    discipline: "Kinetic Mechatronics",
    stack: ["Optical Rotary Encoders", "Microcontroller Relays", "DMX Flame Poofers", "Aluminum Box Trussing", "NEMA E-Stops"],
    metrics: [
      { label: "MECHANICAL WHEEL", val: "10-Foot Gear Reduction" },
      { label: "FLAME POOFERS", val: "4x DMX Timed Relays" }
    ],
    summary: "Challenge: Make a ten-foot kinetic stage mechanism safely respond to direct audience input while controlling live flame effects. Solution: Fabricated a gear-reduction wheel with optical rotary encoders, microcontroller relay logic, NEMA emergency stops, and DMX-timed flame poofers. Outcome: Translated physical rotation into repeatable four-channel flame sequences with deterministic positional feedback.",
    official_links: [
    ],
    assets: [
      { id: "asset-sp-1", name: "Stage1-Storyportal1-action (Flame Poofer)", type: "image", isPrimary: true, url: "/media/Stage1-Storyportal1-action.jpg" },
      { id: "asset-sp-2", name: "Stage2-Storyportal2-night", type: "image", isPrimary: false, url: "/media/Stage2-Storyportal2-night.jpg" },
      { id: "asset-sp-3", name: "Stage3-Storyportal3-design", type: "cad", isPrimary: false, url: "/media/Stage3-Storyportal3-design.jpg" }
    ]
  },
  {
    id: "artechouse",
    title: "Artechouse Miami (Magentaverse)",
    role: "Lead Scenic Carpenter & LED Technician",
    location: "Miami Beach, FL",
    discipline: "Spatial Computing",
    stack: ["TouchDesigner Generative Feeds", "Timber Wall Framing", "Concealed Wire Chases", "270° Projection"],
    metrics: [
      { label: "PROJECTION WRAP", val: "270° Panoramic Multi-Channel" },
      { label: "LED ARCHWAY", val: "Generative TouchDesigner Mesh" }
    ],
    summary: "Challenge: Integrate responsive LED media into an architectural tunnel without exposing structure, cabling, or service paths. Solution: Built structural timber framing and concealed wire chases for a generative TouchDesigner LED mesh alongside a 270° multi-channel projection environment. Outcome: Delivered a clean, visitor-ready responsive archway with all distribution and maintenance access hidden from view.",
    official_links: [
      { label: "ARTECHOUSE Official Exhibition Archive", url: "https://www.artechouse.com/program/magentaverse-miami/", badge: "Exhibition Archive" }
    ],
    assets: [
      { id: "asset-art-1", name: "ARTECHOUSE Magentaverse 60 FPS Teaser", type: "video", isPrimary: true, url: "/media/artechouse-magentaverse-teaser-mobile-h265.mp4", poster: "/media/tunnel.jpg" },
      { id: "asset-art-2", name: "Artechouse2-anything.jpg (Timber Framing)", type: "image", isPrimary: false, url: "/media/Artechouse2-anything.jpg" },
      { id: "asset-art-3", name: "artechouse3-crt.jpeg (CRT Array Stack)", type: "image", isPrimary: false, url: "/media/artechouse3-crt.jpg" }
    ]
  },
  {
    id: "homebass-hijinx",
    title: "Home Bass & HiJinx Festival Stages",
    role: "Lead Staging Designer & Volumetric CAD Specialist",
    location: "Orlando, FL / Philadelphia, PA",
    discipline: "AV Architecture",
    stack: ["Vectorworks Spotlight 3D Pre-Vis", "ChamSys MagicQ", "Resolume Arena 7", "Aluminum Box Trussing", "3-Phase Power"],
    metrics: [
      { label: "STAGE GEOMETRY", val: "270° LED Screen Wrap" },
      { label: "STRUCTURAL CLEARANCE", val: "Column Wrap Pre-Vis" }
    ],
    summary: "Challenge: Fit immersive festival stages around fixed warehouse columns while preserving sightlines, rigging clearance, and a continuous LED canvas. Solution: Developed Vectorworks Spotlight 3D pre-vis for 270° screen wraps, aluminum truss distribution, ChamSys control, and 3-phase power placement. Outcome: Issued build-ready geometry that resolved structural conflicts before load-in and maintained the intended panoramic audience view.",
    official_links: [
    ],
    assets: [
      { id: "asset-hb-1", name: "Stage5-Homebass2-night (270° Stage)", type: "image", isPrimary: true, url: "/media/Stage5-Homebass2-night.jpg" },
      { id: "asset-hb-2", name: "Stage6-HiJinx1-render (Vectorworks Column Wrap)", type: "cad", isPrimary: false, url: "/media/Stage6-HiJinx1-render.jpg" }
    ]
  },
  {
    id: "gaussian-splatting",
    title: "Real-Time Gaussian Splatting & GPU Visuals",
    role: "GPU Visuals Developer & Creative Technologist",
    location: "R&D / Concert Visuals",
    discipline: "Spatial Computing",
    stack: ["TouchDesigner GLSL Compute Shaders", "LiDAR Point Clouds", "Pangolin BEYOND FB4", "Aether Nano Controller"],
    metrics: [
      { label: "GPU FRAME RATE", val: "60 FPS Locked GLSL" },
      { label: "POINT CLOUD DISPLACEMENT", val: "Real-Time LiDAR Engine" }
    ],
    summary: "Challenge: Render dense LiDAR point clouds as an expressive, audio-reactive concert instrument without sacrificing frame rate. Solution: Developed TouchDesigner GLSL compute pipelines for Gaussian splat displacement with Pangolin FB4 and custom Aether controller integration. Outcome: Sustained 60 FPS real-time spatial visuals with performance-ready parameter control.",
    official_links: [
    ],
    assets: [
      { id: "asset-gs-1", name: "Gaussian Splat Point Cloud Capture", type: "video", isPrimary: true, url: "/media/GaussianSplats1-Pointcloud.mp4" },
      { id: "asset-gs-2", name: "GPU Visuals Capture (2025-12-12)", type: "video", isPrimary: false, url: "/media/GaussianSplats2-Capture-20251212.mp4" },
      { id: "asset-gs-3", name: "Digital Feedback Loop Visuals", type: "video", isPrimary: false, url: "/media/GaussianSplats3-DigitalFeedback.mp4" },
      { id: "asset-gs-4", name: "Gaussian Splat GPU Visuals Capture", type: "video", isPrimary: false, url: "/media/GaussianSplats4-Capture.mp4" }
    ]
  },
  {
    id: "underground-stage",
    title: "Underground Stage Design",
    role: "Laser Systems Designer & Live Visual Operator",
    location: "Warehouse / Underground Venue",
    discipline: "AV Architecture",
    stack: ["Pangolin BEYOND FB4", "Multi-Plane Laser Slicing", "Warehouse Beam Rigging", "Monochromatic Visual Programming"],
    metrics: [
      { label: "LASER ARRAY", val: "Multi-Plane FB4 Network" },
      { label: "PROGRAM FORMAT", val: "Live Headline Set Busking" }
    ],
    summary: "Challenge: Give a bare warehouse floor a cohesive laser-and-visual identity for back-to-back headline sets without a fixed rig plan. Solution: Deployed a Pangolin FB4 multi-plane laser network with monochromatic visual programming and overhead beam sweeps, adapted set-to-set for acts including a Buku headline slot and a Ternion Sound show. Outcome: Delivered a repeatable warehouse rig capable of fast turnarounds between distinct live visual programs.",
    official_links: [
    ],
    assets: [
      { id: "asset-us-1", name: "Underground3 (FB4 Laser Geometry)", type: "image", isPrimary: true, url: "/media/Underground3.jpg" },
      { id: "asset-us-2", name: "Underground1 (Warehouse Overhead Beam Sweep)", type: "image", isPrimary: false, url: "/media/Underground1.jpg" },
      { id: "asset-us-3", name: "Underground2 (Multi-Plane Laser Slicing)", type: "image", isPrimary: false, url: "/media/Underground2.jpg" },
      { id: "asset-us-4", name: "Underground5 (Ternion Sound Set)", type: "image", isPrimary: false, url: "/media/Underground5.jpg" },
      { id: "asset-us-5", name: "Underground6 (Buku Headline Set Busking)", type: "image", isPrimary: false, url: "/media/Underground6.jpg" }
    ]
  },
  {
    id: "bespoke-builds",
    title: "Bespoke Client Builds & Hospitality Staging",
    role: "Lead Carpenter & Systems Fabricator",
    location: "Custom Client Deployments",
    discipline: "Kinetic Mechatronics",
    stack: ["Modular Timber Joinery", "Concealed Power Distribution", "Sound-Reactive Projection", "Radial LED Rigging"],
    metrics: [
      { label: "TIMBER JOINERY", val: "Pergola Free-Standing Bar" },
      { label: "MURAL PROJECTION", val: "Sound-Reactive Mapping" }
    ],
    summary: "Challenge: Deliver hospitality environments that combine custom scenic character with touring-grade power, lighting, and media integration. Solution: Fabricated modular timber joinery, free-standing pergola bars, concealed distribution, radial LED rigging, and sound-reactive projection systems. Outcome: Produced reusable, serviceable client builds that arrived show-ready while keeping power and signal infrastructure out of sight.",
    official_links: [
    ],
    assets: [
      { id: "asset-bb-0", name: "Set Design Build Reel", type: "video", isPrimary: true, url: "/media/Setdesign1-hero.mp4", poster: "/media/Setdesign5-Wedding-bar.jpg" },
      { id: "asset-bb-1", name: "Setdesign5-Wedding bar.jpg", type: "image", isPrimary: false, url: "/media/Setdesign5-Wedding-bar.jpg" },
      { id: "asset-bb-2", name: "Setdesign3-portal build.jpg (Radial LED Rig)", type: "image", isPrimary: false, url: "/media/Setdesign3-portal-build.jpg" },
      { id: "asset-bb-3", name: "Setdesign2-Mural-flat", type: "image", isPrimary: false, url: "/media/Setdesign2-Mural-flat.jpg" }
    ]
  }
];

const UNASSIGNED_POOL = [
  { id: "pool-1", name: "Underground4 (Warehouse Beam Sweep)", type: "image", url: "/media/Underground4.jpg" },
  { id: "pool-2", name: "Resume-TD.docx (Technical Director Spec)", type: "document", url: "Word Asset" },
  { id: "pool-3", name: "Resume-Creative.docx (Creative Technologist Spec)", type: "document", url: "Word Asset" },
  { id: "pool-4", name: "LONGBOAT - UFDC Image Array 2", type: "pdf", url: "PDF Asset" }
];

const CORE_SERVICES = [
  {
    index: "01",
    title: "AV Systems Architecture & FOH Direction",
    detail: "Multi-display matrix routing (44+ zones), NovaStar CoEX/MX40 Pro processing, Resolume Arena 7 DXV3 server clusters, and 3-phase power distribution (100A–400A)."
  },
  {
    index: "02",
    title: "360° Volumetric Projection Mapping",
    detail: "Multi-projector edge blending (up to 64 laser engines), optical throw calculations, Datapath FX4 video wall distribution, and zero-drift corner pinning across large-scale canvases (32,000+ sq ft)."
  },
  {
    index: "03",
    title: "Spatial Computing & Real-Time GPU Visuals",
    detail: "TouchDesigner GLSL compute shaders, LiDAR point cloud particle displacement, 60 FPS real-time audio/visual reactivity, and custom Aether controller integrations."
  },
  {
    index: "04",
    title: "Kinetic Mechatronics & Laser Operations",
    detail: "Pangolin BEYOND FB4 laser networks under FDA/CDRH variance (LSO certified), multi-axis DMX positional winches, optical rotary encoders, and aluminum box trussing / electric chain hoist rigging."
  }
];

const BENCH_CAPABILITIES = [
  "SMD 0603/0805 rework and PCB trace reconstruction",
  "17 SMPS power-supply rebuilds",
  "UART / EEPROM receiving-card recovery"
];

const ACTIVE_PROTOCOLS = [
  "Resolume Arena 7 & Alley DXV3",
  "TouchDesigner GLSL",
  "Pangolin BEYOND FB4",
  "Vectorworks Spotlight 3D pre-vis",
  "NovaStar CoEX/MX40 Pro",
  "ChamSys MagicQ",
  "DMX512/Art-Net/sACN/SMPTE LTC"
];

const CONTACT_PILL = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '999px',
  padding: '9px 15px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#e2e8f0',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

const FIELD = {
  backgroundColor: '#0a0f1a',
  border: '1px solid #334155',
  borderRadius: '8px',
  padding: '11px 13px',
  fontSize: '13px',
  color: '#f8fafc',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
};

const isLocalImage = (url) => typeof url === 'string' && url.startsWith('/media/') && /\.(avif|gif|jpe?g|png|webp)$/i.test(url);
const isLocalVideo = (url) => typeof url === 'string' && url.startsWith('/media/') && /\.(mp4|webm)$/i.test(url);
const getYouTubeData = (url) => {
  if (typeof url !== 'string' || !/(youtu\.be|youtube\.com)/.test(url)) return null;
  try {
    const parsed = new URL(url);
    const id = parsed.hostname.includes('youtu.be') ? parsed.pathname.slice(1) : parsed.searchParams.get('v');
    const rawStart = parsed.searchParams.get('t') || parsed.searchParams.get('start') || '0';
    const start = /^\d+$/.test(rawStart) ? rawStart : '0';
    return id ? { id, start } : null;
  } catch {
    return null;
  }
};
const splitNarrative = (summary) => {
  const match = summary.match(/^Challenge:\s*(.*?)\s*Solution:\s*(.*?)\s*Outcome:\s*(.*)$/);
  return match ? [{ label: 'Challenge', text: match[1] }, { label: 'Systems Solution', text: match[2] }, { label: 'Measured Outcome', text: match[3] }] : [{ label: 'Project Brief', text: summary }];
};
const referenceBadge = (badge = '') => {
  if (/broadcast/i.test(badge)) return 'Broadcast Feature';
  if (/press|design/i.test(badge)) return 'Press Profile';
  if (/city|guide/i.test(badge)) return 'City Guide';
  if (/official|portal|exhibition/i.test(badge)) return 'Official Venue';
  return badge;
};

function InteractiveGalleryModal({ project, activeIndex, onSelect, onClose }) {
  const assets = project?.assets || [];
  const asset = assets[activeIndex];
  const youtube = getYouTubeData(asset?.url);
  const selectOffset = (offset) => onSelect((activeIndex + offset + assets.length) % assets.length);

  useEffect(() => {
    if (!project) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') selectOffset(-1);
      if (event.key === 'ArrowRight') selectOffset(1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [project, activeIndex]);

  if (!project || !asset) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={`${project.title} interactive gallery`} onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'grid', gridTemplateRows: 'auto minmax(0, 1fr) auto', backgroundColor: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(18px)', color: '#f8fafc', padding: 'clamp(12px, 2vw, 24px)' }}>
      <header onClick={(e) => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', paddingBottom: '12px' }}>
        <div><div style={{ color: '#38bdf8', fontSize: '10px', fontWeight: 900, letterSpacing: '.14em' }}>INTERACTIVE GALLERY / {activeIndex + 1} OF {assets.length}</div><h2 style={{ margin: '4px 0 0', fontSize: 'clamp(17px, 2vw, 26px)' }}>{project.title} — {asset.name}</h2></div>
        <button type="button" onClick={onClose} aria-label="Close gallery" style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid #475569', background: 'rgba(15,23,42,.8)', color: '#fff', fontSize: '22px', cursor: 'pointer' }}>×</button>
      </header>
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', minHeight: 0, display: 'grid', placeItems: 'center' }}>
        {youtube ? <iframe src={`https://www.youtube-nocookie.com/embed/${youtube.id}?start=${youtube.start}&rel=0&autoplay=1`} title={asset.name} allow="autoplay; encrypted-media; picture-in-picture; web-share" allowFullScreen style={{ width: 'min(1180px, 100%)', height: 'min(66vw, 72vh)', border: 0, borderRadius: '10px', backgroundColor: '#020617' }} /> : isLocalVideo(asset.url) ? <video key={asset.url} src={asset.url} poster={asset.poster} controls autoPlay playsInline style={{ maxWidth: '100%', maxHeight: '72vh', borderRadius: '10px', backgroundColor: '#020617' }} /> : isLocalImage(asset.url) ? <img src={asset.url} alt={asset.name} style={{ maxWidth: '100%', maxHeight: '72vh', objectFit: 'contain', borderRadius: '8px' }} /> : <a href={asset.url} target="_blank" rel="noopener noreferrer" style={{ color: '#7dd3fc', border: '1px solid #0ea5e9', padding: '16px 22px', borderRadius: '999px', textDecoration: 'none' }}>Open {asset.name} ↗</a>}
        {assets.length > 1 && <><button type="button" onClick={() => selectOffset(-1)} aria-label="Previous asset" style={{ position: 'absolute', left: 0, width: '44px', height: '58px', border: '1px solid #475569', borderRadius: '8px', background: 'rgba(15,23,42,.82)', color: '#fff', cursor: 'pointer' }}>◀</button><button type="button" onClick={() => selectOffset(1)} aria-label="Next asset" style={{ position: 'absolute', right: 0, width: '44px', height: '58px', border: '1px solid #475569', borderRadius: '8px', background: 'rgba(15,23,42,.82)', color: '#fff', cursor: 'pointer' }}>▶</button></>}
      </div>
      <nav onClick={(e) => e.stopPropagation()} aria-label="Gallery thumbnails" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingTop: '14px', justifyContent: assets.length < 6 ? 'center' : 'flex-start' }}>
        {assets.map((item, index) => { const itemYoutube = getYouTubeData(item.url); return <button key={item.id} type="button" onClick={() => onSelect(index)} aria-label={`View ${item.name}`} style={{ flex: '0 0 104px', height: '68px', padding: 0, overflow: 'hidden', borderRadius: '6px', border: index === activeIndex ? '2px solid #38bdf8' : '1px solid #334155', background: '#0f172a', color: '#cbd5e1', cursor: 'pointer' }}>{itemYoutube ? <img src={`https://i.ytimg.com/vi/${itemYoutube.id}/mqdefault.jpg`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (isLocalImage(item.url) || item.poster) ? <img src={isLocalImage(item.url) ? item.url : item.poster} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '9px', padding: '5px', display: 'block' }}>{item.name}</span>}</button>; })}
      </nav>
    </div>
  );
}

export default function MobileMultiSelectPortfolio() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [unassigned, setUnassigned] = useState(UNASSIGNED_POOL);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAvailable, setIsAdminAvailable] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [targetProjectSelect, setTargetProjectSelect] = useState(projects[0].id);
  const [gallery, setGallery] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('admin=true')) {
      setIsAdminAvailable(true);
      setIsAdminOpen(true);
    }
  }, []);

  // Netlify Forms accepts a urlencoded POST to any path on the site; the
  // form-name field routes it to the form declared in index.html.
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const data = new FormData(e.target);
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      setSent(true);
    } catch (err) {
      setError(`${err.message}. You can also reach me through the CV link above.`);
    } finally {
      setSending(false);
    }
  };

  const filteredProjects = activeFilter === "ALL" 
    ? projects 
    : projects.filter(p => p.discipline === activeFilter);

  const toggleSelectAsset = (asset, sourceProjectId = null) => {
    setSelectedItems(prev => {
      const exists = prev.some(item => item.asset.id === asset.id);
      if (exists) {
        return prev.filter(item => item.asset.id !== asset.id);
      } else {
        return [...prev, { asset, sourceProjectId }];
      }
    });
  };

  const isSelected = (assetId) => selectedItems.some(item => item.asset.id === assetId);

  const clearSelection = () => setSelectedItems([]);

  const moveSelectedToProject = (targetProjectId) => {
    if (selectedItems.length === 0) return;

    let newUnassigned = [...unassigned];
    let newProjects = projects.map(p => ({ ...p, assets: [...p.assets] }));

    selectedItems.forEach(({ asset, sourceProjectId }) => {
      if (sourceProjectId === targetProjectId) return;

      if (sourceProjectId === null) {
        newUnassigned = newUnassigned.filter(a => a.id !== asset.id);
      } else {
        newProjects = newProjects.map(p => {
          if (p.id === sourceProjectId) {
            return { ...p, assets: p.assets.filter(a => a.id !== asset.id) };
          }
          return p;
        });
      }

      newProjects = newProjects.map(p => {
        if (p.id === targetProjectId) {
          const hasPrimary = p.assets.some(a => a.isPrimary);
          return {
            ...p,
            assets: [...p.assets, { ...asset, isPrimary: !hasPrimary }]
          };
        }
        return p;
      });
    });

    setUnassigned(newUnassigned);
    setProjects(newProjects);
    setSelectedItems([]);
  };

  const handleDragStartSelected = (e, primaryAsset, sourceProjectId) => {
    let itemsToDrag = selectedItems;
    if (!isSelected(primaryAsset.id)) {
      itemsToDrag = [{ asset: primaryAsset, sourceProjectId }];
      setSelectedItems(itemsToDrag);
    }
    e.dataTransfer.setData("text/plain", JSON.stringify(itemsToDrag));
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDropOnProject = (e, targetProjectId) => {
    e.preventDefault();
    moveSelectedToProject(targetProjectId);
  };

  const handleUnassignSelected = () => {
    if (selectedItems.length === 0) return;

    let newProjects = projects.map(p => ({ ...p, assets: [...p.assets] }));
    let newUnassigned = [...unassigned];

    selectedItems.forEach(({ asset, sourceProjectId }) => {
      if (sourceProjectId !== null) {
        newProjects = newProjects.map(p => {
          if (p.id === sourceProjectId) {
            return { ...p, assets: p.assets.filter(a => a.id !== asset.id) };
          }
          return p;
        });
        if (!newUnassigned.some(a => a.id === asset.id)) {
          newUnassigned.push({ ...asset, isPrimary: false });
        }
      }
    });

    setProjects(newProjects);
    setUnassigned(newUnassigned);
    setSelectedItems([]);
  };

  return (
    <div style={{
      backgroundColor: '#090d16',
      color: '#e2e8f0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      paddingBottom: '100px'
    }}>
      <InteractiveGalleryModal
        project={gallery ? projects.find(project => project.id === gallery.projectId) : null}
        activeIndex={gallery?.index || 0}
        onSelect={(index) => setGallery(current => current ? { ...current, index } : null)}
        onClose={() => setGallery(null)}
      />
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(10, 13, 18, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #1e293b',
        padding: '12px 16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, margin: 0, letterSpacing: '0.05em', color: '#f8fafc' }}>
              PRIMORDIAL VIDEO
            </h1>
            <p style={{ fontSize: '12px', margin: 0, color: '#38bdf8', fontWeight: 600 }}>
              Technical Direction & Systems Architecture
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <a
              href="/Brice-Morneau-CV.pdf"
              download
              style={{ backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              ↓ Download CV
            </a>
            <a
              href="#contact"
              style={{ backgroundColor: '#0284c7', color: '#ffffff', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              Get in touch
            </a>
          </div>

          {isAdminAvailable && (
            <button
              onClick={() => setIsAdminOpen(!isAdminOpen)}
              style={{
                backgroundColor: isAdminOpen ? '#ef4444' : '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
            >
              <span>{isAdminOpen ? '✕ CLOSE EDITOR' : '⚙️ SHORT-PRESS SORT'}</span>
            </button>
          )}
        </div>

        {!isAdminOpen && (
          <div style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingTop: '12px',
            paddingBottom: '4px',
            WebkitOverflowScrolling: 'touch'
          }}>
            {["ALL", "AV Architecture", "360° Volumetric Projection Mapping", "Spatial Computing", "Kinetic Mechatronics"].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  backgroundColor: activeFilter === filter ? '#38bdf8' : '#1e293b',
                  color: activeFilter === filter ? '#0f172a' : '#94a3b8',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '11px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </header>

      {isAdminOpen && selectedItems.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '500px',
          zIndex: 200,
          backgroundColor: '#0284c7',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
          border: '2px solid #38bdf8',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 900 }}>
              ✓ {selectedItems.length} ITEM{selectedItems.length > 1 ? 'S' : ''} SELECTED (Short-Press)
            </span>
            <button
              onClick={clearSelection}
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
            >
              CLEAR
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              value={targetProjectSelect}
              onChange={(e) => setTargetProjectSelect(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: '#0f172a',
                color: '#fff',
                border: '1px solid #38bdf8',
                borderRadius: '6px',
                padding: '8px',
                fontSize: '12px'
              }}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>Assign to: {p.title}</option>
              ))}
            </select>
            <button
              onClick={() => moveSelectedToProject(targetProjectSelect)}
              style={{
                backgroundColor: '#22c55e',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              MOVE HERE
            </button>
            <button
              onClick={handleUnassignSelected}
              style={{
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 10px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              UNASSIGN
            </button>
          </div>
        </div>
      )}

      <main style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1500px', margin: '0 auto' }}>
        <section aria-labelledby="hero-title" style={{ border: '1px solid #334155', background: 'linear-gradient(135deg, #111827 0%, #071018 68%, #14202a 100%)', overflow: 'hidden', borderRadius: '12px' }}>
          <div style={{ padding: 'clamp(24px, 5vw, 72px)', borderBottom: '1px solid #334155' }}>
            <p style={{ margin: '0 0 12px', color: '#38bdf8', fontSize: '11px', fontWeight: 900, letterSpacing: '0.18em' }}>BRICE ANTHONY MORNEAU / STUDIO PRACTICE</p>
            <h1 id="hero-title" style={{ margin: 0, maxWidth: '1100px', color: '#f8fafc', fontSize: 'clamp(34px, 7vw, 92px)', lineHeight: 0.94, letterSpacing: '-0.055em' }}>
              Primordial Video <span style={{ color: '#38bdf8' }}>//</span> Technical Direction &amp; Systems Architecture
            </h1>
          </div>
          <div aria-label="Availability and location" style={{ padding: '12px 18px', color: '#cbd5e1', backgroundColor: '#0a0d12', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 'clamp(10px, 1.5vw, 13px)', lineHeight: 1.6, borderBottom: '1px solid #334155' }}>
            [ Studio: Primordial Video | Base: Pittsburgh (PIT) / Pattaya | Range: Global Touring &amp; Residencies | Status: <strong style={{ color: '#86efac' }}>Available for Technical Direction</strong> ]
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', backgroundColor: '#05080c' }}>
            <div style={{ position: 'relative', minHeight: 'clamp(280px, 50vw, 620px)', borderRight: '1px solid #334155', overflow: 'hidden' }}>
              <iframe
                src="https://www.youtube-nocookie.com/embed/6GY_e4yeLXw?start=17&rel=0&modestbranding=1"
                title="Republic Club Pattaya primary video feature, starting at 17 seconds"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="eager"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
            <div style={{ position: 'relative', minHeight: 'clamp(280px, 50vw, 620px)', overflow: 'hidden' }}>
              <video autoPlay muted loop playsInline preload="metadata" poster="/media/tunnel.jpg" aria-label="ARTECHOUSE Magentaverse responsive LED tunnel showreel" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.78 }}>
                <source src="/media/artechouse-magentaverse-teaser-mobile-h265.mp4" type="video/mp4" />
              </video>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 35%, rgba(5,8,12,.94) 100%)' }} />
              <div style={{ position: 'absolute', left: 'clamp(18px, 4vw, 48px)', right: 'clamp(18px, 4vw, 48px)', bottom: 'clamp(18px, 4vw, 42px)' }}>
                <span style={{ color: '#38bdf8', fontSize: '10px', fontWeight: 900, letterSpacing: '.16em' }}>HERO SHOWREEL / RESPONSIVE MEDIA</span>
                <h2 style={{ color: '#fff', margin: '8px 0 5px', fontSize: 'clamp(22px, 3vw, 42px)' }}>ARTECHOUSE LED Tunnel</h2>
                <p style={{ color: '#cbd5e1', margin: 0, fontSize: '13px' }}>TouchDesigner-driven architectural LED mesh / production H.265 + WebM loops</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="services-title" style={{ borderTop: '1px solid #334155', borderBottom: '1px solid #334155', padding: '28px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: '16px', marginBottom: '18px' }}>
            <div>
              <p style={{ color: '#38bdf8', margin: '0 0 5px', fontSize: '10px', fontWeight: 900, letterSpacing: '.16em' }}>ENGAGEMENT MENU / 01—04</p>
              <h2 id="services-title" style={{ color: '#f8fafc', margin: 0, fontSize: 'clamp(24px, 4vw, 46px)' }}>Core Services &amp; Capabilities</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', borderTop: '1px solid #334155', borderLeft: '1px solid #334155' }}>
            {CORE_SERVICES.map(service => (
              <article key={service.index} style={{ padding: '24px 20px', borderRight: '1px solid #334155', borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
                <span style={{ color: '#38bdf8', fontFamily: 'ui-monospace, monospace', fontSize: '11px' }}>{service.index}</span>
                <h3 style={{ color: '#f8fafc', margin: '22px 0 10px', fontSize: '17px', lineHeight: 1.25 }}>{service.title}</h3>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '12px', lineHeight: 1.65 }}>{service.detail}</p>
              </article>
            ))}
          </div>
          <div style={{ marginTop: '12px', padding: '15px 18px', backgroundColor: '#161f2e', borderLeft: '3px solid #eab308' }}>
            <strong style={{ color: '#f8fafc', fontSize: '12px' }}>COMPONENT-LEVEL FIELD BENCH:</strong>{' '}
            <span style={{ color: '#cbd5e1', fontSize: '12px' }}>{BENCH_CAPABILITIES.join(' · ')}</span>
          </div>
          <div aria-label="Active software and control protocols" style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginTop: '12px' }}>
            {ACTIVE_PROTOCOLS.map(protocol => (
              <span key={protocol} style={{ backgroundColor: '#062e46', color: '#bae6fd', border: '1px solid #075985', fontSize: '10px', fontWeight: 800, padding: '6px 9px', borderRadius: '4px' }}>{protocol}</span>
            ))}
          </div>
        </section>

        <section aria-labelledby="case-studies-title">
          <p style={{ color: '#38bdf8', margin: '0 0 5px', fontSize: '10px', fontWeight: 900, letterSpacing: '.16em' }}>PROBLEM / ARCHITECTURE / TELEMETRY</p>
          <h2 id="case-studies-title" style={{ color: '#f8fafc', margin: 0, fontSize: 'clamp(24px, 4vw, 46px)' }}>Core Case Studies</h2>
        </section>
        {filteredProjects.map(project => (
          <article
            key={project.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropOnProject(e, project.id)}
            style={{
              backgroundColor: '#0f172a',
              border: isAdminOpen ? '2px dashed #0284c7' : '1px solid #1e293b',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {project.discipline}
              </span>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
                {project.title}
              </h2>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>
                {project.role}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                📍 {project.location}
              </div>
            </div>

            {(() => {
              const hero = project.assets.find(a => a.isPrimary && (isLocalImage(a.url) || isLocalVideo(a.url)));
              return hero && isLocalVideo(hero.url) ? (
                <video
                  src={hero.url}
                  poster={hero.poster}
                  muted loop autoPlay playsInline preload="metadata"
                  aria-label={hero.name}
                  onClick={() => setGallery({ projectId: project.id, index: project.assets.indexOf(hero) })}
                  style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: '6px', border: '1px solid #334155', marginBottom: '14px', display: 'block', cursor: 'zoom-in' }}
                />
              ) : hero ? (
                <img
                  src={hero.url}
                  alt={hero.name}
                  loading="lazy"
                  onClick={() => setGallery({ projectId: project.id, index: project.assets.indexOf(hero) })}
                  style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: '6px', border: '1px solid #334155', marginBottom: '14px', display: 'block', cursor: 'zoom-in' }}
                />
              ) : null;
            })()}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '8px',
              marginBottom: '14px'
            }}>
              {project.metrics.map((m, idx) => (
                <div key={idx} style={{ backgroundColor: '#1e293b', borderLeft: '3px solid #38bdf8', padding: '8px 10px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 800, marginTop: '2px' }}>
                    {m.val}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1px', backgroundColor: '#334155', border: '1px solid #334155', marginBottom: '14px' }}>
              {splitNarrative(project.summary).map((part, index) => (
                <div key={part.label} style={{ backgroundColor: '#0b1220', padding: '14px' }}>
                  <div style={{ color: index === 2 ? '#86efac' : '#38bdf8', fontSize: '9px', fontWeight: 900, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '7px' }}>{part.label}</div>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>{part.text}</p>
                </div>
              ))}
            </div>

            {/* OFFICIAL GALLERY & LIVE SITE LINKS */}
            {project.official_links && project.official_links.length > 0 && (
              <div style={{ marginBottom: '16px', backgroundColor: 'rgba(30, 41, 59, .46)', backdropFilter: 'blur(12px)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(100, 116, 139, .45)' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>VERIFIED REFERENCES &amp; LIVE PORTALS</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {project.official_links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: 'rgba(2, 6, 23, .62)',
                        color: '#bae6fd',
                        border: '1px solid rgba(14, 165, 233, .5)',
                        borderRadius: '999px',
                        padding: '7px 11px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ backgroundColor: '#0284c7', color: '#ffffff', fontSize: '9px', fontWeight: 900, padding: '2px 5px', borderRadius: '4px', textTransform: 'uppercase' }}>
                        {referenceBadge(link.badge)}
                      </span>
                      <span>{link.label} ↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
              {project.stack.map((tech, idx) => (
                <span key={idx} style={{ backgroundColor: '#0369a1', color: '#e0f2fe', fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px' }}>
                  {tech}
                </span>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
                ASSIGNED MEDIA ASSETS ({project.assets.length})
              </div>

              {project.assets.length === 0 ? (
                <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', padding: '8px', backgroundColor: '#1e293b', borderRadius: '4px' }}>
                  No media assigned yet. Short-press select or drag items here.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {project.assets.map(asset => {
                    const selected = isSelected(asset.id);
                    const youtube = getYouTubeData(asset.url);
                    const assetIndex = project.assets.indexOf(asset);
                    return (
                      <div
                        key={asset.id}
                        draggable={isAdminOpen}
                        onDragStart={(e) => handleDragStartSelected(e, asset, project.id)}
                        onClick={() => isAdminOpen ? toggleSelectAsset(asset, project.id) : setGallery({ projectId: project.id, index: assetIndex })}
                        style={{
                          backgroundColor: selected ? '#0284c7' : '#0f172a',
                          border: selected ? '2px solid #38bdf8' : '1px solid #334155',
                          borderRadius: '6px',
                          padding: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          cursor: isAdminOpen ? 'pointer' : 'zoom-in'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                          {youtube && (
                            <img
                              src={`https://i.ytimg.com/vi/${youtube.id}/mqdefault.jpg`}
                              alt=""
                              loading="lazy"
                              style={{ width: '72px', height: '54px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #334155', flexShrink: 0 }}
                            />
                          )}
                          {isLocalImage(asset.url) && (
                            <img
                              src={asset.url}
                              alt={asset.name}
                              loading="lazy"
                              style={{ width: '72px', height: '54px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #334155', flexShrink: 0 }}
                            />
                          )}
                          {isLocalVideo(asset.url) && (
                            <video
                              src={asset.url}
                              poster={asset.poster}
                              muted playsInline preload="metadata"
                              aria-label={asset.name}
                              style={{ width: '72px', height: '54px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #334155', flexShrink: 0 }}
                            />
                          )}
                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {selected && (
                                <span style={{ backgroundColor: '#22c55e', color: '#fff', fontSize: '10px', fontWeight: 900, borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  ✓
                                </span>
                              )}
                              <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>
                                {asset.name}
                              </span>
                            </div>
                            <div style={{ fontSize: '10px', color: selected ? '#e0f2fe' : '#64748b', marginTop: '2px' }}>
                              Source: {asset.url}
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </article>
        ))}

        <section
          id="contact"
          style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px', marginTop: '8px' }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>
            Let's build something
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 4px', lineHeight: 1.5 }}>
            Available for technical direction, systems design, projection mapping and install work.
          </p>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px' }}>
            📍 Pittsburgh, PA, USA &nbsp;·&nbsp; Available for travel
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            <a
              href="mailto:Brice@primordial.video"
              style={CONTACT_PILL}
            >
              ✉︎ Brice@primordial.video
            </a>
            <a
              href="tel:+14123767138"
              style={CONTACT_PILL}
            >
              ☎ (412) 376-7138
            </a>
          </div>

          {sent ? (
            <div style={{ backgroundColor: '#052e16', border: '1px solid #16a34a', borderRadius: '8px', padding: '16px', color: '#bbf7d0', fontSize: '13px' }}>
              Thanks — your message is through. I'll get back to you shortly.
            </div>
          ) : (
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={handleContactSubmit}
              style={{ display: 'grid', gap: '10px', maxWidth: '560px' }}
            >
              <input type="hidden" name="form-name" value="contact" />
              <p style={{ display: 'none' }}>
                <label>Leave this empty: <input name="bot-field" /></label>
              </p>
              <input
                name="name" type="text" required placeholder="Your name"
                style={FIELD}
              />
              <input
                name="email" type="email" required placeholder="Email"
                style={FIELD}
              />
              <textarea
                name="message" rows={4} required placeholder="What are you building?"
                style={{ ...FIELD, resize: 'vertical' }}
              />
              <button
                type="submit" disabled={sending}
                style={{ backgroundColor: sending ? '#334155' : '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 18px', fontSize: '14px', fontWeight: 700, cursor: sending ? 'default' : 'pointer', justifySelf: 'start' }}
              >
                {sending ? 'Sending…' : 'Send message'}
              </button>
              {error && (
                <div style={{ color: '#fca5a5', fontSize: '12px' }}>{error}</div>
              )}
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
