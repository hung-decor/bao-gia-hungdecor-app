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
  
  // Frames
  frames: FrameSpecItem[];
  setFrames: React.Dispatch<React.SetStateAction<FrameSpecItem[]>>;
  saveFrames: (newFrames?: FrameSpecItem[]) => Promise<boolean>;
  addFrame: (newFrame: FrameSpecItem) => Promise<boolean>;
  updateFrame: (index: number, updatedFrame: FrameSpecItem) => Promise<boolean>;
  deleteFrame: (code: string) => Promise<boolean>;
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
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const CACHE_VERSION = '2026_HUNG_DECOR_GOLUA_V8';

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [studioPricing, setStudioPricing] = useState<FullPricingState>(initialPricing);
  const [freelancePricing, setFreelancePricing] = useState<FullPricingState>(() => generateDefaultFreelancePricing(initialPricing));
  const [frames, setFrames] = useState<FrameSpecItem[]>(defaultFrames);
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
          localStorage.clear();
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
        setStudioPricing(loadedStudio);
        hasFirestoreData = true;
        if (pricingResult.updatedAt) setLastUpdated(pricingResult.updatedAt);
      } else {
        setStudioPricing(initialPricing);
        savePricingToFirestore(initialPricing).catch(console.warn);
        hasFirestoreData = true;
      }

      if (freelanceResult && freelanceResult.data) {
        setFreelancePricing(freelanceResult.data);
      } else {
        const generatedFreelance = generateDefaultFreelancePricing(loadedStudio);
        setFreelancePricing(generatedFreelance);
        saveFreelancePricingToFirestore(generatedFreelance).catch(console.warn);
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

  const handleDeleteFrame = async (code: string): Promise<boolean> => {
    const updated = frames.filter(f => f.code !== code);
    return handleSaveFrames(updated);
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
        frames,
        setFrames,
        saveFrames: handleSaveFrames,
        addFrame: handleAddFrame,
        updateFrame: handleUpdateFrame,
        deleteFrame: handleDeleteFrame,
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
