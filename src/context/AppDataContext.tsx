import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  InEpMikaPriceRow, 
  DongKhungPriceRow, 
  Anh4KPriceRow, 
  FrameSpecItem, 
  B2BShopInfo 
} from '../types';
import {
  inEpMikaPricingData as defaultInEpMika,
  goLuaDongKhungData as defaultGoLua,
  mikaPhoThongData as defaultMikaPhoThong,
  hdGuongSieuBongKhungData as defaultHdGuong,
  anh4KPricingData as defaultAnh4K,
  frameReferenceGuide as defaultFrames,
  b2bShopInfo2026 as defaultShopInfo
} from '../data/tiemIn194Pricing2026';
import {
  FullPricingState,
  fetchPricingFromFirestore,
  savePricingToFirestore,
  fetchFramesFromFirestore,
  saveFramesToFirestore,
  fetchShopInfoFromFirestore,
  saveShopInfoToFirestore,
  seedAllDataToFirestore,
  uploadFrameImageToStorage
} from '../firebase/dataService';

export interface AppDataContextType {
  // Pricing
  pricing: FullPricingState;
  setPricing: React.Dispatch<React.SetStateAction<FullPricingState>>;
  savePricing: (newPricing?: FullPricingState) => Promise<boolean>;
  
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
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pricing, setPricing] = useState<FullPricingState>(initialPricing);
  const [frames, setFrames] = useState<FrameSpecItem[]>(defaultFrames);
  const [shopInfo, setShopInfo] = useState<B2BShopInfo>(initialShopInfo);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<'firestore' | 'default'>('default');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pricingResult, framesResult, shopResult] = await Promise.all([
        fetchPricingFromFirestore(),
        fetchFramesFromFirestore(),
        fetchShopInfoFromFirestore()
      ]);

      let hasFirestoreData = false;

      if (pricingResult && pricingResult.data) {
        setPricing(pricingResult.data);
        hasFirestoreData = true;
        if (pricingResult.updatedAt) setLastUpdated(pricingResult.updatedAt);
      }

      if (framesResult && framesResult.frames && framesResult.frames.length > 0) {
        setFrames(framesResult.frames);
        hasFirestoreData = true;
        if (framesResult.updatedAt && !lastUpdated) setLastUpdated(framesResult.updatedAt);
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

  const handleSavePricing = async (newPricing?: FullPricingState): Promise<boolean> => {
    setIsSaving(true);
    const toSave = newPricing || pricing;
    try {
      await savePricingToFirestore(toSave);
      setPricing(toSave);
      setDataSource('firestore');
      setLastUpdated(new Date().toISOString());
      return true;
    } catch (e) {
      console.error('Save pricing failed', e);
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

  const handleUploadImage = async (file: File, frameCode: string): Promise<string> => {
    return uploadFrameImageToStorage(file, frameCode);
  };

  return (
    <AppDataContext.Provider
      value={{
        pricing,
        setPricing,
        savePricing: handleSavePricing,
        frames,
        setFrames,
        saveFrames: handleSaveFrames,
        addFrame: handleAddFrame,
        updateFrame: handleUpdateFrame,
        deleteFrame: handleDeleteFrame,
        uploadFrameImage: handleUploadImage,
        shopInfo,
        setShopInfo,
        saveShopInfo: handleSaveShopInfo,
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
