import React, { useState } from 'react';
import { Category, PortfolioItem } from '../types';
import { X, Plus, Trash2, Edit2, Check, Folder, Palette } from 'lucide-react';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  items: PortfolioItem[];
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const AVAILABLE_COLORS = [
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-500' },
  { id: 'sky', label: 'Sky Blue', bg: 'bg-sky-500' },
  { id: 'rose', label: 'Rose Pink', bg: 'bg-rose-500' },
  { id: 'emerald', label: 'Emerald Green', bg: 'bg-emerald-500' },
  { id: 'amber', label: 'Amber Orange', bg: 'bg-amber-500' },
  { id: 'violet', label: 'Violet Purple', bg: 'bg-violet-500' },
  { id: 'fuchsia', label: 'Fuchsia', bg: 'bg-fuchsia-500' },
  { id: 'slate', label: 'Stone Slate', bg: 'bg-stone-8000' }
];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  items,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editColor, setEditColor] = useState('indigo');

  // New category state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newColor, setNewColor] = useState('indigo');

  if (!isOpen) return null;

  const handleStartEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditName(cat.name);
    setEditDesc(cat.description || '');
    setEditColor(cat.color);
  };

  const handleSaveEdit = (cat: Category) => {
    if (!editName.trim()) return;
    onUpdateCategory({
      ...cat,
      name: editName.trim(),
      description: editDesc.trim(),
      color: editColor
    });
    setEditingCatId(null);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newCategory: Category = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: newName.trim(),
      description: newDesc.trim(),
      color: newColor,
      icon: 'Folder'
    };

    onAddCategory(newCategory);
    setNewName('');
    setNewDesc('');
    setNewColor('indigo');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div 
        id="category-manager-modal-dialog"
        className="bg-stone-900 w-full max-w-xl max-h-[85vh] rounded-2xl shadow-2xl border border-stone-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-800/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-100 flex items-center gap-2">
              <Folder className="w-5 h-5 text-indigo-600" />
              <span>Customize Categories</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Create, rename, recolor, and curate your portfolio &amp; resume categories.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-200 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* New Category Form */}
          <form onSubmit={handleCreateCategory} className="p-4 bg-stone-800 rounded-xl border border-stone-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Create New Category
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Category Name (e.g. Case Studies)"
                className="px-3 py-1.5 rounded-lg border border-stone-700 text-xs sm:text-sm text-stone-100 bg-stone-900"
              />
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Optional description"
                className="px-3 py-1.5 rounded-lg border border-stone-700 text-xs sm:text-sm text-stone-100 bg-stone-900"
              />
            </div>

            {/* Color selection */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-stone-400 font-medium">Color:</span>
                <div className="flex items-center gap-1">
                  {AVAILABLE_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setNewColor(c.id)}
                      className={`w-5 h-5 rounded-full ${c.bg} transition-transform ${
                        newColor === c.id ? 'ring-2 ring-stone-900 ring-offset-1 scale-110' : 'hover:scale-105'
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>
          </form>

          {/* Existing Categories List */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Existing Categories ({categories.length})
            </h3>

            {categories.map((cat) => {
              const itemCount = items.filter((i) => i.categoryId === cat.id).length;
              const isEditing = editingCatId === cat.id;

              if (isEditing) {
                return (
                  <div key={cat.id} className="p-3 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-2.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded border border-indigo-300 text-xs font-medium text-stone-100 bg-stone-900"
                      />
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Description..."
                        className="flex-1 px-2.5 py-1.5 rounded border border-indigo-300 text-xs text-stone-300 bg-stone-900"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {AVAILABLE_COLORS.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setEditColor(c.id)}
                            className={`w-4 h-4 rounded-full ${c.bg} ${
                              editColor === c.id ? 'ring-2 ring-stone-900 ring-offset-1 scale-110' : ''
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingCatId(null)}
                          className="px-2.5 py-1 text-xs text-stone-400 hover:bg-stone-200 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(cat)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded text-xs font-medium"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-stone-800 bg-stone-900 hover:border-stone-700 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-3 h-3 rounded-full bg-${cat.color}-500 shrink-0`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-stone-100 truncate">
                          {cat.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 font-medium">
                          {itemCount} {itemCount === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                      {cat.description && (
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(cat)}
                      className="p-1.5 rounded text-stone-400 hover:text-stone-300 hover:bg-stone-800"
                      title="Edit category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              `Delete category "${cat.name}"? Items in this category will be moved to another category.`
                            )
                          ) {
                            onDeleteCategory(cat.id);
                          }
                        }}
                        className="p-1.5 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-800 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
