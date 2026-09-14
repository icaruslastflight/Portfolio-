/**
 * Injects the project list into dist/index.html as real markup.
 *
 * The app is a client-rendered SPA, so crawlers and link scrapers otherwise
 * receive an empty <div id="root">. React replaces this content on mount, so
 * what ships here is the same information the user sees -- not hidden text.
 *
 * Data is read from src/App.jsx rather than duplicated, so the two cannot drift.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(resolve(root, 'src/App.jsx'), 'utf8');
const htmlPath = resolve(root, 'dist/index.html');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const field = (block, name) => (block.match(new RegExp(`${name}: "((?:[^"\\\\]|\\\\.)*)"`)) || [, ''])[1];

// Each project begins at `id: "<slug>",` followed by title/role/etc.
const projects = src
  .split(/\n  \{\n    id: "/)
  .slice(1)
  .map((b) => ({
    title: field(b, 'title'),
    role: field(b, 'role'),
    location: field(b, 'location'),
    discipline: field(b, 'discipline'),
    summary: field(b, 'summary'),
  }))
  .filter((p) => p.title && p.summary);

if (projects.length === 0) {
  console.error('prerender: no projects parsed from src/App.jsx - refusing to ship an empty shell');
  process.exit(1);
}

const body = projects
  .map(
    (p) => `      <article>
        <h2>${esc(p.title)}</h2>
        <p><strong>${esc(p.role)}</strong>${p.location ? ` &mdash; ${esc(p.location)}` : ''}</p>
        <p>${esc(p.summary)}</p>
      </article>`
  )
  .join('\n');

const payload = `<div id="root">
    <div>
      <h1>Brice Anthony Morneau</h1>
      <p>Technical Director &amp; Systems Architect</p>
${body}
    </div>
  </div>`;

const html = readFileSync(htmlPath, 'utf8');
const marked = /<!-- PRERENDER:START -->[\s\S]*?<!-- PRERENDER:END -->/;
if (!marked.test(html)) {
  console.error('prerender: PRERENDER markers missing from dist/index.html');
  process.exit(1);
}

writeFileSync(
  htmlPath,
  html.replace(marked, `<!-- PRERENDER:START -->\n    ${payload}\n    <!-- PRERENDER:END -->`)
);
console.log(`prerender: injected ${projects.length} projects into dist/index.html`);
