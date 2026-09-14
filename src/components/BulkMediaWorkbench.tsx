import React, { useState, useRef, useMemo } from 'react';
import { PortfolioItem, Category, ManagedAsset, AuxiliaryAsset, MediaDisplayMode, ImageGroup } from '../types';
import { 
  Upload, 
  Film, 
  Image as ImageIcon, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Search, 
  SlidersHorizontal, 
  Layers, 
  Briefcase, 
  ArrowUpDown, 
  Check, 
  X, 
  Play, 
  Maximize2, 
  Link2, 
  Sparkles,
  RefreshCw,
  FolderSync,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface BulkMediaWorkbenchProps {
  items: PortfolioItem[];
  categories: Category[];
  managedAssets: ManagedAsset[];
  onUpdateItem: (updatedItem: PortfolioItem) => void;
  onBatchUpdateItems: (updatedItems: PortfolioItem[]) => void;
  onAddAsset: (asset: ManagedAsset) => void;
  onBatchAddAssets: (assets: ManagedAsset[]) => void;
  onRemoveAsset: (filename: string) => void;
  onClose?: () => void;
  onOpenImageLightbox?: (url: string, title: string) => void;
}

export const BulkMediaWorkbench: React.FC<BulkMediaWorkbenchProps> = ({
  items,
  categories,
  managedAssets,
  onUpdateItem,
  onBatchUpdateItems,
  onAddAsset,
  onBatchAddAssets,
  onRemoveAsset,
  onClose,
  onOpenImageLightbox
}) => {
  // Top Section: Media Gallery States
  const [selectedAssetFilename, setSelectedAssetFilename] = useState<string | null>(
    managedAssets[0]?.filename || null
  );
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [assetTypeFilter, setAssetTypeFilter] = useState<'all' | 'video' | 'image' | 'assigned' | 'unassigned'>('all');
  const [isDraggingBulk, setIsDraggingBulk] = useState(false);
  const [bulkUploadStatus, setBulkUploadStatus] = useState<string | null>(null);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);

  // URL Add State
  const [showUrlAddModal, setShowUrlAddModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlFilenameInput, setUrlFilenameInput] = useState('');
  const [urlTypeInput, setUrlTypeInput] = useState<'video' | 'image'>('video');

  // Bottom Section: Jobs & Projects States
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category' | 'needsMedia' | 'hasMedia'>('date');
  const [showOnlyUnassigned, setShowOnlyUnassigned] = useState(false);
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [dragOverJobId, setDragOverJobId] = useState<string | null>(null);

  // Quick helper to resolve full media URL
  const resolveAssetSrc = (asset: ManagedAsset): string => {
    if (asset.dataUrl) return asset.dataUrl;
    if (asset.externalUrl) return asset.externalUrl;
    return `https://primordial-portfolio.netlify.app/media/${encodeURIComponent(asset.filename)}`;
  };

  // Map: filename -> array of portfolio items that use this asset
  const assetUsageMap = useMemo(() => {
    const map = new Map<string, PortfolioItem[]>();
    managedAssets.forEach((a) => map.set(a.filename, []));

    items.forEach((item) => {
      // Primary media
      if (item.mediaFilename) {
        const existing = map.get(item.mediaFilename) || [];
        if (!existing.some((it) => it.id === item.id)) {
          existing.push(item);
          map.set(item.mediaFilename, existing);
        }
      }
      // Auxiliary assets
      item.auxiliaryAssets?.forEach((aux) => {
        if (aux.filename) {
          const existing = map.get(aux.filename) || [];
          if (!existing.some((it) => it.id === item.id)) {
            existing.push(item);
            map.set(aux.filename, existing);
          }
        }
      });
      // Grouped images
      item.imageGroups?.forEach((grp) => {
        grp.images.forEach((img) => {
          if (img.filename) {
            const existing = map.get(img.filename) || [];
            if (!existing.some((it) => it.id === item.id)) {
              existing.push(item);
              map.set(img.filename, existing);
            }
          }
        });
      });
    });

    return map;
  }, [managedAssets, items]);

  // Active selected asset
  const activeAsset = useMemo(() => {
    if (!selectedAssetFilename) return managedAssets[0] || null;
    return managedAssets.find((a) => a.filename === selectedAssetFilename) || managedAssets[0] || null;
  }, [managedAssets, selectedAssetFilename]);

  // Filtered Assets for the top thumbnail strip
  const filteredAssets = useMemo(() => {
    return managedAssets.filter((asset) => {
      // Search
      if (assetSearchQuery) {
        const query = assetSearchQuery.toLowerCase();
        const matchesName = asset.filename.toLowerCase().includes(query);
        const matchesProj = asset.associatedProjectTitle?.toLowerCase().includes(query);
        if (!matchesName && !matchesProj) return false;
      }

      // Filter
      const usage = assetUsageMap.get(asset.filename) || [];
      if (assetTypeFilter === 'video' && asset.fileType !== 'video') return false;
      if (assetTypeFilter === 'image' && asset.fileType !== 'image') return false;
      if (assetTypeFilter === 'assigned' && usage.length === 0) return false;
      if (assetTypeFilter === 'unassigned' && usage.length > 0) return false;

      return true;
    });
  }, [managedAssets, assetSearchQuery, assetTypeFilter, assetUsageMap]);

  // Filtered & Sorted Jobs/Projects for the bottom section
  const filteredAndSortedItems = useMemo(() => {
    let result = items.filter((item) => {
      // Category filter
      if (selectedCategoryId && item.categoryId !== selectedCategoryId) {
        return false;
      }

      // Text search
      if (jobSearchQuery.trim()) {
        const q = jobSearchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSub = item.subtitle?.toLowerCase().includes(q) || false;
        const matchesRole = item.roleTag?.toLowerCase().includes(q) || false;
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        const matchesLoc = item.location?.toLowerCase().includes(q) || false;
        const matchesContent = item.content.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSub && !matchesRole && !matchesTags && !matchesLoc && !matchesContent) {
          return false;
        }
      }

      // Filter only unassigned
      if (showOnlyUnassigned) {
        const hasPrimary = Boolean(item.mediaFilename || item.imageUrl || item.videoUrl);
        const hasAux = (item.auxiliaryAssets?.length || 0) > 0;
        if (hasPrimary || hasAux) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'category') {
        return (a.categoryId || '').localeCompare(b.categoryId || '');
      }
      if (sortBy === 'needsMedia') {
        const aHas = Boolean(a.mediaFilename || a.imageUrl || a.videoUrl);
        const bHas = Boolean(b.mediaFilename || b.imageUrl || b.videoUrl);
        if (!aHas && bHas) return -1;
        if (aHas && !bHas) return 1;
        return 0;
      }
      if (sortBy === 'hasMedia') {
        const aHas = Boolean(a.mediaFilename || a.imageUrl || a.videoUrl);
        const bHas = Boolean(b.mediaFilename || b.imageUrl || b.videoUrl);
        if (aHas && !bHas) return -1;
        if (!aHas && bHas) return 1;
        return 0;
      }
      // default: date / order
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    });

    return result;
  }, [items, selectedCategoryId, jobSearchQuery, showOnlyUnassigned, sortBy]);

  // Bulk File Ingest Handler
  const handleBulkFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    setBulkUploadStatus(`Processing ${fileList.length} media files...`);
    const newAssets: ManagedAsset[] = [];

    for (const file of fileList) {
      const isVid = file.type.startsWith('video/') || 
        file.name.endsWith('.mp4') || 
        file.name.endsWith('.webm') || 
        file.name.endsWith('.mov') || 
        file.name.endsWith('.m4v');
      
      const fileType = isVid ? 'video' : 'image';
      // Immediate object URL for instant zero-lag rendering
      const objectUrl = URL.createObjectURL(file);

      const newAsset: ManagedAsset = {
        filename: file.name,
        fileType,
        associatedProjectTitle: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        dataUrl: objectUrl,
        fileSize: file.size,
        updatedAt: Date.now()
      };
      newAssets.push(newAsset);
    }

    onBatchAddAssets(newAssets);
    if (newAssets.length > 0) {
      setSelectedAssetFilename(newAssets[0].filename);
    }
    setBulkUploadStatus(`Successfully staged ${newAssets.length} files into visual gallery!`);
    setTimeout(() => setBulkUploadStatus(null), 4000);
  };

  // Add Asset via URL
  const handleAddUrlAsset = () => {
    if (!urlInput.trim()) return;
    const cleanFilename = urlFilenameInput.trim() || urlInput.split('/').pop()?.split('?')[0] || 'stream-asset.mp4';
    const isVid = urlTypeInput === 'video' || cleanFilename.endsWith('.mp4') || cleanFilename.endsWith('.webm');

    const newAsset: ManagedAsset = {
      filename: cleanFilename,
      fileType: isVid ? 'video' : 'image',
      associatedProjectTitle: cleanFilename,
      externalUrl: urlInput.trim(),
      updatedAt: Date.now()
    };

    onAddAsset(newAsset);
    setSelectedAssetFilename(newAsset.filename);
    setUrlInput('');
    setUrlFilenameInput('');
    setShowUrlAddModal(false);
  };

  // Apply Active Asset as Primary Media to a single Job/Project
  const handleApplyAsPrimary = (item: PortfolioItem, asset: ManagedAsset) => {
    const isVid = asset.fileType === 'video';
    const resolvedUrl = resolveAssetSrc(asset);

    const updated: PortfolioItem = {
      ...item,
      type: isVid ? 'video' : item.type === 'video' ? 'project' : item.type,
      mediaFilename: asset.filename,
      imageUrl: isVid ? '' : resolvedUrl,
      videoUrl: isVid ? resolvedUrl : '',
      updatedAt: Date.now()
    };

    onUpdateItem(updated);
  };

  // Add Active Asset as an Auxiliary Gallery Asset to a single Job/Project
  const handleAddToAuxiliary = (item: PortfolioItem, asset: ManagedAsset) => {
    const resolvedUrl = resolveAssetSrc(asset);
    const existing = item.auxiliaryAssets || [];
    
    // Check if already in aux
    if (existing.some((a) => a.filename === asset.filename)) {
      return;
    }

    const newAux: AuxiliaryAsset = {
      id: `aux_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      label: asset.fileType === 'video' ? 'Video Demonstration' : 'Media Asset',
      filename: asset.filename,
      url: resolvedUrl,
      fileType: asset.fileType
    };

    const updated: PortfolioItem = {
      ...item,
      auxiliaryAssets: [...existing, newAux],
      updatedAt: Date.now()
    };

    onUpdateItem(updated);
  };

  // Detach Active Asset from a single Job/Project
  const handleDetachAsset = (item: PortfolioItem, filename: string) => {
    let updated = { ...item };

    // If it's primary media
    if (item.mediaFilename === filename) {
      updated.mediaFilename = '';
      updated.imageUrl = '';
      updated.videoUrl = '';
    }

    // If it's in auxiliary
    if (item.auxiliaryAssets?.some((a) => a.filename === filename)) {
      updated.auxiliaryAssets = item.auxiliaryAssets.filter((a) => a.filename !== filename);
    }

    // If it's in image groups
    if (item.imageGroups?.some((g) => g.images.some((img) => img.filename === filename))) {
      updated.imageGroups = item.imageGroups.map((g) => ({
        ...g,
        images: g.images.filter((img) => img.filename !== filename)
      })).filter((g) => g.images.length > 0 || g.name.trim().length > 0);
    }

    updated.updatedAt = Date.now();
    onUpdateItem(updated);
  };

  // Add Active Asset to an Image Group with Context
  const handleAddToImageGroup = (item: PortfolioItem, asset: ManagedAsset) => {
    const existingGroups = item.imageGroups || [];
    let updatedGroups: ImageGroup[];
    
    if (existingGroups.length === 0) {
      updatedGroups = [
        {
          id: `grp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          name: 'Project Visuals & Context',
          context: 'Staged media assets with operational and design notes',
          images: [
            {
              id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              filename: asset.filename,
              caption: asset.filename.replace(/\.[^/.]+$/, ''),
              context: 'Live deployment record'
            }
          ]
        }
      ];
    } else {
      const newImg = {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        filename: asset.filename,
        caption: asset.filename.replace(/\.[^/.]+$/, ''),
        context: 'Staged asset'
      };
      updatedGroups = existingGroups.map((g, idx) =>
        idx === 0 ? { ...g, images: [...g.images, newImg] } : g
      );
    }

    onUpdateItem({
      ...item,
      imageGroups: updatedGroups,
      updatedAt: Date.now()
    });
  };

  // Change display mode directly from workbench
  const handleChangeDisplayMode = (item: PortfolioItem, mode: MediaDisplayMode) => {
    onUpdateItem({
      ...item,
      mediaDisplayMode: mode,
      updatedAt: Date.now()
    });
  };

  // Batch Apply Active Asset to All Selected Jobs/Projects
  const handleBatchApplyToSelected = (asAux: boolean = false) => {
    if (!activeAsset || selectedJobIds.length === 0) return;

    const isVid = activeAsset.fileType === 'video';
    const resolvedUrl = resolveAssetSrc(activeAsset);

    const updatedList = items
      .filter((it) => selectedJobIds.includes(it.id))
      .map((item) => {
        if (asAux) {
          const existing = item.auxiliaryAssets || [];
          if (existing.some((a) => a.filename === activeAsset.filename)) return item;
          const newAux: AuxiliaryAsset = {
            id: `aux_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            label: isVid ? 'Video Demonstration' : 'Media Asset',
            filename: activeAsset.filename,
            url: resolvedUrl,
            fileType: activeAsset.fileType
          };
          return {
            ...item,
            auxiliaryAssets: [...existing, newAux],
            updatedAt: Date.now()
          };
        } else {
          return {
            ...item,
            type: (isVid ? 'video' : item.type === 'video' ? 'project' : item.type) as any,
            mediaFilename: activeAsset.filename,
            imageUrl: isVid ? '' : resolvedUrl,
            videoUrl: isVid ? resolvedUrl : '',
            updatedAt: Date.now()
          };
        }
      });

    onBatchUpdateItems(updatedList);
    setSelectedJobIds([]);
  };

  // Batch Selection Helpers
  const handleToggleSelectJob = (id: string) => {
    setSelectedJobIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    if (selectedJobIds.length === filteredAndSortedItems.length) {
      setSelectedJobIds([]);
    } else {
      setSelectedJobIds(filteredAndSortedItems.map((it) => it.id));
    }
  };

  return (
    <div className="bg-stone-950 min-h-screen pb-20">
      {/* Top Section: Visual Media Gallery & Bulk Upload Area */}
      <div className="bg-stone-900 border-b border-stone-800 text-stone-100 px-4 sm:px-6 py-6 shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Visual Media Staging &amp; Quick-Apply Studio
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-mono font-medium">
                    {managedAssets.length} Staged Assets
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Bulk upload images &amp; video reels, preview thumbnails visually, and apply assets across multiple jobs, projects, or experiences.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Add by URL button */}
              <button
                type="button"
                onClick={() => setShowUrlAddModal(true)}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono border border-stone-700 flex items-center gap-1.5 transition-colors"
                title="Add video or image by direct URL"
              >
                <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add via URL</span>
              </button>

              {/* Bulk File Upload Button */}
              <button
                type="button"
                onClick={() => bulkFileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-stone-950 text-xs font-bold font-mono flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Bulk Upload Files</span>
              </button>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                  title="Close Media Studio"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Hidden Bulk File Input */}
          <input
            ref={bulkFileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.mp4,.mov,.webm,.m4v,.png,.jpg,.jpeg,.gif,.webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleBulkFiles(e.target.files);
              e.target.value = '';
            }}
          />

          {/* Drag and Drop Zone Banner (when dragging files or idle) */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingBulk(true);
            }}
            onDragLeave={() => setIsDraggingBulk(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingBulk(false);
              if (e.dataTransfer.files) handleBulkFiles(e.dataTransfer.files);
            }}
            onClick={() => bulkFileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
              isDraggingBulk
                ? 'border-sky-400 bg-sky-950/50 scale-[1.01]'
                : 'border-stone-800 hover:border-stone-700 bg-stone-950/40'
            }`}
          >
            <div className="flex items-center justify-center gap-3 text-xs">
              <Upload className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="font-semibold text-stone-200">
                Drag &amp; drop multiple videos and images anywhere here
              </span>
              <span className="text-stone-400 hidden sm:inline">•</span>
              <span className="text-stone-400 font-mono text-[11px] hidden sm:inline">
                Supports batch MP4, MOV, WebM, PNG, JPG (select 10+ at once)
              </span>
            </div>
          </div>

          {bulkUploadStatus && (
            <div className="p-2 rounded bg-sky-900/40 border border-sky-700 text-xs font-mono text-sky-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>{bulkUploadStatus}</span>
            </div>
          )}

          {/* Asset Filters & Active Asset Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-xs font-mono overflow-x-auto pb-1 max-w-full">
              <button
                type="button"
                onClick={() => setAssetTypeFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  assetTypeFilter === 'all'
                    ? 'bg-sky-500 text-black font-bold'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                All Assets ({managedAssets.length})
              </button>
              <button
                type="button"
                onClick={() => setAssetTypeFilter('video')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors ${
                  assetTypeFilter === 'video'
                    ? 'bg-sky-500 text-black font-bold'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <Film className="w-3 h-3 text-sky-400" />
                <span>Videos ({managedAssets.filter((a) => a.fileType === 'video').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setAssetTypeFilter('image')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors ${
                  assetTypeFilter === 'image'
                    ? 'bg-sky-500 text-black font-bold'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <ImageIcon className="w-3 h-3 text-amber-400" />
                <span>Images ({managedAssets.filter((a) => a.fileType === 'image').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setAssetTypeFilter('unassigned')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors ${
                  assetTypeFilter === 'unassigned'
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <span>Unassigned ({managedAssets.filter((a) => (assetUsageMap.get(a.filename) || []).length === 0).length})</span>
              </button>
            </div>

            {/* Asset Search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={assetSearchQuery}
                onChange={(e) => setAssetSearchQuery(e.target.value)}
                placeholder="Search thumbnails..."
                className="w-full pl-8 pr-3 py-1 rounded-md bg-stone-800 border border-stone-700 text-xs font-mono text-white placeholder:text-stone-500 focus:outline-hidden focus:border-sky-400"
              />
            </div>
          </div>

          {/* Visual Thumbnails Carousel / Strip */}
          <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-stone-900">
            {filteredAssets.length === 0 ? (
              <div className="p-4 text-xs font-mono text-stone-500 text-center w-full">
                No media assets match this filter. Upload files above to get started.
              </div>
            ) : (
              filteredAssets.map((asset) => {
                const isSelected = activeAsset?.filename === asset.filename;
                const usage = assetUsageMap.get(asset.filename) || [];
                const isVid = asset.fileType === 'video';
                const resolvedUrl = resolveAssetSrc(asset);

                return (
                  <div
                    key={asset.filename}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', asset.filename);
                      setSelectedAssetFilename(asset.filename);
                    }}
                    onClick={() => setSelectedAssetFilename(asset.filename)}
                    className={`shrink-0 w-44 sm:w-48 rounded-xl bg-stone-950 border transition-all cursor-pointer overflow-hidden group flex flex-col ${
                      isSelected
                        ? 'border-sky-400 ring-2 ring-sky-400/50 shadow-lg shadow-sky-950/50'
                        : 'border-stone-800 hover:border-stone-600'
                    }`}
                  >
                    {/* Visual Media Box */}
                    <div className="relative w-full h-28 bg-black flex items-center justify-center overflow-hidden">
                      {isVid ? (
                        <div className="relative w-full h-full">
                          <video
                            src={resolvedUrl}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            muted
                            playsInline
                            loop
                            onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                            onMouseLeave={(e) => {
                              const vid = e.target as HTMLVideoElement;
                              vid.pause();
                              vid.currentTime = 0;
                            }}
                          />
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-sky-400 flex items-center gap-1 border border-zinc-800">
                            <Play className="w-2.5 h-2.5" />
                            <span>VIDEO</span>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={resolvedUrl}
                          alt={asset.filename}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                          onError={(e) => {
                            if (!resolvedUrl.includes('primordial-portfolio.netlify.app')) {
                              (e.target as HTMLImageElement).src = `https://primordial-portfolio.netlify.app/media/${encodeURIComponent(asset.filename)}`;
                            }
                          }}
                        />
                      )}

                      {/* Expand Lightbox Button */}
                      {onOpenImageLightbox && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenImageLightbox(resolvedUrl, asset.filename);
                          }}
                          className="absolute bottom-1.5 right-1.5 p-1 rounded bg-black/70 hover:bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Expand Preview"
                        >
                          <Maximize2 className="w-3 h-3" />
                        </button>
                      )}

                      {/* Active Indicator Checkmark */}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 bg-sky-500 text-stone-950 p-1 rounded-full shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Metadata & Status */}
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-mono font-semibold text-stone-200 truncate" title={asset.filename}>
                          {asset.filename}
                        </p>
                        <p className="text-[10px] font-mono text-stone-400 truncate mt-0.5">
                          {asset.associatedProjectTitle || 'Unlabeled Asset'}
                        </p>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-stone-800/80 flex items-center justify-between">
                        {usage.length > 0 ? (
                          <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>Applied to {usage.length} {usage.length === 1 ? 'item' : 'items'}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            <span>Unassigned</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveAsset(asset.filename);
                          }}
                          className="text-stone-500 hover:text-rose-400 p-1 transition-colors"
                          title="Delete from Hub"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Active Asset Banner: Tells the user what's currently active and how to apply */}
          {activeAsset && (
            <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-800/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-sky-500 text-stone-950 font-bold text-[11px]">
                  ACTIVE ASSET
                </span>
                <span className="font-bold text-white text-sm">
                  {activeAsset.filename}
                </span>
                <span className="text-stone-400">
                  ({activeAsset.fileType.toUpperCase()})
                </span>
                <span className="text-stone-300">
                  — Currently applied to <strong className="text-emerald-400">{(assetUsageMap.get(activeAsset.filename) || []).length}</strong> jobs/projects.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-sky-300 font-semibold">
                  Click "+ Apply" on any job below, or select multiple:
                </span>
                {selectedJobIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleBatchApplyToSelected(false)}
                    className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold transition-colors shadow-2xs"
                  >
                    Apply to {selectedJobIds.length} Selected Jobs
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Underneath Section: All Jobs, Experiences, and Projects */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Section Title & Quick Filter Controls */}
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-4 sm:p-5 shadow-2xs mb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-stone-100 tracking-tight flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-stone-300" />
                <span>All Jobs, Experiences &amp; Technical Projects</span>
                <span className="text-xs bg-stone-950 text-stone-400 px-2 py-0.5 rounded-full font-mono">
                  {filteredAndSortedItems.length} {filteredAndSortedItems.length === 1 ? 'item' : 'items'}
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Quickly sort and assign your staged assets. You can apply the same asset to more than one job or project!
              </p>
            </div>

            {/* Quick Sort & Search */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={jobSearchQuery}
                  onChange={(e) => setJobSearchQuery(e.target.value)}
                  placeholder="Filter jobs &amp; projects..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-700 text-xs font-mono text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-stone-800/50"
                />
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-1.5 text-xs font-mono text-stone-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2 py-1.5 rounded-lg border border-stone-700 text-xs font-mono text-stone-200 bg-stone-900"
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title (A - Z)</option>
                  <option value="category">Sort by Category</option>
                  <option value="needsMedia">Sort: Needs Media First</option>
                  <option value="hasMedia">Sort: Has Media First</option>
                </select>
              </div>

              {/* Toggle unassigned filter */}
              <button
                type="button"
                onClick={() => setShowOnlyUnassigned(!showOnlyUnassigned)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                  showOnlyUnassigned
                    ? 'bg-amber-500 text-white border-amber-600 font-bold'
                    : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-950'
                }`}
              >
                Needs Media Only
              </button>
            </div>
          </div>

          {/* Category Quick Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedCategoryId(null)}
              className={`px-3 py-1 rounded-full shrink-0 transition-colors ${
                selectedCategoryId === null
                  ? 'bg-stone-900 text-white font-bold'
                  : 'bg-stone-950 text-stone-400 hover:bg-stone-200'
              }`}
            >
              All Categories ({items.length})
            </button>
            {categories.map((cat) => {
              const count = items.filter((it) => it.categoryId === cat.id).length;
              const isSelected = selectedCategoryId === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(isSelected ? null : cat.id)}
                  className={`px-3 py-1 rounded-full shrink-0 flex items-center gap-1.5 transition-colors ${
                    isSelected
                      ? 'bg-sky-600 text-white font-bold shadow-xs'
                      : 'bg-stone-950 text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="opacity-75 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Batch Multi-Select Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs font-mono text-stone-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedJobIds.length > 0 && selectedJobIds.length === filteredAndSortedItems.length}
                onChange={handleSelectAllFiltered}
                className="w-4 h-4 rounded border-stone-700 text-sky-600 focus:ring-sky-500"
              />
              <span className="font-semibold text-stone-200">
                Select All Visible ({filteredAndSortedItems.length})
              </span>
              {selectedJobIds.length > 0 && (
                <span className="text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {selectedJobIds.length} Selected
                </span>
              )}
            </label>

            {selectedJobIds.length > 0 && activeAsset && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBatchApplyToSelected(false)}
                  className="px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold transition-colors shadow-xs"
                >
                  Set "{activeAsset.filename}" as Primary on {selectedJobIds.length} items
                </button>
                <button
                  type="button"
                  onClick={() => handleBatchApplyToSelected(true)}
                  className="px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-white font-medium transition-colors"
                >
                  Add to Gallery ({selectedJobIds.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedJobIds([])}
                  className="px-2 py-1 text-stone-500 hover:text-stone-200"
                >
                  Deselect
                </button>
              </div>
            )}
          </div>
        </div>

        {/* The Jobs & Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedItems.map((item) => {
            const cat = categories.find((c) => c.id === item.categoryId);
            const isSelectedForBatch = selectedJobIds.includes(item.id);
            
            // Check relationship with active asset
            const isPrimary = Boolean(activeAsset && item.mediaFilename === activeAsset.filename);
            const isInAux = Boolean(activeAsset && item.auxiliaryAssets?.some((a) => a.filename === activeAsset.filename));
            const isInGroup = Boolean(activeAsset && item.imageGroups?.some((g) => g.images.some((img) => img.filename === activeAsset.filename)));
            const isApplied = isPrimary || isInAux || isInGroup;

            // Current item media preview
            const currentMediaUrl = item.videoUrl || item.imageUrl || (item.mediaFilename ? `https://primordial-portfolio.netlify.app/media/${encodeURIComponent(item.mediaFilename)}` : '');
            const hasExistingMedia = Boolean(item.mediaFilename || item.imageUrl || item.videoUrl);

            return (
              <div
                key={item.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverJobId(item.id);
                }}
                onDragLeave={() => setDragOverJobId(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverJobId(null);
                  const droppedFilename = e.dataTransfer.getData('text/plain');
                  const asset = managedAssets.find((a) => a.filename === droppedFilename) || activeAsset;
                  if (asset) handleApplyAsPrimary(item, asset);
                }}
                className={`rounded-2xl border transition-all p-4 flex flex-col justify-between bg-stone-900 ${
                  dragOverJobId === item.id
                    ? 'ring-2 ring-sky-500 bg-sky-50/50 scale-[1.01]'
                    : isApplied
                    ? 'border-emerald-400 ring-2 ring-emerald-400/30 shadow-md'
                    : isSelectedForBatch
                    ? 'border-sky-400 bg-sky-50/20'
                    : 'border-stone-800 hover:border-stone-700 shadow-2xs'
                }`}
              >
                <div>
                  {/* Top metadata row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelectedForBatch}
                        onChange={() => handleToggleSelectJob(item.id)}
                        className="w-4 h-4 rounded border-stone-700 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-stone-950 text-stone-300 font-semibold truncate max-w-[170px]">
                        {cat?.name || 'Milestone'}
                      </span>
                    </label>

                    {item.date && (
                      <span className="text-[11px] font-mono text-stone-400">
                        {item.date}
                      </span>
                    )}
                  </div>

                  {/* Title & Role */}
                  <h4 className="text-sm font-bold text-stone-100 leading-snug">
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="text-xs text-stone-500 font-mono mt-0.5">
                      {item.subtitle}
                    </p>
                  )}
                  {item.location && (
                    <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                      📍 {item.location}
                    </p>
                  )}

                  {/* Description excerpt */}
                  <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>

                  {/* Current Media Status Display */}
                  <div className="mt-3 p-2.5 rounded-xl bg-stone-800 border border-stone-800 flex items-center gap-3">
                    <div className="w-14 h-10 rounded-lg bg-stone-900 overflow-hidden shrink-0 flex items-center justify-center border border-stone-700">
                      {hasExistingMedia && currentMediaUrl ? (
                        item.videoUrl ? (
                          <video src={currentMediaUrl} className="w-full h-full object-cover" muted />
                        ) : (
                          <img src={currentMediaUrl} alt="" className="w-full h-full object-cover" />
                        )
                      ) : (
                        <Film className="w-4 h-4 text-stone-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-xs font-mono">
                      {hasExistingMedia ? (
                        <>
                          <p className="text-stone-200 font-bold truncate">
                            {item.mediaFilename || 'Embedded Media'}
                          </p>
                          <p className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold mt-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Primary Media Linked</span>
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-stone-500 italic">No media attached</p>
                          <p className="text-[10px] text-amber-600 font-medium">Ready for assignment</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Auxiliary Assets Pill */}
                  {(item.auxiliaryAssets?.length || 0) > 0 && (
                    <div className="mt-2 text-[11px] font-mono text-stone-500 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-stone-400" />
                      <span>{item.auxiliaryAssets?.length} gallery assets attached</span>
                    </div>
                  )}

                  {/* Image Groups Pill */}
                  {(item.imageGroups?.length || 0) > 0 && (
                    <div className="mt-1 text-[11px] font-mono text-sky-700 flex items-center gap-1">
                      <FolderSync className="w-3 h-3 text-sky-500" />
                      <span>{item.imageGroups?.length} image groups ({item.imageGroups?.reduce((acc, g) => acc + g.images.length, 0)} photos)</span>
                    </div>
                  )}

                  {/* Media Display Mode Quick Switcher */}
                  <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">Display:</span>
                    <div className="flex items-center gap-1">
                      {(['single', 'background', 'side_by_side', 'slides'] as MediaDisplayMode[]).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => handleChangeDisplayMode(item, mode)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                            (item.mediaDisplayMode || 'single') === mode
                              ? 'bg-sky-600 text-white font-bold'
                              : 'bg-stone-950 text-stone-400 hover:bg-stone-200'
                          }`}
                          title={`Set presentation mode to ${mode}`}
                        >
                          {mode === 'side_by_side' ? 'Side' : mode === 'background' ? 'Backdrop' : mode === 'slides' ? 'Slides' : 'Single'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Quick-Apply Action Controls */}
                <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                  {activeAsset ? (
                    isApplied ? (
                      /* If active asset is already applied to this job */
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>{isPrimary ? 'Primary Media' : isInAux ? 'In Gallery' : 'In Group'}</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          {!isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleApplyAsPrimary(item, activeAsset)}
                              className="px-2 py-1 rounded text-[11px] font-mono font-semibold bg-sky-100 text-sky-800 hover:bg-sky-200 border border-sky-300 transition-colors"
                              title="Promote to Primary Media"
                            >
                              Make Primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDetachAsset(item, activeAsset.filename)}
                            className="px-2 py-1 rounded text-[11px] font-mono text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                          >
                            Detach
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Not applied yet: Offer one-click apply buttons! */
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleApplyAsPrimary(item, activeAsset)}
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Primary</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddToAuxiliary(item, activeAsset)}
                          className="px-2 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-200 text-stone-200 text-xs font-mono font-semibold border border-stone-700 transition-colors"
                          title="Add to auxiliary gallery without replacing primary media"
                        >
                          + Aux
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddToImageGroup(item, activeAsset)}
                          className="px-2 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-mono font-semibold border border-sky-200 transition-colors"
                          title="Add to image group with context"
                        >
                          + Group
                        </button>
                      </div>
                    )
                  ) : (
                    <div className="text-[11px] font-mono text-stone-400 text-center py-1 bg-stone-800 rounded-lg">
                      Select a thumbnail above to apply media
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add via URL Modal */}
      {showUrlAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-sky-600" />
                <span>Add Media by Web URL</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowUrlAddModal(false)}
                className="text-stone-400 hover:text-stone-300 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Media Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUrlTypeInput('video')}
                    className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                      urlTypeInput === 'video'
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-stone-800 text-stone-300 border-stone-700'
                    }`}
                  >
                    Video (.mp4 / stream)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrlTypeInput('image')}
                    className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                      urlTypeInput === 'image'
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-stone-800 text-stone-300 border-stone-700'
                    }`}
                  >
                    Image (.jpg / .png / CDN)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Direct Media URL
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/tour_video.mp4"
                  className="w-full px-3 py-2 rounded-lg border border-stone-700 text-stone-100 bg-stone-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Filename Identifier (e.g. tour_video.mp4)
                </label>
                <input
                  type="text"
                  value={urlFilenameInput}
                  onChange={(e) => setUrlFilenameInput(e.target.value)}
                  placeholder="proposal.mp4"
                  className="w-full px-3 py-2 rounded-lg border border-stone-700 text-stone-100 bg-stone-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowUrlAddModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-stone-700 text-stone-300 text-xs font-mono hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddUrlAsset}
                disabled={!urlInput.trim()}
                className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-mono font-bold shadow-xs"
              >
                Add Asset to Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
