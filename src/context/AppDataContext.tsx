import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  InEpMikaPriceRow, 
  DongKhungPriceRow, 
  Anh4KPriceRow, 
  FrameSpecItem, 
  B2BShopInfo,
  RealGalleryPhoto 
} from '../types';
import {
  inEpMikaPricingData as defaultInEpMika,
  goLuaDongKhungData as defaultGoLua,
  mikaPhoThongData as defaultMikaPhoThong,
  hdGuongSieuBongKhungData as defaultHdGuong,
  anh4KPricingData as defaultAnh4K,
  frameReferenceGuide as defaultFrames,
  b2bShopInfo2026 as defaultShopInfo,
  defaultRealGalleryPhotos
} from '../data/tiemIn194Pricing2026';
import {
  FullPricingState,
  defaultTabLabels,
  defaultColumnLabels,
  defaultMaterialColumnKeys,
  getAllMaterialTabs,
  getMaterialColumns,
  fetchPricingFromFirestore,
  savePricingToFirestore,
  fetchFreelancePricingFromFirestore,
  saveFreelancePricingToFirestore,
  generateDefaultFreelancePricing,
  fetchFramesFromFirestore,
  saveFramesToFirestore,
  fetchRealPhotosFromFirestore,
  saveRealPhotosToFirestore,
  fetchShopInfoFromFirestore,
  saveShopInfoToFirestore,
  seedAllDataToFirestore,
  uploadFrameImageToStorage,
  fetchAdminPasswordFromFirestore,
  saveAdminPasswordToFirestore,
  saveCatalogToFirestore
} from '../firebase/dataService';
import { isFreelanceMode } from '../hooks/usePriceMultiplier';

export interface AppDataContextType {
  // Active pricing depending on client mode
  pricing: FullPricingState;
  
  // Explicit dual pricing states
  studioPricing: FullPricingState;
  freelancePricing: FullPricingState;
  
  setStudioPricing: React.Dispatch<React.SetStateAction<FullPricingState>>;
  setFreelancePricing: React.Dispatch<React.SetStateAction<FullPricingState>>;
  setPricing: React.Dispatch<React.SetStateAction<FullPricingState>>;
  
  saveStudioPricing: (newPricing?: FullPricingState) => Promise<boolean>;
  saveFreelancePricing: (newPricing?: FullPricingState) => Promise<boolean>;
  savePricing: (newPricing?: FullPricingState) => Promise<boolean>; // Compatibility alias for saveStudioPricing
  saveAllPricing: (newStudio?: FullPricingState, newFreelance?: FullPricingState) => Promise<boolean>;
  deleteMaterialColumn: (materialTabId: string, colKey: string) => void;
  addMaterialColumn: (materialTabId: string, colKey: string) => void;
  
  // Frames
  frames: FrameSpecItem[];
  setFrames: React.Dispatch<React.SetStateAction<FrameSpecItem[]>>;
  saveFrames: (newFrames?: FrameSpecItem[]) => Promise<boolean>;
  addFrame: (newFrame: FrameSpecItem) => Promise<boolean>;
  updateFrame: (index: number, updatedFrame: FrameSpecItem) => Promise<boolean>;
  deleteFrame: (idOrIndex: string | number) => void;
  deleteFrameNote: (frameIdOrIndex: string | number, noteIdx: number) => void;
  uploadFrameImage: (file: File, frameCode: string) => Promise<string>;

  // Shop Info
  shopInfo: B2BShopInfo;
  setShopInfo: React.Dispatch<React.SetStateAction<B2BShopInfo>>;
  saveShopInfo: (newShopInfo?: B2BShopInfo) => Promise<boolean>;

  // Security / Admin Password
  adminPassword: string;
  changeAdminPassword: (newPassword: string) => Promise<boolean>;

  // Real Photos
  realPhotos: RealGalleryPhoto[];
  setRealPhotos: React.Dispatch<React.SetStateAction<RealGalleryPhoto[]>>;
  saveRealPhotos: (newPhotos?: RealGalleryPhoto[]) => Promise<boolean>;

  // Meta status
  isLoading: boolean;
  isSaving: boolean;
  dataSource: 'firestore' | 'default';
  lastUpdated: string | null;
  seedInitialData: () => Promise<boolean>;
  reloadFromFirestore: () => Promise<void>;
}

const initialShopInfo: B2BShopInfo = {
  ...defaultShopInfo,
  name: 'Hùng Decor',
  subTitle: 'Xưởng In Lab & Gia Công Khung Ảnh B2B Cho Studio & Thợ Ảnh',
};

const initialPricing: FullPricingState = {
  inEpMika: defaultInEpMika,
  goLua: defaultGoLua,
  mikaPhoThong: defaultMikaPhoThong,
  hdGuong: defaultHdGuong,
  anh4K: defaultAnh4K,
  tabLabels: defaultTabLabels,
  columnLabels: defaultColumnLabels,
  materialColumnsMap: defaultMaterialColumnKeys,
  materialColumnKeys: defaultMaterialColumnKeys,
};

const normalizeFramesList = (list: FrameSpecItem[]): FrameSpecItem[] => {
  const isLegacy = (list || []).some(f => {
    const code = (f.code || '').toUpperCase();
    return code.includes('K0') || code.includes('K1') || code.includes('K2') || code.includes('K3') ||
           code.includes('K4') || code.includes('K5') || code.includes('K6') || code.includes('K7') ||
           code.includes('K8') || code.includes('K9') || code.includes('K10') || code.includes('K11');
  });
  const source = isLegacy ? defaultFrames : (list || defaultFrames);

  return source.map((f, idx) => ({
    ...f,
    id: f.id || `frame_${f.code ? f.code.replace(/\s+/g, '_').toLowerCase() : idx}`,
    images: (f.images || []).map((img, i) => ({
      ...img,
      id: img.id || `img_${idx}_${i}_${Date.now()}`
    })),
    notes: (f.notes || []).map((n: any, i: number) => ({
      id: n?.id || `note_${idx}_${i}_${Date.now()}`,
      text: typeof n === 'string' ? n : n?.text || ''
    }))
  }));
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const CACHE_VERSION = '2026_HUNG_DECOR_GOLUA_V10_CLEAN';

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [studioPricing, setStudioPricing] = useState<FullPricingState>(initialPricing);
  const [freelancePricing, setFreelancePricing] = useState<FullPricingState>(() => generateDefaultFreelancePricing(initialPricing));
  const [frames, setFrames] = useState<FrameSpecItem[]>(() => normalizeFramesList(defaultFrames));
  const [realPhotos, setRealPhotos] = useState<RealGalleryPhoto[]>(defaultRealGalleryPhotos);
  const [shopInfo, setShopInfo] = useState<B2BShopInfo>(initialShopInfo);
  const [adminPassword, setAdminPassword] = useState<string>('123456');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<'firestore' | 'default'>('default');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [isFreelanceClient, setIsFreelanceClient] = useState<boolean>(false);

  useEffect(() => {
    setIsFreelanceClient(isFreelanceMode());
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (typeof window !== 'undefined') {
        const localVersion = localStorage.getItem('HUNG_DECOR_CACHE_VERSION');
        if (localVersion !== CACHE_VERSION) {
          localStorage.setItem('HUNG_DECOR_CACHE_VERSION', CACHE_VERSION);
        }
      }

      const [pricingResult, freelanceResult, framesResult, shopResult, pwdResult, realPhotosResult] = await Promise.all([
        fetchPricingFromFirestore(),
        fetchFreelancePricingFromFirestore(),
        fetchFramesFromFirestore(),
        fetchShopInfoFromFirestore(),
        fetchAdminPasswordFromFirestore(),
        fetchRealPhotosFromFirestore()
      ]);

      if (pwdResult) {
        setAdminPassword(pwdResult);
      }

      let hasFirestoreData = false;

      let loadedStudio = initialPricing;
      if (pricingResult && pricingResult.data) {
        loadedStudio = pricingResult.data;
        // Merge cached material columns if available and custom
        if (typeof window !== 'undefined') {
          const cachedCols = localStorage.getItem('hung_decor_material_cols');
          if (cachedCols) {
            try {
              const parsed = JSON.parse(cachedCols);
              if (parsed && typeof parsed === 'object') {
                loadedStudio.materialColumnsMap = { ...(loadedStudio.materialColumnsMap || {}), ...parsed };
                loadedStudio.materialColumnKeys = loadedStudio.materialColumnsMap;
              }
            } catch (e) {}
          }
        }
        setStudioPricing(loadedStudio);
        hasFirestoreData = true;
        if (pricingResult.updatedAt) setLastUpdated(pricingResult.updatedAt);
      } else {
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem('hung_decor_custom_pricing');
          if (cached) {
            try {
              loadedStudio = JSON.parse(cached);
              setStudioPricing(loadedStudio);
              hasFirestoreData = true;
            } catch (e) {}
          }
        }
        if (!hasFirestoreData) {
          setStudioPricing(initialPricing);
          savePricingToFirestore(initialPricing).catch(console.warn);
          hasFirestoreData = true;
        }
      }

      if (freelanceResult && freelanceResult.data) {
        let loadedFreelance = freelanceResult.data;
        if (loadedStudio.materialColumnsMap) {
          loadedFreelance.materialColumnsMap = loadedStudio.materialColumnsMap;
          loadedFreelance.materialColumnKeys = loadedStudio.materialColumnsMap;
        }
        setFreelancePricing(loadedFreelance);
      } else {
        if (typeof window !== 'undefined') {
          const cachedFl = localStorage.getItem('hung_decor_freelance_pricing');
          if (cachedFl) {
            try {
              const parsedFl = JSON.parse(cachedFl);
              setFreelancePricing(parsedFl);
            } catch (e) {}
          } else {
            const generatedFreelance = generateDefaultFreelancePricing(loadedStudio);
            setFreelancePricing(generatedFreelance);
            saveFreelancePricingToFirestore(generatedFreelance).catch(console.warn);
          }
        } else {
          const generatedFreelance = generateDefaultFreelancePricing(loadedStudio);
          setFreelancePricing(generatedFreelance);
          saveFreelancePricingToFirestore(generatedFreelance).catch(console.warn);
        }
      }

      if (framesResult && framesResult.frames && framesResult.frames.length > 0) {
        setFrames(framesResult.frames);
        hasFirestoreData = true;
        if (framesResult.updatedAt && !lastUpdated) setLastUpdated(framesResult.updatedAt);
      } else {
        setFrames(defaultFrames);
        saveFramesToFirestore(defaultFrames).catch(console.warn);
        hasFirestoreData = true;
      }

      if (realPhotosResult && Array.isArray(realPhotosResult.realPhotos)) {
        setRealPhotos(realPhotosResult.realPhotos);
        hasFirestoreData = true;
      } else {
        setRealPhotos([]);
      }

      if (shopResult) {
        setShopInfo(shopResult);
      }

      setDataSource(hasFirestoreData ? 'firestore' : 'default');
    } catch (err) {
      console.warn('Failed to load Firestore data, using defaults', err);
      setDataSource('default');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveStudioPricing = async (newPricing?: FullPricingState): Promise<boolean> => {
    setIsSaving(true);
    const toSave = newPricing || studioPricing;
    try {
      await savePricingToFirestore(toSave);
      setStudioPricing(toSave);
      setDataSource('firestore');
      setLastUpdated(new Date().toISOString());
      saveCatalogToFirestore(toSave, freelancePricing).catch(console.warn);
      return true;
    } catch (e) {
      console.error('Save studio pricing failed', e);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFreelancePricing = async (newPricing?: FullPricingState): Promise<boolean> => {
    setIsSaving(true);
    const toSave = newPricing || freelancePricing;
    try {
      await saveFreelancePricingToFirestore(toSave);
      setFreelancePricing(toSave);
      setDataSource('firestore');
      setLastUpdated(new Date().toISOString());
      saveCatalogToFirestore(studioPricing, toSave).catch(console.warn);
      return true;
    } catch (e) {
      console.error('Save freelance pricing failed', e);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAllPricing = async (newStudio?: FullPricingState, newFreelance?: FullPricingState): Promise<boolean> => {
    setIsSaving(true);
    const studioSave = newStudio || studioPricing;
    const freelanceSave = newFreelance || freelancePricing;
    try {
      await Promise.all([
        savePricingToFirestore(studioSave),
        saveFreelancePricingToFirestore(freelanceSave),
        saveCatalogToFirestore(studioSave, freelanceSave)
      ]);
      setStudioPricing(studioSave);
      setFreelancePricing(freelanceSave);
      setDataSource('firestore');
      setLastUpdated(new Date().toISOString());
      return true;
    } catch (e) {
      console.error('Save all pricing failed', e);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFrames = async (newFrames?: FrameSpecItem[]): Promise<boolean> => {
    setIsSaving(true);
    const toSave = newFrames || frames;
    try {
      await saveFramesToFirestore(toSave);
      setFrames(toSave);
      setDataSource('firestore');
      setLastUpdated(new Date().toISOString());
      return true;
    } catch (e) {
      console.error('Save frames failed', e);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFrame = async (newFrame: FrameSpecItem): Promise<boolean> => {
    const updated = [newFrame, ...frames];
    return handleSaveFrames(updated);
  };

  const handleUpdateFrame = async (index: number, updatedFrame: FrameSpecItem): Promise<boolean> => {
    const updated = [...frames];
    updated[index] = updatedFrame;
    return handleSaveFrames(updated);
  };

  const deleteFrame = (idOrIndex: string | number) => {
    setFrames(prev => {
      const newFrames = prev.filter((item, idx) => {
        if (typeof idOrIndex === 'number') {
          return idx !== idOrIndex;
        }
        if (item.id === idOrIndex || item.code === idOrIndex) {
          return false;
        }
        if (String(idx) === String(idOrIndex)) {
          return false;
        }
        return true;
      });
      // Immediately persist frames to Firestore
      saveFramesToFirestore(newFrames).catch(err => {
        console.warn('Could not auto-save deleted frame to Firestore:', err);
      });
      return [...newFrames];
    });
  };

  const deleteFrameNote = (frameIdOrIndex: string | number, noteIdx: number) => {
    setFrames(prev => {
      let targetIdx = -1;
      if (typeof frameIdOrIndex === 'number') {
        targetIdx = frameIdOrIndex;
      } else {
        targetIdx = prev.findIndex((item, idx) =>
          item.id === frameIdOrIndex || item.code === frameIdOrIndex || String(idx) === String(frameIdOrIndex)
        );
      }

      if (targetIdx === -1 || !prev[targetIdx]) {
        return prev;
      }

      const newFrames = [...prev];
      const targetFrame = { ...newFrames[targetIdx] };
      const currentNotes = [...(targetFrame.notes || [])];
      currentNotes.splice(noteIdx, 1);
      targetFrame.notes = currentNotes;
      newFrames[targetIdx] = targetFrame;
      
      // Immediately persist updated notes to Firestore
      saveFramesToFirestore(newFrames).catch(err => {
        console.warn('Could not auto-save deleted note to Firestore:', err);
      });
      return [...newFrames];
    });
  };

  const deleteMaterialColumn = (materialTabId: string, colKey: string) => {
    const applyDelete = (prev: FullPricingState): FullPricingState => {
      const allTabs = getAllMaterialTabs(prev);
      const currentMatCols: Record<string, string[]> = {
        ...(prev.materialColumnsMap || prev.materialColumnKeys || {})
      };

      allTabs.forEach(t => {
        if (!currentMatCols[t.id]) {
          currentMatCols[t.id] = [...getMaterialColumns(prev, t.id)];
        } else {
          currentMatCols[t.id] = [...currentMatCols[t.id]];
        }
      });

      const currentList = currentMatCols[materialTabId] || getMaterialColumns(prev, materialTabId);
      currentMatCols[materialTabId] = currentList.filter(k => k !== colKey);

      return {
        ...prev,
        materialColumnKeys: currentMatCols,
        materialColumnsMap: currentMatCols,
      };
    };

    setStudioPricing(prevStudio => {
      const updatedStudio = applyDelete(prevStudio);
      
      setFreelancePricing(prevFreelance => {
        const updatedFreelance = applyDelete(prevFreelance);

        // 1. Instantly write to localStorage so F5 reload retains the deletion immediately
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('hung_decor_custom_pricing', JSON.stringify(updatedStudio));
            localStorage.setItem('hung_decor_freelance_pricing', JSON.stringify(updatedFreelance));
            localStorage.setItem('hung_decor_material_cols', JSON.stringify(updatedStudio.materialColumnsMap));
          } catch (e) {
            console.warn('Could not cache deleted column to localStorage:', e);
          }
        }

        // 2. Persist to Firestore database in background
        Promise.all([
          savePricingToFirestore(updatedStudio),
          saveFreelancePricingToFirestore(updatedFreelance),
          saveCatalogToFirestore(updatedStudio, updatedFreelance)
        ]).then(() => {
          setDataSource('firestore');
          setLastUpdated(new Date().toISOString());
        }).catch(err => {
          console.warn('Could not auto-save deleted column to Firestore:', err);
        });

        return updatedFreelance;
      });

      return updatedStudio;
    });
  };

  const addMaterialColumn = (materialTabId: string, colKey: string) => {
    const applyAdd = (prev: FullPricingState): FullPricingState => {
      const allTabs = getAllMaterialTabs(prev);
      const currentMatCols: Record<string, string[]> = {
        ...(prev.materialColumnsMap || prev.materialColumnKeys || {})
      };

      allTabs.forEach(t => {
        if (!currentMatCols[t.id]) {
          currentMatCols[t.id] = [...getMaterialColumns(prev, t.id)];
        } else {
          currentMatCols[t.id] = [...currentMatCols[t.id]];
        }
      });

      if (!currentMatCols[materialTabId]) {
        currentMatCols[materialTabId] = [...getMaterialColumns(prev, materialTabId)];
      } else {
        currentMatCols[materialTabId] = [...currentMatCols[materialTabId]];
      }
      if (!currentMatCols[materialTabId].includes(colKey)) {
        currentMatCols[materialTabId] = [...currentMatCols[materialTabId], colKey];
      }

      return {
        ...prev,
        materialColumnKeys: currentMatCols,
        materialColumnsMap: currentMatCols,
      };
    };

    setStudioPricing(prevStudio => {
      const updatedStudio = applyAdd(prevStudio);

      setFreelancePricing(prevFreelance => {
        const updatedFreelance = applyAdd(prevFreelance);

        // 1. Instantly write to localStorage so F5 reload retains the added column immediately
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('hung_decor_custom_pricing', JSON.stringify(updatedStudio));
            localStorage.setItem('hung_decor_freelance_pricing', JSON.stringify(updatedFreelance));
            localStorage.setItem('hung_decor_material_cols', JSON.stringify(updatedStudio.materialColumnsMap));
          } catch (e) {
            console.warn('Could not cache added column to localStorage:', e);
          }
        }

        // 2. Persist to Firestore database in background
        Promise.all([
          savePricingToFirestore(updatedStudio),
          saveFreelancePricingToFirestore(updatedFreelance),
          saveCatalogToFirestore(updatedStudio, updatedFreelance)
        ]).then(() => {
          setDataSource('firestore');
          setLastUpdated(new Date().toISOString());
        }).catch(err => {
          console.warn('Could not auto-save added column to Firestore:', err);
        });

        return updatedFreelance;
      });

      return updatedStudio;
    });
  };

  const handleSaveShopInfo = async (newShopInfo?: B2BShopInfo): Promise<boolean> => {
    setIsSaving(true);
    const toSave = newShopInfo || shopInfo;
    try {
      await saveShopInfoToFirestore(toSave);
      setShopInfo(toSave);
      return true;
    } catch (e) {
      console.error('Save shop info failed', e);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeedInitialData = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      await seedAllDataToFirestore();
      setDataSource('firestore');
      setLastUpdated(new Date().toISOString());
      await loadData();
      return true;
    } catch (e) {
      console.error('Seed initial data failed', e);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveRealPhotos = async (newPhotos?: RealGalleryPhoto[]): Promise<boolean> => {
    setIsSaving(true);
    const toSave = newPhotos || realPhotos;
    try {
      await saveRealPhotosToFirestore(toSave);
      setRealPhotos(toSave);
      return true;
    } catch (e) {
      console.error('Save real photos failed', e);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadImage = async (file: File, frameCode: string): Promise<string> => {
    return uploadFrameImageToStorage(file, frameCode);
  };

  const handleChangeAdminPassword = async (newPassword: string): Promise<boolean> => {
    setIsSaving(true);
    try {
      await saveAdminPasswordToFirestore(newPassword);
      setAdminPassword(newPassword);
      return true;
    } catch (e) {
      console.error('Failed to change admin password:', e);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  // Active pricing for public client pages
  const activeClientPricing = isFreelanceClient ? freelancePricing : studioPricing;

  return (
    <AppDataContext.Provider
      value={{
        pricing: activeClientPricing,
        studioPricing,
        freelancePricing,
        setStudioPricing,
        setFreelancePricing,
        setPricing: setStudioPricing,
        saveStudioPricing: handleSaveStudioPricing,
        saveFreelancePricing: handleSaveFreelancePricing,
        savePricing: handleSaveStudioPricing,
        saveAllPricing: handleSaveAllPricing,
        deleteMaterialColumn,
        addMaterialColumn,
        frames,
        setFrames,
        saveFrames: handleSaveFrames,
        addFrame: handleAddFrame,
        updateFrame: handleUpdateFrame,
        deleteFrame,
        deleteFrameNote,
        uploadFrameImage: handleUploadImage,
        realPhotos,
        setRealPhotos,
        saveRealPhotos: handleSaveRealPhotos,
        shopInfo,
        setShopInfo,
        saveShopInfo: handleSaveShopInfo,
        adminPassword,
        changeAdminPassword: handleChangeAdminPassword,
        isLoading,
        isSaving,
        dataSource,
        lastUpdated,
        seedInitialData: handleSeedInitialData,
        reloadFromFirestore: loadData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
