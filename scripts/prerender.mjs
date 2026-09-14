/** Injects the complete portfolio into dist/index.html for crawlers and no-JS clients. */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = resolve(root, 'dist/index.html');
const portfolio = JSON.parse(readFileSync(resolve(root, 'src/data/Portfolio-Schema.json'), 'utf8'));
const esc = (value = '') => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const sourceUrls = {
  'TheXperience2-night': '/media/TheXperience2-night.jpg', 'TheXperience1-statue-Day': '/media/TheXperience1-statue-Day.jpg',
  'TheXperience3-led-forest': '/media/TheXperience3-led-forest.jpg', 'TheXperience6': '/media/TheXperience6.jpg',
  'TheXperience4-playa': '/media/TheXperience4-playa.jpg', 'TheXperience5-Playa': '/media/TheXperience5-Playa.jpg',
  'Stage1-Storyportal1-action': '/media/Stage1-Storyportal1-action.jpg', 'Stage2-Storyportal2-night': '/media/Stage2-Storyportal2-night.jpg',
  'Stage3-Storyportal3-design': '/media/Stage3-Storyportal3-design.jpg', 'Artechouse1': '/media/tunnel.jpg',
  'Artechouse2-anything.jpg': '/media/Artechouse2-anything.jpg', 'Artechouse4': '/media/Artechouse4.jpg',
  'artechouse3-crt.jpeg': '/media/artechouse3-crt.jpg', 'Stage5-Homebass2-night': '/media/Stage5-Homebass2-night.jpg',
  'Stage6-HiJinx1-render': '/media/Stage6-HiJinx1-render.jpg', 'Underground3': '/media/Underground3.jpg',
  'Underground5': '/media/Underground5.jpg', 'Underground6': '/media/Underground6.jpg',
  'Setdesign5-Wedding-bar': '/media/Setdesign5-Wedding-bar.jpg', 'Setdesign3-portal-build': '/media/Setdesign3-portal-build.jpg',
  'Setdesign2-Mural-flat': '/media/Setdesign2-Mural-flat.jpg'
};
const services = [
  ['AV Systems Architecture & FOH Direction', 'Multi-display matrix routing (44+ zones), NovaStar CoEX/MX40 Pro processing, Resolume Arena 7 DXV3 server clusters, and 3-phase power distribution (100A–400A).'],
  ['360° Volumetric Projection Mapping', 'Multi-projector edge blending (up to 64 laser engines), optical throw calculations, Datapath FX4 distribution, and zero-drift corner pinning across 32,000+ sq ft canvases.'],
  ['Spatial Computing & Real-Time GPU Visuals', 'TouchDesigner GLSL compute shaders, LiDAR point cloud particle displacement, 60 FPS audio/visual reactivity, and custom Aether controller integrations.'],
  ['Kinetic Mechatronics & Laser Operations', 'Pangolin BEYOND FB4 networks under FDA/CDRH variance (LSO certified), multi-axis DMX positional winches, optical rotary encoders, aluminum box trussing, and electric chain hoists.']
];
const activeProtocols = ['Resolume Arena 7 & Alley DXV3', 'TouchDesigner GLSL', 'Pangolin BEYOND FB4', 'Vectorworks Spotlight 3D pre-vis', 'NovaStar CoEX/MX40 Pro', 'ChamSys MagicQ', 'DMX512/Art-Net/sACN/SMPTE LTC'];

const projectMarkup = portfolio.projects.map((project) => {
  const list = (items, render) => items.map(render).join('');
  const metrics = list(project.metrics, ({ label, val }) => `<li><strong>${esc(label)}:</strong> ${esc(val)}</li>`);
  const stack = list(project.control_stack, (item) => `<li>${esc(item)}</li>`);
  const links = list(project.official_links, (link) => `<li><a href="${esc(link.url)}">${esc(link.label)} (${esc(link.badge)})</a></li>`);
  const media = list(project.assigned_media, (asset) => {
    const url = asset.url || sourceUrls[asset.source] || asset.source || '';
    return `<li><a href="${esc(url)}">${esc(asset.name)} — ${esc(asset.type)}</a>${asset.tag ? `: ${esc(asset.tag)}` : ''}</li>`;
  });
  return `<article id="${esc(project.id)}"><header><p>${esc(project.discipline)}</p><h2>${esc(project.title)}</h2><p><strong>${esc(project.role)}</strong> — ${esc(project.location)}</p></header><p>${esc(project.summary)}</p><h3>Delivery metrics</h3><ul>${metrics}</ul><h3>Software, systems and control protocols</h3><ul>${stack}</ul>${links ? `<h3>Official features and venue links</h3><ul>${links}</ul>` : ''}<h3>Project media</h3><ul>${media}</ul></article>`;
}).join('\n');
if (!projectMarkup) throw new Error('prerender: portfolio contains no projects');
const serviceMarkup = services.map(([title, detail]) => `<article><h3>${esc(title)}</h3><p>${esc(detail)}</p></article>`).join('');
const protocolMarkup = activeProtocols.map((protocol) => `<li>${esc(protocol)}</li>`).join('');
const payload = `<div id="root"><main><header><p>Brice Anthony Morneau / Studio Practice</p><h1>Primordial Video // Technical Direction &amp; Systems Architecture</h1><p>[ Studio: Primordial Video | Base: Pittsburgh (PIT) / Pattaya | Range: Global Touring &amp; Residencies | Status: Available for Technical Direction ]</p></header><section aria-labelledby="showreel"><h2 id="showreel">Hero Showreel</h2><p><a href="https://youtu.be/6GY_e4yeLXw?t=17">Republic Club Pattaya primary video feature — cued to 17 seconds</a></p><p><a href="/media/republic-pattaya-teaser-mobile-h265.mp4">Republic Club Pattaya local 60 FPS H.265/WebM teaser</a></p><p><a href="/media/artechouse-magentaverse-teaser-mobile-h265.mp4">ARTECHOUSE Magentaverse local 60 FPS H.265/WebM teaser</a></p><p><a href="/media/vangogh-360-teaser-mobile-h265.mp4">Van Gogh 360° local 60 FPS H.265/WebM teaser</a></p><p><a href="https://www.youtube.com/watch?v=u3I85fqUf6w">DJ SPACEMONKEY live at Republic Club Pattaya</a></p></section><section aria-labelledby="services"><h2 id="services">Core Services &amp; Capabilities</h2>${serviceMarkup}<h3>Active software and control protocols</h3><ul>${protocolMarkup}</ul></section><section aria-labelledby="repair"><h2 id="repair">Component-Level Field Bench Repair</h2><ul><li>SMD 0603/0805 rework and PCB trace reconstruction</li><li>17 SMPS power-supply rebuilds</li><li>UART / EEPROM receiving-card recovery</li></ul></section><section aria-labelledby="projects"><h2 id="projects">Core Case Studies</h2>${projectMarkup}</section><section id="contact"><h2>Contact Primordial Video</h2><p>Pittsburgh (PIT) / Pattaya — available for global touring and residencies.</p><p><a href="mailto:Brice@primordial.video">Brice@primordial.video</a> · <a href="tel:+14123767138">(412) 376-7138</a> · <a href="/Brice-Morneau-CV.pdf">Download CV</a></p><p><a href="mailto:Brice@primordial.video?subject=Technical%20Direction%20inquiry">Request technical direction availability</a></p></section></main></div>`;
const html = readFileSync(htmlPath, 'utf8');
const marked = /<!-- PRERENDER:START -->[\s\S]*?<!-- PRERENDER:END -->/;
if (!marked.test(html)) throw new Error('prerender: PRERENDER markers missing from dist/index.html');
writeFileSync(htmlPath, html.replace(marked, `<!-- PRERENDER:START -->\n    ${payload}\n    <!-- PRERENDER:END -->`));
console.log(`prerender: injected complete markup for ${portfolio.projects.length} projects`);
