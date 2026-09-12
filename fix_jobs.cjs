const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add JOBS to STORAGE_KEYS
content = content.replace(
  "SKILL_GROUPS: 'brice_morneau_portfolio_skill_groups_v2'",
  "SKILL_GROUPS: 'brice_morneau_portfolio_skill_groups_v2',\n  JOBS: 'brice_morneau_portfolio_jobs_v2'"
);

// 2. Add jobs state below items state
const itemsStateEndRegex = /return DEFAULT_ITEMS;\n  \}\);\n/;
const jobsStateCode = `
  const [jobs, setJobs] = useState<JobMatch[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading jobs', e);
      }
    }
    return [];
  });
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<JobMatch | null>(null);
`;
content = content.replace(itemsStateEndRegex, "return DEFAULT_ITEMS;\n  });\n" + jobsStateCode);

// 3. Add useEffect to save jobs
const useEffectItemsEndRegex = /localStorage\.setItem\(STORAGE_KEYS\.ITEMS, JSON\.stringify\(items\)\);\n  \}, \[items\]\);/;
const useEffectJobsCode = `\n\n  useEffect(() => {\n    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));\n  }, [jobs]);`;
content = content.replace(useEffectItemsEndRegex, "localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));\n  }, [items]);" + useEffectJobsCode);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx jobs state fixed');
