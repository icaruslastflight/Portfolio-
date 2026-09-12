/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Category, 
  PortfolioItem, 
  AuthorProfile, 
  ExportDeck, 
  ItemType,
  JobMatch, 
  ExportTargetType,
  ManagedAsset,
  AssetPathStrategy,
  WorkExperience,
  SkillGroup,
  SkillItem
} from './types';
import { 
  DEFAULT_CATEGORIES, 
  DEFAULT_ITEMS, 
  DEFAULT_AUTHOR_PROFILE, 
  DEFAULT_EXPORT_DECK,
  DEFAULT_MANAGED_ASSETS,
  DEFAULT_WORK_EXPERIENCE,
  DEFAULT_SKILL_GROUPS
} from './data/defaultData';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { ItemCard } from './components/ItemCard';
import { ExportTray } from './components/ExportTray';
import { ExportPreviewModal } from './components/ExportPreviewModal';
import { AssetManagerModal } from './components/AssetManagerModal';
import { ItemEditModal } from './components/ItemEditModal';
import { AddMediaModal } from './components/AddMediaModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { ImageDetailModal } from './components/ImageDetailModal';
import { BulkMediaWorkbench } from './components/BulkMediaWorkbench';
import { ExperienceView } from './components/ExperienceView';
import { ExperienceEditModal } from './components/ExperienceEditModal';
import { SkillsView } from './components/SkillsView';
import { SkillEditModal, SkillGroupModal } from './components/SkillEditModal';
import { ResumeImportModal } from './components/ResumeImportModal';
import { safeLocalStorageSet, safeLocalStorageGet } from './utils/storage';
import { 
  generateInteractiveHtmlPortfolio, 
  generateResumeMarkdown, 
  generateZipArchive, 
  downloadFile 
} from './utils/exportGenerators';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { JobBoardView } from './components/JobBoardView';
import { JobEditModal } from './components/JobEditModal';
import { SidebarNav } from './components/layout/SidebarNav';
import { 
  Plus, 
  FolderPlus, 
  Sparkles, 
  Layers, 
  ArrowDownCircle, 
  Search,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Plane,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Globe,
  FolderSync,
  Archive,
  FolderUp,
  Briefcase
} from 'lucide-react';

const STORAGE_KEYS = {
  CATEGORIES: 'brice_morneau_portfolio_categories_v2',
  ITEMS: 'brice_morneau_portfolio_items_v2',
  DECK: 'brice_morneau_portfolio_deck_v2',
  PROFILE: 'brice_morneau_portfolio_profile_v2',
  MANAGED_ASSETS: 'brice_morneau_portfolio_managed_assets_v2',
  WORK_EXPERIENCE: 'brice_morneau_portfolio_work_experience_v2',
  SKILL_GROUPS: 'brice_morneau_portfolio_skill_groups_v2',
  JOBS: 'brice_morneau_portfolio_jobs_v2'
};

export default function App() {
  // 1. Core Data State with LocalStorage Persistence
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (saved) {
      try {
        const parsed: Category[] = JSON.parse(saved);
        if (!parsed.some((c) => c.id === 'cat_media_servers' || c.id === 'cat_direct_roles')) {
          return parsed;
        }
      } catch (e) {
        console.error('Error loading saved categories', e);
      }
    }
    return DEFAULT_CATEGORIES;
  });

  const [items, setItems] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (saved) {
      try {
        const parsed: PortfolioItem[] = JSON.parse(saved);
        if (!parsed.some((i) => i.categoryId === 'cat_media_servers' || i.categoryId === 'cat_direct_roles')) {
          return parsed;
        }
      } catch (e) {
        console.error('Error loading saved items', e);
      }
    }
    return DEFAULT_ITEMS;
  });

  const [jobs, setJobs] = useState<JobMatch[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading jobs', e);
      }
    }
    return [];
  });
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<JobMatch | null>(null);

  const [workExperience, setWorkExperience] = useState<WorkExperience[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORK_EXPERIENCE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading work experience', e);
      }
    }
    return DEFAULT_WORK_EXPERIENCE;
  });

  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SKILL_GROUPS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading skill groups', e);
      }
    }
    return DEFAULT_SKILL_GROUPS;
  });

  const [exportDeck, setExportDeck] = useState<ExportDeck>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DECK);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved deck', e);
      }
    }
    return DEFAULT_EXPORT_DECK;
  });

  const [profile, setProfile] = useState<AuthorProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved profile', e);
      }
    }
    return DEFAULT_AUTHOR_PROFILE;
  });

  const [managedAssets, setManagedAssets] = useState<ManagedAsset[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MANAGED_ASSETS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved assets', e);
      }
    }
    return DEFAULT_MANAGED_ASSETS;
  });

  // Sync to local storage safely with QuotaExceeded protection
  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.CATEGORIES, categories);
  }, [categories]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.ITEMS, items);
  }, [items]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.WORK_EXPERIENCE, workExperience);
  }, [workExperience]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.SKILL_GROUPS, skillGroups);
  }, [skillGroups]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.DECK, exportDeck);
  }, [exportDeck]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.PROFILE, profile);
  }, [profile]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.MANAGED_ASSETS, managedAssets);
  }, [managedAssets]);

  // 2. Navigation & Filter States
  const [viewMode, setViewMode] = useState<'projects' | 'experience' | 'skills' | 'bulk_media'>('projects');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ItemType | 'all' | 'starred'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 3. Modal States
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<PortfolioItem | null>(null);
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState(false);
  const [targetMediaItemId, setTargetMediaItemId] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isExportPreviewOpen, setIsExportPreviewOpen] = useState(false);
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showLogisticsNotice, setShowLogisticsNotice] = useState(false);

  // Work Experience Modal States
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [experienceToEdit, setExperienceToEdit] = useState<WorkExperience | null>(null);

  // Skills Modal States
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<SkillItem | null>(null);
  const [skillTargetGroupId, setSkillTargetGroupId] = useState<string>('');
  const [isSkillGroupModalOpen, setIsSkillGroupModalOpen] = useState(false);
  const [skillGroupToEdit, setSkillGroupToEdit] = useState<SkillGroup | null>(null);

  const totalSkillsCount = useMemo(() => {
    return skillGroups.reduce((acc, g) => acc + g.skills.length, 0);
  }, [skillGroups]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2800);
  };

  // Experience Handlers
  const handleOpenAddExperience = () => {
    setExperienceToEdit(null);
    setIsExperienceModalOpen(true);
  };

  const handleOpenEditExperience = (exp: WorkExperience) => {
    setExperienceToEdit(exp);
    setIsExperienceModalOpen(true);
  };

  const handleSaveExperience = (savedExp: WorkExperience) => {
    setWorkExperience((prev) => {
      const idx = prev.findIndex((e) => e.id === savedExp.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedExp;
        return next;
      }
      return [savedExp, ...prev];
    });
    showToast(experienceToEdit ? 'Work experience updated' : 'Work experience added');
  };

  const handleDeleteExperience = (id: string) => {
    setWorkExperience((prev) => prev.filter((e) => e.id !== id));
    showToast('Work experience entry removed');
  };

  const handleToggleExperienceStar = (id: string) => {
    setWorkExperience((prev) =>
      prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e))
    );
  };

  // Skills Handlers
  const handleOpenAddSkillToGroup = (groupId: string) => {
    setSkillToEdit(null);
    setSkillTargetGroupId(groupId || (skillGroups[0]?.id || ''));
    setIsSkillModalOpen(true);
  };

  const handleOpenEditSkill = (groupId: string, skill: SkillItem) => {
    setSkillToEdit(skill);
    setSkillTargetGroupId(groupId);
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = (targetGroupId: string, savedSkill: SkillItem) => {
    setSkillGroups((prev) => {
      return prev.map((grp) => {
        if (grp.id === targetGroupId) {
          const existingIdx = grp.skills.findIndex((s) => s.id === savedSkill.id);
          const nextSkills = [...grp.skills];
          if (existingIdx >= 0) {
            nextSkills[existingIdx] = savedSkill;
          } else {
            nextSkills.push(savedSkill);
          }
          return { ...grp, skills: nextSkills, updatedAt: Date.now() };
        } else {
          return {
            ...grp,
            skills: grp.skills.filter((s) => s.id !== savedSkill.id)
          };
        }
      });
    });
    showToast(skillToEdit ? 'Technical skill updated' : 'Technical skill added');
  };

  const handleDeleteSkill = (groupId: string, skillId: string) => {
    setSkillGroups((prev) =>
      prev.map((grp) =>
        grp.id === groupId
          ? { ...grp, skills: grp.skills.filter((s) => s.id !== skillId), updatedAt: Date.now() }
          : grp
      )
    );
    showToast('Skill deleted');
  };

  const handleOpenAddSkillGroup = () => {
    setSkillGroupToEdit(null);
    setIsSkillGroupModalOpen(true);
  };

  const handleOpenEditSkillGroup = (group: SkillGroup) => {
    setSkillGroupToEdit(group);
    setIsSkillGroupModalOpen(true);
  };

  const handleSaveSkillGroup = (savedGroup: SkillGroup) => {
    setSkillGroups((prev) => {
      const idx = prev.findIndex((g) => g.id === savedGroup.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedGroup;
        return next;
      }
      return [...prev, savedGroup];
    });
    showToast(skillGroupToEdit ? 'Skill group updated' : 'Skill domain group created');
  };

  const handleDeleteSkillGroup = (groupId: string) => {
    setSkillGroups((prev) => prev.filter((g) => g.id !== groupId));
    showToast('Skill group deleted');
  };

  // Resume Ingestion Modal State & Commit Handler
  const [isResumeImportModalOpen, setIsResumeImportModalOpen] = useState(false);

  const handleCommitResumeIngestion = (result: {
    profileUpdates?: Partial<AuthorProfile>;
    newExperiences: WorkExperience[];
    updatedExperiences: WorkExperience[];
    skillsToAddByGroup: Record<string, any[]>;
    newSkillGroupsToCreate: Array<{ name: string; skills: any[] }>;
    newProjects: PortfolioItem[];
    stats: {
      skillsAdded: number;
      experiencesAdded: number;
      profileFieldsUpdated: number;
    };
  }) => {
    // 1. Apply profile updates
    if (result.profileUpdates && Object.keys(result.profileUpdates).length > 0) {
      setProfile((prev) => ({
        ...prev,
        ...result.profileUpdates
      }));
    }

    // 2. Apply experience updates & additions
    if (result.newExperiences.length > 0 || result.updatedExperiences.length > 0) {
      setWorkExperience((prev) => {
        let updated = [...prev];
        for (const u of result.updatedExperiences) {
          const idx = updated.findIndex((e) => e.id === u.id);
          if (idx >= 0) {
            updated[idx] = u;
          } else {
            updated.push(u);
          }
        }
        return [...result.newExperiences, ...updated];
      });
    }

    // 3. Apply skills additions to existing groups and new groups
    setSkillGroups((prev) => {
      let nextGroups = [...prev];

      // Add to existing groups
      for (const [groupId, skillsToAdd] of Object.entries(result.skillsToAddByGroup)) {
        const gIdx = nextGroups.findIndex((g) => g.id === groupId);
        if (gIdx >= 0) {
          const group = nextGroups[gIdx];
          const existingNames = new Set(group.skills.map((s) => s.name.toLowerCase()));
          const newItems: SkillItem[] = [];

          for (const s of skillsToAdd) {
            if (!existingNames.has(s.name.toLowerCase())) {
              newItems.push({
                id: s.id,
                name: s.name,
                proficiency: s.proficiency,
                yearsOfExperience: s.yearsOfExperience,
                description: s.description,
                keywords: s.keywords
              });
            }
          }

          nextGroups[gIdx] = {
            ...group,
            skills: [...group.skills, ...newItems],
            updatedAt: Date.now()
          };
        }
      }

      // Create new groups
      for (const newG of result.newSkillGroupsToCreate) {
        const newGroup: SkillGroup = {
          id: `skill_grp_${newG.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`,
          name: newG.name,
          icon: 'Cpu',
          color: 'indigo',
          description: `Discerned technical skills in ${newG.name}.`,
          skills: newG.skills.map((s) => ({
            id: s.id,
            name: s.name,
            proficiency: s.proficiency,
            yearsOfExperience: s.yearsOfExperience,
            description: s.description,
            keywords: s.keywords
          })),
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        nextGroups.push(newGroup);
      }

      return nextGroups;
    });

    // 4. Projects if any
    if (result.newProjects.length > 0) {
      setItems((prev) => [...result.newProjects, ...prev]);
    }

    // Toast and switch view
    const messageParts: string[] = [];
    if (result.stats.skillsAdded > 0) messageParts.push(`${result.stats.skillsAdded} technical skills`);
    if (result.stats.experiencesAdded > 0) messageParts.push(`${result.stats.experiencesAdded} work roles`);
    if (result.stats.profileFieldsUpdated > 0) messageParts.push(`${result.stats.profileFieldsUpdated} bio fields`);

    showToast(`Successfully ingested ${messageParts.join(', ') || 'resume data'}!`);

    if (result.stats.skillsAdded > 0) {
      setViewMode('skills');
    } else if (result.stats.experiencesAdded > 0) {
      setViewMode('experience');
    }
  };

  // Category counts
  const categoryItemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      counts[cat.id] = items.filter((i) => i.categoryId === cat.id).length;
    });
    return counts;
  }, [categories, items]);

  const starredCount = useMemo(() => {
    return items.filter((i) => i.starred).length;
  }, [items]);

  const imageCount = useMemo(() => {
    return items.filter((i) => i.type === 'image' || i.type === 'video' || Boolean(i.imageUrl) || Boolean(i.mediaFilename)).length;
  }, [items]);

  const infoCount = useMemo(() => {
    return items.filter((i) => i.type === 'info').length;
  }, [items]);

  // Filtered items computation
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategoryId && item.categoryId !== selectedCategoryId) {
        return false;
      }

      // Type filter
      if (selectedType === 'starred') {
        if (!item.starred) return false;
      } else if (selectedType === 'image') {
        if (item.type !== 'image' && item.type !== 'video' && !item.imageUrl && !item.mediaFilename) return false;
      } else if (selectedType === 'info') {
        if (item.type !== 'info') return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSubtitle = item.subtitle ? item.subtitle.toLowerCase().includes(q) : false;
        const matchesContent = item.content.toLowerCase().includes(q);
        const matchesLocation = item.location ? item.location.toLowerCase().includes(q) : false;
        const matchesRole = item.roleTag ? item.roleTag.toLowerCase().includes(q) : false;
        const matchesMedia = item.mediaFilename ? item.mediaFilename.toLowerCase().includes(q) : false;
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        return matchesTitle || matchesSubtitle || matchesContent || matchesLocation || matchesRole || matchesMedia || matchesTags;
      }

      return true;
    });
  }, [items, selectedCategoryId, selectedType, searchQuery]);

  // Actions on Items
  const handleSaveItem = (savedItem: PortfolioItem) => {
    setItems((prev) => {
      const index = prev.findIndex((i) => i.id === savedItem.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = savedItem;
        return next;
      }
      return [savedItem, ...prev];
    });

    // If item has a new mediaFilename not yet in managedAssets, register it
    if (savedItem.mediaFilename) {
      setManagedAssets((prev) => {
        const exists = prev.some((a) => a.filename === savedItem.mediaFilename);
        if (!exists) {
          const isVid = savedItem.type === 'video' || savedItem.mediaFilename!.endsWith('.mp4');
          return [
            ...prev,
            {
              filename: savedItem.mediaFilename!,
              fileType: isVid ? 'video' : 'image',
              associatedProjectTitle: savedItem.title,
              dataUrl: savedItem.imageUrl || savedItem.videoUrl,
              updatedAt: Date.now()
            }
          ];
        }
        return prev;
      });
    }

    showToast(itemToEdit ? 'Case study updated' : 'New item created');
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    // Also remove from deck if present
    setExportDeck((prev) => ({
      ...prev,
      itemIds: prev.itemIds.filter((id) => id !== itemId)
    }));
    showToast('Item deleted');
  };

  const handleDuplicateItem = (item: PortfolioItem) => {
    const duplicated: PortfolioItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: `${item.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setItems((prev) => [duplicated, ...prev]);
    showToast('Item duplicated');
  };

  const handleToggleStar = (itemId: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, starred: !i.starred } : i))
    );
  };

  // Drag-and-drop category reassignment
  const handleMoveItemToCategory = (itemId: string, targetCategoryId: string) => {
    const targetCat = categories.find((c) => c.id === targetCategoryId);
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, categoryId: targetCategoryId } : i))
    );
    showToast(`Moved item to "${targetCat?.name || 'Category'}"`);
  };

  // Dedicated Media Attachment Handlers
  const handleOpenAddMediaModal = (itemId?: string) => {
    setTargetMediaItemId(itemId || (items[0]?.id || null));
    setIsAddMediaModalOpen(true);
  };

  const handleAddMediaToItem = (
    itemId: string,
    mediaData: {
      imageUrl?: string;
      videoUrl?: string;
      mediaFilename?: string;
      caption?: string;
    }
  ) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        const isVid =
          Boolean(mediaData.videoUrl) ||
          (mediaData.mediaFilename &&
            (mediaData.mediaFilename.endsWith('.mp4') ||
              mediaData.mediaFilename.endsWith('.webm') ||
              mediaData.mediaFilename.endsWith('.mov') ||
              mediaData.mediaFilename.endsWith('.m4v')));

        return {
          ...it,
          type: isVid ? 'video' : it.type === 'video' ? 'project' : it.type,
          mediaFilename: mediaData.mediaFilename || it.mediaFilename,
          imageUrl: isVid ? '' : (mediaData.imageUrl || it.imageUrl),
          videoUrl: isVid ? (mediaData.videoUrl || mediaData.imageUrl || it.videoUrl) : '',
          imageCaption: mediaData.caption || it.imageCaption,
          updatedAt: Date.now()
        };
      })
    );
    showToast('Media attached to case study successfully');
  };

  const handleDirectUploadFileToItem = (itemId: string, file: File) => {
    const isVid =
      file.type.startsWith('video/') ||
      file.name.endsWith('.mp4') ||
      file.name.endsWith('.webm') ||
      file.name.endsWith('.mov') ||
      file.name.endsWith('.m4v');

    const objectUrl = URL.createObjectURL(file);
    const targetItem = items.find((it) => it.id === itemId);

    // Update item immediately with object URL for instant feedback
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        return {
          ...it,
          type: isVid ? 'video' : it.type === 'video' ? 'project' : it.type,
          mediaFilename: file.name,
          imageUrl: isVid ? '' : objectUrl,
          videoUrl: isVid ? objectUrl : '',
          updatedAt: Date.now()
        };
      })
    );

    // Register in managedAssets
    const newAsset: ManagedAsset = {
      filename: file.name,
      fileType: isVid ? 'video' : 'image',
      associatedProjectTitle: targetItem?.title || file.name,
      dataUrl: objectUrl,
      fileSize: file.size,
      updatedAt: Date.now()
    };
    handleAddAsset(newAsset);

    // Background base64 encoding for self-contained exports
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setItems((prev) =>
          prev.map((it) => {
            if (it.id !== itemId) return it;
            return {
              ...it,
              imageUrl: isVid ? '' : result,
              videoUrl: isVid ? result : ''
            };
          })
        );
        setManagedAssets((prev) =>
          prev.map((a) => (a.filename === file.name ? { ...a, dataUrl: result } : a))
        );
      }
    };
    reader.readAsDataURL(file);

    showToast(`Attached ${file.name} to ${targetItem?.title || 'item'}`);
  };

  // Direct and Batch Item Updates for Bulk Media Studio
  const handleUpdateItemDirect = (updatedItem: PortfolioItem) => {
    setItems((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
    showToast(`Updated media for "${updatedItem.title}"`);
  };

  const handleBatchUpdateItems = (updatedList: PortfolioItem[]) => {
    const map = new Map(updatedList.map((it) => [it.id, it]));
    setItems((prev) => prev.map((it) => map.get(it.id) || it));
    showToast(`Applied media across ${updatedList.length} items`);
  };

  const handleBatchAddAssets = (newAssets: ManagedAsset[]) => {
    setManagedAssets((prev) => {
      const existingNames = new Set(prev.map((a) => a.filename.toLowerCase()));
      const filtered = newAssets.filter((a) => !existingNames.has(a.filename.toLowerCase()));
      return [...filtered, ...prev];
    });
    showToast(`Staged ${newAssets.length} assets in Media Studio`);
  };

  // Export Deck Actions
  const handleToggleExportDeck = (itemId: string) => {
    setExportDeck((prev) => {
      const exists = prev.itemIds.includes(itemId);
      if (exists) {
        showToast('Removed from Export Deck');
        return { ...prev, itemIds: prev.itemIds.filter((id) => id !== itemId) };
      } else {
        showToast('Added to Export Deck');
        return { ...prev, itemIds: [...prev.itemIds, itemId] };
      }
    });
  };

  const handleAddItemToDeck = (itemId: string) => {
    setExportDeck((prev) => {
      if (prev.itemIds.includes(itemId)) {
        return prev;
      }
      showToast('Item dropped into Export Deck');
      return { ...prev, itemIds: [...prev.itemIds, itemId] };
    });
  };

  const handleRemoveItemFromDeck = (itemId: string) => {
    setExportDeck((prev) => ({
      ...prev,
      itemIds: prev.itemIds.filter((id) => id !== itemId)
    }));
  };

  const handleReorderDeckItems = (newItemIds: string[]) => {
    setExportDeck((prev) => ({ ...prev, itemIds: newItemIds }));
  };

  const handleClearDeck = () => {
    setExportDeck((prev) => ({ ...prev, itemIds: [] }));
    showToast('Export Deck cleared');
  };

  const handleAddAllFilteredToDeck = () => {
    setExportDeck((prev) => {
      const currentSet = new Set(prev.itemIds);
      filteredItems.forEach((i) => currentSet.add(i.id));
      return { ...prev, itemIds: Array.from(currentSet) };
    });
    showToast(`Added ${filteredItems.length} items to Export Deck`);
  };

  // Global Drag & Drop for Media Files
  const [isGlobalDragging, setIsGlobalDragging] = useState(false);

  const handleGlobalFilesDrop = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    let matched = 0;
    let added = 0;

    for (const file of fileArray) {
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const isVid = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm');
        const cleanName = file.name.trim();

        setManagedAssets((prev) => {
          const existingIndex = prev.findIndex(
            (a) => a.filename.toLowerCase() === cleanName.toLowerCase()
          );
          if (existingIndex >= 0) {
            const copy = [...prev];
            copy[existingIndex] = {
              ...copy[existingIndex],
              dataUrl,
              fileSize: file.size,
              updatedAt: Date.now()
            };
            matched++;
            return copy;
          } else {
            added++;
            return [
              ...prev,
              {
                filename: cleanName,
                fileType: isVid ? 'video' : 'image',
                associatedProjectTitle: `Imported (${cleanName})`,
                dataUrl,
                fileSize: file.size,
                updatedAt: Date.now()
              }
            ];
          }
        });

        // Auto-update any matching item
        setItems((prevItems) =>
          prevItems.map((it) => {
            if (it.mediaFilename && it.mediaFilename.toLowerCase() === cleanName.toLowerCase()) {
              return {
                ...it,
                imageUrl: isVid ? it.imageUrl : dataUrl,
                videoUrl: isVid ? dataUrl : it.videoUrl,
                updatedAt: Date.now()
              };
            }
            return it;
          })
        );
      } catch (err) {
        console.error('Error importing file', err);
      }
    }

    showToast(`Imported ${fileArray.length} media files into Primordial Asset Hub!`);
  };

  // Quick Direct Downloads
  const handleQuickDownload = async (type: ExportTargetType | 'zip' | 'json') => {
    if (exportDeck.itemIds.length === 0) {
      showToast('Add items to your deck first!');
      return;
    }

    if (type === 'portfolio' || type === 'primordial_html') {
      const html = generateInteractiveHtmlPortfolio(profile, exportDeck, items, categories);
      downloadFile(html, 'index.html', 'text/html');
      showToast('Downloaded index.html (Netlify ready)');
    } else if (type === 'resume') {
      const md = generateResumeMarkdown(profile, exportDeck, items, categories);
      downloadFile(md, `${profile.name.toLowerCase().replace(/\s+/g, '_')}_resume.md`, 'text/markdown');
      showToast('Resume Markdown downloaded');
    } else if (type === 'zip') {
      try {
        const blob = await generateZipArchive(profile, exportDeck, items, categories, managedAssets);
        downloadFile(blob, `primordialvideo_netlify_bundle.zip`, 'application/zip');
        showToast('Export bundle ZIP downloaded (Netlify ready)');
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Asset Management handlers
  const handleUpdateAsset = (updated: ManagedAsset) => {
    setManagedAssets((prev) =>
      prev.map((a) => (a.filename === updated.filename ? updated : a))
    );
    showToast(`Asset "${updated.filename}" updated`);
  };

  const handleAddAsset = (newAsset: ManagedAsset) => {
    setManagedAssets((prev) => [newAsset, ...prev]);
    showToast(`Asset "${newAsset.filename}" added`);
  };

  const handleRemoveAsset = (filename: string) => {
    setManagedAssets((prev) => prev.filter((a) => a.filename !== filename));
    showToast(`Asset "${filename}" removed`);
  };

  const handleUpdateAssetStrategy = (strategy: AssetPathStrategy) => {
    setExportDeck((prev) => ({ ...prev, assetPathStrategy: strategy }));
    showToast(`Asset strategy set to ${strategy}`);
  };

  const handleDownloadNetlifyZip = async () => {
    try {
      const blob = await generateZipArchive(profile, exportDeck, items, categories, managedAssets);
      downloadFile(blob, 'primordialvideo_netlify_bundle.zip', 'application/zip');
      showToast('Netlify Deploy Bundle ZIP downloaded!');
    } catch (err) {
      console.error(err);
    }
  };

  // Category Management
  const handleAddCategory = (newCat: Category) => {
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${newCat.name}" created`);
  };

  const handleUpdateCategory = (updatedCat: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCat.id ? updatedCat : c))
    );
    showToast('Category updated');
  };

  const handleDeleteCategory = (catIdToDelete: string) => {
    const remainingCats = categories.filter((c) => c.id !== catIdToDelete);
    const fallbackCatId = remainingCats[0]?.id || 'default';

    // Reassign items to the remaining category
    setItems((prev) =>
      prev.map((i) => (i.categoryId === catIdToDelete ? { ...i, categoryId: fallbackCatId } : i))
    );
    setCategories(remainingCats);
    if (selectedCategoryId === catIdToDelete) {
      setSelectedCategoryId(null);
    }
    showToast('Category deleted and items reassigned');
  };

  // Reset to default sample data
  const handleResetData = () => {
    if (
      confirm(
        "Reset portfolio & resume items to Brice Morneau's Master CV data? Any custom edits will be refreshed."
      )
    ) {
      setCategories(DEFAULT_CATEGORIES);
      setItems(DEFAULT_ITEMS);
      setExportDeck(DEFAULT_EXPORT_DECK);
      setProfile(DEFAULT_AUTHOR_PROFILE);
      setManagedAssets(DEFAULT_MANAGED_ASSETS);
      setWorkExperience(DEFAULT_WORK_EXPERIENCE);
      setSkillGroups(DEFAULT_SKILL_GROUPS);
      setSelectedCategoryId(null);
      setSelectedType('all');
      setSearchQuery('');
      showToast("Reset to Brice Morneau's Master CV & Primordial Video Data");
    }
  };

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategoryId);

  return (
    <DashboardLayout
      rightPanel={
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
      }
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
            jobs: jobs.length,
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

      {viewMode === 'jobs' && (
        <JobBoardView
          jobs={jobs}
          onAddJob={() => { setJobToEdit(null); setIsJobModalOpen(true); }}
          onEditJob={(job) => { setJobToEdit(job); setIsJobModalOpen(true); }}
          onDeleteJob={(id) => setJobs(prev => prev.filter(j => j.id !== id))}
          onGenerateApplication={(job) => {
            // Placeholder: would trigger AI pipeline
            showToast(`Generating tailored application for ${job.title}...`);
            setIsExportPreviewOpen(true);
          }}
        />
      )}

      {viewMode === 'projects' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-stone-100 tracking-tight">Projects & Jobs</h2>
              <p className="text-sm text-stone-400">Manage case studies and deliverables.</p>
            </div>
            <button
              onClick={() => { setItemToEdit(null); setIsItemModalOpen(true); }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-lg"
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

      

      {/* Modals */}
      {isJobModalOpen && (
        <JobEditModal
          isOpen={isJobModalOpen}
          job={jobToEdit}
          onClose={() => setIsJobModalOpen(false)}
          onSave={(job) => {
            setJobs(prev => {
              const exists = prev.find(j => j.id === job.id);
              if (exists) return prev.map(j => j.id === job.id ? job : j);
              return [job, ...prev];
            });
            setIsJobModalOpen(false);
            showToast('Job saved successfully');
          }}
        />
      )}
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
