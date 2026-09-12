import React, { useState, useMemo } from 'react';
import { AuthorProfile, Category, ExportDeck, PortfolioItem, ManagedAsset, AssetPathStrategy, ExportLayout } from '../types';
import { 
  generateInteractiveHtmlPortfolio, 
  generateResumeMarkdown, 
  generateZipArchive, 
  downloadFile 
} from '../utils/exportGenerators';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  FileText, 
  Archive, 
  Sliders, 
  Eye, 
  ExternalLink,
  Code,
  Globe,
  FolderSync,
  Sparkles,
  Layers,
  Terminal
} from 'lucide-react';

interface ExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: ExportDeck;
  items: PortfolioItem[];
  categories: Category[];
  profile: AuthorProfile;
  managedAssets: ManagedAsset[];
  onUpdateDeck: (updated: Partial<ExportDeck>) => void;
  onOpenAssetManager: () => void;
}

export const ExportPreviewModal: React.FC<ExportPreviewModalProps> = ({
  isOpen,
  onClose,
  deck,
  items,
  categories,
  profile,
  managedAssets,
  onUpdateDeck,
  onOpenAssetManager
}) => {
  const [activeTab, setActiveTab] = useState<'primordial_preview' | 'html_code' | 'resume_preview' | 'markdown_code'>('primordial_preview');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [editedHtml, setEditedHtml] = useState<string | null>(null);

  // Asset registry for embedded/linked data URLs
  const assetRegistry = useMemo(() => {
    const reg: Record<string, string> = {};
    managedAssets.forEach((asset) => {
      if (asset.dataUrl) {
        reg[asset.filename] = asset.dataUrl;
      } else if (asset.externalUrl) {
        reg[asset.filename] = asset.externalUrl;
      }
    });
    return reg;
  }, [managedAssets]);

  // Generate outputs
  const generatedHtmlPortfolio = useMemo(() => {
    return generateInteractiveHtmlPortfolio(profile, deck, items, categories, assetRegistry);
  }, [profile, deck, items, categories, assetRegistry]);

  const activeHtml = editedHtml !== null ? editedHtml : generatedHtmlPortfolio;

  const markdownResume = useMemo(() => {
    return generateResumeMarkdown(profile, deck, items, categories);
  }, [profile, deck, items, categories]);

  if (!isOpen) return null;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(activeHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    downloadFile(activeHtml, 'index.html', 'text/html');
  };

  const handleDownloadMarkdown = () => {
    const filename = `${profile.name.toLowerCase().replace(/\s+/g, '_')}_resume.md`;
    downloadFile(markdownResume, filename, 'text/markdown');
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const blob = await generateZipArchive(profile, deck, items, categories, managedAssets);
      const filename = `primordialvideo_netlify_bundle.zip`;
      downloadFile(blob, filename, 'application/zip');
    } catch (err) {
      console.error('Failed to create ZIP', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/80 backdrop-blur-xs font-sans">
      <div 
        id="export-preview-modal-dialog"
        className="bg-zinc-950 border border-zinc-800 text-zinc-100 w-full max-w-6xl h-[94vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-zinc-900/90">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-sky-400" />
                <span>HTML &amp; Netlify Studio</span>
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300">
                primordialvideo.netlify.app
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                {deck.itemIds.length} Items Selected
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Instant manipulation of HTML code, layout themes, and Netlify-ready asset deployment bundles
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Manage Assets Shortcut */}
            <button
              type="button"
              id="switch-to-asset-manager-btn"
              onClick={onOpenAssetManager}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors border border-zinc-700"
            >
              <FolderSync className="w-3.5 h-3.5 text-sky-400" />
              <span>Manage Assets</span>
            </button>

            {/* Copy HTML/MD */}
            <button
              type="button"
              id="copy-current-output-btn"
              onClick={activeTab.includes('html') || activeTab.includes('primordial') ? handleCopyHtml : handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors border border-zinc-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            {/* Download index.html */}
            <button
              type="button"
              id="download-clean-index-html-btn"
              onClick={handleDownloadHtml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sky-300 text-xs font-mono font-semibold transition-colors border border-sky-900/60"
              title="Download index.html ready for Netlify"
            >
              <FileCode className="w-3.5 h-3.5 text-sky-400" />
              <span>Download index.html</span>
            </button>

            {/* Download Netlify Bundle ZIP */}
            <button
              type="button"
              id="download-netlify-deploy-zip-btn"
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-black text-xs font-semibold shadow-xs transition-colors"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Bundling ZIP...' : 'Download Netlify ZIP'}</span>
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

        {/* View Mode Tabs & Quick Layout Toggles */}
        <div className="px-5 py-2.5 border-b border-zinc-800 bg-zinc-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="tab-primordial-preview"
              onClick={() => setActiveTab('primordial_preview')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${
                activeTab === 'primordial_preview'
                  ? 'bg-sky-500 text-black font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visual Live Preview</span>
            </button>

            <button
              type="button"
              id="tab-html-code"
              onClick={() => setActiveTab('html_code')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${
                activeTab === 'html_code'
                  ? 'bg-sky-500 text-black font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Raw HTML Code &amp; Inspector</span>
            </button>

            <button
              type="button"
              id="tab-resume-preview"
              onClick={() => setActiveTab('resume_preview')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${
                activeTab === 'resume_preview'
                  ? 'bg-sky-500 text-black font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>ATS Resume Preview</span>
            </button>

            <button
              type="button"
              id="tab-markdown-code"
              onClick={() => setActiveTab('markdown_code')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${
                activeTab === 'markdown_code'
                  ? 'bg-sky-500 text-black font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Markdown Code</span>
            </button>
          </div>

          {/* Theme & Strategy Selectors */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400">Theme:</span>
              <select
                value={deck.layout}
                onChange={(e) => {
                  onUpdateDeck({ layout: e.target.value as ExportLayout });
                  setEditedHtml(null); // Reset manual tweaks on layout switch
                }}
                className="bg-zinc-800 border border-zinc-700 rounded px-2 py-0.8 text-white text-[11px]"
              >
                <option value="primordial_dark">Primordial Cyber-Dark (Netlify)</option>
                <option value="modern">Modern Dark / Sleek</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400">Assets:</span>
              <select
                value={deck.assetPathStrategy || 'relative'}
                onChange={(e) => {
                  onUpdateDeck({ assetPathStrategy: e.target.value as AssetPathStrategy });
                  setEditedHtml(null);
                }}
                className="bg-zinc-800 border border-zinc-700 rounded px-2 py-0.8 text-white text-[11px]"
              >
                <option value="relative">Relative Root (./filename)</option>
                <option value="assets_folder">Subfolder (./assets/filename)</option>
                <option value="netlify_live">Live Netlify CDN URL</option>
                <option value="embedded">Inline Base64 Data</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Workspace */}
        <div className="flex-1 overflow-hidden relative bg-black">
          {/* Visual Live Preview */}
          {activeTab === 'primordial_preview' && (
            <div className="w-full h-full flex flex-col">
              <iframe
                title="Live HTML Portfolio Preview"
                srcDoc={activeHtml}
                className="w-full h-full border-none bg-[#05070b]"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          )}

          {/* Raw HTML Code & Live Inspector */}
          {activeTab === 'html_code' && (
            <div className="w-full h-full flex flex-col p-4">
              <div className="flex items-center justify-between mb-2 text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <span>HTML Source Code (Clean Standalone index.html)</span>
                  {editedHtml !== null && (
                    <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800 px-1.5 py-0.5 rounded">
                      Manual edits applied
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {editedHtml !== null && (
                    <button
                      type="button"
                      onClick={() => setEditedHtml(null)}
                      className="text-xs text-zinc-400 hover:text-white underline"
                    >
                      Reset to generated HTML
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleCopyHtml}
                    className="text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy to clipboard</span>
                  </button>
                </div>
              </div>
              <textarea
                value={activeHtml}
                onChange={(e) => setEditedHtml(e.target.value)}
                spellCheck={false}
                className="w-full flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-200 resize-none focus:outline-hidden focus:ring-1 focus:ring-sky-500 leading-relaxed overflow-auto selection:bg-sky-500 selection:text-black"
              />
            </div>
          )}

          {/* ATS Resume Preview */}
          {activeTab === 'resume_preview' && (
            <div className="w-full h-full overflow-y-auto p-6 sm:p-8 bg-zinc-900 text-zinc-200">
              <div className="max-w-3xl mx-auto bg-zinc-950 p-8 rounded-xl border border-zinc-800 shadow-xl space-y-4">
                <div className="border-b border-zinc-800 pb-4">
                  <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                  <p className="text-sky-400 font-semibold text-sm">{profile.title}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {profile.location} • {profile.phone} • {profile.email}
                  </p>
                </div>
                {profile.summary && (
                  <div className="text-xs text-zinc-300 leading-relaxed">
                    <h3 className="text-xs font-mono font-bold uppercase text-zinc-400 mb-1">Summary</h3>
                    <p>{profile.summary}</p>
                  </div>
                )}
                <div className="pt-2 border-t border-zinc-800">
                  <h3 className="text-xs font-mono font-bold uppercase text-zinc-400 mb-3">
                    Curated Experience &amp; Competencies
                  </h3>
                  <div className="space-y-4">
                    {deck.itemIds
                      .map((id) => items.find((i) => i.id === id))
                      .filter(Boolean)
                      .map((item) => (
                        <div key={item!.id} className="text-xs border-b border-zinc-900 pb-3">
                          <div className="flex justify-between font-bold text-white">
                            <span>{item!.title}</span>
                            <span className="font-mono text-zinc-400">{item!.date}</span>
                          </div>
                          {item!.subtitle && <p className="text-sky-400 text-[11px]">{item!.subtitle}</p>}
                          <p className="text-zinc-300 mt-1 leading-relaxed">{item!.content}</p>
                          {item!.tags && item!.tags.length > 0 && (
                            <p className="text-[10px] font-mono text-zinc-500 mt-1">
                              Keywords: {item!.tags.join(', ')}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Markdown Code View */}
          {activeTab === 'markdown_code' && (
            <div className="w-full h-full flex flex-col p-4">
              <div className="flex items-center justify-between mb-2 text-xs font-mono text-zinc-400">
                <span>Markdown Resume (Ready for Notion, Obsidian, GitHub)</span>
                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className="text-sky-400 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </button>
              </div>
              <textarea
                readOnly
                value={markdownResume}
                spellCheck={false}
                className="w-full flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-200 resize-none focus:outline-hidden leading-relaxed overflow-auto selection:bg-sky-500 selection:text-black"
              />
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-2.5 border-t border-zinc-800 bg-zinc-900/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>All 10 Primordial Video Case Studies &amp; Blueprints Synced</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Netlify Drop ready: <strong>app.netlify.com/drop</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
