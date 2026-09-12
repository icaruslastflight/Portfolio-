const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add imports
const importRegex = /import \{([^\}]+)\} from '\.\/components\/layout\/DashboardLayout';/;
content = content.replace("import { DashboardLayout } from './components/layout/DashboardLayout';", "import { DashboardLayout } from './components/layout/DashboardLayout';\nimport { JobBoardView } from './components/JobBoardView';\nimport { JobEditModal } from './components/JobEditModal';");

// Add job match type
content = content.replace("ItemType,", "ItemType,\n  JobMatch,");

// Add state for jobs
const stateRegex = /const \[items, setItems\] = useLocalStorage<PortfolioItem\[\]>\('portfolio_items', defaultItems\);/;
const stateReplacement = `const [items, setItems] = useLocalStorage<PortfolioItem[]>('portfolio_items', defaultItems);\n  const [jobs, setJobs] = useLocalStorage<JobMatch[]>('portfolio_jobs', []);\n  const [isJobModalOpen, setIsJobModalOpen] = useState(false);\n  const [jobToEdit, setJobToEdit] = useState<JobMatch | null>(null);`;
content = content.replace(stateRegex, stateReplacement);

// Add viewMode = 'jobs' condition
const jobsViewRegex = /\{viewMode === 'projects' && \(/;
const jobsViewReplacement = `{viewMode === 'jobs' && (
        <JobBoardView
          jobs={jobs}
          onAddJob={() => { setJobToEdit(null); setIsJobModalOpen(true); }}
          onEditJob={(job) => { setJobToEdit(job); setIsJobModalOpen(true); }}
          onDeleteJob={(id) => setJobs(prev => prev.filter(j => j.id !== id))}
          onGenerateApplication={(job) => {
            // Placeholder: would trigger AI pipeline
            showToast(\`Generating tailored application for \${job.title}...\`);
            setIsExportPreviewOpen(true);
          }}
        />
      )}

      {viewMode === 'projects' && (`;

content = content.replace(jobsViewRegex, jobsViewReplacement);

// Add JobEditModal
const modalsRegex = /\{isItemModalOpen && \(/;
const modalsReplacement = `{isJobModalOpen && (
        <JobEditModal
          isOpen={isJobModalOpen}
          job={jobToEdit}
          onClose={() => setIsJobModalOpen(false)}
          onSave={(job) => {
            setJobs(prev => {
              const exists = prev.find(j => j.id === job.id);
              if (exists) return prev.map(j => j.id === job.id ? job : j);
              return [job, ...prev];
            });
            setIsJobModalOpen(false);
            showToast('Job saved successfully');
          }}
        />
      )}
      {isItemModalOpen && (`;

content = content.replace(modalsRegex, modalsReplacement);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx updated');
