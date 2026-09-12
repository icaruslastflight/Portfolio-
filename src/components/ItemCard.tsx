import React, { useState, useMemo, useRef } from 'react';
import { Category, PortfolioItem, ManagedAsset, MediaDisplayMode, ImageGroup } from '../types';
import { 
  GripVertical, 
  Star, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Plus, 
  Check, 
  Maximize2, 
  Calendar,
  Sparkles,
  FileText, 
  Image as ImageIcon, 
  Copy,
  FileVideo,
  MapPin,
  Briefcase,
  Layers,
  FileCode,
  Play,
  Upload,
  Film,
  Link2,
  ChevronLeft,
  ChevronRight,
  Columns2,
  LayoutTemplate,
  Info
} from 'lucide-react';

interface ItemCardProps {
  item: PortfolioItem;
  category?: Category;
  categoryName?: string;
  categoryColor?: string;
  managedAssets?: ManagedAsset[];
  isInExportDeck: boolean;
  onToggleExportDeck: (itemId: string) => void;
  onEditItem?: (item: PortfolioItem) => void;
  onEdit?: (item: PortfolioItem) => void;
  onDeleteItem?: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
  onDuplicateItem?: (item: PortfolioItem) => void;
  onDuplicate?: (item: PortfolioItem) => void;
  onToggleStar: (itemId: string) => void;
  onOpenImageLightbox?: (url: string, title: string, context?: string) => void;
  onAttachMedia?: (itemId: string) => void;
  onDirectUploadFile?: (itemId: string, file: File) => void;
  onUpdateItem?: (item: PortfolioItem) => void;
}

const COLOR_MAP: Record<string, { badgeBg: string; badgeText: string; border: string }> = {
  sky: { badgeBg: 'bg-sky-50', badgeText: 'text-sky-700', border: 'border-sky-200' },
  indigo: { badgeBg: 'bg-indigo-50', badgeText: 'text-indigo-700', border: 'border-indigo-200' },
  rose: { badgeBg: 'bg-rose-50', badgeText: 'text-rose-700', border: 'border-rose-200' },
  emerald: { badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-700', border: 'border-emerald-200' },
  amber: { badgeBg: 'bg-amber-800/10', badgeText: 'text-amber-800', border: 'border-amber-200' },
  violet: { badgeBg: 'bg-violet-50', badgeText: 'text-violet-700', border: 'border-violet-200' },
  fuchsia: { badgeBg: 'bg-fuchsia-50', badgeText: 'text-fuchsia-700', border: 'border-fuchsia-200' },
  slate: { badgeBg: 'bg-stone-800', badgeText: 'text-stone-300', border: 'border-stone-800' }
};

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  category,
  categoryName,
  categoryColor,
  managedAssets,
  isInExportDeck,
  onToggleExportDeck,
  onEditItem,
  onEdit,
  onDeleteItem,
  onDelete,
  onDuplicateItem,
  onDuplicate,
  onToggleStar,
  onOpenImageLightbox,
  onAttachMedia,
  onDirectUploadFile,
  onUpdateItem
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCardDragOver, setIsCardDragOver] = useState(false);
  const [imgLoadFailed, setImgLoadFailed] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isGroupsExpanded, setIsGroupsExpanded] = useState(true);
  const cardFileInputRef = useRef<HTMLInputElement>(null);

  const effectiveColor = categoryColor || category?.color || 'sky';
  const effectiveName = categoryName || category?.name || 'Technical Milestone';
  const colorTheme = COLOR_MAP[effectiveColor] || COLOR_MAP.sky;
  const currentMode: MediaDisplayMode = item.mediaDisplayMode || 'single';

  const handleEditClick = () => {
    if (onEditItem) onEditItem(item);
    else if (onEdit) onEdit(item);
  };

  const handleDeleteClick = () => {
    if (onDeleteItem) onDeleteItem(item.id);
    else if (onDelete) onDelete(item.id);
  };

  const handleDuplicateClick = () => {
    if (onDuplicateItem) onDuplicateItem(item);
    else if (onDuplicate) onDuplicate(item);
  };

  const handleModeChange = (mode: MediaDisplayMode) => {
    if (onUpdateItem) {
      onUpdateItem({ ...item, mediaDisplayMode: mode });
    }
  };

  const isVideo =
    item.type === 'video' ||
    (item.mediaFilename && (item.mediaFilename.endsWith('.mp4') || item.mediaFilename.endsWith('.webm'))) ||
    Boolean(item.videoUrl);

  // Helper to resolve an asset URL
  const resolveAssetSrc = (filename?: string, url?: string) => {
    if (!filename && !url) return null;
    const match = managedAssets?.find(
      (a) => (filename && a.filename.toLowerCase() === filename.toLowerCase()) ||
             (url && a.filename.toLowerCase() === url.toLowerCase())
    );
    if (match?.dataUrl) return match.dataUrl;
    if (match?.externalUrl) return match.externalUrl;
    if (url && (url.startsWith('http') || url.startsWith('data:'))) return url;
    if (filename) return `https://primordialvideo.netlify.app/${encodeURIComponent(filename)}`;
    if (url) return `https://primordialvideo.netlify.app/${encodeURIComponent(url)}`;
    return null;
  };

  const displayMediaSrc = resolveAssetSrc(item.mediaFilename, isVideo ? item.videoUrl : item.imageUrl);

  // Collect all available image assets for slideshow and side-by-side
  const allImages = useMemo(() => {
    const list: { src: string; caption?: string; context?: string; label?: string; filename?: string }[] = [];
    
    // 1. Primary image
    if (displayMediaSrc && !isVideo) {
      list.push({
        src: displayMediaSrc,
        caption: item.imageCaption || item.title,
        context: item.content ? item.content.slice(0, 100) + '...' : 'Primary Featured Asset',
        label: 'Hero Visual',
        filename: item.mediaFilename
      });
    }

    // 2. Auxiliary image assets
    item.auxiliaryAssets?.forEach((aux) => {
      const src = resolveAssetSrc(aux.filename, aux.url);
      if (src && !aux.filename.endsWith('.mp4') && !aux.filename.endsWith('.webm') && !aux.filename.endsWith('.pdf')) {
        list.push({
          src,
          caption: aux.filename,
          context: `${aux.label} Documentation asset`,
          label: aux.label,
          filename: aux.filename
        });
      }
    });

    // 3. Grouped images
    item.imageGroups?.forEach((grp) => {
      grp.images.forEach((img) => {
        const src = resolveAssetSrc(img.filename, img.url);
        if (src) {
          list.push({
            src,
            caption: img.caption || img.filename,
            context: img.context || grp.context || grp.name,
            label: grp.name,
            filename: img.filename
          });
        }
      });
    });

    return list;
  }, [displayMediaSrc, isVideo, item, managedAssets]);

  const activeSlide = allImages[currentSlideIndex] || allImages[0];

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <article
      id={`portfolio-item-${item.id}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`group relative flex flex-col bg-stone-900 rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
        isInExportDeck 
          ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-sky-100/50' 
          : 'border-stone-800 hover:border-stone-700 hover:shadow-md'
      } ${isDragging ? 'opacity-40 scale-[0.98] border-dashed border-sky-400' : ''}`}
    >
      {/* Drag handle & top action bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-stone-100 bg-stone-800/90 select-none">
        <div 
          className="flex items-center gap-1.5 text-stone-400 hover:text-stone-200 cursor-grab active:cursor-grabbing text-xs font-medium font-mono"
          title="Drag to recategorize or drop into Export Basket"
        >
          <GripVertical className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1">
            {isVideo ? (
              <>
                <FileVideo className="w-3 h-3 text-sky-600" />
                <span>Video Reel</span>
              </>
            ) : item.type === 'image' || item.imageUrl ? (
              <>
                <ImageIcon className="w-3 h-3 text-amber-600" />
                <span>Media Asset</span>
              </>
            ) : item.type === 'project' ? (
              <>
                <Sparkles className="w-3 h-3 text-sky-600" />
                <span>Case Study</span>
              </>
            ) : (
              <>
                <FileText className="w-3 h-3 text-purple-600" />
                <span>Resume Entry</span>
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Star toggle */}
          <button
            type="button"
            onClick={() => onToggleStar(item.id)}
            className={`p-1 rounded hover:bg-stone-200/60 transition-colors ${
              item.starred ? 'text-amber-500' : 'text-stone-400 hover:text-stone-300'
            }`}
            title={item.starred ? 'Starred' : 'Mark as priority'}
          >
            <Star className={`w-3.5 h-3.5 ${item.starred ? 'fill-amber-500' : ''}`} />
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={handleDuplicateClick}
            className="p-1 rounded text-stone-400 hover:text-stone-300 hover:bg-stone-200/60 transition-colors"
            title="Duplicate item"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={handleEditClick}
            className="p-1 rounded text-stone-400 hover:text-stone-300 hover:bg-stone-200/60 transition-colors"
            title="Edit item"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={handleDeleteClick}
            className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hidden file input for direct card uploads */}
      <input
        ref={cardFileInputRef}
        type="file"
        accept="image/*,video/*,.mp4,.mov,.webm,.m4v,.png,.jpg,.jpeg,.gif,.webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && onDirectUploadFile) {
            onDirectUploadFile(item.id, file);
          } else if (file && onAttachMedia) {
            onAttachMedia(item.id);
          }
          e.target.value = '';
        }}
      />

      {/* Display Mode Switcher Strip */}
      <div className="flex items-center justify-between px-3 py-1 bg-stone-800/80 border-b border-stone-800/80 text-[10px] font-mono">
        <span className="text-stone-500 font-medium">Display Mode:</span>
        <div className="inline-flex items-center bg-stone-900 rounded-md p-0.5 border border-stone-800 shadow-2xs">
          <button
            type="button"
            onClick={() => handleModeChange('single')}
            className={`px-1.5 py-0.5 rounded transition-all ${
              currentMode === 'single'
                ? 'bg-sky-600 text-white font-bold shadow-2xs'
                : 'text-stone-400 hover:text-stone-100'
            }`}
            title="Single Asset display"
          >
            Single
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('background')}
            className={`px-1.5 py-0.5 rounded transition-all ${
              currentMode === 'background'
                ? 'bg-sky-600 text-white font-bold shadow-2xs'
                : 'text-stone-400 hover:text-stone-100'
            }`}
            title="Background Cover display"
          >
            Backdrop
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('side_by_side')}
            className={`px-1.5 py-0.5 rounded transition-all ${
              currentMode === 'side_by_side'
                ? 'bg-sky-600 text-white font-bold shadow-2xs'
                : 'text-stone-400 hover:text-stone-100'
            }`}
            title="Side-by-side comparison"
          >
            Side-by-Side
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('slides')}
            className={`px-1.5 py-0.5 rounded transition-all ${
              currentMode === 'slides'
                ? 'bg-sky-600 text-white font-bold shadow-2xs'
                : 'text-stone-400 hover:text-stone-100'
            }`}
            title="Interactive slide carousel"
          >
            Slides
          </button>
        </div>
      </div>

      {/* --- MEDIA RENDERING ACCORDING TO DISPLAY MODE --- */}

      {/* 1. BACKGROUND MODE */}
      {currentMode === 'background' ? (
        <div className="relative w-full h-52 bg-zinc-950 overflow-hidden border-b border-stone-800 group/bg">
          {displayMediaSrc ? (
            <img
              src={displayMediaSrc}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/bg:scale-105"
              onClick={() => onOpenImageLightbox?.(displayMediaSrc, item.title, 'Full Backdrop Visual')}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-stone-900 to-zinc-950 flex items-center justify-center">
              <span className="text-xs font-mono text-zinc-500">No media background attached</span>
            </div>
          )}

          {/* High-contrast gradient scrim overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/60 to-stone-950/30 p-3.5 flex flex-col justify-between pointer-events-none">
            <div className="flex items-center justify-between pointer-events-auto">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 text-sky-300 border border-sky-400/30 backdrop-blur-xs">
                <LayoutTemplate className="w-3 h-3 text-sky-400" />
                <span>Backdrop Mode</span>
              </span>
              
              <div className="flex items-center gap-1">
                {displayMediaSrc && onOpenImageLightbox && (
                  <button
                    type="button"
                    onClick={() => onOpenImageLightbox(displayMediaSrc, item.title, 'Backdrop Visual')}
                    className="p-1 rounded bg-black/70 hover:bg-black text-white text-xs border border-white/20 transition-colors"
                    title="Enlarge visual"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => (onAttachMedia ? onAttachMedia(item.id) : cardFileInputRef.current?.click())}
                  className="p-1 rounded bg-black/70 hover:bg-black text-white text-xs border border-white/20 transition-colors"
                  title="Change media"
                >
                  <Upload className="w-3 h-3 text-sky-400" />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-200 border border-sky-400/40">
                  {effectiveName}
                </span>
                {item.date && (
                  <span className="text-[10px] font-mono text-stone-300">
                    {item.date}
                  </span>
                )}
              </div>
              <h4 className="font-bold text-white text-sm leading-snug line-clamp-2">
                {item.title}
              </h4>
              {item.roleTag && (
                <span className="text-[11px] font-mono text-sky-300 mt-0.5 block truncate">
                  {item.roleTag}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : currentMode === 'side_by_side' ? (
        /* 2. SIDE-BY-SIDE MODE */
        <div className="relative w-full h-44 bg-zinc-950 grid grid-cols-2 gap-1 p-1 border-b border-stone-800 overflow-hidden group/split select-none">
          {/* Left Column Image */}
          {allImages[0] ? (
            <div 
              className="relative w-full h-full bg-zinc-900 rounded-md overflow-hidden cursor-pointer group/col1"
              onClick={() => onOpenImageLightbox?.(allImages[0].src, allImages[0].caption || item.title, allImages[0].context)}
            >
              <img 
                src={allImages[0].src} 
                alt={allImages[0].caption || 'Left Visual'} 
                className="w-full h-full object-cover group-hover/col1:scale-105 transition-transform duration-300" 
              />
              <div className="absolute bottom-1 left-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-[9px] font-mono text-zinc-200 truncate">
                {allImages[0].label || allImages[0].filename || 'Asset 1'}
              </div>
            </div>
          ) : (
            <div 
              onClick={() => cardFileInputRef.current?.click()}
              className="w-full h-full border border-dashed border-zinc-700 hover:border-sky-400 rounded-md flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors bg-zinc-900/60"
            >
              <Upload className="w-4 h-4 text-sky-400 mb-1" />
              <span className="text-[10px] font-mono text-zinc-400">Add Left Asset</span>
            </div>
          )}

          {/* Right Column Image */}
          {allImages[1] ? (
            <div 
              className="relative w-full h-full bg-zinc-900 rounded-md overflow-hidden cursor-pointer group/col2"
              onClick={() => onOpenImageLightbox?.(allImages[1].src, allImages[1].caption || item.title, allImages[1].context)}
            >
              <img 
                src={allImages[1].src} 
                alt={allImages[1].caption || 'Right Visual'} 
                className="w-full h-full object-cover group-hover/col2:scale-105 transition-transform duration-300" 
              />
              <div className="absolute bottom-1 left-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-[9px] font-mono text-zinc-200 truncate">
                {allImages[1].label || allImages[1].filename || 'Asset 2'}
              </div>
            </div>
          ) : (
            <div 
              onClick={() => (onAttachMedia ? onAttachMedia(item.id) : cardFileInputRef.current?.click())}
              className="w-full h-full border border-dashed border-zinc-700 hover:border-sky-400 rounded-md flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors bg-zinc-900/60"
            >
              <Plus className="w-4 h-4 text-sky-400 mb-1" />
              <span className="text-[10px] font-mono text-zinc-400">Add 2nd Photo (Side-by-Side)</span>
            </div>
          )}

          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 text-[9px] font-mono text-sky-300 pointer-events-none border border-zinc-800 flex items-center gap-1">
            <Columns2 className="w-2.5 h-2.5" />
            <span>Side-by-Side</span>
          </div>
        </div>
      ) : currentMode === 'slides' ? (
        /* 3. SLIDES MODE */
        <div className="relative w-full h-44 bg-zinc-950 overflow-hidden border-b border-stone-800 group/slides flex items-center justify-center select-none">
          {activeSlide ? (
            <div className="relative w-full h-full">
              <img 
                src={activeSlide.src} 
                alt={activeSlide.caption || item.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => onOpenImageLightbox?.(activeSlide.src, activeSlide.caption || item.title, activeSlide.context)}
              />
              
              {/* Slide Context and Info Scrim */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-2 pt-6">
                <div className="flex items-center justify-between text-[10px] font-mono text-white">
                  <span className="font-semibold truncate max-w-[170px]">
                    {activeSlide.label}: {activeSlide.caption || activeSlide.filename}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-sky-600 text-white shrink-0 font-bold">
                    {currentSlideIndex + 1} / {Math.max(1, allImages.length)}
                  </span>
                </div>
                {activeSlide.context && (
                  <p className="text-[10px] text-zinc-300 truncate mt-0.5 font-sans font-normal">
                    {activeSlide.context}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center p-4 text-zinc-400 font-mono text-xs">
              No images in slide deck
            </div>
          )}

          {/* Prev / Next Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlideIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
                }}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/75 hover:bg-black text-white transition-colors border border-white/15"
                title="Previous Slide"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlideIndex((prev) => (prev + 1) % allImages.length);
                }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/75 hover:bg-black text-white transition-colors border border-white/15"
                title="Next Slide"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 text-[9px] font-mono text-amber-300 pointer-events-none border border-zinc-800">
            Slide Deck
          </div>
        </div>
      ) : (
        /* 4. SINGLE ASSET MODE (Standard Hero Media) */
        <div 
          onDragOver={(e) => {
            if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
              e.preventDefault();
              e.stopPropagation();
              setIsCardDragOver(true);
            }
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsCardDragOver(false);
          }}
          onDrop={(e) => {
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              e.preventDefault();
              e.stopPropagation();
              setIsCardDragOver(false);
              const file = e.dataTransfer.files[0];
              if (onDirectUploadFile) {
                onDirectUploadFile(item.id, file);
              }
            }
          }}
          className={`relative w-full h-44 bg-zinc-950 overflow-hidden group/img flex items-center justify-center border-b border-stone-800 transition-colors ${
            isCardDragOver ? 'ring-2 ring-sky-400 bg-sky-950/40' : ''
          }`}
        >
          {isCardDragOver ? (
            <div className="flex flex-col items-center justify-center text-sky-400 p-4">
              <Upload className="w-8 h-8 animate-bounce mb-1" />
              <span className="text-xs font-mono font-semibold">Drop media to attach to this item</span>
            </div>
          ) : isVideo && displayMediaSrc ? (
            <div className="relative w-full h-full group/video">
              <video
                src={displayMediaSrc}
                className="w-full h-full object-cover"
                controls
                preload="metadata"
                playsInline
                onError={() => {
                  setImgLoadFailed(true);
                }}
              />
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 border border-zinc-800 text-[10px] font-mono text-sky-400 flex items-center gap-1 pointer-events-none">
                <Play className="w-2.5 h-2.5" />
                <span>Video Reel</span>
              </div>

              {/* Replace media button on hover */}
              <button
                type="button"
                onClick={() => (onAttachMedia ? onAttachMedia(item.id) : cardFileInputRef.current?.click())}
                className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 hover:bg-black text-white text-[11px] font-mono border border-zinc-700 opacity-0 group-hover/video:opacity-100 transition-opacity flex items-center gap-1"
                title="Change media"
              >
                <Upload className="w-3 h-3 text-sky-400" />
                <span>Change</span>
              </button>
            </div>
          ) : displayMediaSrc && !imgLoadFailed ? (
            <div className="relative w-full h-full">
              <img
                src={displayMediaSrc}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105 cursor-pointer"
                loading="lazy"
                onClick={() => onOpenImageLightbox && onOpenImageLightbox(displayMediaSrc, item.title, item.imageCaption || 'Hero Visual')}
                onError={(e) => {
                  if (item.mediaFilename && !(e.target as HTMLImageElement).src.includes('primordialvideo.netlify.app')) {
                    (e.target as HTMLImageElement).src = `https://primordialvideo.netlify.app/${encodeURIComponent(item.mediaFilename)}`;
                  } else {
                    setImgLoadFailed(true);
                  }
                }}
              />

              {/* Netlify Asset Filename Badge */}
              {item.mediaFilename && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 border border-zinc-800 text-[10px] font-mono text-zinc-300 backdrop-blur-xs flex items-center gap-1 pointer-events-none">
                  <FileCode className="w-3 h-3 text-sky-400" />
                  <span className="truncate max-w-[140px]">{item.mediaFilename}</span>
                </div>
              )}

              {/* Expand Lightbox Button */}
              {onOpenImageLightbox && (
                <button
                  type="button"
                  onClick={() => onOpenImageLightbox(displayMediaSrc, item.title, item.imageCaption || 'Hero Visual')}
                  className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-stone-900/75 text-white backdrop-blur-xs opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-stone-900"
                  title="Expand image lightbox"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Replace media button on hover */}
              <button
                type="button"
                onClick={() => (onAttachMedia ? onAttachMedia(item.id) : cardFileInputRef.current?.click())}
                className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/80 hover:bg-black text-white text-[11px] font-mono border border-zinc-700 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1"
                title="Change media"
              >
                <Upload className="w-3 h-3 text-sky-400" />
                <span>Change</span>
              </button>

              {item.imageCaption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6 text-[11px] font-mono text-white/90 truncate pointer-events-none">
                  {item.imageCaption}
                </div>
              )}
            </div>
          ) : (
            /* Empty / Awaiting Media Zone */
            <div className="text-center p-4 w-full h-full flex flex-col items-center justify-center bg-zinc-950 hover:bg-zinc-900/90 transition-colors">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-1.5">
                <Film className="w-4 h-4 text-sky-400" />
              </div>
              <span className="text-[11px] font-mono text-zinc-300 font-semibold block truncate max-w-[220px]">
                {item.mediaFilename || 'No Media Attached'}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 block mb-2">
                Drag file here, or click to choose
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => cardFileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-black text-[11px] font-mono font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Media</span>
                </button>

                <button
                  type="button"
                  onClick={() => onAttachMedia && onAttachMedia(item.id)}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-mono border border-zinc-700 flex items-center gap-1 transition-colors"
                >
                  <Link2 className="w-3 h-3 text-emerald-400" />
                  <span>Link / Hub</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Card Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category & Date Line (shown if not background mode) */}
        {currentMode !== 'background' && (
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${colorTheme.badgeBg} ${colorTheme.badgeText} ${colorTheme.border}`}>
              {effectiveName}
            </span>

            {item.date && (
              <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 font-mono shrink-0">
                <Calendar className="w-3 h-3 text-stone-400" />
                {item.date}
              </span>
            )}
          </div>
        )}

        {/* Location & Role Tags */}
        {(item.location || item.roleTag) && currentMode !== 'background' && (
          <div className="flex flex-wrap items-center gap-2 mb-1.5 text-[11px] font-mono text-stone-400">
            {item.location && (
              <span className="inline-flex items-center gap-1 text-sky-800 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                <MapPin className="w-3 h-3 text-sky-600" />
                <span>{item.location}</span>
              </span>
            )}
            {item.roleTag && (
              <span className="inline-flex items-center gap-1 text-stone-300 bg-stone-800 px-1.5 py-0.2 rounded border border-stone-800">
                <Briefcase className="w-3 h-3 text-stone-500" />
                <span>{item.roleTag}</span>
              </span>
            )}
          </div>
        )}

        {/* Title & Subtitle (shown if not background mode) */}
        {currentMode !== 'background' && (
          <>
            <h3 className="font-semibold text-stone-100 text-sm leading-snug group-hover:text-sky-700 transition-colors line-clamp-2">
              {item.title}
            </h3>
            
            {item.subtitle && (
              <p className="text-xs text-stone-500 font-medium font-mono mt-0.5 mb-2 line-clamp-1">
                {item.subtitle}
              </p>
            )}
          </>
        )}

        {/* Body Description */}
        {item.content && (
          <p className="text-xs text-stone-400 leading-relaxed mb-3 line-clamp-3 whitespace-pre-line mt-1">
            {item.content}
          </p>
        )}

        {/* --- IMAGE GROUPS & CONTEXT SECTION --- */}
        {item.imageGroups && item.imageGroups.length > 0 && (
          <div className="mb-3 rounded-xl border border-stone-800 bg-stone-800/60 p-2.5">
            <div 
              className="flex items-center justify-between cursor-pointer select-none mb-2"
              onClick={() => setIsGroupsExpanded(!isGroupsExpanded)}
            >
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-600" />
                <span className="text-xs font-bold text-stone-200 font-mono">
                  Image Groups &amp; Context
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-800 font-mono font-semibold">
                  {item.imageGroups.length} {item.imageGroups.length === 1 ? 'group' : 'groups'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-stone-500 hover:text-stone-200">
                {isGroupsExpanded ? 'Collapse' : 'Expand'}
              </span>
            </div>

            {isGroupsExpanded && (
              <div className="space-y-3 pt-1">
                {item.imageGroups.map((group) => (
                  <div key={group.id} className="rounded-lg border border-stone-800 bg-stone-900 p-2.5 shadow-2xs">
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <h5 className="text-xs font-bold text-stone-100 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                        <span>{group.name}</span>
                      </h5>
                      <span className="text-[10px] font-mono text-stone-400">
                        {group.images.length} {group.images.length === 1 ? 'photo' : 'photos'}
                      </span>
                    </div>

                    {/* Group Context Narrative Box */}
                    {group.context && (
                      <div className="bg-sky-50/90 border border-sky-200 rounded-md p-2 text-[11px] text-stone-300 mb-2">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-sky-900 uppercase tracking-wider mb-0.5 font-mono">
                          <Info className="w-3 h-3 text-sky-600" />
                          <span>Context Narrative</span>
                        </div>
                        <p className="leading-relaxed font-sans">{group.context}</p>
                      </div>
                    )}

                    {/* Group Images Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {group.images.map((img) => {
                        const src = resolveAssetSrc(img.filename, img.url);
                        return (
                          <div
                            key={img.id}
                            onClick={() => src && onOpenImageLightbox?.(src, `${group.name} // ${img.caption || img.filename}`, img.context || group.context)}
                            className="group/thumb relative aspect-video bg-zinc-950 rounded-md overflow-hidden border border-stone-800 hover:border-sky-500 cursor-pointer transition-colors shadow-2xs"
                            title={img.caption || img.filename}
                          >
                            {src ? (
                              <img 
                                src={src} 
                                alt={img.filename} 
                                className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] font-mono text-stone-400 p-1 text-center">
                                {img.filename}
                              </div>
                            )}

                            {/* Caption Badge */}
                            {img.caption && (
                              <div className="absolute inset-x-0 bottom-0 bg-black/85 p-1 text-[9px] font-mono text-white truncate">
                                {img.caption}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Auxiliary Assets (Blueprints, CAD, Rigging) */}
        {item.auxiliaryAssets && item.auxiliaryAssets.length > 0 && (
          <div className="mb-3 p-2 bg-stone-800 rounded-lg border border-stone-800 text-[11px] font-mono text-stone-400">
            <div className="flex items-center gap-1 text-stone-500 font-semibold mb-1">
              <Layers className="w-3 h-3 text-sky-600" />
              <span>Blueprints &amp; CAD Files ({item.auxiliaryAssets.length}):</span>
            </div>
            <div className="space-y-0.5 text-[10px]">
              {item.auxiliaryAssets.map((a, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-stone-500">{a.label}:</span>
                  <span className="font-bold text-stone-200 truncate max-w-[140px]">{a.filename}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        {item.metrics && item.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-1.5 mb-3 p-2 bg-stone-800 rounded-lg border border-stone-800">
            {item.metrics.slice(0, 4).map((metric, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-[10px] text-stone-500 truncate uppercase tracking-wider font-semibold font-mono">
                  {metric.label}
                </span>
                <span className="text-xs font-bold text-sky-700 truncate font-mono">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3 mt-auto font-mono">
            {item.tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
            {item.tags.length > 4 && (
              <span className="text-[10px] text-stone-500 px-1 py-0.5">
                +{item.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Links */}
        {item.links && item.links.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100 mb-3 text-xs font-mono">
            {item.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-800 hover:underline text-[11px] font-medium"
              >
                <ExternalLink className="w-3 h-3" />
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        )}

        {/* Bottom Quick Export Deck Toggle */}
        <div className="pt-2 border-t border-stone-100 mt-auto flex items-center justify-between">
          <span className="text-[11px] text-stone-500 font-mono">
            Drag or click:
          </span>
          <button
            type="button"
            onClick={() => onToggleExportDeck(item.id)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              isInExportDeck
                ? 'bg-sky-600 text-white shadow-2xs hover:bg-sky-700'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-200 hover:text-stone-100 border border-stone-800'
            }`}
          >
            {isInExportDeck ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Export Deck</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-stone-500" />
                <span>Add to Export</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
