import React, { useState, useRef } from 'react';
import { PortfolioItem, ManagedAsset } from '../types';
import { 
  X, 
  Upload, 
  Film, 
  Image as ImageIcon, 
  Link2, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  FileCode,
  FolderSync,
  AlertCircle
} from 'lucide-react';

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: PortfolioItem[];
  managedAssets: ManagedAsset[];
  preselectedItemId?: string | null;
  onAddMediaToItem: (itemId: string, mediaData: {
    imageUrl?: string;
    videoUrl?: string;
    mediaFilename?: string;
    caption?: string;
  }) => void;
  onAddAssetToHub: (asset: {
    filename: string;
    fileType: 'image' | 'video' | 'pdf';
    associatedProjectTitle?: string;
    dataUrl?: string;
    externalUrl?: string;
    fileSize?: number;
  }) => void;
  onCreateItemWithMedia?: (title: string, categoryId: string, mediaData: {
    imageUrl?: string;
    videoUrl?: string;
    mediaFilename?: string;
  }) => void;
}

export const AddMediaModal: React.FC<AddMediaModalProps> = ({
  isOpen,
  onClose,
  items,
  managedAssets,
  preselectedItemId,
  onAddMediaToItem,
  onAddAssetToHub
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'library'>('upload');
  const [selectedItemId, setSelectedItemId] = useState<string>(preselectedItemId || (items[0]?.id || ''));
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [filename, setFilename] = useState('');
  const [caption, setCaption] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [fileSizeStr, setFileSizeStr] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (preselectedItemId) {
      setSelectedItemId(preselectedItemId);
    } else if (items.length > 0 && !selectedItemId) {
      setSelectedItemId(items[0].id);
    }
  }, [preselectedItemId, items]);

  if (!isOpen) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleProcessFile = (file: File) => {
    setErrorMessage(null);
    setIsProcessing(true);
    setFilename(file.name);
    setFileSizeStr(formatBytes(file.size));

    const isVid = file.type.startsWith('video/') || 
      file.name.endsWith('.mp4') || 
      file.name.endsWith('.webm') || 
      file.name.endsWith('.mov') ||
      file.name.endsWith('.m4v');

    setMediaType(isVid ? 'video' : 'image');

    // Create immediate memory object URL for instant preview without delay
    const objectUrl = URL.createObjectURL(file);
    setPreviewSrc(objectUrl);

    // Also read as Data URL for standalone exports
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setPreviewSrc(dataUrl);
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setIsProcessing(false);
      setErrorMessage('Could not process this file. Please try another format.');
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (!externalUrl.trim()) return;
    setErrorMessage(null);
    const cleanUrl = externalUrl.trim();
    
    // Auto-detect format
    const lower = cleanUrl.toLowerCase();
    const isVid = lower.includes('.mp4') || lower.includes('.webm') || lower.includes('vimeo') || lower.includes('youtube');
    setMediaType(isVid ? 'video' : 'image');
    setPreviewSrc(cleanUrl);
    
    if (!filename) {
      const extractedName = cleanUrl.split('/').pop()?.split('?')[0] || (isVid ? 'remote_video.mp4' : 'remote_image.jpg');
      setFilename(extractedName);
    }
  };

  const handleSelectFromLibrary = (asset: ManagedAsset) => {
    setFilename(asset.filename);
    setMediaType(asset.fileType === 'video' ? 'video' : 'image');
    const resolved = asset.dataUrl || asset.externalUrl || `https://primordial-portfolio.netlify.app/media/${encodeURIComponent(asset.filename)}`;
    setPreviewSrc(resolved);
  };

  const handleSave = () => {
    if (!previewSrc && !filename) {
      setErrorMessage('Please upload a file, enter a URL, or pick an asset from your library.');
      return;
    }

    if (!selectedItemId) {
      setErrorMessage('Please select a target case study.');
      return;
    }

    const isVid = mediaType === 'video';

    // 1. Update Portfolio Item
    onAddMediaToItem(selectedItemId, {
      imageUrl: !isVid ? (previewSrc || undefined) : undefined,
      videoUrl: isVid ? (previewSrc || undefined) : undefined,
      mediaFilename: filename || undefined,
      caption: caption || undefined
    });

    // 2. Also register into Netlify Asset Hub if not already present
    const cleanName = filename || (isVid ? 'custom_video.mp4' : 'custom_image.jpg');
    const existing = managedAssets.find((a) => a.filename.toLowerCase() === cleanName.toLowerCase());
    if (!existing) {
      onAddAssetToHub({
        filename: cleanName,
        fileType: isVid ? 'video' : 'image',
        associatedProjectTitle: items.find((i) => i.id === selectedItemId)?.title || 'Custom Upload',
        dataUrl: previewSrc?.startsWith('data:') ? previewSrc : undefined,
        externalUrl: previewSrc?.startsWith('http') ? previewSrc : undefined
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Add Media to Portfolio
              </h2>
              <p className="text-[11px] font-mono text-stone-400">
                Videos, Photos, &amp; Visual Assets for Netlify deployment
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source Tabs */}
        <div className="flex border-b border-stone-800 bg-stone-950 px-5 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-3 text-xs font-semibold font-mono flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`pb-2.5 px-3 text-xs font-semibold font-mono flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'url'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Web URL / CDN</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`pb-2.5 px-3 text-xs font-semibold font-mono flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'library'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FolderSync className="w-3.5 h-3.5" />
            <span>Asset Hub Library ({managedAssets.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-200">
          {/* Target Portfolio Item Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1 font-mono">
              Target Case Study / Portfolio Item <span className="text-sky-400">*</span>
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-white text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} ({item.mediaFilename ? `Has: ${item.mediaFilename}` : 'No Media Attached'})
                </option>
              ))}
            </select>
          </div>

          {/* TAB 1: Local File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,.mp4,.mov,.webm,.m4v,.png,.jpg,.jpeg,.gif,.webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleProcessFile(file);
                  e.target.value = '';
                }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleProcessFile(file);
                }}
                className="border-2 border-dashed border-stone-700 hover:border-sky-400 bg-stone-950/60 hover:bg-stone-950 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5"
              >
                <div className="w-12 h-12 rounded-xl bg-stone-800/80 flex items-center justify-center text-sky-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-white text-xs sm:text-sm">
                    Click to select or drag &amp; drop media file
                  </div>
                  <p className="text-[11px] font-mono text-stone-400 mt-1">
                    Supports Video (.mp4, .mov, .webm, .m4v) and Images (.jpg, .png, .webp, .gif)
                  </p>
                </div>
                {fileSizeStr && (
                  <div className="mt-1 px-2.5 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300 font-mono text-[10px]">
                    Detected Size: {fileSizeStr}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Direct URL */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://primordial-portfolio.netlify.app/media/my_video.mp4 or https://..."
                  className="flex-1 px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-white font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-black font-semibold rounded-lg text-xs transition-colors shrink-0"
                >
                  Load URL
                </button>
              </div>
              <p className="text-[11px] font-mono text-stone-500">
                Accepts direct media files from Netlify, AWS S3, Cloudinary, YouTube, or public servers.
              </p>
            </div>
          )}

          {/* TAB 3: Library Selection */}
          {activeTab === 'library' && (
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-stone-400 mb-2">
                Click any asset blueprint to attach it directly to this case study:
              </div>
              <div className="max-h-52 overflow-y-auto divide-y divide-stone-800 border border-stone-800 rounded-xl bg-stone-950">
                {managedAssets.length === 0 ? (
                  <div className="p-4 text-center text-stone-500 text-xs font-mono">
                    No assets registered yet.
                  </div>
                ) : (
                  managedAssets.map((asset) => (
                    <div
                      key={asset.filename}
                      onClick={() => handleSelectFromLibrary(asset)}
                      className="p-2.5 hover:bg-stone-900 cursor-pointer flex items-center justify-between gap-2 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {asset.fileType === 'video' ? (
                          <Film className="w-4 h-4 text-sky-400 shrink-0" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className="font-mono text-xs text-white truncate">
                          {asset.filename}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-500 shrink-0">
                        {asset.fileType.toUpperCase()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Filename & Caption Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">
                Netlify Asset Filename
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="e.g. proposal.mp4 or stage_lighting.jpg"
                className="w-full px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-white font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">
                Optional Caption / Tech Note
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Dual 4K Resolume Playback via Brompton SX40"
                className="w-full px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Live Preview Box */}
          {previewSrc && (
            <div className="pt-2">
              <label className="block text-xs font-mono text-stone-400 mb-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Media Preview Ready</span>
              </label>
              <div className="w-full h-44 rounded-xl bg-black border border-stone-800 overflow-hidden relative flex items-center justify-center">
                {mediaType === 'video' ? (
                  <video
                    src={previewSrc}
                    controls
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={previewSrc}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-stone-800 bg-stone-950 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isProcessing}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-black flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Attach Media to Item</span>
          </button>
        </div>
      </div>
    </div>
  );
};
