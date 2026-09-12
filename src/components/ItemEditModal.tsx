import React, { useState, useEffect, useRef } from 'react';
import { PortfolioItem, ItemType, Category, MetricItem, LinkItem, AuxiliaryAsset, ManagedAsset, MediaDisplayMode, ImageGroup, GroupedImage } from '../types';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Link as LinkIcon, 
  Tag, 
  TrendingUp, 
  Sparkles, 
  FileText, 
  Image as ImageIcon,
  FileVideo,
  Layers,
  MapPin,
  Briefcase,
  FileCode,
  FolderSync,
  Film,
  CheckCircle2,
  Sliders,
  Columns2,
  LayoutTemplate,
  Info
} from 'lucide-react';

interface ItemEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveItem: (item: PortfolioItem) => void;
  categories: Category[];
  itemToEdit?: PortfolioItem | null;
  defaultCategoryId?: string;
  managedAssets?: ManagedAsset[];
}

export const ItemEditModal: React.FC<ItemEditModalProps> = ({
  isOpen,
  onClose,
  onSaveItem,
  categories,
  itemToEdit,
  defaultCategoryId,
  managedAssets = []
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<ItemType>('project');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [roleTag, setRoleTag] = useState('');
  const [content, setContent] = useState('');
  
  // Media & Netlify Asset tracking
  const [mediaFilename, setMediaFilename] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  
  // Auxiliary Technical Assets (Blueprints, CAD, etc.)
  const [auxiliaryAssets, setAuxiliaryAssets] = useState<AuxiliaryAsset[]>([]);

  // Media Display Mode & Image Groups with Context
  const [mediaDisplayMode, setMediaDisplayMode] = useState<MediaDisplayMode>('single');
  const [imageGroups, setImageGroups] = useState<ImageGroup[]>([]);

  // Badges and metadata
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [metrics, setMetrics] = useState<MetricItem[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isStarred, setIsStarred] = useState(false);
  const [dragOverUpload, setDragOverUpload] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  useEffect(() => {
    if (itemToEdit) {
      setType(itemToEdit.type);
      setTitle(itemToEdit.title);
      setSubtitle(itemToEdit.subtitle || '');
      setCategoryId(itemToEdit.categoryId);
      setDate(itemToEdit.date || '');
      setLocation(itemToEdit.location || '');
      setRoleTag(itemToEdit.roleTag || '');
      setContent(itemToEdit.content || '');
      setMediaFilename(itemToEdit.mediaFilename || '');
      setImageUrl(itemToEdit.imageUrl || '');
      setVideoUrl(itemToEdit.videoUrl || '');
      setImageCaption(itemToEdit.imageCaption || '');
      setMediaDisplayMode(itemToEdit.mediaDisplayMode || 'single');
      setImageGroups(itemToEdit.imageGroups || []);
      setAuxiliaryAssets(itemToEdit.auxiliaryAssets || []);
      setTags(itemToEdit.tags || []);
      setMetrics(itemToEdit.metrics || []);
      setLinks(itemToEdit.links || []);
      setIsStarred(Boolean(itemToEdit.starred));
    } else {
      setType('project');
      setTitle('');
      setSubtitle('');
      setCategoryId(defaultCategoryId || (categories[0] ? categories[0].id : ''));
      setDate('');
      setLocation('');
      setRoleTag('');
      setContent('');
      setMediaFilename('');
      setImageUrl('');
      setVideoUrl('');
      setImageCaption('');
      setMediaDisplayMode('single');
      setImageGroups([]);
      setAuxiliaryAssets([]);
      setTags([]);
      setMetrics([]);
      setLinks([]);
      setIsStarred(false);
    }
  }, [itemToEdit, defaultCategoryId, categories, isOpen]);

  if (!isOpen) return null;

  // Handle local file upload (converts to base64 DataURL and autofills media filename)
  const processFile = (file: File) => {
    const isVid = file.type.startsWith('video/') || 
      file.name.endsWith('.mp4') || 
      file.name.endsWith('.webm') || 
      file.name.endsWith('.mov') ||
      file.name.endsWith('.m4v');
    
    // Immediate preview
    const objectUrl = URL.createObjectURL(file);
    if (isVid) {
      setVideoUrl(objectUrl);
      setType('video');
    } else {
      setImageUrl(objectUrl);
      if (type === 'video') setType('project');
    }

    if (!mediaFilename) {
      setMediaFilename(file.name);
    }
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    setUploadStatus(`Processing ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        if (isVid) {
          setVideoUrl(result);
        } else {
          setImageUrl(result);
        }
        setUploadStatus(`Loaded ${file.name}`);
        setTimeout(() => setUploadStatus(null), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverUpload(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // Tags management
  const handleAddTag = () => {
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Metrics management
  const handleAddMetric = () => {
    setMetrics([...metrics, { label: 'Resolution / Latency', value: '4K @ <1ms' }]);
  };

  const handleUpdateMetric = (index: number, field: 'label' | 'value', val: string) => {
    const next = [...metrics];
    next[index][field] = val;
    setMetrics(next);
  };

  const handleRemoveMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  // Auxiliary Assets management
  const handleAddAuxAsset = () => {
    setAuxiliaryAssets([
      ...auxiliaryAssets,
      { label: 'Blueprint', filename: 'deployment_spec.pdf' }
    ]);
  };

  const handleUpdateAuxAsset = (index: number, field: 'label' | 'filename' | 'url', val: string) => {
    const next = [...auxiliaryAssets];
    next[index] = { ...next[index], [field]: val };
    setAuxiliaryAssets(next);
  };

  const handleRemoveAuxAsset = (index: number) => {
    setAuxiliaryAssets(auxiliaryAssets.filter((_, i) => i !== index));
  };

  // Image Groups & Context management
  const handleAddGroup = () => {
    setImageGroups([
      ...imageGroups,
      {
        id: `grp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: 'New Image Group',
        context: '',
        images: []
      }
    ]);
  };

  const handleUpdateGroup = (groupIndex: number, field: 'name' | 'context', value: string) => {
    const next = [...imageGroups];
    next[groupIndex] = { ...next[groupIndex], [field]: value };
    setImageGroups(next);
  };

  const handleRemoveGroup = (groupIndex: number) => {
    setImageGroups(imageGroups.filter((_, idx) => idx !== groupIndex));
  };

  const handleAddImageToGroup = (groupIndex: number, filename: string, caption = '', context = '') => {
    const next = [...imageGroups];
    next[groupIndex].images.push({
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      filename,
      caption,
      context
    });
    setImageGroups(next);
  };

  const handleUpdateImageInGroup = (groupIndex: number, imgIndex: number, field: 'filename' | 'caption' | 'context', value: string) => {
    const next = [...imageGroups];
    next[groupIndex].images[imgIndex] = {
      ...next[groupIndex].images[imgIndex],
      [field]: value
    };
    setImageGroups(next);
  };

  const handleRemoveImageFromGroup = (groupIndex: number, imgIndex: number) => {
    const next = [...imageGroups];
    next[groupIndex].images = next[groupIndex].images.filter((_, idx) => idx !== imgIndex);
    setImageGroups(next);
  };

  // Links management
  const handleAddLink = () => {
    setLinks([...links, { label: 'Live Video / Spec', url: 'https://' }]);
  };

  const handleUpdateLink = (index: number, field: 'label' | 'url', val: string) => {
    const next = [...links];
    next[index][field] = val;
    setLinks(next);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  // Form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const item: PortfolioItem = {
      id: itemToEdit ? itemToEdit.id : `item_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      categoryId: categoryId || (categories[0]?.id ?? 'default'),
      date: date.trim() || undefined,
      location: location.trim() || undefined,
      roleTag: roleTag.trim() || undefined,
      content: content.trim(),
      mediaFilename: mediaFilename.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      imageCaption: imageCaption.trim() || undefined,
      mediaDisplayMode,
      imageGroups: imageGroups.filter((g) => g.name.trim()),
      auxiliaryAssets: auxiliaryAssets.filter((a) => a.label.trim() && a.filename.trim()),
      tags,
      metrics: metrics.filter((m) => m.label.trim() && m.value.trim()),
      links: links.filter((l) => l.label.trim() && l.url.trim()),
      starred: isStarred,
      createdAt: itemToEdit ? itemToEdit.createdAt : Date.now(),
      updatedAt: Date.now()
    };

    onSaveItem(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs font-sans">
      <div 
        id="item-edit-modal-dialog"
        className="bg-stone-900 w-full max-w-3xl max-h-[92vh] rounded-2xl shadow-2xl border border-stone-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-800/90">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-600" />
              <span>{itemToEdit ? 'Edit Portfolio / Case Study' : 'Add New Portfolio & Resume Item'}</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5 font-mono">
              Configure case study metadata, media assets, Netlify filenames, and engineering blueprints
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm">
          {/* Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 font-mono">
              Item Format &amp; Archetype
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setType('project')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition-all ${
                  type === 'project'
                    ? 'border-sky-600 bg-sky-50 text-sky-800 shadow-2xs font-bold'
                    : 'border-stone-800 bg-stone-800 text-stone-400 hover:bg-stone-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>Case Study</span>
              </button>

              <button
                type="button"
                onClick={() => setType('video')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition-all ${
                  type === 'video'
                    ? 'border-sky-600 bg-sky-50 text-sky-800 shadow-2xs font-bold'
                    : 'border-stone-800 bg-stone-800 text-stone-400 hover:bg-stone-800'
                }`}
              >
                <FileVideo className="w-3.5 h-3.5 text-emerald-500" />
                <span>Video Reel</span>
              </button>

              <button
                type="button"
                onClick={() => setType('image')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition-all ${
                  type === 'image'
                    ? 'border-sky-600 bg-sky-50 text-sky-800 shadow-2xs font-bold'
                    : 'border-stone-800 bg-stone-800 text-stone-400 hover:bg-stone-800'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                <span>Image / Photo</span>
              </button>

              <button
                type="button"
                onClick={() => setType('info')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition-all ${
                  type === 'info'
                    ? 'border-sky-600 bg-sky-50 text-sky-800 shadow-2xs font-bold'
                    : 'border-stone-800 bg-stone-800 text-stone-400 hover:bg-stone-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-purple-500" />
                <span>Resume / Role</span>
              </button>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1 font-mono">
                Title / Case Study Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 05 // Republic Club LED Drop"
                className="w-full px-3 py-2 rounded-lg border border-stone-700 text-stone-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1 font-mono">
                Subtitle / System Architecture
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Brompton SX40 • Resolume DXV3 • 4K Switch"
                className="w-full px-3 py-2 rounded-lg border border-stone-700 text-stone-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-stone-900"
              />
            </div>
          </div>

          {/* Role Tag & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1 font-mono flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-stone-500" />
                <span>Role Badge (e.g. Technical Director, V1, LD)</span>
              </label>
              <input
                type="text"
                value={roleTag}
                onChange={(e) => setRoleTag(e.target.value)}
                placeholder="e.g. Lead Video Engineer &amp; Designer"
                className="w-full px-3 py-2 rounded-lg border border-stone-700 text-stone-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1 font-mono flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                <span>Location / Venue (e.g. Koh Samui, Thailand)</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Koh Samui, Thailand or Pittsburgh, PA"
                className="w-full px-3 py-2 rounded-lg border border-stone-700 text-stone-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-stone-900"
              />
            </div>
          </div>

          {/* Category & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1 font-mono">
                Category Group <span className="text-rose-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-700 text-stone-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-stone-900"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1 font-mono">
                Timeline / Year
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. 2024 or 2023 - Present"
                className="w-full px-3 py-2 rounded-lg border border-stone-700 text-stone-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-stone-900"
              />
            </div>
          </div>

          {/* Media & Netlify Asset Sync */}
          <div className="border border-stone-800 rounded-xl p-4 bg-stone-800/70 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-100 flex items-center gap-1.5 font-mono">
                <FileCode className="w-4 h-4 text-sky-600" />
                <span>Primary Media Asset (Image / Video)</span>
              </label>
              <span className="text-[11px] font-mono text-stone-500">
                Synchronized with Netlify root assets
              </span>
            </div>

            {/* Netlify Asset Filename */}
            <div>
              <label className="block text-[11px] font-mono text-stone-400 mb-1">
                Asset Filename on Netlify (e.g. proposal.mp4, portal build.jpg)
              </label>
              <input
                type="text"
                value={mediaFilename}
                onChange={(e) => setMediaFilename(e.target.value)}
                placeholder="e.g. proposal.mp4 or MVIMG_20220202_023036.jpg"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-700 font-mono text-xs text-stone-100 bg-stone-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Upload Drop Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverUpload(true);
              }}
              onDragLeave={() => setDragOverUpload(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverUpload(false);
                const file = e.dataTransfer.files?.[0];
                if (file) processFile(file);
              }}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                dragOverUpload
                  ? 'border-sky-500 bg-sky-50/60'
                  : 'border-stone-700 hover:border-sky-500 bg-stone-900'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,.mp4,.mov,.webm,.m4v,.png,.jpg,.jpeg,.gif,.webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processFile(file);
                  e.target.value = '';
                }}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <Upload className="w-5 h-5 text-sky-600 mb-1" />
                <span className="text-xs font-semibold text-stone-200">
                  Click anywhere or drag &amp; drop video / image here
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5 font-mono">
                  Supports MP4, MOV, WebM, M4V, PNG, JPG, WebP
                </span>
              </div>
            </div>

            {uploadStatus && (
              <div className="text-[11px] font-mono text-sky-700 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
                {uploadStatus}
              </div>
            )}

            {/* Quick Pick from Netlify Asset Library */}
            {managedAssets.length > 0 && (
              <div>
                <label className="block text-[11px] font-mono text-stone-400 mb-1 flex items-center gap-1">
                  <FolderSync className="w-3.5 h-3.5 text-stone-500" />
                  <span>Or Pick Registered Asset from Hub ({managedAssets.length} available)</span>
                </label>
                <select
                  value=""
                  onChange={(e) => {
                    const chosen = managedAssets.find((a) => a.filename === e.target.value);
                    if (chosen) {
                      setMediaFilename(chosen.filename);
                      const isVid = chosen.fileType === 'video';
                      const resolved = chosen.dataUrl || chosen.externalUrl || `https://primordialvideo.netlify.app/${encodeURIComponent(chosen.filename)}`;
                      if (isVid) {
                        setVideoUrl(resolved);
                        setType('video');
                      } else {
                        setImageUrl(resolved);
                      }
                    }
                  }}
                  className="w-full px-2.5 py-1.5 rounded border border-stone-700 font-mono text-xs text-stone-200 bg-stone-900"
                >
                  <option value="">-- Select from Primordial Asset Hub --</option>
                  {managedAssets.map((a) => (
                    <option key={a.filename} value={a.filename}>
                      [{a.fileType.toUpperCase()}] {a.filename} — {a.associatedProjectTitle || 'No project'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Direct URL Fallbacks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-stone-500 mb-0.5">Image Direct URL:</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-2.5 py-1.5 rounded border border-stone-700 text-xs font-mono text-stone-100 bg-stone-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-stone-500 mb-0.5">Video Direct URL:</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-2.5 py-1.5 rounded border border-stone-700 text-xs font-mono text-stone-100 bg-stone-900"
                />
              </div>
            </div>

            {/* Media Preview Box */}
            {(imageUrl || videoUrl) && (
              <div className="flex items-center gap-3 pt-2">
                <div className="w-24 h-16 rounded-lg bg-black overflow-hidden border border-stone-700 flex items-center justify-center shrink-0">
                  {videoUrl ? (
                    <video src={videoUrl} controls autoPlay muted loop className="w-full h-full object-cover" />
                  ) : (
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-stone-200 font-bold truncate">
                    {mediaFilename || (videoUrl ? 'Video Stream' : 'Image Asset')}
                  </p>
                  <p className="text-[10px] font-mono text-emerald-600 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Media Loaded &amp; Ready</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('');
                      setVideoUrl('');
                    }}
                    className="text-[11px] text-rose-600 hover:underline font-mono mt-1"
                  >
                    Clear media source
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Media Display Mode Selector */}
          <div className="border border-stone-800 rounded-xl p-4 bg-stone-900 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-100 flex items-center gap-1.5 font-mono">
                <Sliders className="w-4 h-4 text-sky-600" />
                <span>Media Display Mode</span>
              </label>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 uppercase font-bold">
                Active: {mediaDisplayMode.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs text-stone-400 font-sans">
              Choose how images and media are presented on this project card and exported portfolios:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Single Asset */}
              <button
                type="button"
                onClick={() => setMediaDisplayMode('single')}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  mediaDisplayMode === 'single'
                    ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20'
                    : 'border-stone-800 hover:border-stone-700 bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-100 font-mono mb-1">
                  <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                  <span>Single Asset</span>
                </div>
                <p className="text-[10px] text-stone-500 leading-tight">
                  Clean hero visual with video controls and lightbox expand.
                </p>
              </button>

              {/* Background */}
              <button
                type="button"
                onClick={() => setMediaDisplayMode('background')}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  mediaDisplayMode === 'background'
                    ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20'
                    : 'border-stone-800 hover:border-stone-700 bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-100 font-mono mb-1">
                  <LayoutTemplate className="w-3.5 h-3.5 text-sky-600" />
                  <span>Background</span>
                </div>
                <p className="text-[10px] text-stone-500 leading-tight">
                  Image shown as atmospheric backdrop with dark gradient scrim.
                </p>
              </button>

              {/* Side by Side */}
              <button
                type="button"
                onClick={() => setMediaDisplayMode('side_by_side')}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  mediaDisplayMode === 'side_by_side'
                    ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20'
                    : 'border-stone-800 hover:border-stone-700 bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-100 font-mono mb-1">
                  <Columns2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Side by Side</span>
                </div>
                <p className="text-[10px] text-stone-500 leading-tight">
                  Split dual-panel comparing 2+ photos (e.g. Rigging vs Show).
                </p>
              </button>

              {/* Slides */}
              <button
                type="button"
                onClick={() => setMediaDisplayMode('slides')}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  mediaDisplayMode === 'slides'
                    ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20'
                    : 'border-stone-800 hover:border-stone-700 bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-100 font-mono mb-1">
                  <Sliders className="w-3.5 h-3.5 text-sky-600" />
                  <span>Slide Deck</span>
                </div>
                <p className="text-[10px] text-stone-500 leading-tight">
                  Interactive carousel with prev/next buttons and slide counts.
                </p>
              </button>
            </div>
          </div>

          {/* Image Groups & Context Builder */}
          <div className="border border-stone-800 rounded-xl p-4 bg-stone-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-stone-100 flex items-center gap-1.5 font-mono">
                  <Layers className="w-4 h-4 text-sky-600" />
                  <span>Image Groups &amp; Context</span>
                </label>
                <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                  Group related project photos together and give them contextual narrative explanations.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddGroup}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-colors shadow-2xs font-mono"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Create Group</span>
              </button>
            </div>

            {imageGroups.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-stone-700 bg-stone-900 text-center">
                <p className="text-xs text-stone-400 font-mono">
                  No image groups created yet.
                </p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Click "+ Create Group" to organize photos with dedicated context (e.g. Pre-Rigging, FOH Rack, Cues).
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {imageGroups.map((group, groupIdx) => (
                  <div key={group.id} className="rounded-xl border border-stone-700 bg-stone-900 p-3.5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-0.5">
                          Group Name / Section Title
                        </label>
                        <input
                          type="text"
                          value={group.name}
                          onChange={(e) => handleUpdateGroup(groupIdx, 'name', e.target.value)}
                          placeholder="e.g. Pre-Production Rigging &amp; Truss Plots"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-700 font-mono text-xs font-bold text-stone-100 bg-stone-800/50 focus:bg-stone-900"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveGroup(groupIdx)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors mt-4"
                        title="Delete this image group"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Group Context Narrative */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-0.5 flex items-center gap-1">
                        <Info className="w-3 h-3 text-sky-600" />
                        <span>Context Narrative for this Group</span>
                      </label>
                      <textarea
                        rows={2}
                        value={group.context || ''}
                        onChange={(e) => handleUpdateGroup(groupIdx, 'context', e.target.value)}
                        placeholder="Explain what these images show, engineering decisions, venue constraints, or setup background..."
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-700 text-xs text-stone-200 bg-stone-800/50 focus:bg-stone-900 leading-relaxed"
                      />
                    </div>

                    {/* Images in this group */}
                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-semibold text-stone-300">
                          Grouped Images ({group.images.length})
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {managedAssets.length > 0 && (
                            <select
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleAddImageToGroup(groupIdx, e.target.value, e.target.value.replace(/\.[^/.]+$/, ''), '');
                                }
                              }}
                              className="text-[10px] font-mono px-2 py-1 rounded border border-stone-700 bg-stone-800 text-stone-300"
                            >
                              <option value="">+ Add from Hub</option>
                              {managedAssets.map((a) => (
                                <option key={a.filename} value={a.filename}>
                                  {a.filename}
                                </option>
                              ))}
                            </select>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const fn = prompt('Enter image filename or URL:');
                              if (fn) {
                                const caption = prompt('Enter caption for this image:') || '';
                                const ctx = prompt('Enter specific context note for this image:') || '';
                                handleAddImageToGroup(groupIdx, fn, caption, ctx);
                              }
                            }}
                            className="text-[10px] font-mono text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Custom Image</span>
                          </button>
                        </div>
                      </div>

                      {group.images.length === 0 ? (
                        <p className="text-[10px] font-mono text-stone-400 italic py-1">
                          No photos in this group yet. Pick from the hub or add a custom image above.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {group.images.map((img, imgIdx) => (
                            <div key={img.id} className="p-2 rounded-lg border border-stone-800 bg-stone-800/50 grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                              <div>
                                <label className="block text-[9px] font-mono text-stone-500">Filename / URL</label>
                                <input
                                  type="text"
                                  value={img.filename}
                                  onChange={(e) => handleUpdateImageInGroup(groupIdx, imgIdx, 'filename', e.target.value)}
                                  className="w-full px-2 py-1 rounded border border-stone-700 font-mono text-[11px] bg-stone-900"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-mono text-stone-500">Caption / Label</label>
                                <input
                                  type="text"
                                  value={img.caption || ''}
                                  onChange={(e) => handleUpdateImageInGroup(groupIdx, imgIdx, 'caption', e.target.value)}
                                  placeholder="e.g. Truss Assembly"
                                  className="w-full px-2 py-1 rounded border border-stone-700 font-mono text-[11px] bg-stone-900"
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="flex-1">
                                  <label className="block text-[9px] font-mono text-stone-500">Specific Context Note</label>
                                  <input
                                    type="text"
                                    value={img.context || ''}
                                    onChange={(e) => handleUpdateImageInGroup(groupIdx, imgIdx, 'context', e.target.value)}
                                    placeholder="e.g. Pre-rigging inspection"
                                    className="w-full px-2 py-1 rounded border border-stone-700 font-mono text-[11px] bg-stone-900"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImageFromGroup(groupIdx, imgIdx)}
                                  className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-rose-50 mt-3"
                                  title="Remove image"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auxiliary Technical Assets (Blueprints, CAD, Rigging Specs) */}
          <div className="border border-stone-800 rounded-xl p-4 bg-stone-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-200 flex items-center gap-1.5 font-mono">
                <Layers className="w-4 h-4 text-sky-600" />
                <span>Auxiliary Assets (Blueprints, CAD, Bench Tests)</span>
              </label>
              <button
                type="button"
                onClick={handleAddAuxAsset}
                className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-semibold font-mono"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Asset Spec</span>
              </button>
            </div>

            {auxiliaryAssets.length === 0 ? (
              <p className="text-[11px] font-mono text-stone-500 italic">
                No auxiliary blueprints attached. Click "+ Add Asset Spec" to reference CAD files, rigging plots, or wiring schematics.
              </p>
            ) : (
              <div className="space-y-2">
                {auxiliaryAssets.map((asset, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={asset.label}
                      onChange={(e) => handleUpdateAuxAsset(idx, 'label', e.target.value)}
                      placeholder="Label (e.g. Blueprint, CAD, Rigging)"
                      className="w-1/3 px-2.5 py-1.5 rounded border border-stone-700 font-mono text-xs text-stone-100 bg-stone-900"
                    />
                    <input
                      type="text"
                      value={asset.filename}
                      onChange={(e) => handleUpdateAuxAsset(idx, 'filename', e.target.value)}
                      placeholder="Filename (e.g. festival_truss_plot.dwg)"
                      className="flex-1 px-2.5 py-1.5 rounded border border-stone-700 font-mono text-xs text-stone-100 bg-stone-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAuxAsset(idx)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description / Bullet points */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-stone-300 font-mono">
                Technical Execution &amp; Case Study Description
              </label>
            </div>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detailed description of server architecture, power distribution, signal chain, and hardware integration..."
              className="w-full px-3 py-2 rounded-lg border border-stone-700 text-stone-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 leading-relaxed font-sans bg-stone-900"
            />
          </div>

          {/* Key Technical Metrics */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5 font-mono">
                <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
                <span>Technical Specifications / Metrics</span>
              </label>
              <button
                type="button"
                onClick={handleAddMetric}
                className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-semibold font-mono"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Metric</span>
              </button>
            </div>

            {metrics.map((metric, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={metric.label}
                  onChange={(e) => handleUpdateMetric(idx, 'label', e.target.value)}
                  placeholder="Metric Label (e.g. Resolume DXV3)"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-stone-700 text-xs text-stone-200 bg-stone-900"
                />
                <input
                  type="text"
                  value={metric.value}
                  onChange={(e) => handleUpdateMetric(idx, 'value', e.target.value)}
                  placeholder="Value (e.g. 4K60 Ultra-Low Latency)"
                  className="w-1/2 px-3 py-1.5 rounded-lg border border-stone-700 text-xs font-bold text-stone-100 bg-stone-900"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMetric(idx)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Keywords / Tags */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5 font-mono">
              <Tag className="w-3.5 h-3.5 text-sky-600" />
              <span>Keywords &amp; Production Tags</span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg border border-stone-700 bg-stone-900 min-h-[42px]">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-stone-800 text-stone-200 text-xs font-mono border border-stone-800"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-stone-400 hover:text-rose-600"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Type tag and press Enter..."
                className="flex-1 min-w-[140px] px-1 py-0.5 text-xs text-stone-200 placeholder:text-stone-400 focus:outline-hidden"
              />
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-stone-800 bg-stone-800/90 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isStarred}
              onChange={(e) => setIsStarred(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500"
            />
            <span className="text-xs font-medium text-stone-300 font-mono">
              Pin / Highlight in Portfolios
            </span>
          </label>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-400 hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-colors"
            >
              {itemToEdit ? 'Update Case Study' : 'Save Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
