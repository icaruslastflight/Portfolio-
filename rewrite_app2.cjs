const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// We need to move ExportTray into the rightPanel of DashboardLayout.
const layoutStartStr = '<DashboardLayout';
const layoutStartIdx = content.indexOf(layoutStartStr);

if (layoutStartIdx === -1) {
  console.error("DashboardLayout not found");
  process.exit(1);
}

// Remove the inline ExportTray
const exportTrayStr = `<ExportTray
        deck={exportDeck}
        items={items}
        categories={categories}
        onUpdateDeck={(updated) => setExportDeck(prev => ({ ...prev, ...updated }))}
        onRemoveItemFromDeck={handleRemoveItemFromDeck}
        onReorderDeckItems={handleReorderDeckItems}
        onAddItemToDeck={handleAddItemToDeck}
        onClearDeck={handleClearDeck}
        onOpenPreviewModal={() => setIsExportPreviewOpen(true)}
        onQuickDownload={handleQuickDownload}
      />`;

content = content.replace(exportTrayStr, '');

// Insert rightPanel prop
const rightPanelStr = `rightPanel={
        <ExportTray
          deck={exportDeck}
          items={items}
          categories={categories}
          onUpdateDeck={(updated) => setExportDeck(prev => ({ ...prev, ...updated }))}
          onRemoveItemFromDeck={handleRemoveItemFromDeck}
          onReorderDeckItems={handleReorderDeckItems}
          onAddItemToDeck={handleAddItemToDeck}
          onClearDeck={handleClearDeck}
          onOpenPreviewModal={() => setIsExportPreviewOpen(true)}
          onQuickDownload={handleQuickDownload}
        />
      }`;

content = content.replace('<DashboardLayout', `<DashboardLayout\n      ${rightPanelStr}`);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx right panel updated');
