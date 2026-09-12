import React from 'react';
import { X, Info } from 'lucide-react';

interface ImageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title: string | null;
  context?: string | null;
}

export const ImageDetailModal: React.FC<ImageDetailModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  context
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl max-h-[92vh] flex flex-col items-center w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/80 hover:text-white p-1 rounded-full hover:bg-stone-900/10 transition-colors"
          title="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative max-w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-xl border border-white/15 shadow-2xl bg-black">
          <img
            src={imageUrl}
            alt={title || 'Enlarged showcase view'}
            className="max-w-full max-h-[75vh] object-contain"
          />
        </div>

        {/* Title and Context Notes */}
        <div className="mt-3 text-center max-w-2xl px-4 space-y-1.5">
          {title && (
            <div className="text-white text-sm font-semibold tracking-wide">
              {title}
            </div>
          )}
          {context && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-950/80 border border-sky-600/50 text-sky-200 text-xs text-left font-mono">
              <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{context}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
