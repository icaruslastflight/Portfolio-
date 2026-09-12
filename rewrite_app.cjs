const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const returnIndex = content.indexOf('return (');
if (returnIndex === -1) {
  console.error('Could not find return statement');
  process.exit(1);
}

const beforeReturn = content.substring(0, returnIndex);

const newReturn = `return (
    <DashboardLayout
      isGlobalDragging={isGlobalDragging}
      onGlobalDrop={handleGlobalFilesDrop}
      sidebar={
        <SidebarNav
          profile={profile}
          currentView={viewMode}
          onChangeView={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          counts={{
            projects: items.length,
            experience: workExperience.length,
            skills: totalSkillsCount,
            assets: managedAssets.length,
            deck: exportDeck.itemIds.length
          }}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenHtmlStudio={() => setIsExportPreviewOpen(true)}
          onDownloadZip={handleDownloadNetlifyZip}
        />
      }
    >
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[200] bg-stone-800 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-stone-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {viewMode === 'bulk_media' && (
        <BulkMediaWorkbench
          items={items}
          categories={categories}
          managedAssets={managedAssets}
          onUpdateItem={handleUpdateItemDirect}
          onBatchUpdateItems={handleBatchUpdateItems}
          onAddAsset={handleAddAsset}
          onBatchAddAssets={handleBatchAddAssets}
          onRemoveAsset={handleRemoveAsset}
          onClose={() => setViewMode('projects')}
          onOpenImageLightbox={(url, title) => setLightboxImage({ url, title })}
        />
      )}

      {viewMode === 'experience' && (
        <ExperienceView
          workExperience={workExperience}
          onAddExperience={handleOpenAddExperience}
          onEditExperience={handleOpenEditExperience}
          onDeleteExperience={handleDeleteExperience}
          onToggleStar={handleToggleExperienceStar}
          onOpenResumeImport={() => setIsResumeImportModalOpen(true)}
        />
      )}

      {viewMode === 'skills' && (
        <SkillsView
          skillGroups={skillGroups}
          onAddSkillGroup={handleOpenAddSkillGroup}
          onEditSkillGroup={handleOpenEditSkillGroup}
          onDeleteSkillGroup={handleDeleteSkillGroup}
          onAddSkillToGroup={handleOpenAddSkillToGroup}
          onEditSkill={handleOpenEditSkill}
          onDeleteSkill={handleDeleteSkill}
          onOpenResumeImport={() => setIsResumeImportModalOpen(true)}
        />
      )}

      {viewMode === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-100 tracking-tight">Projects & Jobs</h2>
              <p className="text-sm text-stone-400">Manage case studies and deliverables.</p>
            </div>
            <button
              onClick={() => { setItemToEdit(null); setIsItemModalOpen(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </div>
          
          <CategoryNav
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            selectedType={selectedType}
            onSelectType={setSelectedType}
            categoryItemCounts={categoryItemCounts}
            totalItemsCount={items.length}
            starredCount={starredCount}
            onMoveItemToCategory={handleMoveItemToCategory}
            onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                category={categories.find(c => c.id === item.categoryId)}
                isInExportDeck={exportDeck.itemIds.includes(item.id)}
                onEdit={() => { setItemToEdit(item); setIsItemModalOpen(true); }}
                onDelete={() => handleDeleteItem(item.id)}
                onDuplicate={() => handleDuplicateItem(item)}
                onToggleExport={() => handleToggleExportDeck(item.id)}
                onToggleStar={() => handleToggleStar(item.id)}
                onAddMedia={() => handleOpenAddMediaModal(item.id)}
                onDirectUpload={handleDirectUploadFileToItem}
              />
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full py-12 text-center text-stone-500 bg-stone-900/50 rounded-xl border border-stone-800 border-dashed">
                No projects match your filters.
              </div>
            )}
          </div>
        </div>
      )}

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

      {/* Modals */}
      {isItemModalOpen && (
        <ItemEditModal
          isOpen={isItemModalOpen}
          item={itemToEdit}
          categories={categories}
          onClose={() => setIsItemModalOpen(false)}
          onSave={handleSaveItem}
        />
      )}
      {isAddMediaModalOpen && (
        <AddMediaModal
          isOpen={isAddMediaModalOpen}
          onClose={() => setIsAddMediaModalOpen(false)}
          onSave={handleAddMediaToItem}
          targetItemId={targetMediaItemId}
          items={items}
          managedAssets={managedAssets}
        />
      )}
      {isCategoryModalOpen && (
        <CategoryManagerModal
          isOpen={isCategoryModalOpen}
          categories={categories}
          items={items}
          onClose={() => setIsCategoryModalOpen(false)}
          onAddCategory={handleAddCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}
      {isProfileModalOpen && (
        <ProfileEditModal
          isOpen={isProfileModalOpen}
          profile={profile}
          onClose={() => setIsProfileModalOpen(false)}
          onSave={(p) => setProfile(p)}
        />
      )}
      {isExportPreviewOpen && (
        <ExportPreviewModal
          isOpen={isExportPreviewOpen}
          deck={exportDeck}
          items={items}
          categories={categories}
          profile={profile}
          managedAssets={managedAssets}
          onClose={() => setIsExportPreviewOpen(false)}
          onUpdateDeckStrategy={handleUpdateAssetStrategy}
        />
      )}
      {isAssetManagerOpen && (
        <AssetManagerModal
          isOpen={isAssetManagerOpen}
          managedAssets={managedAssets}
          items={items}
          onClose={() => setIsAssetManagerOpen(false)}
          onUpdateAsset={handleUpdateAsset}
          onAddAsset={handleAddAsset}
          onRemoveAsset={handleRemoveAsset}
          onOpenImageLightbox={(url, title) => setLightboxImage({ url, title })}
        />
      )}
      {lightboxImage && (
        <ImageDetailModal
          isOpen={!!lightboxImage}
          imageUrl={lightboxImage.url}
          imageTitle={lightboxImage.title}
          onClose={() => setLightboxImage(null)}
        />
      )}
      {isExperienceModalOpen && (
        <ExperienceEditModal
          isOpen={isExperienceModalOpen}
          experience={experienceToEdit}
          onClose={() => setIsExperienceModalOpen(false)}
          onSave={handleSaveExperience}
        />
      )}
      {isSkillModalOpen && (
        <SkillEditModal
          isOpen={isSkillModalOpen}
          skill={skillToEdit}
          targetGroupId={skillTargetGroupId}
          skillGroups={skillGroups}
          onClose={() => setIsSkillModalOpen(false)}
          onSave={handleSaveSkill}
        />
      )}
      {isSkillGroupModalOpen && (
        <SkillGroupModal
          isOpen={isSkillGroupModalOpen}
          group={skillGroupToEdit}
          onClose={() => setIsSkillGroupModalOpen(false)}
          onSave={handleSaveSkillGroup}
        />
      )}
      <ResumeImportModal
        isOpen={isResumeImportModalOpen}
        onClose={() => setIsResumeImportModalOpen(false)}
        profile={profile}
        workExperience={workExperience}
        skillGroups={skillGroups}
        onCommitIngestion={handleCommitResumeIngestion}
      />
    </DashboardLayout>
  );
}
`;

fs.writeFileSync('src/App.tsx', beforeReturn + newReturn);
console.log('App.tsx rewritten successfully.');
