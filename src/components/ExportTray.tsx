import React from 'react';
import { ExportDeck, PortfolioItem, ExportTargetType, Category } from '../types';
import { 
  Eye, 
  Trash2, 
  GripVertical, 
  FileCode, 
  FileText, 
  Archive, 
  Layers
} from 'lucide-react';

interface ExportTrayProps {
  deck: ExportDeck;
  items: PortfolioItem[];
  categories: Category[];
  onUpdateDeck: (updated: Partial<ExportDeck>) => void;
  onRemoveItemFromDeck: (itemId: string) => void;
  onReorderDeckItems: (newItemIds: string[]) => void;
  onAddItemToDeck: (itemId: string) => void;
  onClearDeck: () => void;
  onOpenPreviewModal: () => void;
  onQuickDownload: (type: ExportTargetType | 'zip' | 'json') => void;
}

export const ExportTray: React.FC<ExportTrayProps> = ({
  deck,
  items,
  categories,
  onUpdateDeck,
  onRemoveItemFromDeck,
  onReorderDeckItems,
  onAddItemToDeck,
  onClearDeck,
  onOpenPreviewModal,
  onQuickDownload
}) => {
  const [isDragOverTray, setIsDragOverTray] = React.useState(false);
  const [draggedItemId, setDraggedItemId] = React.useState<string | null>(null);

  const deckItems = deck.itemIds
    .map((id) => items.find((i) => i.id === id))
    .filter((i): i is PortfolioItem => Boolean(i));

  const handleTrayDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOverTray) setIsDragOverTray(true);
  };

  const handleTrayDragLeave = (e: React.DragEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setIsDragOverTray(false);
    }
  };

  const handleTrayDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverTray(false);
    const itemId = e.dataTransfer.getData('text/plain');
    if (itemId) onAddItemToDeck(itemId);
  };

  const handleItemDragStart = (e: React.DragEvent, id: string) => {
    e.stopPropagation();
    setDraggedItemId(id);
    e.dataTransfer.setData('reorder/item-id', id);
  };

  const handleItemDropOnOther = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const sourceId = e.dataTransfer.getData('reorder/item-id') || draggedItemId;
    if (!sourceId || sourceId === targetId) return;

    const sourceIndex = deck.itemIds.indexOf(sourceId);
    const targetIndex = deck.itemIds.indexOf(targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const newOrder = [...deck.itemIds];
    newOrder.splice(sourceIndex, 1);
    newOrder.splice(targetIndex, 0, sourceId);

    onReorderDeckItems(newOrder);
    setDraggedItemId(null);
  };

  return (
    <div
      onDragOver={handleTrayDragOver}
      onDragLeave={handleTrayDragLeave}
      onDrop={handleTrayDrop}
      className={`h-full flex flex-col transition-all duration-300 ${
        isDragOverTray ? 'bg-stone-900/80 ring-2 ring-sky-500 inset-0' : ''
      }`}
    >
      <div className="p-4 border-b border-stone-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-bold text-white">Export Deck</h2>
          </div>
          <span className="bg-sky-900/40 text-sky-300 text-xs font-bold px-2 py-0.5 rounded border border-sky-800">
            {deckItems.length} items
          </span>
        </div>
        
        {deckItems.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={onOpenPreviewModal}
              className="w-full flex justify-center items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-all shadow"
            >
              <Eye className="w-4 h-4" />
              Preview Output
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onQuickDownload('portfolio')}
                className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs border border-stone-700"
              >
                <FileCode className="w-3.5 h-3.5" /> HTML
              </button>
              <button
                onClick={() => onQuickDownload('resume')}
                className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs border border-stone-700"
              >
                <FileText className="w-3.5 h-3.5" /> .MD
              </button>
            </div>
            <button
              onClick={() => onQuickDownload('zip')}
              className="w-full flex justify-center items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-all"
            >
              <Archive className="w-4 h-4" />
              ZIP Bundle
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-stone-800">
        {deckItems.length === 0 ? (
          <div className="p-4 border border-dashed border-stone-800 rounded-xl text-center">
            <p className="text-xs text-stone-400">Your deck is empty.</p>
            <p className="text-[10px] text-stone-500 mt-1">Drag items here to stage them for export.</p>
          </div>
        ) : (
          deckItems.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleItemDragStart(e, item.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleItemDropOnOther(e, item.id)}
              className="group flex items-center gap-3 bg-stone-900 border border-stone-800 hover:border-sky-500/50 rounded-lg p-2 text-xs text-stone-200 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="w-8 h-8 rounded object-cover border border-stone-700 shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded bg-stone-800 flex items-center justify-center text-stone-500 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
              )}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-semibold text-stone-200 truncate">{item.title}</span>
                <span className="text-[10px] text-stone-500">#{index + 1} • {item.type}</span>
              </div>
              <button
                onClick={() => onRemoveItemFromDeck(item.id)}
                className="p-1.5 rounded text-stone-500 hover:text-rose-400 hover:bg-stone-800 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
        
        {deckItems.length > 0 && (
          <button
            onClick={onClearDeck}
            className="w-full mt-4 text-xs text-stone-500 hover:text-rose-400 py-2 transition-colors"
          >
            Clear Deck
          </button>
        )}
      </div>
    </div>
  );
};
