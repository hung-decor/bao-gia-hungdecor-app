import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';
import { 
  InEpMikaPriceRow, 
  DongKhungPriceRow, 
  Anh4KPriceRow, 
  FrameSpecItem, 
  B2BShopInfo,
  TabLabelsConfig,
  ColumnLabelsConfig,
  CustomMaterialTab
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

export const defaultTabLabels: TabLabelsConfig = {
  goLua: '1. Gỗ Lụa Đóng Khung',
  hdGuong: '2. Mika HD Gương 8K',
  mikaPhoThong: '3. Mika Phổ Thông',
  inEpMika: '4. In Ép và Giá Khung Xương Gia Cố',
  anh4K: '5. Cao Cấp 4K',
};

export const defaultColumnLabels: ColumnLabelsConfig = {
  boVien: 'Bo Viền',
  k0_k3: 'Khung KX',
  k4_k6: 'Khung HT10',
  k10: 'Khung K12',
  k11: 'Khung bản 10cm',
  titan1: 'Khung nhôm Titan M',
  titan2: 'Khung nhôm Titan C',
  inAnh: 'In Ảnh',
  inEpLua: 'In Ép Lụa',
  inEpMikaCol: 'In Ép Mika',
  inEpPlastic: 'In Ép Plastic',
  khungGiaCo: 'Giá Khung Gia Cố',
};

export interface FullPricingState {
  inEpMika: InEpMikaPriceRow[];
  goLua: DongKhungPriceRow[];
  mikaPhoThong: DongKhungPriceRow[];
  hdGuong: DongKhungPriceRow[];
  anh4K: Anh4KPriceRow[];
  tabLabels?: TabLabelsConfig;
  columnLabels?: ColumnLabelsConfig;
  customTabs?: CustomMaterialTab[];
  deletedTabIds?: string[];
}

export interface ActiveMaterialTabItem {
  id: string;
  title: string;
  type: 'dongKhung' | 'inEpMika' | 'anh4K';
  rows: any[];
  isCustom?: boolean;
}

export function getAllMaterialTabs(pricing: FullPricingState): ActiveMaterialTabItem[] {
  const deleted = pricing.deletedTabIds || [];
  const tabs = pricing.tabLabels || defaultTabLabels;
  const list: ActiveMaterialTabItem[] = [];

  if (!deleted.includes('go-lua')) {
    list.push({
      id: 'go-lua',
      title: tabs.goLua || defaultTabLabels.goLua,
      type: 'dongKhung',
      rows: pricing.goLua || []
    });
  }
  if (!deleted.includes('hd-guong-sieu-bong')) {
    list.push({
      id: 'hd-guong-sieu-bong',
      title: tabs.hdGuong || defaultTabLabels.hdGuong,
      type: 'dongKhung',
      rows: pricing.hdGuong || []
    });
  }
  if (!deleted.includes('mika-pho-thong')) {
    list.push({
      id: 'mika-pho-thong',
      title: tabs.mikaPhoThong || defaultTabLabels.mikaPhoThong,
      type: 'dongKhung',
      rows: pricing.mikaPhoThong || []
    });
  }
  if (!deleted.includes('in-ep-mika')) {
    list.push({
      id: 'in-ep-mika',
      title: tabs.inEpMika || defaultTabLabels.inEpMika,
      type: 'inEpMika',
      rows: pricing.inEpMika || []
    });
  }
  if (!deleted.includes('anh-4k')) {
    list.push({
      id: 'anh-4k',
      title: tabs.anh4K || defaultTabLabels.anh4K,
      type: 'anh4K',
      rows: pricing.anh4K || []
    });
  }

  if (pricing.customTabs && pricing.customTabs.length > 0) {
    pricing.customTabs.forEach(ct => {
      if (!deleted.includes(ct.id)) {
        list.push({
          id: ct.id,
          title: ct.title,
          type: ct.type || 'dongKhung',
          rows: ct.rows || [],
          isCustom: true
        });
      }
    });
  }

  return list;
}

export const FIRESTORE_COLLECTION = 'hung_decor';
export const PRICING_DOC = 'pricing';
export const FRAMES_DOC = 'frames';
export const SHOP_INFO_DOC = 'shop_info';
export const SECURITY_DOC = 'security';

// 0. Fetch & Save Admin Password
export async function fetchAdminPasswordFromFirestore(): Promise<string> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, SECURITY_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.adminPassword) {
        return String(data.adminPassword);
      }
    }
    return '123456';
  } catch (error) {
    console.warn('Could not fetch security config from Firestore:', error);
    return '123456';
  }
}

export async function saveAdminPasswordToFirestore(newPassword: string): Promise<boolean> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, SECURITY_DOC);
    await setDoc(docRef, {
      adminPassword: newPassword,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving new admin password to Firestore:', error);
    throw error;
  }
}

export const PRICING_VERSION = '2026_HUNG_DECOR_FINAL_V6';

// 1. Fetch Pricing from Firestore
export async function fetchPricingFromFirestore(): Promise<{ data: FullPricingState; updatedAt?: string } | null> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, PRICING_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const d = snap.data();
      // Enforce the new Excel pricing version: disregard older cached versions
      if (d.version === PRICING_VERSION && d.inEpMika && d.goLua && d.hdGuong) {
        return {
          data: {
            inEpMika: d.inEpMika,
            goLua: d.goLua,
            mikaPhoThong: d.mikaPhoThong,
            hdGuong: d.hdGuong,
            anh4K: d.anh4K,
            tabLabels: d.tabLabels || defaultTabLabels,
            columnLabels: d.columnLabels || defaultColumnLabels,
            customTabs: d.customTabs || [],
            deletedTabIds: d.deletedTabIds || [],
          },
          updatedAt: d.updatedAt || undefined,
        };
      }
    }
    return null;
  } catch (error) {
    console.warn('Could not fetch pricing from Firestore, falling back to local defaults:', error);
    return null;
  }
}

// 2. Save Pricing to Firestore
export async function savePricingToFirestore(pricing: FullPricingState): Promise<boolean> {
  try {
    const toSave: FullPricingState = {
      ...pricing,
      tabLabels: pricing.tabLabels || defaultTabLabels,
      columnLabels: pricing.columnLabels || defaultColumnLabels,
      customTabs: pricing.customTabs || [],
      deletedTabIds: pricing.deletedTabIds || [],
    };
    const docRef = doc(db, FIRESTORE_COLLECTION, PRICING_DOC);
    await setDoc(docRef, {
      ...toSave,
      version: PRICING_VERSION,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hung_decor_custom_pricing', JSON.stringify(toSave));
      } catch (err) {
        console.warn('Could not cache custom pricing to localStorage:', err);
      }
    }

    return true;
  } catch (error) {
    console.error('Error saving pricing to Firestore:', error);
    throw error;
  }
}

export const FREELANCE_PRICING_DOC = 'freelance_pricing';

// Helper: Apply percentage increase to all numerical price values
export function applyPercentageIncrease(targetPricing: FullPricingState, percent: number): FullPricingState {
  const factor = 1 + percent / 100;

  const bumpValue = (val: number | null | undefined): number | null => {
    if (val === null || val === undefined || val === 0) return val ?? null;
    return Math.round((val * factor) / 1000) * 1000;
  };

  const bumpDongKhungRow = (r: DongKhungPriceRow): DongKhungPriceRow => ({
    ...r,
    boVien: bumpValue(r.boVien),
    k0_k3: bumpValue(r.k0_k3),
    k4_k6: bumpValue(r.k4_k6),
    k7_k9: bumpValue(r.k7_k9),
    k10: bumpValue(r.k10),
    k11: bumpValue(r.k11),
    titan1: bumpValue(r.titan1),
    titan2: bumpValue(r.titan2),
  });

  const bumpInEpRow = (r: InEpMikaPriceRow): InEpMikaPriceRow => ({
    ...r,
    inAnh: bumpValue(r.inAnh),
    inEpLua: bumpValue(r.inEpLua),
    inEpMika: bumpValue(r.inEpMika),
    inEpPlastic: bumpValue(r.inEpPlastic),
    khungGiaCo: bumpValue(r.khungGiaCo),
  });

  const bumpAnh4KRow = (r: Anh4KPriceRow): Anh4KPriceRow => ({
    ...r,
    k4_k6: bumpValue(r.k4_k6),
    titan2: bumpValue(r.titan2),
  });

  const bumpCustomRow = (r: any, type: string) => {
    if (type === 'dongKhung') {
      return bumpDongKhungRow(r);
    }
    if (type === 'inEpMika') {
      return bumpInEpRow(r);
    }
    if (type === 'anh4K') {
      return bumpAnh4KRow(r);
    }
    const updated = { ...r };
    Object.keys(updated).forEach(k => {
      if (typeof updated[k] === 'number' && k !== 'stt') {
        updated[k] = bumpValue(updated[k]);
      }
    });
    return updated;
  };

  return {
    ...targetPricing,
    goLua: (targetPricing.goLua || []).map(bumpDongKhungRow),
    hdGuong: (targetPricing.hdGuong || []).map(bumpDongKhungRow),
    mikaPhoThong: (targetPricing.mikaPhoThong || []).map(bumpDongKhungRow),
    inEpMika: (targetPricing.inEpMika || []).map(bumpInEpRow),
    anh4K: (targetPricing.anh4K || []).map(bumpAnh4KRow),
    customTabs: (targetPricing.customTabs || []).map(ct => ({
      ...ct,
      rows: (ct.rows || []).map(r => bumpCustomRow(r, ct.type))
    }))
  };
}

// Generate default freelance pricing (+10% boosted from base)
export function generateDefaultFreelancePricing(basePricing: FullPricingState): FullPricingState {
  return applyPercentageIncrease(basePricing, 10);
}

// Synchronize structure from structureSource to priceTarget
export function syncPricingStructure(structureSource: FullPricingState, priceTarget: FullPricingState): FullPricingState {
  // DongKhung row merger
  const syncDongKhung = (sourceRows: DongKhungPriceRow[], targetRows: DongKhungPriceRow[]): DongKhungPriceRow[] => {
    const targetMap = new Map<string, DongKhungPriceRow>();
    (targetRows || []).forEach(r => r.size && targetMap.set(r.size, r));

    return (sourceRows || []).map(srcRow => {
      const existingTarget = targetMap.get(srcRow.size);
      if (!existingTarget) {
        // If not in target yet, bump base price by +10%
        return {
          ...srcRow,
          boVien: srcRow.boVien ? Math.round((srcRow.boVien * 1.1) / 1000) * 1000 : null,
          k0_k3: srcRow.k0_k3 ? Math.round((srcRow.k0_k3 * 1.1) / 1000) * 1000 : null,
          k4_k6: srcRow.k4_k6 ? Math.round((srcRow.k4_k6 * 1.1) / 1000) * 1000 : null,
          k7_k9: srcRow.k7_k9 ? Math.round((srcRow.k7_k9 * 1.1) / 1000) * 1000 : null,
          k10: srcRow.k10 ? Math.round((srcRow.k10 * 1.1) / 1000) * 1000 : null,
          k11: srcRow.k11 ? Math.round((srcRow.k11 * 1.1) / 1000) * 1000 : null,
          titan1: srcRow.titan1 ? Math.round((srcRow.titan1 * 1.1) / 1000) * 1000 : null,
          titan2: srcRow.titan2 ? Math.round((srcRow.titan2 * 1.1) / 1000) * 1000 : null,
        };
      }
      return {
        ...existingTarget,
        size: srcRow.size
      };
    });
  };

  // InEp row merger
  const syncInEp = (sourceRows: InEpMikaPriceRow[], targetRows: InEpMikaPriceRow[]): InEpMikaPriceRow[] => {
    const targetMap = new Map<string, InEpMikaPriceRow>();
    (targetRows || []).forEach(r => r.size && targetMap.set(r.size, r));

    return (sourceRows || []).map(srcRow => {
      const existingTarget = targetMap.get(srcRow.size);
      if (!existingTarget) {
        return {
          ...srcRow,
          inAnh: srcRow.inAnh ? Math.round((srcRow.inAnh * 1.1) / 1000) * 1000 : null,
          inEpLua: srcRow.inEpLua ? Math.round((srcRow.inEpLua * 1.1) / 1000) * 1000 : null,
          inEpMika: srcRow.inEpMika ? Math.round((srcRow.inEpMika * 1.1) / 1000) * 1000 : null,
          inEpPlastic: srcRow.inEpPlastic ? Math.round((srcRow.inEpPlastic * 1.1) / 1000) * 1000 : null,
          khungGiaCo: srcRow.khungGiaCo ? Math.round((srcRow.khungGiaCo * 1.1) / 1000) * 1000 : null,
        };
      }
      return {
        ...existingTarget,
        stt: srcRow.stt,
        size: srcRow.size
      };
    });
  };

  // Anh4K row merger
  const syncAnh4K = (sourceRows: Anh4KPriceRow[], targetRows: Anh4KPriceRow[]): Anh4KPriceRow[] => {
    const targetMap = new Map<string, Anh4KPriceRow>();
    (targetRows || []).forEach(r => r.size && targetMap.set(r.size, r));

    return (sourceRows || []).map(srcRow => {
      const existingTarget = targetMap.get(srcRow.size);
      if (!existingTarget) {
        return {
          ...srcRow,
          k4_k6: srcRow.k4_k6 ? Math.round((srcRow.k4_k6 * 1.1) / 1000) * 1000 : null,
          titan2: srcRow.titan2 ? Math.round((srcRow.titan2 * 1.1) / 1000) * 1000 : null,
        };
      }
      return {
        ...existingTarget,
        size: srcRow.size
      };
    });
  };

  // CustomTabs merger
  const targetCustomTabsMap = new Map<string, CustomMaterialTab>();
  (priceTarget.customTabs || []).forEach(ct => targetCustomTabsMap.set(ct.id, ct));

  const syncedCustomTabs: CustomMaterialTab[] = (structureSource.customTabs || []).map(srcCt => {
    const existingTargetCt = targetCustomTabsMap.get(srcCt.id);
    if (!existingTargetCt) {
      const dummyTabPricing = applyPercentageIncrease({
        inEpMika: [], goLua: [], mikaPhoThong: [], hdGuong: [], anh4K: [],
        customTabs: [srcCt]
      }, 10);
      return dummyTabPricing.customTabs![0];
    }

    const targetRowsMap = new Map<string, any>();
    (existingTargetCt.rows || []).forEach((r: any) => r.size && targetRowsMap.set(r.size, r));

    const syncedRows = (srcCt.rows || []).map((srcRow: any) => {
      const existingTargetRow = targetRowsMap.get(srcRow.size);
      if (!existingTargetRow) {
        return srcRow;
      }
      return { ...existingTargetRow, size: srcRow.size };
    });

    return {
      ...srcCt,
      rows: syncedRows
    };
  });

  return {
    inEpMika: syncInEp(structureSource.inEpMika || [], priceTarget.inEpMika || []),
    goLua: syncDongKhung(structureSource.goLua || [], priceTarget.goLua || []),
    mikaPhoThong: syncDongKhung(structureSource.mikaPhoThong || [], priceTarget.mikaPhoThong || []),
    hdGuong: syncDongKhung(structureSource.hdGuong || [], priceTarget.hdGuong || []),
    anh4K: syncAnh4K(structureSource.anh4K || [], priceTarget.anh4K || []),
    tabLabels: structureSource.tabLabels || defaultTabLabels,
    columnLabels: structureSource.columnLabels || defaultColumnLabels,
    deletedTabIds: structureSource.deletedTabIds || [],
    customTabs: syncedCustomTabs
  };
}

// Fetch Freelance Pricing
export async function fetchFreelancePricingFromFirestore(): Promise<{ data: FullPricingState; updatedAt?: string } | null> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, FREELANCE_PRICING_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const d = snap.data();
      if (d.version === PRICING_VERSION && d.inEpMika && d.goLua && d.hdGuong) {
        return {
          data: {
            inEpMika: d.inEpMika,
            goLua: d.goLua,
            mikaPhoThong: d.mikaPhoThong,
            hdGuong: d.hdGuong,
            anh4K: d.anh4K,
            tabLabels: d.tabLabels || defaultTabLabels,
            columnLabels: d.columnLabels || defaultColumnLabels,
            customTabs: d.customTabs || [],
            deletedTabIds: d.deletedTabIds || [],
          },
          updatedAt: d.updatedAt || undefined,
        };
      }
    }

    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('hung_decor_freelance_pricing');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          return { data: parsed };
        } catch (e) {
          console.warn('Could not parse freelance pricing from LocalStorage');
        }
      }
    }

    return null;
  } catch (error) {
    console.warn('Could not fetch freelance pricing from Firestore:', error);
    return null;
  }
}

// Save Freelance Pricing
export async function saveFreelancePricingToFirestore(pricing: FullPricingState): Promise<boolean> {
  try {
    const toSave: FullPricingState = {
      ...pricing,
      tabLabels: pricing.tabLabels || defaultTabLabels,
      columnLabels: pricing.columnLabels || defaultColumnLabels,
      customTabs: pricing.customTabs || [],
      deletedTabIds: pricing.deletedTabIds || [],
    };
    const docRef = doc(db, FIRESTORE_COLLECTION, FREELANCE_PRICING_DOC);
    await setDoc(docRef, {
      ...toSave,
      version: PRICING_VERSION,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hung_decor_freelance_pricing', JSON.stringify(toSave));
      } catch (err) {
        console.warn('Could not cache freelance pricing to localStorage:', err);
      }
    }

    return true;
  } catch (error) {
    console.error('Error saving freelance pricing to Firestore:', error);
    throw error;
  }
}


export const FRAMES_VERSION = '2026_FRAMES_HUNG_DECOR_V3';

// 3. Fetch Frames from Firestore
export async function fetchFramesFromFirestore(): Promise<{ frames: FrameSpecItem[]; updatedAt?: string } | null> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, FRAMES_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const d = snap.data();
      if (d.version === FRAMES_VERSION && Array.isArray(d.framesList)) {
        return {
          frames: d.framesList,
          updatedAt: d.updatedAt || undefined,
        };
      }
    }
    return null;
  } catch (error) {
    console.warn('Could not fetch frames from Firestore, falling back to local defaults:', error);
    return null;
  }
}

// 4. Save Frames to Firestore
export async function saveFramesToFirestore(framesList: FrameSpecItem[]): Promise<boolean> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, FRAMES_DOC);
    await setDoc(docRef, {
      framesList,
      version: FRAMES_VERSION,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving frames to Firestore:', error);
    throw error;
  }
}

// 5. Fetch Shop Info from Firestore
export async function fetchShopInfoFromFirestore(): Promise<B2BShopInfo | null> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, SHOP_INFO_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as B2BShopInfo;
    }
    return null;
  } catch (error) {
    console.warn('Could not fetch shop info from Firestore, falling back to local defaults:', error);
    return null;
  }
}

// 6. Save Shop Info to Firestore
export async function saveShopInfoToFirestore(shopInfo: B2BShopInfo): Promise<boolean> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, SHOP_INFO_DOC);
    await setDoc(docRef, {
      ...shopInfo,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving shop info to Firestore:', error);
    throw error;
  }
}

// 7. Seed Initial Data to Firestore (Default -> Firestore)
export async function seedAllDataToFirestore(): Promise<boolean> {
  const defaultPricing: FullPricingState = {
    inEpMika: defaultInEpMika,
    goLua: defaultGoLua,
    mikaPhoThong: defaultMikaPhoThong,
    hdGuong: defaultHdGuong,
    anh4K: defaultAnh4K,
    tabLabels: defaultTabLabels,
    columnLabels: defaultColumnLabels,
  };

  const updatedDefaultShopInfo: B2BShopInfo = {
    ...defaultShopInfo,
    name: 'Hùng Decor',
    subTitle: 'Xưởng In Lab & Gia Công Khung Ảnh B2B Cho Studio & Thợ Ảnh',
  };

  await Promise.all([
    savePricingToFirestore(defaultPricing),
    saveFramesToFirestore(defaultFrames),
    saveShopInfoToFirestore(updatedDefaultShopInfo),
  ]);

  return true;
}

// 8. Upload Frame Image to Firebase Storage
export async function uploadFrameImageToStorage(
  file: File, 
  frameCode: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Sanitize filename
  const cleanCode = frameCode.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const timestamp = Date.now();
  const extension = file.name.split('.').pop() || 'jpg';
  const storagePath = `frames/${cleanCode}/${timestamp}_${cleanCode}.${extension}`;
  
  const storageRef = ref(storage, storagePath);
  
  // Upload file
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type || 'image/jpeg',
    customMetadata: {
      frameCode: frameCode,
      uploadedAt: new Date().toISOString(),
      shop: 'Hùng Decor'
    }
  });
  
  // Get public download URL
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}
