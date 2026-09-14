import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import { ManagedAsset, AssetPathStrategy, PortfolioItem } from '../types';
import { downloadFile } from '../utils/exportGenerators';
import { 
  X, 
  Upload, 
  Trash2, 
  Link2, 
  FileVideo, 
  FileImage, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Download, 
  Globe, 
  FolderSync, 
  ExternalLink,
  Eye,
  Plus,
  RefreshCw,
  FolderUp,
  Sparkles,
  Archive
} from 'lucide-react';

interface AssetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  managedAssets: ManagedAsset[];
  items: PortfolioItem[];
  onUpdateAsset: (asset: ManagedAsset) => void;
  onAddAsset: (asset: ManagedAsset) => void;
  onRemoveAsset: (filename: string) => void;
  assetStrategy: AssetPathStrategy;
  onUpdateStrategy: (strategy: AssetPathStrategy) => void;
  onDownloadNetlifyZip: () => void;
  onOpenHtmlStudio: () => void;
}

export const AssetManagerModal: React.FC<AssetManagerModalProps> = ({
  isOpen,
  onClose,
  managedAssets,
  items,
  onUpdateAsset,
  onAddAsset,
  onRemoveAsset,
  assetStrategy,
  onUpdateStrategy,
  onDownloadNetlifyZip,
  onOpenHtmlStudio
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'video' | 'image' | 'linked' | 'missing'>('all');
  const [activeAssetForUpload, setActiveAssetForUpload] = useState<string | null>(null);
  const [externalUrlInput, setExternalUrlInput] = useState<{ filename: string; url: string } | null>(null);
  const [previewMedia, setPreviewMedia] = useState<{ url: string; isVideo: boolean; title: string } | null>(null);
  
  // Batch upload state
  const [isDraggingBatch, setIsDraggingBatch] = useState(false);
  const [batchStatus, setBatchStatus] = useState<string | null>(null);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const batchFileInputRef = useRef<HTMLInputElement>(null);

  // New asset form
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newFilename, setNewFilename] = useState('');
  const [newAssociatedProject, setNewAssociatedProject] = useState('');
  const [newFileType, setNewFileType] = useState<'image' | 'video' | 'pdf'>('image');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (filename: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const existing = managedAssets.find((a) => a.filename === filename);
      if (existing) {
        onUpdateAsset({
          ...existing,
          dataUrl,
          fileSize: file.size,
          updatedAt: Date.now()
        });
      }
    };
    reader.readAsDataURL(file);
    setActiveAssetForUpload(null);
  };

  const handleBatchProcessFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessingBatch(true);
    setBatchStatus(`Ingesting ${files.length} media files...`);

    let matchedCount = 0;
    let addedCount = 0;
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const isVid = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm');
        const isPdf = file.name.endsWith('.pdf') || file.type === 'application/pdf';
        const detectedType: 'video' | 'image' | 'pdf' = isVid ? 'video' : isPdf ? 'pdf' : 'image';

        const cleanName = file.name.trim();
        const existing = managedAssets.find(
          (a) => a.filename.toLowerCase() === cleanName.toLowerCase()
        );

        if (existing) {
          onUpdateAsset({
            ...existing,
            dataUrl,
            fileSize: file.size,
            updatedAt: Date.now()
          });
          matchedCount++;
        } else {
          onAddAsset({
            filename: cleanName,
            fileType: detectedType,
            associatedProjectTitle: `Imported Asset (${cleanName})`,
            dataUrl,
            fileSize: file.size,
            updatedAt: Date.now()
          });
          addedCount++;
        }
      } catch (err) {
        console.error(`Error processing file ${file.name}`, err);
      }
    }

    setIsProcessingBatch(false);
    setBatchStatus(`Completed: ${matchedCount} blueprints matched & updated, ${addedCount} new assets registered!`);
    setTimeout(() => setBatchStatus(null), 5000);
  };

  const handleAutoLinkAllToNetlify = () => {
    let linked = 0;
    managedAssets.forEach((asset) => {
      if (!asset.dataUrl && !asset.externalUrl) {
        onUpdateAsset({
          ...asset,
          externalUrl: `https://primordial-portfolio.netlify.app/media/${encodeURIComponent(asset.filename)}`,
          updatedAt: Date.now()
        });
        linked++;
      }
    });
    setBatchStatus(`Linked ${linked} assets to primordial-portfolio.netlify.app Live CDN!`);
    setTimeout(() => setBatchStatus(null), 4000);
  };

  const handleDownloadAllMediaZip = async () => {
    const uploadedAssets = managedAssets.filter((a) => a.dataUrl && a.dataUrl.startsWith('data:'));
    if (uploadedAssets.length === 0) {
      alert('No media files have been uploaded yet. Drop your media files in the box above to pack them.');
      return;
    }
    const zip = new JSZip();
    uploadedAssets.forEach((asset) => {
      try {
        const commaIndex = asset.dataUrl!.indexOf(',');
        if (commaIndex > 0) {
          const base64 = asset.dataUrl!.substring(commaIndex + 1);
          zip.file(asset.filename, base64, { base64: true });
        }
      } catch (e) {
        console.error(e);
      }
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    downloadFile(blob, 'primordial-portfolio_media_assets.zip', 'application/zip');
  };

  const handleCreateNewAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilename.trim()) return;
    
    const formatted = newFilename.trim();
    onAddAsset({
      filename: formatted,
      fileType: newFileType,
      associatedProjectTitle: newAssociatedProject.trim() || 'Custom Deployment Asset',
      updatedAt: Date.now()
    });

    setNewFilename('');
    setNewAssociatedProject('');
    setIsAddingNew(false);
  };

  const filteredAssets = managedAssets.filter((asset) => {
    const matchesSearch =
      !searchQuery ||
      asset.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.associatedProjectTitle.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (typeFilter === 'video') return asset.fileType === 'video';
    if (typeFilter === 'image') return asset.fileType === 'image';
    if (typeFilter === 'linked') return Boolean(asset.dataUrl || asset.externalUrl);
    if (typeFilter === 'missing') return !asset.dataUrl && !asset.externalUrl;

    return true;
  });

  const linkedCount = managedAssets.filter((a) => a.dataUrl || a.externalUrl).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs font-sans">
      <div 
        id="asset-manager-dialog"
        className="bg-zinc-950 border border-zinc-800 text-zinc-200 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <FolderSync className="w-5 h-5 text-sky-400" />
                <span>Primordial Video Asset &amp; Media Hub</span>
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800 text-sky-300 font-medium">
                {linkedCount} / {managedAssets.length} Ready
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Manage images, videos, and blueprints referenced across primordial-portfolio.netlify.app
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="open-html-studio-from-assets"
              onClick={onOpenHtmlStudio}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors border border-zinc-700"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Preview HTML</span>
            </button>

            <button
              type="button"
              id="download-netlify-bundle-btn"
              onClick={onDownloadNetlifyZip}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-black text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Netlify Bundle (.zip)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Strategy Bar */}
        <div className="px-6 py-3 bg-zinc-900/50 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-zinc-400 font-semibold">Asset Path Strategy:</span>
            <select
              value={assetStrategy}
              onChange={(e) => onUpdateStrategy(e.target.value as AssetPathStrategy)}
              className="bg-zinc-800 border border-zinc-700 rounded-md px-2.5 py-1 text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-sky-500"
            >
              <option value="relative">Relative Root (./filename.ext) — Standard Netlify Deploy</option>
              <option value="assets_folder">Subfolder (./assets/filename.ext) — Structured assets/</option>
              <option value="netlify_live">Live Netlify CDN (https://primordial-portfolio.netlify.app/media/filename)</option>
              <option value="embedded">Self-Contained Inline (Embed uploaded Base64 in HTML)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleAutoLinkAllToNetlify}
              className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-sky-400 text-xs font-mono flex items-center gap-1.5 transition-colors"
              title="Automatically connect all case studies to live primordial-portfolio.netlify.app assets"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Link All to Netlify CDN</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadAllMediaZip}
              className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
              title="Download all currently uploaded media files as a ZIP package"
            >
              <Archive className="w-3.5 h-3.5 text-amber-400" />
              <span>Download Media ZIP</span>
            </button>
          </div>
        </div>

        {/* Batch Dropzone & Status Bar */}
        <div className="px-6 py-3 bg-zinc-950 border-b border-zinc-800">
          <input
            ref={batchFileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleBatchProcessFiles(e.target.files);
              e.target.value = '';
            }}
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingBatch(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDraggingBatch(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingBatch(false);
              if (e.dataTransfer.files) handleBatchProcessFiles(e.dataTransfer.files);
            }}
            onClick={() => batchFileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
              isDraggingBatch
                ? 'border-sky-400 bg-sky-950/30 text-white'
                : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-zinc-400 hover:text-zinc-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-sky-400 shrink-0">
                <FolderUp className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                  <span>Batch Ingest Media Files (Videos, Images, Technical Blueprints)</span>
                  {isProcessingBatch && (
                    <span className="text-[10px] font-mono text-sky-400 animate-pulse">
                      Processing...
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                  Drag &amp; drop multiple files at once or click to browse. Files automatically link to matching case study blueprints by filename!
                </p>
              </div>
              <button
                type="button"
                className="mt-2 sm:mt-0 sm:ml-auto px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono font-medium border border-zinc-700 pointer-events-none"
              >
                Browse Files
              </button>
            </div>

            {batchStatus && (
              <div className="mt-2.5 inline-block px-3 py-1 rounded bg-sky-950/80 border border-sky-800/80 text-xs font-mono text-sky-300">
                {batchStatus}
              </div>
            )}
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="px-6 py-3 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-zinc-950">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                typeFilter === 'all'
                  ? 'bg-sky-500 text-black font-semibold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              All ({managedAssets.length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('video')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                typeFilter === 'video'
                  ? 'bg-sky-500 text-black font-semibold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Videos ({managedAssets.filter((a) => a.fileType === 'video').length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('image')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                typeFilter === 'image'
                  ? 'bg-sky-500 text-black font-semibold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Images ({managedAssets.filter((a) => a.fileType === 'image').length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('linked')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                typeFilter === 'linked'
                  ? 'bg-emerald-500 text-black font-semibold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Uploaded / Linked ({linkedCount})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('missing')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                typeFilter === 'missing'
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Awaiting File ({managedAssets.length - linkedCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search filenames or deployments..."
                className="pl-8 pr-3 py-1 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-white placeholder:text-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-sky-500 w-48 sm:w-64"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 border border-zinc-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Asset</span>
            </button>
          </div>
        </div>

        {/* Add New Custom Asset Form */}
        {isAddingNew && (
          <form onSubmit={handleCreateNewAsset} className="px-6 py-3 bg-zinc-900 border-b border-zinc-800 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-mono text-zinc-400 mb-0.5">Asset Filename (e.g., stage_lighting.mp4)</label>
              <input
                type="text"
                required
                value={newFilename}
                onChange={(e) => setNewFilename(e.target.value)}
                placeholder="filename.jpg or video.mp4"
                className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-white font-mono"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-mono text-zinc-400 mb-0.5">Associated Case Study / Description</label>
              <input
                type="text"
                value={newAssociatedProject}
                onChange={(e) => setNewAssociatedProject(e.target.value)}
                placeholder="e.g. 05 // Republic Club Live Drop"
                className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-zinc-400 mb-0.5">File Type</label>
              <select
                value={newFileType}
                onChange={(e) => setNewFileType(e.target.value as 'image' | 'video' | 'pdf')}
                className="bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-white font-mono"
              >
                <option value="image">Image (.jpg, .png)</option>
                <option value="video">Video (.mp4, .webm)</option>
                <option value="pdf">Document / Blueprint (.pdf)</option>
              </select>
            </div>
            <div className="flex items-end gap-2 pt-4">
              <button
                type="submit"
                className="px-3 py-1 bg-sky-500 hover:bg-sky-400 text-black font-semibold rounded transition-colors"
              >
                Add Asset
              </button>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Assets Table / List */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60 p-4 sm:p-6 space-y-2.5">
          {filteredAssets.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 font-mono text-xs">
              No assets found matching your search or filter.
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const hasData = Boolean(asset.dataUrl || asset.externalUrl);
              const isVideo = asset.fileType === 'video';
              const resolvedPreview = asset.dataUrl || asset.externalUrl || `https://primordial-portfolio.netlify.app/media/${asset.filename}`;

              return (
                <div
                  key={asset.filename}
                  className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    {/* Media Thumbnail Box */}
                    <div className="w-16 h-12 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden relative shrink-0 flex items-center justify-center">
                      {hasData ? (
                        isVideo ? (
                          <div className="relative w-full h-full bg-zinc-950 flex items-center justify-center text-sky-400">
                            <FileVideo className="w-5 h-5" />
                          </div>
                        ) : (
                          <img
                            src={resolvedPreview}
                            alt={asset.filename}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        )
                      ) : (
                        <div className="text-zinc-600">
                          {isVideo ? <FileVideo className="w-5 h-5" /> : <FileImage className="w-5 h-5" />}
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white tracking-tight break-all">
                          {asset.filename}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                          {asset.fileType}
                        </span>
                        {hasData ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.2 rounded">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{asset.dataUrl ? 'Uploaded Base64' : 'External Link'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800 px-1.5 py-0.2 rounded">
                            <AlertCircle className="w-3 h-3" />
                            <span>Awaiting File</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        {asset.associatedProjectTitle}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewMedia({ url: resolvedPreview, isVideo, title: asset.filename })}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1 transition-colors border border-zinc-700"
                      title="Preview Media"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Preview</span>
                    </button>

                    {/* Upload File Button */}
                    <label className="cursor-pointer px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1 transition-colors border border-zinc-700">
                      <Upload className="w-3.5 h-3.5 text-sky-400" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept={isVideo ? 'video/mp4,video/webm' : 'image/*'}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(asset.filename, file);
                        }}
                      />
                    </label>

                    {/* Link External URL Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setExternalUrlInput({
                          filename: asset.filename,
                          url: asset.externalUrl || ''
                        });
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1 transition-colors border border-zinc-700"
                      title="Set External CDN / Cloud URL"
                    >
                      <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Link URL</span>
                    </button>

                    {/* Clear / Delete */}
                    {hasData && (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateAsset({
                            ...asset,
                            dataUrl: undefined,
                            externalUrl: undefined
                          });
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        title="Clear uploaded file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950 flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-500">
          <div>
            Total Tracked Assets: <strong className="text-zinc-300">{managedAssets.length}</strong> • Uploaded in App: <strong className="text-emerald-400">{linkedCount}</strong>
          </div>
          <div>
            Drop folder/zip to <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">app.netlify.com/drop</a> for instant deployment
          </div>
        </div>
      </div>

      {/* External URL Dialog */}
      {externalUrlInput && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-sans">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 max-w-md w-full shadow-2xl text-zinc-200">
            <h3 className="text-sm font-bold text-white mb-1 font-mono">
              Link External CDN / Cloud URL
            </h3>
            <p className="text-xs text-zinc-400 mb-3">
              Set an external URL for <span className="font-mono text-sky-400">{externalUrlInput.filename}</span> (e.g. from Cloudinary, S3, Vimeo, or Netlify).
            </p>
            <input
              type="url"
              autoFocus
              value={externalUrlInput.url}
              onChange={(e) => setExternalUrlInput({ ...externalUrlInput, url: e.target.value })}
              placeholder="https://..."
              className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs text-white font-mono mb-4 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setExternalUrlInput(null)}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const asset = managedAssets.find((a) => a.filename === externalUrlInput.filename);
                  if (asset) {
                    onUpdateAsset({
                      ...asset,
                      externalUrl: externalUrlInput.url.trim() || undefined
                    });
                  }
                  setExternalUrlInput(null);
                }}
                className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-black font-semibold rounded transition-colors"
              >
                Save URL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="relative max-w-3xl w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden p-2">
            <button
              type="button"
              onClick={() => setPreviewMedia(null)}
              className="absolute top-4 right-4 z-10 p-1.5 bg-black/60 rounded-full text-zinc-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-3 text-xs font-mono text-zinc-400 border-b border-zinc-800 mb-2">
              Previewing: <strong className="text-white">{previewMedia.title}</strong>
            </div>
            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
              {previewMedia.isVideo ? (
                <video src={previewMedia.url} controls autoPlay className="w-full h-full object-contain"></video>
              ) : (
                <img
                  src={previewMedia.url}
                  alt={previewMedia.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).parentElement!.innerHTML =
                      '<div class="p-8 text-center font-mono text-xs text-zinc-500">Media not accessible at this local path. Upload a file or specify a CDN URL.</div>';
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
