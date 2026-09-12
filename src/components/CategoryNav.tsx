import React, { useState } from 'react';
import { Category, ItemType } from '../types';
import { 
  Folder, 
  Sparkles, 
  Briefcase, 
  Image as ImageIcon, 
  Wrench, 
  GraduationCap, 
  Layers, 
  Plus, 
  SlidersHorizontal,
  Star,
  FileText,
  Monitor,
  Cpu,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface CategoryNavProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  selectedType: ItemType | 'all' | 'starred';
  onSelectType: (type: ItemType | 'all' | 'starred') => void;
  categoryItemCounts: Record<string, number>;
  totalItemsCount: number;
  starredCount: number;
  onMoveItemToCategory: (itemId: string, targetCategoryId: string) => void;
  onOpenCategoryManager: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-4 h-4" />,
  Briefcase: <Briefcase className="w-4 h-4" />,
  Image: <ImageIcon className="w-4 h-4" />,
  Wrench: <Wrench className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />,
  Folder: <Folder className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Monitor: <Monitor className="w-4 h-4" />,
  Cpu: <Cpu className="w-4 h-4" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />
};

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; activeBg: string; activeText: string }> = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', activeBg: 'bg-indigo-600', activeText: 'text-white' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', activeBg: 'bg-sky-600', activeText: 'text-white' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', activeBg: 'bg-rose-600', activeText: 'text-white' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', activeBg: 'bg-emerald-600', activeText: 'text-white' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', activeBg: 'bg-amber-600', activeText: 'text-white' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', activeBg: 'bg-violet-600', activeText: 'text-white' },
  fuchsia: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-200', activeBg: 'bg-fuchsia-600', activeText: 'text-white' },
  slate: { bg: 'bg-stone-800', text: 'text-stone-300', border: 'border-stone-800', activeBg: 'bg-stone-800', activeText: 'text-white' }
};

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  selectedType,
  onSelectType,
  categoryItemCounts,
  totalItemsCount,
  starredCount,
  onMoveItemToCategory,
  onOpenCategoryManager
}) => {
  const [dragOverCatId, setDragOverCatId] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent, catId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCatId !== catId) {
      setDragOverCatId(catId);
    }
  };

  const handleDragLeave = (catId: string) => {
    if (dragOverCatId === catId) {
      setDragOverCatId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, catId: string) => {
    e.preventDefault();
    setDragOverCatId(null);
    const itemId = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('application/json');
    if (itemId) {
      onMoveItemToCategory(itemId, catId);
    }
  };

  return (
    <div id="category-navigation-panel" className="bg-stone-900 border-b border-stone-800 px-4 sm:px-6 py-3 sticky top-0 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Pills with Drop Target capability */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            id="cat-pill-all"
            type="button"
            onClick={() => onSelectCategory(null)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategoryId === null
                ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                : 'bg-stone-800 text-stone-300 border-stone-800 hover:bg-stone-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Projects & Jobs</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
              selectedCategoryId === null ? 'bg-stone-700 text-stone-100' : 'bg-stone-200 text-stone-400'
            }`}>
              {totalItemsCount}
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const isDragOver = dragOverCatId === cat.id;
            const count = categoryItemCounts[cat.id] || 0;
            const theme = COLOR_MAP[cat.color] || COLOR_MAP.indigo;

            return (
              <button
                key={cat.id}
                id={`cat-pill-${cat.id}`}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                onDragOver={(e) => handleDragOver(e, cat.id)}
                onDragLeave={() => handleDragLeave(cat.id)}
                onDrop={(e) => handleDrop(e, cat.id)}
                title={`Click to filter. Drag any project card onto this tab to recategorize it!`}
                className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? `${theme.activeBg} ${theme.activeText} border-transparent shadow-xs`
                    : `${theme.bg} ${theme.text} ${theme.border} hover:opacity-90`
                } ${isDragOver ? 'ring-2 ring-indigo-500 ring-offset-1 scale-105 transition-transform' : ''}`}
              >
                <span className="opacity-80">
                  {cat.icon && CATEGORY_ICONS[cat.icon] ? CATEGORY_ICONS[cat.icon] : <Folder className="w-3.5 h-3.5" />}
                </span>
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-medium ${
                    isSelected ? 'bg-stone-900/25 text-white' : 'bg-stone-900 text-stone-300 border border-stone-800/60'
                  }`}
                >
                  {count}
                </span>
                {isDragOver && (
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] py-0.5 px-1.5 rounded shadow whitespace-nowrap z-30">
                    Drop to move here
                  </span>
                )}
              </button>
            );
          })}

          <button
            id="cat-manage-button"
            type="button"
            onClick={onOpenCategoryManager}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-400 border border-dashed border-stone-700 hover:border-stone-400 hover:bg-stone-800 transition-colors whitespace-nowrap"
            title="Add or edit project/job categories"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Job Categories</span>
          </button>
        </div>

        {/* Type / Sub-Filter tabs */}
        <div className="flex items-center gap-1 self-start md:self-auto shrink-0 bg-stone-800 p-1 rounded-lg border border-stone-800">
          <button
            type="button"
            onClick={() => onSelectType('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              selectedType === 'all'
                ? 'bg-stone-900 text-stone-100 shadow-2xs font-semibold'
                : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            All Types
          </button>
          <button
            type="button"
            onClick={() => onSelectType('image')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              selectedType === 'image'
                ? 'bg-stone-900 text-stone-100 shadow-2xs font-semibold'
                : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            <ImageIcon className="w-3 h-3 text-rose-500" />
            Images
          </button>
          <button
            type="button"
            onClick={() => onSelectType('info')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              selectedType === 'info'
                ? 'bg-stone-900 text-stone-100 shadow-2xs font-semibold'
                : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            <FileText className="w-3 h-3 text-sky-500" />
            Resume Info
          </button>
          <button
            type="button"
            onClick={() => onSelectType('starred')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              selectedType === 'starred'
                ? 'bg-stone-900 text-stone-100 shadow-2xs font-semibold'
                : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            Starred ({starredCount})
          </button>
        </div>
      </div>
    </div>
  );
};
