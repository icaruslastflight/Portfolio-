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
    summary: "Directed FOH lighting, laser systems, and media server architecture. Managed multi-axis kinetic ceiling hoists and locked 60 FPS DXV3 playback across 44 LED zones.",
    official_links: [
      { label: "Official Club Site & Gallery", url: "https://republic-nightclub.com/", badge: "Official Site" },
      { label: "EDM Addicts Profile & Top 100 Rank", url: "https://edm-addicts.com/club/republic-club-lounge", badge: "Press Feature" },
      { label: "Go To Pattaya Venue Guide", url: "https://www.gotopattaya.com/en/venues/republic-club-pattaya", badge: "City Guide" },
      { label: "Wanderlog Review & Party Profile", url: "https://wanderlog.com/place/details/1819232/republic-club-pattaya", badge: "Venue Review" }
    ],
    assets: [
      { id: "asset-rep-1", name: "Republic Club - Pattaya Video Reel", type: "video", isPrimary: true, url: "https://youtu.be/wlw7MD1ZvoE" },
      { id: "asset-rep-2", name: "DJ SPACEMONKEY LIVE at Republic Club Pattaya", type: "video", isPrimary: false, url: "https://youtu.be/u3I85fqUf6w" },
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
    summary: "Led 32-technician crew in optical throw alignment, pipe grid rigging, and video distribution across a 32,000 sq ft immersive 360° visual canvas.",
    official_links: [
      { label: "CBS Pittsburgh KDKA Exhibition Feature", url: "https://pittsburgh.cbslocal.com/", badge: "Broadcast News" },
      { label: "Lighthouse Immersive Exhibition Portal", url: "https://www.immersivevangogh.com/", badge: "Exhibition Portal" }
    ],
    assets: [
      { id: "asset-vg-1", name: "CBS Pittsburgh Video Feature", type: "video", isPrimary: true, url: "https://pittsburgh.cbslocal.com/" },
      { id: "asset-vg-2", name: "64-Projector Optical Convergence Blueprint", type: "cad", isPrimary: false, url: "https://www.immersivevangogh.com/" }
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
    summary: "Designed 3D sculpture projection mapping onto Nathan Hooper statues paired with a TouchDesigner sensor-driven interactive forest network and DMX pyrotechnics.",
    official_links: [
      { label: "Megatix Thailand Immersive Events", url: "https://megatix.in.th/", badge: "Ticketing Platform" },
      { label: "Wonderfruit Festival Participation Portal", url: "https://wonderfruit.co/", badge: "Cultural Festival" }
    ],
    assets: [
      { id: "asset-xp-1", name: "TheXperience2-night (Luna Statue)", type: "image", isPrimary: true, url: "Drive Asset" },
      { id: "asset-xp-2", name: "TheXperience1-statue-Day", type: "image", isPrimary: false, url: "Drive Asset" },
      { id: "asset-xp-3", name: "TheXperience3-led-forest", type: "image", isPrimary: false, url: "Drive Asset" },
      { id: "asset-xp-4", name: "TheXperience6-panoramic", type: "image", isPrimary: false, url: "Drive Asset" }
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
    summary: "Fabricated participant-spun mechanical gear-reduction wheel with optical encoders linked to microcontroller relays sequencing DMX flame poofers.",
    official_links: [
      { label: "Love Burn Community Reddit Archive", url: "https://www.reddit.com/r/Loveburn/comments/1p10ug9/love_burn_2026_discounted_art_sponsor_tickets_to/", badge: "Community Archive" }
    ],
    assets: [
      { id: "asset-sp-1", name: "Stage1-Storyportal1-action (Flame Poofer)", type: "image", isPrimary: true, url: "Drive Asset" },
      { id: "asset-sp-2", name: "Stage2-Storyportal2-night", type: "image", isPrimary: false, url: "Drive Asset" },
      { id: "asset-sp-3", name: "Stage3-Storyportal3-design", type: "cad", isPrimary: false, url: "Drive Asset" }
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
    summary: "Built structural timber framing with concealed wire chases driving interactive multi-channel LED display arrays via generative TouchDesigner feeds.",
    official_links: [
      { label: "ARTECHOUSE Official Exhibition Archive", url: "https://www.artechouse.com/program/magentaverse-miami/", badge: "Exhibition Archive" },
      { label: "Dezeen Events Architectural Feature", url: "https://www.dezeen.com/eventsguide/2023/01/magentaverse-2023/", badge: "Design Press" }
    ],
    assets: [
      { id: "asset-art-1", name: "Artechouse1 / tunnel.jpg (LED Arch)", type: "image", isPrimary: true, url: "Drive Asset" },
      { id: "asset-art-2", name: "Artechouse2-anything.jpg (Timber Framing)", type: "image", isPrimary: false, url: "Drive Asset" },
      { id: "asset-art-3", name: "artechouse3-crt.jpeg (CRT Array Stack)", type: "image", isPrimary: false, url: "Drive Asset" }
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
    summary: "Developed Vectorworks Spotlight 3D pre-vis for 270° wrap stage geometry, truss load distribution, and warehouse column obstruction wrapping.",
    official_links: [
      { label: "Interactive & Immersive Staging Jobs", url: "https://jobs.interactiveimmersive.io/", badge: "Industry Portal" }
    ],
    assets: [
      { id: "asset-hb-1", name: "Stage5-Homebass2-night (270° Stage)", type: "image", isPrimary: true, url: "Drive Asset" },
      { id: "asset-hb-2", name: "Stage6-HiJinx1-render (Vectorworks Column Wrap)", type: "cad", isPrimary: false, url: "Drive Asset" }
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
    summary: "Developed GPU compute pipelines rendering 3D Gaussian Splats and LiDAR point cloud displacement at 60 FPS in TouchDesigner GLSL.",
    official_links: [
      { label: "Brice Morneau GitHub Repository", url: "https://github.com/icaruslastflight/my-portfolio", badge: "GitHub Source" }
    ],
    assets: [
      { id: "asset-gs-1", name: "Underground3 (FB4 Laser Geometry)", type: "image", isPrimary: true, url: "Drive Asset" },
      { id: "asset-gs-2", name: "Underground5 (Ternion Sound Set)", type: "image", isPrimary: false, url: "Drive Asset" },
      { id: "asset-gs-3", name: "Underground6 (Buku Visuals Set)", type: "image", isPrimary: false, url: "Drive Asset" }
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
    summary: "Fabricated modular timber joinery, free-standing pergola bars with concealed power, and sound-reactive studio projection mapping.",
    official_links: [
      { label: "Sitara Experiential Design Index", url: "https://sitara.systems/experiential-design-index/", badge: "Industry Index" }
    ],
    assets: [
      { id: "asset-bb-1", name: "Setdesign5-Wedding bar.jpg", type: "image", isPrimary: true, url: "Drive Asset" },
      { id: "asset-bb-2", name: "Setdesign3-portal build.jpg (Radial LED Rig)", type: "image", isPrimary: false, url: "Drive Asset" },
      { id: "asset-bb-3", name: "Setdesign2-Mural-flat", type: "image", isPrimary: false, url: "Drive Asset" }
    ]
  }
];

const UNASSIGNED_POOL = [
  { id: "pool-1", name: "Underground4 (Warehouse Beam Sweep)", type: "image", url: "Drive Asset" },
  { id: "pool-2", name: "Resume-TD.docx (Technical Director Spec)", type: "document", url: "Word Asset" },
  { id: "pool-3", name: "Resume-Creative.docx (Creative Technologist Spec)", type: "document", url: "Word Asset" },
  { id: "pool-4", name: "LONGBOAT - UFDC Image Array 2", type: "pdf", url: "PDF Asset" }
];

export default function MobileMultiSelectPortfolio() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [unassigned, setUnassigned] = useState(UNASSIGNED_POOL);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [targetProjectSelect, setTargetProjectSelect] = useState(projects[0].id);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('admin=true')) {
      setIsAdminOpen(true);
    }
  }, []);

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

  const handleMakePrimary = (projectId, assetId) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          assets: p.assets.map(a => ({
            ...a,
            isPrimary: a.id === assetId
          }))
        };
      }
      return p;
    }));
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
      backgroundColor: '#0a0d12',
      color: '#e2e8f0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      paddingBottom: '100px'
    }}>
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
              BRICE ANTHONY MORNEAU
            </h1>
            <p style={{ fontSize: '12px', margin: 0, color: '#38bdf8', fontWeight: 600 }}>
              Technical Director & Systems Architect
            </p>
          </div>
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

      <main style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '14px' }}>
              {project.summary}
            </p>

            {/* OFFICIAL GALLERY & LIVE SITE LINKS */}
            {project.official_links && project.official_links.length > 0 && (
              <div style={{ marginBottom: '16px', backgroundColor: '#1a2333', borderRadius: '8px', padding: '10px 12px', border: '1px solid #0284c7' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>🌐 OFFICIAL GALLERY & LIVE SITE LINKS</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {project.official_links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: '#0f172a',
                        color: '#38bdf8',
                        border: '1px solid #0284c7',
                        borderRadius: '6px',
                        padding: '6px 10px',
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
                        {link.badge}
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
                    return (
                      <div
                        key={asset.id}
                        draggable={isAdminOpen}
                        onDragStart={(e) => handleDragStartSelected(e, asset, project.id)}
                        onClick={() => isAdminOpen && toggleSelectAsset(asset, project.id)}
                        style={{
                          backgroundColor: selected ? '#0284c7' : (asset.isPrimary ? '#1e293b' : '#0f172a'),
                          border: selected ? '2px solid #38bdf8' : (asset.isPrimary ? '1px solid #eab308' : '1px solid #334155'),
                          borderRadius: '6px',
                          padding: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          cursor: isAdminOpen ? 'pointer' : 'default'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {selected && (
                              <span style={{ backgroundColor: '#22c55e', color: '#fff', fontSize: '10px', fontWeight: 900, borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                ✓
                              </span>
                            )}
                            {asset.isPrimary && (
                              <span style={{ backgroundColor: '#eab308', color: '#000', fontSize: '9px', fontWeight: 900, padding: '2px 6px', borderRadius: '4px' }}>
                                ★ HERO
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

                        {isAdminOpen && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {!asset.isPrimary && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleMakePrimary(project.id, asset.id); }}
                                style={{ backgroundColor: '#854d0e', color: '#fef08a', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                MAKE HERO
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}
