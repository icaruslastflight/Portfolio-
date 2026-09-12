import JSZip from 'jszip';
import { AuthorProfile, Category, ExportDeck, PortfolioItem, ManagedAsset } from '../types';

export function getCategoryMap(categories: Category[]): Record<string, Category> {
  const map: Record<string, Category> = {};
  categories.forEach((cat) => {
    map[cat.id] = cat;
  });
  return map;
}

export function resolveAssetUrl(
  filename?: string,
  directUrl?: string,
  assetRegistry?: Record<string, string>,
  strategy: 'relative' | 'assets_folder' | 'netlify_live' | 'embedded' = 'relative'
): string {
  if (filename && assetRegistry && assetRegistry[filename]) {
    return assetRegistry[filename];
  }
  if (directUrl && (directUrl.startsWith('http://') || directUrl.startsWith('https://') || directUrl.startsWith('data:'))) {
    return directUrl;
  }
  if (!filename) return directUrl || '';

  switch (strategy) {
    case 'assets_folder':
      return `assets/${filename}`;
    case 'netlify_live':
      return `https://primordialvideo.netlify.app/${filename}`;
    case 'embedded':
      return directUrl || filename;
    case 'relative':
    default:
      return filename;
  }
}

export function generateResumeMarkdown(
  profile: AuthorProfile,
  deck: ExportDeck,
  items: PortfolioItem[],
  categories: Category[]
): string {
  const categoryMap = getCategoryMap(categories);
  const deckItems = deck.itemIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is PortfolioItem => Boolean(item));

  let md = `# ${profile.name}\n`;
  md += `**${profile.title}**\n\n`;
  md += `${profile.location} | [Email](mailto:${profile.email}) | ${profile.phone}\n`;
  if (profile.website) md += `[Portfolio](${profile.website}) | `;
  if (profile.linkedin) md += `[LinkedIn](${profile.linkedin}) | `;
  if (profile.github) md += `[GitHub](${profile.github})\n`;
  md += `\n---\n\n`;

  if (profile.summary) {
    md += `## Professional Summary\n\n${profile.summary}\n\n---\n\n`;
  }

  // Group by category
  const groupedByCategory: Record<string, PortfolioItem[]> = {};
  deckItems.forEach((item) => {
    const catName = categoryMap[item.categoryId]?.name || 'Additional Highlights';
    if (!groupedByCategory[catName]) {
      groupedByCategory[catName] = [];
    }
    groupedByCategory[catName].push(item);
  });

  Object.entries(groupedByCategory).forEach(([categoryName, groupItems]) => {
    md += `## ${categoryName}\n\n`;
    groupItems.forEach((item) => {
      md += `### ${item.title}`;
      if (item.date) md += ` (${item.date})`;
      md += `\n`;

      if (item.subtitle) {
        md += `*${item.subtitle}*\n\n`;
      }

      if (item.location || item.roleTag) {
        md += `**Role / Location:** ${[item.roleTag, item.location].filter(Boolean).join(' • ')}\n\n`;
      }

      md += `${item.content}\n\n`;

      if (item.metrics && item.metrics.length > 0) {
        md += `**Key Technical Metrics:**\n`;
        item.metrics.forEach((m) => {
          md += `- **${m.label}:** ${m.value}\n`;
        });
        md += `\n`;
      }

      if (item.tags && item.tags.length > 0) {
        md += `*Keywords:* ${item.tags.join(', ')}\n\n`;
      }

      if (item.auxiliaryAssets && item.auxiliaryAssets.length > 0) {
        md += `*Associated Assets / Blueprints:* ${item.auxiliaryAssets.map((a) => `${a.label}: ${a.filename}`).join(', ')}\n\n`;
      }

      md += `---\n\n`;
    });
  });

  return md;
}

/**
 * Generates the signature Cyber-Dark HTML portfolio matching primordialvideo.netlify.app
 */
export function generatePrimordialDarkHtmlPortfolio(
  profile: AuthorProfile,
  deck: ExportDeck,
  items: PortfolioItem[],
  categories: Category[],
  assetRegistry?: Record<string, string>
): string {
  const strategy = deck.assetPathStrategy || 'relative';
  const categoryMap = getCategoryMap(categories);
  const deckItems = deck.itemIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is PortfolioItem => Boolean(item));

  // Separate case studies from other items
  const caseStudies = deckItems.filter(
    (item) => item.categoryId === 'cat_primordial_cases' || item.id.startsWith('case-')
  );
  const otherItems = deckItems.filter(
    (item) => item.categoryId !== 'cat_primordial_cases' && !item.id.startsWith('case-')
  );

  const displayCaseStudies = caseStudies.length > 0 ? caseStudies : deckItems;

  const caseStudiesHtml = displayCaseStudies
    .map((item, index) => {
      const isVideo =
        item.type === 'video' ||
        (item.mediaFilename && (item.mediaFilename.endsWith('.mp4') || item.mediaFilename.endsWith('.webm'))) ||
        (item.videoUrl && (item.videoUrl.endsWith('.mp4') || item.videoUrl.endsWith('.webm')));

      const assetSrc = resolveAssetUrl(
        item.mediaFilename,
        isVideo ? item.videoUrl : item.imageUrl,
        assetRegistry,
        strategy
      );

      const displayMode = item.mediaDisplayMode || 'single';

      const tagsHtml = item.tags
        .map((t) => `<span class="px-2 py-0.5 rounded bg-brand-tag text-zinc-300">${t}</span>`)
        .join('\n            ');

      const auxHtml =
        item.auxiliaryAssets && item.auxiliaryAssets.length > 0
          ? `<div class="text-[11px] font-mono text-zinc-500 mt-2 flex flex-wrap justify-between gap-1">
            ${item.auxiliaryAssets.map((a) => `<span>${a.label}: ${a.filename}</span>`).join('\n            ')}
          </div>`
          : item.mediaFilename
          ? `<div class="text-[11px] font-mono text-zinc-500 mt-2 flex justify-between">
            <span>Asset: ${item.mediaFilename}</span>
          </div>`
          : '';

      const mediaBlock = isVideo
        ? `<video src="${assetSrc}" controls preload="metadata" class="w-full h-full object-cover" onerror="if(this.src!=='https://primordialvideo.netlify.app/${encodeURIComponent(item.mediaFilename || '')}'){this.src='https://primordialvideo.netlify.app/${encodeURIComponent(item.mediaFilename || '')}';}"></video>`
        : `<img src="${assetSrc}" alt="${item.title.replace(/"/g, '&quot;')}" class="w-full h-full object-cover" onerror="if(!this.src.includes('primordialvideo.netlify.app') && '${item.mediaFilename || ''}'){this.src='https://primordialvideo.netlify.app/${encodeURIComponent(item.mediaFilename || '')}';}else{this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center font-mono text-xs text-zinc-500 bg-brand-surface\\'>${item.mediaFilename || 'Asset Preview'}</div>';}">`;

      // Build grouped images section with context
      let imageGroupsHtml = '';
      if (item.imageGroups && item.imageGroups.length > 0) {
        imageGroupsHtml = `
        <div class="mt-4 pt-3 border-t border-brand-border/60">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-mono text-brand-accent uppercase tracking-wider flex items-center gap-1">
              <span>// Image Groups &amp; Technical Context (${item.imageGroups.length})</span>
            </span>
          </div>
          <div class="space-y-3">
            ${item.imageGroups.map((grp) => `
              <div class="p-3 rounded-lg bg-brand-surface border border-brand-border/80">
                <div class="text-xs font-bold text-white font-mono mb-1">${grp.name}</div>
                ${grp.context ? `<p class="text-[11px] text-zinc-400 mb-2 leading-relaxed font-sans">${grp.context}</p>` : ''}
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  ${grp.images.map((img) => `
                    <div class="rounded border border-brand-border overflow-hidden bg-black flex flex-col">
                      <div class="aspect-video w-full relative">
                        <img src="${resolveAssetUrl(img.filename, undefined, assetRegistry, strategy)}" alt="${img.caption || img.filename}" class="w-full h-full object-cover" onerror="this.src='https://primordialvideo.netlify.app/${encodeURIComponent(img.filename)}'"/>
                      </div>
                      ${(img.caption || img.context) ? `
                        <div class="p-1.5 text-[10px] font-mono bg-brand-panel border-t border-brand-border/50">
                          ${img.caption ? `<div class="font-semibold text-zinc-200 truncate">${img.caption}</div>` : ''}
                          ${img.context ? `<div class="text-zinc-500 text-[9px] line-clamp-2 mt-0.5">${img.context}</div>` : ''}
                        </div>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>`;
      }

      // Display Mode specific presentation
      let mediaPresentationHtml = '';
      if (displayMode === 'side_by_side') {
        const secondaryImg = (item.imageGroups && item.imageGroups[0]?.images[0]?.filename) || (item.auxiliaryAssets && item.auxiliaryAssets[0]?.filename);
        const secSrc = secondaryImg ? resolveAssetUrl(secondaryImg, undefined, assetRegistry, strategy) : '';

        mediaPresentationHtml = `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            <div class="aspect-video rounded-lg bg-brand-surface border border-brand-border overflow-hidden relative">
              ${mediaBlock}
              <span class="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs font-mono text-[9px] text-brand-accent">Primary Visual</span>
            </div>
            <div class="aspect-video rounded-lg bg-brand-surface border border-brand-border overflow-hidden relative">
              ${secSrc ? `<img src="${secSrc}" alt="Secondary reference" class="w-full h-full object-cover" onerror="this.src='https://primordialvideo.netlify.app/${encodeURIComponent(secondaryImg || '')}'"/>` : `<div class="w-full h-full flex items-center justify-center font-mono text-xs text-zinc-500 bg-brand-surface">Rigging / Secondary Plot</div>`}
              <span class="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs font-mono text-[9px] text-zinc-300">Technical Context</span>
            </div>
          </div>
        `;
      } else if (displayMode === 'slides') {
        const allSlideImages = [
          ...(item.mediaFilename ? [{ filename: item.mediaFilename, caption: item.title }] : []),
          ...(item.imageGroups ? item.imageGroups.flatMap((g) => g.images) : [])
        ];
        
        mediaPresentationHtml = `
          <div class="relative w-full rounded-lg bg-brand-surface border border-brand-border overflow-hidden">
            <div class="aspect-video w-full relative">
              ${mediaBlock}
            </div>
            <div class="px-3 py-2 bg-brand-panel border-t border-brand-border flex items-center justify-between text-xs font-mono">
              <span class="text-zinc-400">Slide Deck: ${allSlideImages.length || 1} Assets</span>
              <span class="text-[10px] text-brand-accent uppercase">Multi-Slide Carousel</span>
            </div>
          </div>
        `;
      } else if (displayMode === 'background') {
        mediaPresentationHtml = `
          <div class="aspect-video w-full rounded-lg bg-brand-surface border border-brand-border overflow-hidden relative">
            ${mediaBlock}
            <div class="absolute inset-0 bg-gradient-to-t from-brand-panel via-brand-panel/40 to-transparent pointer-events-none"></div>
            <span class="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 border border-brand-border font-mono text-[9px] text-brand-accent">Atmospheric Background</span>
          </div>
        `;
      } else {
        mediaPresentationHtml = `
          <div class="aspect-video w-full rounded-lg bg-brand-surface border border-brand-border overflow-hidden relative">
            ${mediaBlock}
          </div>
        `;
      }

      return `      <!-- ${String(index + 1).padStart(2, '0')} // ${item.title.replace(/</g, '&lt;')} -->
      <article class="border border-brand-border rounded-xl bg-brand-panel overflow-hidden flex flex-col justify-between">
        <div class="p-5 sm:p-6">
          <div class="flex justify-between items-start gap-4 mb-2">
            <span class="text-xs font-mono text-brand-accent uppercase">${item.location || 'Specialized Deployment'}</span>
            <div class="flex items-center gap-1.5">
              ${displayMode !== 'single' ? `<span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950/60 text-sky-400 border border-sky-800/60 uppercase">${displayMode.replace('_', ' ')}</span>` : ''}
              <span class="text-xs font-mono px-2 py-0.5 rounded bg-brand-tag text-zinc-400 border border-brand-border">${item.roleTag || 'Technical Lead'}</span>
            </div>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">${item.title}</h3>
          <p class="text-zinc-400 text-sm mb-4 leading-relaxed">
            ${item.content}
          </p>
          <div class="flex flex-wrap gap-1.5 mb-4 font-mono text-[11px]">
            ${tagsHtml}
          </div>
        </div>
        <div class="px-5 pb-5">
          ${mediaPresentationHtml}
          ${auxHtml}
          ${imageGroupsHtml}
        </div>
      </article>`;
    })
    .join('\n\n');

  // Additional experience section if included
  const additionalSectionHtml =
    otherItems.length > 0
      ? `  <!-- ADDITIONAL SYSTEMS & DIRECT EXPERIENCE -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
        <span class="text-brand-accent font-mono text-base">//</span> Direct Systems Engineering &amp; Operational Roles
      </h2>
      <span class="text-xs font-mono text-zinc-400">${otherItems.length} Additional Profiles</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${otherItems
        .map(
          (item) => `
      <div class="border border-brand-border rounded-xl bg-brand-panel p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start gap-3 mb-2">
            <span class="text-xs font-mono text-brand-accent uppercase">${categoryMap[item.categoryId]?.name || 'Specialty'}</span>
            <span class="text-xs font-mono text-zinc-400">${item.date || ''}</span>
          </div>
          <h3 class="text-lg font-bold text-white mb-1.5">${item.title}</h3>
          ${item.subtitle ? `<p class="text-xs font-mono text-zinc-400 mb-2">${item.subtitle}</p>` : ''}
          <p class="text-zinc-400 text-sm leading-relaxed mb-4">${item.content}</p>
        </div>
        ${
          item.metrics && item.metrics.length > 0
            ? `<div class="grid grid-cols-2 gap-2 pt-3 border-t border-brand-border/60 text-[11px] font-mono">
          ${item.metrics
            .map(
              (m) => `<div><span class="text-zinc-500 block">${m.label}</span><span class="text-brand-accent font-semibold">${m.value}</span></div>`
            )
            .join('')}
        </div>`
            : ''
        }
      </div>`
        )
        .join('')}
    </div>
  </section>`
      : '';

  return `<!DOCTYPE html>
<html lang="en" class="dark scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.name} — Creative Technologist &amp; Technical Director</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Space Grotesk', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          },
          colors: {
            brand: {
              accent: '#38bdf8',
              laser: '#22c55e',
              warning: '#f59e0b',
              surface: '#07090e',
              panel: '#0d121a',
              card: '#131924',
              border: '#202b3b',
              tag: '#182230'
            }
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-color: #05070b;
      background-image: 
        radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.08) 0%, transparent 60%),
        linear-gradient(to right, rgba(255, 255, 255, 0.012) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.012) 1px, transparent 1px);
      background-size: 100% 100%, 32px 32px, 32px 32px;
    }
  </style>
</head>
<body class="text-zinc-200 font-sans antialiased selection:bg-sky-500 selection:text-black min-h-screen">

  <!-- TOP STATUS BAR -->
  <header class="border-b border-brand-border/70 bg-black/80 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center space-x-3">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-xs font-mono tracking-widest uppercase text-zinc-400">${profile.name.toUpperCase()} // PITTSBURGH, PA</span>
      </div>
      <div class="flex items-center gap-5 text-xs font-mono text-zinc-400">
        <a href="#projects" class="hover:text-brand-accent transition">PORTFOLIO INDEX</a>
        <a href="#stack" class="hover:text-brand-accent transition">CORE STACK</a>
        <a href="#resumes" class="hover:text-brand-accent transition">RESUME DIRECTORY</a>
        ${profile.phone ? `<a href="tel:${profile.phone.replace(/[^0-9]/g, '')}" class="text-brand-accent hover:underline hidden sm:inline">${profile.phone}</a>` : ''}
      </div>
    </div>
  </header>

  <!-- HERO SECTION -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
    <div class="border border-brand-border rounded-xl bg-brand-panel/90 p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
      <div class="absolute -right-20 -top-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex flex-col lg:flex-row justify-between lg:items-center gap-6 relative z-10">
        <div>
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-brand-tag border border-brand-border text-brand-accent text-[11px] font-mono uppercase tracking-wider mb-2">
            ${profile.title}
          </div>
          <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-2">
            ${profile.name}
          </h1>
          <p class="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            ${profile.summary}
          </p>
        </div>

        <div class="flex flex-col sm:flex-row lg:flex-col gap-2 font-mono text-xs text-zinc-300 shrink-0">
          <div class="flex items-center gap-2 bg-brand-surface px-3 py-1.5 rounded border border-brand-border">
            <svg class="w-4 h-4 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>Pittsburgh, PA</span>
          </div>
          ${profile.phone ? `<a href="tel:${profile.phone.replace(/[^0-9]/g, '')}" class="flex items-center gap-2 bg-brand-surface px-3 py-1.5 rounded border border-brand-border hover:border-brand-accent transition">
            <svg class="w-4 h-4 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            <span>${profile.phone}</span>
          </a>` : ''}
          ${profile.email ? `<a href="mailto:${profile.email}" class="flex items-center gap-2 bg-brand-surface px-3 py-1.5 rounded border border-brand-border hover:border-brand-accent transition">
            <svg class="w-4 h-4 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span>${profile.email}</span>
          </a>` : ''}
        </div>
      </div>
    </div>
  </section>

  <!-- CORE TECHNICAL STACK -->
  <section id="stack" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
    <div class="border border-brand-border rounded-xl bg-brand-surface/80 p-5 font-mono text-xs">
      <h2 class="text-zinc-400 font-bold uppercase tracking-widest text-[11px] mb-3">Core Technical Stack &amp; Systems Architecture</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <div class="bg-brand-panel p-3 rounded border border-brand-border">
          <span class="text-brand-accent font-bold block mb-1">Media Servers (V1)</span>
          <span class="text-zinc-400 block text-[11px] leading-relaxed">Resolume Arena 7 (DXV3 / FOH automation), TouchDesigner, MadMapper, Blackmagic ATEM Constellation SDI routing.</span>
        </div>
        <div class="bg-brand-panel p-3 rounded border border-brand-border">
          <span class="text-brand-accent font-bold block mb-1">LED Displays</span>
          <span class="text-zinc-400 block text-[11px] leading-relaxed">Brompton (SX40/S8), NovaStar (MX40 Pro/MCTRL4K), ROE, Absen, and component PSU bench soldering.</span>
        </div>
        <div class="bg-brand-panel p-3 rounded border border-brand-border">
          <span class="text-brand-accent font-bold block mb-1">Concert Lighting (L1/LD)</span>
          <span class="text-zinc-400 block text-[11px] leading-relaxed">ChamSys MagicQ, Obsidian ONYX, GrandMA onPC, 100A–400A 3-phase cam-lock distros, Art-Net/sACN, DMX512-A.</span>
        </div>
        <div class="bg-brand-panel p-3 rounded border border-brand-border">
          <span class="text-brand-accent font-bold block mb-1">Laser Systems</span>
          <span class="text-zinc-400 block text-[11px] leading-relaxed">Pangolin BEYOND/QuickShow, FB4 distribution, series E-stop loops, key-switches (unlicensed under LSO/variance).</span>
        </div>
        <div class="bg-brand-panel p-3 rounded border border-brand-border">
          <span class="text-brand-accent font-bold block mb-1">Physical Computing</span>
          <span class="text-zinc-400 block text-[11px] leading-relaxed">Custom microcontrollers, Akai APC40 tri-computer MIDI/OSC network map, kinetic winches, DMX pyro triggers.</span>
        </div>
      </div>
    </div>
  </section>

  <!-- CASE STUDIES -->
  <section id="projects" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
        <span class="text-brand-accent font-mono text-base">//</span> Verified Case Studies &amp; Blueprints
      </h2>
      <span class="text-xs font-mono text-zinc-400">${displayCaseStudies.length} Major Deployments</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
${caseStudiesHtml}
    </div>
  </section>

${additionalSectionHtml}

  <!-- MASTER RESUME DIRECTORY -->
  <section id="resumes" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="border border-brand-border rounded-xl bg-brand-surface p-6 sm:p-8 font-mono text-xs">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-brand-border">
        <div>
          <span class="text-xs font-mono uppercase tracking-widest text-brand-accent">16 Targeted Production Specialties</span>
          <h2 class="text-xl sm:text-2xl font-bold text-white">Master Resume &amp; Technical Reference Directory</h2>
        </div>
        <span class="text-xs text-zinc-400">Complete Resume Library Available Upon Request</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Video -->
        <div class="space-y-2">
          <h3 class="text-sm font-bold text-white border-b border-brand-border/60 pb-1.5 flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-sky-400"></span> Video Production (5 Roles)
          </h3>
          <ul class="space-y-1 text-zinc-400 text-[11px]">
            <li>• V1: Lead Video Systems Engineer</li>
            <li>• V2: Deck Video &amp; Camera Tech</li>
            <li>• Media Server Op (Resolume / TD)</li>
            <li>• LED Wall Tech (Brompton / NovaStar)</li>
            <li>• Projectionist (64-Projector Edge Blend)</li>
          </ul>
        </div>

        <!-- Lighting -->
        <div class="space-y-2">
          <h3 class="text-sm font-bold text-white border-b border-brand-border/60 pb-1.5 flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Lighting Production (4 Roles)
          </h3>
          <ul class="space-y-1 text-zinc-400 text-[11px]">
            <li>• L1: Master Electrician &amp; 3-Phase Power</li>
            <li>• L2: Deck Electrician &amp; Lift Operator</li>
            <li>• Lighting Director &amp; Live Busker (LD)</li>
            <li>• Moving Light Bench Repair Technician</li>
          </ul>
        </div>

        <!-- Laser -->
        <div class="space-y-2">
          <h3 class="text-sm font-bold text-white border-b border-brand-border/60 pb-1.5 flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Laser Systems (3 Roles)
          </h3>
          <ul class="space-y-1 text-zinc-400 text-[11px]">
            <li>• Touring &amp; Festival Laser Technician</li>
            <li>• Live Laser Show Busker / Board Op</li>
            <li>• Pangolin BEYOND Workspace Designer</li>
            <li class="text-[10px] text-zinc-500 pt-1">*Operates unlicensed under LSO/variance</li>
          </ul>
        </div>

        <!-- Production Management -->
        <div class="space-y-2">
          <h3 class="text-sm font-bold text-white border-b border-brand-border/60 pb-1.5 flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Management &amp; Staging (4 Roles)
          </h3>
          <ul class="space-y-1 text-zinc-400 text-[11px]">
            <li>• Technical Director (Live Music &amp; Club)</li>
            <li>• Concert &amp; Festival Production Manager</li>
            <li>• Lead Scenic Carpenter (StageRight)</li>
            <li>• Rigging Specialist &amp; MEWP Lift Op</li>
          </ul>
        </div>

      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="border-t border-brand-border/70 bg-black/90 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono">
      <div>
        <p class="text-sm font-bold text-white tracking-tight">${profile.name}</p>
        <p class="text-zinc-400 mt-0.5">${profile.title}</p>
      </div>
      <div class="flex flex-wrap items-center gap-4 text-zinc-300">
        <span class="text-zinc-500">Pittsburgh, PA</span>
        <span class="text-zinc-700">|</span>
        ${profile.phone ? `<a href="tel:${profile.phone.replace(/[^0-9]/g, '')}" class="hover:text-brand-accent transition">${profile.phone}</a><span class="text-zinc-700">|</span>` : ''}
        ${profile.email ? `<a href="mailto:${profile.email}" class="hover:text-brand-accent transition">${profile.email}</a>` : ''}
      </div>
    </div>
  </footer>

</body>
</html>`;
}

export function generateInteractiveHtmlPortfolio(
  profile: AuthorProfile,
  deck: ExportDeck,
  items: PortfolioItem[],
  categories: Category[],
  assetRegistry?: Record<string, string>
): string {
  if (deck.layout === 'primordial_dark' || deck.targetType === 'primordial_html') {
    return generatePrimordialDarkHtmlPortfolio(profile, deck, items, categories, assetRegistry);
  }

  const categoryMap = getCategoryMap(categories);
  const deckItems = deck.itemIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is PortfolioItem => Boolean(item));

  const itemsJson = JSON.stringify(deckItems);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.name} — ${deck.name || 'Portfolio & Resume'}</title>
  <meta name="description" content="${profile.summary ? profile.summary.replace(/"/g, '&quot;') : 'Portfolio curated collection'}">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111827;
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --border: #1f2937;
      --accent: #38bdf8;
      --accent-light: #0c4a6e;
      --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: var(--font-sans);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      padding: 40px 20px;
    }
    .container {
      max-width: 1080px;
      margin: 0 auto;
    }
    header {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 40px;
      margin-bottom: 32px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    .profile-name {
      font-size: 2.2rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 6px;
      color: var(--text-main);
    }
    .profile-title {
      font-size: 1.15rem;
      color: var(--accent);
      font-weight: 500;
      margin-bottom: 16px;
    }
    .profile-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 0.95rem;
      color: var(--text-muted);
      margin-bottom: 20px;
    }
    .profile-meta a {
      color: var(--accent);
      text-decoration: none;
    }
    .profile-meta a:hover {
      text-decoration: underline;
    }
    .profile-summary {
      font-size: 1rem;
      color: var(--text-main);
      max-width: 800px;
      line-height: 1.7;
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
    }
    .filter-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .filter-btn {
      background: var(--card-bg);
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 0.88rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .filter-btn.active, .filter-btn:hover {
      background: var(--accent);
      color: #000;
      font-weight: 600;
      border-color: var(--accent);
    }
    .search-box {
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--card-bg);
      color: var(--text-main);
      font-size: 0.9rem;
      min-width: 240px;
    }
    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }
    .item-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-col;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .item-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    }
    .item-media {
      width: 100%;
      height: 200px;
      object-fit: cover;
      background: #000;
    }
    .item-body {
      padding: 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .item-cat {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      color: var(--accent);
      margin-bottom: 8px;
    }
    .item-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 6px;
      color: var(--text-main);
    }
    .item-sub {
      font-size: 0.88rem;
      color: var(--text-muted);
      margin-bottom: 12px;
    }
    .item-content {
      font-size: 0.92rem;
      color: #d1d5db;
      margin-bottom: 16px;
      flex: 1;
      white-space: pre-line;
    }
    .item-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: auto;
    }
    .tag {
      background: #1f2937;
      color: #9ca3af;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
    }
    .mode-badge {
      display: inline-block;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
      margin-left: 8px;
    }
    .groups-details {
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid var(--border);
      font-size: 0.8rem;
    }
    .groups-details summary {
      cursor: pointer;
      color: var(--accent);
      font-weight: 600;
      user-select: none;
    }
    .group-block {
      background: #181d24;
      border: 1px solid #283340;
      border-radius: 8px;
      padding: 10px;
      margin-top: 8px;
    }
    .group-block-title {
      font-weight: 700;
      color: #f3f4f6;
      margin-bottom: 3px;
    }
    .group-block-context {
      font-size: 0.75rem;
      color: #9ca3af;
      margin-bottom: 8px;
      line-height: 1.4;
    }
    .group-block-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
      gap: 6px;
    }
    .group-thumb-card {
      border: 1px solid #283340;
      border-radius: 6px;
      overflow: hidden;
      background: #000;
    }
    .group-thumb-card img {
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;
      display: block;
    }
    .group-thumb-meta {
      padding: 4px;
      font-size: 0.68rem;
      background: #111827;
      color: #9ca3af;
    }
    .group-thumb-meta strong {
      display: block;
      color: #e5e7eb;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    footer {
      margin-top: 60px;
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-muted);
      padding: 24px 0;
      border-top: 1px solid var(--border);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1 class="profile-name">${profile.name}</h1>
      <div class="profile-title">${profile.title}</div>
      <div class="profile-meta">
        ${profile.location ? `<span>📍 ${profile.location}</span>` : ''}
        ${profile.email ? `<span>✉️ <a href="mailto:${profile.email}">${profile.email}</a></span>` : ''}
        ${profile.phone ? `<span>📞 ${profile.phone}</span>` : ''}
        ${profile.website ? `<span>🌐 <a href="${profile.website}" target="_blank" rel="noopener">${profile.website}</a></span>` : ''}
      </div>
      ${profile.summary ? `<p class="profile-summary">${profile.summary}</p>` : ''}
    </header>

    <div class="controls">
      <div class="filter-group" id="filter-group">
        <button class="filter-btn active" data-cat="all">All Items</button>
        ${categories
          .filter((cat) => deckItems.some((item) => item.categoryId === cat.id))
          .map((cat) => `<button class="filter-btn" data-cat="${cat.id}">${cat.name}</button>`)
          .join('\n        ')}
      </div>
      <input type="text" id="search" class="search-box" placeholder="Filter projects...">
    </div>

    <div class="items-grid" id="items-grid"></div>

    <footer>
      <p>Curated showcase for ${profile.name} • Generated with Portfolio &amp; Resume Organizer</p>
    </footer>
  </div>

  <script>
    const ITEMS = ${itemsJson};
    const CATEGORIES = ${JSON.stringify(categories)};
    const categoryMap = {};
    CATEGORIES.forEach(c => { categoryMap[c.id] = c; });

    let activeFilter = 'all';
    let searchQuery = '';

    const gridEl = document.getElementById('items-grid');
    const filterGroupEl = document.getElementById('filter-group');
    const searchEl = document.getElementById('search');

    function renderItems() {
      const filtered = ITEMS.filter(item => {
        const matchesCat = activeFilter === 'all' || item.categoryId === activeFilter;
        const matchesQuery = !searchQuery || 
          item.title.toLowerCase().includes(searchQuery) ||
          item.content.toLowerCase().includes(searchQuery) ||
          (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery)));
        return matchesCat && matchesQuery;
      });

      if (filtered.length === 0) {
        gridEl.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-muted);">No matching portfolio items found.</div>';
        return;
      }

      gridEl.innerHTML = filtered.map(item => {
        const cat = categoryMap[item.categoryId];
        const isVideo = item.type === 'video' || (item.mediaFilename && item.mediaFilename.endsWith('.mp4'));
        const mediaHtml = isVideo && item.videoUrl
          ? '<video src="' + item.videoUrl + '" class="item-media" controls preload="metadata"></video>'
          : item.imageUrl
          ? '<img src="' + item.imageUrl + '" alt="' + item.title + '" class="item-media" onerror="this.style.display=\\'none\\'">'
          : '';

        const tagsHtml = (item.tags || []).map(t => '<span class="tag">' + t + '</span>').join('');

        let groupsHtml = '';
        if (item.imageGroups && item.imageGroups.length > 0) {
          groupsHtml = '<details class="groups-details">' +
            '<summary>Image Groups & Context (' + item.imageGroups.length + ')</summary>' +
            item.imageGroups.map(grp => {
              const imgs = (grp.images || []).map(img => {
                const src = img.filename ? 'https://primordialvideo.netlify.app/' + encodeURIComponent(img.filename) : '';
                return '<div class="group-thumb-card">' +
                  '<img src="' + src + '" alt="' + (img.caption || img.filename) + '" onerror="this.style.display=\\'none\\'">' +
                  (img.caption || img.context ? '<div class="group-thumb-meta"><strong>' + (img.caption || '') + '</strong>' + (img.context ? '<span>' + img.context + '</span>' : '') + '</div>' : '') +
                '</div>';
              }).join('');

              return '<div class="group-block">' +
                '<div class="group-block-title">' + grp.name + '</div>' +
                (grp.context ? '<div class="group-block-context">' + grp.context + '</div>' : '') +
                '<div class="group-block-grid">' + imgs + '</div>' +
              '</div>';
            }).join('') +
          '</details>';
        }

        const modeBadge = item.mediaDisplayMode && item.mediaDisplayMode !== 'single'
          ? '<span class="mode-badge">' + item.mediaDisplayMode.replace('_', ' ') + '</span>'
          : '';

        return '<div class="item-card">' +
          mediaHtml +
          '<div class="item-body">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
              (cat ? '<span class="item-cat">' + cat.name + '</span>' : '<span></span>') +
              modeBadge +
            '</div>' +
            '<h3 class="item-title">' + item.title + '</h3>' +
            (item.subtitle ? '<div class="item-sub">' + item.subtitle + (item.date ? ' • ' + item.date : '') + '</div>' : '') +
            '<p class="item-content">' + item.content + '</p>' +
            '<div class="item-tags">' + tagsHtml + '</div>' +
            groupsHtml +
          '</div>' +
        '</div>';
      }).join('');
    }

    filterGroupEl.addEventListener('click', e => {
      if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        activeFilter = e.target.getAttribute('data-cat');
        renderItems();
      }
    });

    searchEl.addEventListener('input', e => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderItems();
    });

    renderItems();
  </script>
</body>
</html>`;
}

export async function generateZipArchive(
  profile: AuthorProfile,
  deck: ExportDeck,
  items: PortfolioItem[],
  categories: Category[],
  managedAssets?: ManagedAsset[]
): Promise<Blob> {
  const zip = new JSZip();

  // Create registry map for assets with data URLs
  const assetRegistry: Record<string, string> = {};
  if (managedAssets) {
    managedAssets.forEach((asset) => {
      if (asset.dataUrl) {
        assetRegistry[asset.filename] = asset.dataUrl;
      } else if (asset.externalUrl) {
        assetRegistry[asset.filename] = asset.externalUrl;
      }
    });
  }

  // 1. Interactive Portfolio HTML (Both index.html for Netlify root drop and portfolio.html)
  const primordialHtml = generatePrimordialDarkHtmlPortfolio(profile, deck, items, categories, assetRegistry);
  zip.file('index.html', primordialHtml);
  zip.file('portfolio.html', primordialHtml);

  // 2. Clean ATS-ready Markdown Resume
  const markdownContent = generateResumeMarkdown(profile, deck, items, categories);
  zip.file('resume.md', markdownContent);

  // 3. Raw Structured JSON data
  const deckItems = deck.itemIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is PortfolioItem => Boolean(item));

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    author: profile,
    deckSettings: deck,
    curatedItems: deckItems,
    categories: categories.filter((cat) => deckItems.some((it) => it.categoryId === cat.id))
  };
  zip.file('portfolio_data.json', JSON.stringify(exportPayload, null, 2));

  // 4. Netlify _redirects file for SPA / direct link stability
  zip.file('_redirects', '/*    /index.html   200\n');

  // 5. Pack uploaded real assets directly into the ZIP!
  if (managedAssets && managedAssets.length > 0) {
    managedAssets.forEach((asset) => {
      if (asset.dataUrl && asset.dataUrl.startsWith('data:')) {
        try {
          // Extract base64 part
          const commaIndex = asset.dataUrl.indexOf(',');
          if (commaIndex > 0) {
            const base64Data = asset.dataUrl.substring(commaIndex + 1);
            zip.file(asset.filename, base64Data, { base64: true });
          }
        } catch (e) {
          console.warn(`Could not pack binary asset ${asset.filename}`, e);
        }
      }
    });
  }

  // 6. Netlify Drop Instructions README
  const readme = `PRIMORDIAL VIDEO // NETLIFY DEPLOYMENT PACKAGE
==================================================
Author: ${profile.name}
Role: ${profile.title}
Deploy Target: primordialvideo.netlify.app or new Netlify site
Generated: ${new Date().toLocaleString()}

HOW TO DEPLOY TO NETLIFY IN 10 SECONDS:
---------------------------------------
Method A (Netlify Drop):
1. Go to https://app.netlify.com/drop in your browser.
2. Drag and drop this ZIP file (or the extracted folder containing 'index.html') into the upload zone.
3. Your updated portfolio and all media assets are instantly published live!

Method B (GitHub / Git Repo):
1. Commit 'index.html', your media assets, and '_redirects' to your repository.
2. Push to your main branch. Netlify will build and deploy automatically.

FILES INCLUDED:
- index.html: Standalone Cyber-Dark HTML portfolio matching primordialvideo.netlify.app.
- resume.md: Clean, formatted technical resume reference.
- portfolio_data.json: Structured JSON backup of all 10 case studies and CV items.
- _redirects: Netlify routing configuration.
`;
  zip.file('README.txt', readme);

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadFile(blob: Blob | string, filename: string, mimeType = 'text/plain') {
  const url =
    typeof blob === 'string'
      ? window.URL.createObjectURL(new Blob([blob], { type: mimeType }))
      : window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
