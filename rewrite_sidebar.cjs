const fs = require('fs');
let content = fs.readFileSync('src/components/layout/SidebarNav.tsx', 'utf8');

const imports = /import \{([^\}]+)\} from 'lucide-react';/;
content = content.replace(imports, "import { Layers, Briefcase, Sparkles, Film, User, Globe, Search, Archive, Target } from 'lucide-react';");

const countsRegex = /assets: number;\n    deck: number;\n  \};/;
content = content.replace(countsRegex, "assets: number;\n    jobs: number;\n    deck: number;\n  };");

const navItemsRegex = /const navItems = \[/;
const navItemsReplacement = `const navItems = [\n    { id: 'jobs', label: 'Job Board', icon: Target, count: counts.jobs, activeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },`;
content = content.replace(navItemsRegex, navItemsReplacement);

fs.writeFileSync('src/components/layout/SidebarNav.tsx', content);
console.log('SidebarNav.tsx updated');
