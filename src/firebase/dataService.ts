import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './config';
import { 
  InEpMikaPriceRow, 
  DongKhungPriceRow, 
  Anh4KPriceRow, 
  FrameSpecItem, 
  B2BShopInfo,
  TabLabelsConfig,
  ColumnLabelsConfig,
  CustomMaterialTab,
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

export const defaultTabLabels: TabLabelsConfig = {
  mikaPhoThong: '1. Ảnh Mika',
  hdGuong: '2. Mika HD Gương 8K',
  anh4K: '3. Album – Photobook',
  inEpMika: '4. In Ép',
  goLua: '5. Gỗ Lụa Bo Viền',
};

export const defaultColumnLabels: ColumnLabelsConfig = {
  boVien: 'Bo Viền',
  kx: 'Khung KX',
  ht10: 'Khung HT10',
  k12: 'Khung K12',
  b10: 'Khung bản 10cm',
  titan1: 'Khung nhôm Titan M',
  titan2: 'Khung nhôm Titan C',
  inAnh: 'In Ảnh',
  inEpLua: 'In Ép Lụa',
  inEpMikaCol: 'In Ép Mika',
  inEpPlastic: 'In Ép Plastic',
  khungGiaCo: 'Giá Khung Gia Cố',
};

export const defaultFrameColumnKeys: string[] = [
  'boVien',
  'kx',
  'ht10',
  'k12',
  'b10',
  'titan1',
  'titan2',
];

export const defaultInEpColumnKeys: string[] = [
  'inAnh',
  'inEpLua',
  'inEpMikaCol',
  'inEpPlastic',
  'khungGiaCo',
];

export const defaultMaterialColumnKeys: Record<string, string[]> = {
  'mika-pho-thong': ['boVien', 'kx', 'ht10', 'k12', 'b10', 'titan1', 'titan2'],
  'hd-guong-sieu-bong': ['boVien', 'kx', 'ht10', 'k12', 'b10', 'titan1', 'titan2'],
  'anh-4k': ['donGia'],
  'in-ep-mika': ['inAnh', 'inEpLua', 'inEpMikaCol', 'inEpPlastic', 'khungGiaCo'],
  'go-lua': ['boVien'],
};
export const defaultMaterialColumnsMap = defaultMaterialColumnKeys;

export function getMaterialColumns(pricing: FullPricingState, tabId: string): string[] {
  if (tabId === 'anh-4k' || tabId === 'album' || tabId === 'album-photobook') {
    return ['donGia'];
  }
  const map = pricing.materialColumnsMap || pricing.materialColumnKeys;
  if (map && Array.isArray(map[tabId]) && map[tabId].length > 0) {
    return map[tabId];
  }
  if (defaultMaterialColumnKeys[tabId]) {
    return defaultMaterialColumnKeys[tabId];
  }
  if (tabId === 'in-ep-mika') {
    return pricing.inEpColumnKeys || defaultInEpColumnKeys;
  }
  if (pricing.customTabs) {
    const custom = pricing.customTabs.find(c => c.id === tabId);
    if (custom) {
      if (custom.type === 'inEpMika') {
        return pricing.inEpColumnKeys || defaultInEpColumnKeys;
      }
      if (custom.type === 'album') {
        return ['donGia'];
      }
      return pricing.frameColumnKeys || defaultFrameColumnKeys;
    }
  }
  return pricing.frameColumnKeys || defaultFrameColumnKeys;
}

export interface FullPricingState {
  inEpMika: InEpMikaPriceRow[];
  goLua: DongKhungPriceRow[];
  mikaPhoThong: DongKhungPriceRow[];
  hdGuong: DongKhungPriceRow[];
  anh4K: Anh4KPriceRow[];
  tabLabels?: TabLabelsConfig;
  columnLabels?: ColumnLabelsConfig;
  frameColumnKeys?: string[];
  inEpColumnKeys?: string[];
  materialColumnKeys?: { [materialTabId: string]: string[] };
  materialColumnsMap?: { [materialTabId: string]: string[] };
  customTabs?: CustomMaterialTab[];
  deletedTabIds?: string[];
  lastPriceAdjustmentDate?: string;
}

export interface ActiveMaterialTabItem {
  id: string;
  title: string;
  type: 'dongKhung' | 'inEpMika' | 'anh4K' | 'album' | 'goLuaBoVien';
  rows: any[];
  isCustom?: boolean;
}

export function getAllMaterialTabs(pricing: FullPricingState): ActiveMaterialTabItem[] {
  const deleted = pricing.deletedTabIds || [];
  const tabs = pricing.tabLabels || defaultTabLabels;
  const list: ActiveMaterialTabItem[] = [];

  // Tab 1: 1. Ảnh Mika (mika-pho-thong)
  if (!deleted.includes('mika-pho-thong')) {
    list.push({
      id: 'mika-pho-thong',
      title: tabs.mikaPhoThong || defaultTabLabels.mikaPhoThong,
      type: 'dongKhung',
      rows: pricing.mikaPhoThong || []
    });
  }

  // Tab 2: 2. Mika HD Gương 8K (hd-guong-sieu-bong)
  if (!deleted.includes('hd-guong-sieu-bong')) {
    list.push({
      id: 'hd-guong-sieu-bong',
      title: tabs.hdGuong || defaultTabLabels.hdGuong,
      type: 'dongKhung',
      rows: pricing.hdGuong || []
    });
  }

  // Tab 3: 3. Album – Photobook (anh-4k)
  if (!deleted.includes('anh-4k')) {
    list.push({
      id: 'anh-4k',
      title: tabs.anh4K || defaultTabLabels.anh4K,
      type: 'album',
      rows: pricing.anh4K || []
    });
  }

  // Tab 4: 4. In Ép (in-ep-mika)
  if (!deleted.includes('in-ep-mika')) {
    list.push({
      id: 'in-ep-mika',
      title: tabs.inEpMika || defaultTabLabels.inEpMika,
      type: 'inEpMika',
      rows: pricing.inEpMika || []
    });
  }

  // Tab 5: 5. Gỗ Lụa Bo Viền (go-lua)
  if (!deleted.includes('go-lua')) {
    list.push({
      id: 'go-lua',
      title: tabs.goLua || defaultTabLabels.goLua,
      type: 'goLuaBoVien',
      rows: pricing.goLua || []
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
export const GALLERY_REAL_PHOTOS_DOC = 'gallery_real_photos';
export const GALLERY_VERSION = '2026_REAL_PHOTOS_V1';

// Fetch Real Customer Photos from Firestore
export async function fetchRealPhotosFromFirestore(): Promise<{ realPhotos: RealGalleryPhoto[]; updatedAt?: string } | null> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, GALLERY_REAL_PHOTOS_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const d = snap.data();
      if (Array.isArray(d.photosList)) {
        return {
          realPhotos: d.photosList,
          updatedAt: d.updatedAt || undefined,
        };
      }
    }
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('hung_decor_real_photos');
      if (local !== null) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            return { realPhotos: parsed };
          }
        } catch (e) {
          console.warn('Could not parse local real photos');
        }
      }
    }
    return null;
  } catch (error) {
    console.warn('Could not fetch real photos from Firestore:', error);
    return null;
  }
}

// Save Real Customer Photos to Firestore
export async function saveRealPhotosToFirestore(photosList: RealGalleryPhoto[]): Promise<boolean> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, GALLERY_REAL_PHOTOS_DOC);
    await setDoc(docRef, cleanUndefined({
      photosList,
      version: GALLERY_VERSION,
      updatedAt: new Date().toISOString(),
    }), { merge: true });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hung_decor_real_photos', JSON.stringify(photosList));
      } catch (err) {
        console.warn('Could not cache real photos to localStorage:', err);
      }
    }
    return true;
  } catch (error) {
    console.error('Error saving real photos to Firestore:', error);
    throw error;
  }
}

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
    await setDoc(docRef, cleanUndefined({
      adminPassword: newPassword,
      updatedAt: new Date().toISOString()
    }), { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving new admin password to Firestore:', error);
    throw error;
  }
}

export function cleanUndefined<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanUndefined(item)) as unknown as T;
  }
  const cleaned: any = {};
  Object.keys(obj).forEach(key => {
    const val = (obj as any)[key];
    if (val !== undefined) {
      cleaned[key] = cleanUndefined(val);
    }
  });
  return cleaned;
}

export const PRICING_VERSION = '2026_HUNG_DECOR_GOLUA_V10_CLEAN';

export function sanitizePricingState(d: any): FullPricingState {
  const sanitizeDongKhungRow = (r: any): DongKhungPriceRow => {
    return {
      ...r,
      size: r.size,
      boVien: r.boVien ?? null,
      kx: r.kx ?? r.k0_k3 ?? null,
      ht10: r.ht10 ?? r.k4_k6 ?? null,
      k12: r.k12 ?? r.k10 ?? null,
      b10: r.b10 ?? r.k11 ?? null,
      titan1: r.titan1 ?? null,
      titan2: r.titan2 ?? null,
    };
  };

  const sanitizeAlbumRow = (r: any): Anh4KPriceRow => {
    return {
      size: r.size,
      donGia: r.donGia ?? r.price ?? r.k4_k6 ?? r.boVien ?? null,
      skus: r.skus || {}
    };
  };

  const sanitizeCols = (cols: string[]): string[] => {
    return (cols || [])
      .map(k => {
        if (k === 'k0_k3') return 'kx';
        if (k === 'k4_k6') return 'ht10';
        if (k === 'k10') return 'k12';
        if (k === 'k11') return 'b10';
        return k;
      })
      .filter((k, idx, arr) => arr.indexOf(k) === idx && !['k7_k9'].includes(k));
  };

  let rawMap = d.materialColumnsMap || d.materialColumnKeys;
  if (!rawMap && typeof window !== 'undefined') {
    const cachedCols = localStorage.getItem('hung_decor_material_cols');
    if (cachedCols) {
      try {
        rawMap = JSON.parse(cachedCols);
      } catch (e) {
        console.warn('Could not parse cached material cols', e);
      }
    }
  }
  if (!rawMap) {
    rawMap = defaultMaterialColumnKeys;
  }

  const cleanMap: Record<string, string[]> = {};
  Object.keys(rawMap).forEach(key => {
    cleanMap[key] = sanitizeCols(rawMap[key]);
  });

  if (cleanMap['go-lua'] === undefined) cleanMap['go-lua'] = ['boVien'];
  if (cleanMap['hd-guong-sieu-bong'] === undefined) cleanMap['hd-guong-sieu-bong'] = ['boVien', 'kx', 'ht10', 'k12', 'b10', 'titan1', 'titan2'];
  if (cleanMap['mika-pho-thong'] === undefined) cleanMap['mika-pho-thong'] = ['boVien', 'kx', 'ht10', 'k12', 'b10', 'titan1', 'titan2'];
  if (cleanMap['in-ep-mika'] === undefined) cleanMap['in-ep-mika'] = defaultInEpColumnKeys;
  cleanMap['anh-4k'] = ['donGia'];

  let loadedTabLabels = d.tabLabels;
  if (!loadedTabLabels && typeof window !== 'undefined') {
    const cachedTabs = localStorage.getItem('hung_decor_tab_labels');
    if (cachedTabs) {
      try {
        loadedTabLabels = JSON.parse(cachedTabs);
      } catch (e) {}
    }
  }

  const mergedTabLabels: TabLabelsConfig = {
    ...defaultTabLabels,
    ...(loadedTabLabels || {})
  };

  // Auto-correct outdated numbering in stored tab labels if found
  if (!mergedTabLabels.mikaPhoThong || mergedTabLabels.mikaPhoThong.startsWith('3.') || mergedTabLabels.mikaPhoThong.startsWith('Mika Phổ')) {
    mergedTabLabels.mikaPhoThong = '1. Ảnh Mika';
  }
  if (!mergedTabLabels.hdGuong) {
    mergedTabLabels.hdGuong = '2. Mika HD Gương 8K';
  }
  if (!mergedTabLabels.anh4K || mergedTabLabels.anh4K.startsWith('5.') || mergedTabLabels.anh4K.startsWith('4.')) {
    mergedTabLabels.anh4K = '3. Album – Photobook';
  }
  if (!mergedTabLabels.inEpMika || mergedTabLabels.inEpMika.includes('Giá Khung Xương') || mergedTabLabels.inEpMika.startsWith('3.')) {
    mergedTabLabels.inEpMika = '4. In Ép';
  }
  if (!mergedTabLabels.goLua || mergedTabLabels.goLua.startsWith('1.')) {
    mergedTabLabels.goLua = '5. Gỗ Lụa Bo Viền';
  }

  return {
    inEpMika: d.inEpMika || defaultInEpMika,
    goLua: (d.goLua || defaultGoLua).map(sanitizeDongKhungRow),
    mikaPhoThong: (d.mikaPhoThong || defaultMikaPhoThong).map(sanitizeDongKhungRow),
    hdGuong: (d.hdGuong || defaultHdGuong).map(sanitizeDongKhungRow),
    anh4K: (d.anh4K || defaultAnh4K).map(sanitizeAlbumRow),
    tabLabels: mergedTabLabels,
    columnLabels: {
      ...defaultColumnLabels,
      ...(d.columnLabels || {})
    },
    frameColumnKeys: sanitizeCols(d.frameColumnKeys || defaultFrameColumnKeys),
    inEpColumnKeys: d.inEpColumnKeys || defaultInEpColumnKeys,
    materialColumnKeys: cleanMap,
    materialColumnsMap: cleanMap,
    customTabs: (d.customTabs || []).map((ct: any) => ({
      ...ct,
      rows: (ct.rows || []).map((r: any) => ct.type === 'dongKhung' ? sanitizeDongKhungRow(r) : ct.type === 'album' ? sanitizeAlbumRow(r) : r)
    })),
    deletedTabIds: d.deletedTabIds || [],
    lastPriceAdjustmentDate: d.lastPriceAdjustmentDate || undefined,
  };
}

// 1. Fetch Pricing from Firestore
export async function fetchPricingFromFirestore(): Promise<{ data: FullPricingState; updatedAt?: string } | null> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, PRICING_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const d = snap.data();
      if (d.inEpMika && d.goLua && d.hdGuong) {
        return {
          data: sanitizePricingState(d),
          updatedAt: d.updatedAt || undefined,
        };
      }
    }
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('hung_decor_custom_pricing');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          return { data: sanitizePricingState(parsed) };
        } catch (e) {
          console.warn('Could not parse cached custom pricing');
        }
      }
    }
    return null;
  } catch (error) {
    console.warn('Could not fetch pricing from Firestore, falling back to local storage:', error);
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('hung_decor_custom_pricing');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          return { data: sanitizePricingState(parsed) };
        } catch (e) {
          console.warn('Could not parse cached custom pricing');
        }
      }
    }
    return null;
  }
}

// 2. Save Pricing to Firestore
export async function savePricingToFirestore(pricing: FullPricingState): Promise<boolean> {
  try {
    const matCols = pricing.materialColumnsMap || pricing.materialColumnKeys || defaultMaterialColumnKeys;
    const toSave: FullPricingState = {
      ...pricing,
      tabLabels: pricing.tabLabels || defaultTabLabels,
      columnLabels: pricing.columnLabels || defaultColumnLabels,
      frameColumnKeys: pricing.frameColumnKeys || defaultFrameColumnKeys,
      inEpColumnKeys: pricing.inEpColumnKeys || defaultInEpColumnKeys,
      materialColumnKeys: matCols,
      materialColumnsMap: matCols,
      customTabs: pricing.customTabs || [],
      deletedTabIds: pricing.deletedTabIds || [],
    };
    const docRef = doc(db, FIRESTORE_COLLECTION, PRICING_DOC);
    await setDoc(docRef, cleanUndefined({
      ...toSave,
      version: PRICING_VERSION,
      updatedAt: new Date().toISOString(),
    }), { merge: true });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hung_decor_custom_pricing', JSON.stringify(toSave));
        localStorage.setItem('hung_decor_material_cols', JSON.stringify(matCols));
        if (toSave.tabLabels) {
          localStorage.setItem('hung_decor_tab_labels', JSON.stringify(toSave.tabLabels));
        }
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

export function formatViDateTime(d: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const hours = pad(d.getHours());
  const mins = pad(d.getMinutes());
  return `${day}/${month}/${year} ${hours}:${mins}`;
}

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
    size: r.size,
    donGia: bumpValue(r.donGia ?? (r as any).k4_k6),
    skus: r.skus
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
    lastPriceAdjustmentDate: formatViDateTime(new Date()),
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

  const syncAnh4K = (sourceRows: Anh4KPriceRow[], targetRows: Anh4KPriceRow[]): Anh4KPriceRow[] => {
    const targetMap = new Map<string, Anh4KPriceRow>();
    (targetRows || []).forEach(r => r.size && targetMap.set(r.size, r));

    return (sourceRows || []).map(srcRow => {
      const existingTarget = targetMap.get(srcRow.size);
      if (!existingTarget) {
        return {
          size: srcRow.size,
          donGia: srcRow.donGia ? Math.round((srcRow.donGia * 1.1) / 1000) * 1000 : null,
          skus: srcRow.skus || {}
        };
      }
      return {
        size: srcRow.size,
        donGia: existingTarget.donGia ?? (existingTarget as any).k4_k6 ?? srcRow.donGia ?? null,
        skus: existingTarget.skus || srcRow.skus || {}
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
    frameColumnKeys: structureSource.frameColumnKeys || priceTarget.frameColumnKeys || defaultFrameColumnKeys,
    inEpColumnKeys: structureSource.inEpColumnKeys || priceTarget.inEpColumnKeys || defaultInEpColumnKeys,
    materialColumnKeys: structureSource.materialColumnsMap || structureSource.materialColumnKeys || priceTarget.materialColumnsMap || priceTarget.materialColumnKeys || undefined,
    materialColumnsMap: structureSource.materialColumnsMap || structureSource.materialColumnKeys || priceTarget.materialColumnsMap || priceTarget.materialColumnKeys || undefined,
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
      if (d.inEpMika && d.goLua && d.hdGuong) {
        return {
          data: sanitizePricingState(d),
          updatedAt: d.updatedAt || undefined,
        };
      }
    }

    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('hung_decor_freelance_pricing');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          return { data: sanitizePricingState(parsed) };
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
    const matCols = pricing.materialColumnsMap || pricing.materialColumnKeys || defaultMaterialColumnKeys;
    const toSave: FullPricingState = {
      ...pricing,
      tabLabels: pricing.tabLabels || defaultTabLabels,
      columnLabels: pricing.columnLabels || defaultColumnLabels,
      frameColumnKeys: pricing.frameColumnKeys || defaultFrameColumnKeys,
      inEpColumnKeys: pricing.inEpColumnKeys || defaultInEpColumnKeys,
      materialColumnKeys: matCols,
      materialColumnsMap: matCols,
      customTabs: pricing.customTabs || [],
      deletedTabIds: pricing.deletedTabIds || [],
    };
    const docRef = doc(db, FIRESTORE_COLLECTION, FREELANCE_PRICING_DOC);
    await setDoc(docRef, cleanUndefined({
      ...toSave,
      version: PRICING_VERSION,
      updatedAt: new Date().toISOString(),
    }), { merge: true });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hung_decor_freelance_pricing', JSON.stringify(toSave));
        localStorage.setItem('hung_decor_material_cols', JSON.stringify(matCols));
        if (toSave.tabLabels) {
          localStorage.setItem('hung_decor_tab_labels', JSON.stringify(toSave.tabLabels));
        }
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


export function isLegacy194Frame(frame: FrameSpecItem): boolean {
  if (!frame) return true;
  const idStr = String(frame.id || '').toLowerCase();
  const codeStr = String(frame.code || '').toLowerCase().trim();
  const nameStr = String(frame.name || '').toLowerCase();

  if (
    idStr.includes('194') || codeStr.includes('194') || nameStr.includes('194') ||
    idStr.includes('2mau_cu') || idStr.includes('hai_mau_cu') || nameStr.includes('2 màu cũ') ||
    nameStr.includes('mẫu cũ') || idStr.includes('_cu') || codeStr.includes('2 màu cũ')
  ) {
    return true;
  }

  const isIndividualKCode = /^k(0|1|2|3|4|5|6|7|8|9|10|11)$/i.test(codeStr);
  if (isIndividualKCode) {
    return true;
  }

  const isIndividualKId = /^frame_k(0|1|2|3|4|5|6|7|8|9|10|11)$/i.test(idStr);
  if (isIndividualKId) {
    return true;
  }

  return false;
}

export async function purgeLegacy194FramesFromFirestoreAndStorage(): Promise<void> {
  try {
    const colRef = collection(db, 'hung_decor_frame_items');
    const snap = await getDocs(colRef);
    const deletePromises: Promise<void>[] = [];

    snap.forEach(d => {
      const item = d.data() as FrameSpecItem;
      const fullItem = { ...item, id: d.id };
      if (isLegacy194Frame(fullItem)) {
        console.warn(`Purging legacy 194 frame doc from Firestore: ${d.id}`);
        deletePromises.push(deleteDoc(doc(db, 'hung_decor_frame_items', d.id)));
      }
    });

    if (deletePromises.length > 0) {
      await Promise.all(deletePromises);
    }

    if (typeof window !== 'undefined') {
      ['hung_decor_frames', 'hung_decor_custom_frames'].forEach(key => {
        const local = localStorage.getItem(key);
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed)) {
              const cleaned = parsed.filter((f: FrameSpecItem) => !isLegacy194Frame(f));
              localStorage.setItem(key, JSON.stringify(cleaned));
            }
          } catch (e) {}
        }
      });
    }
  } catch (err) {
    console.warn('Error purging legacy 194 frames:', err);
  }
}

// Delete single frame document from Firestore
export async function deleteFrameFromFirestore(frameId: string): Promise<boolean> {
  try {
    const docId = String(frameId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const itemRef = doc(db, 'hung_decor_frame_items', docId);
    await deleteDoc(itemRef);

    if (typeof window !== 'undefined') {
      ['hung_decor_frames', 'hung_decor_custom_frames'].forEach(key => {
        const local = localStorage.getItem(key);
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed)) {
              const filtered = parsed.filter((f: any) => f.id !== frameId && f.id !== docId && f.code !== frameId && !isLegacy194Frame(f));
              localStorage.setItem(key, JSON.stringify(filtered));
            }
          } catch (e) {}
        }
      });
    }
    return true;
  } catch (error) {
    console.warn('Could not delete frame document from Firestore:', error);
    return false;
  }
}

// 3. Fetch Frames from Firestore
export async function fetchFramesFromFirestore(): Promise<{ frames: FrameSpecItem[]; updatedAt?: string } | null> {
  try {
    // Proactively purge any leftover legacy 194 frames
    purgeLegacy194FramesFromFirestoreAndStorage().catch(console.warn);

    const colRef = collection(db, 'hung_decor_frame_items');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const frames: FrameSpecItem[] = [];
      const legacyDocIdsToDelete: string[] = [];

      snap.forEach(d => {
        const item = d.data() as FrameSpecItem;
        if (item) {
          const fullItem: FrameSpecItem = {
            ...item,
            id: item.id || d.id,
            displayOrder: typeof item.displayOrder === 'number' ? item.displayOrder : 999,
            images: (item.images || []).map((img, i) => ({
              ...img,
              id: img.id || `img_${i}_${Date.now()}`
            })),
            notes: (item.notes || []).map((n: any, i: number) => ({
              id: n?.id || `note_${i}_${Date.now()}`,
              text: typeof n === 'string' ? n : n?.text || ''
            }))
          };

          if (isLegacy194Frame(fullItem)) {
            legacyDocIdsToDelete.push(d.id);
          } else {
            frames.push(fullItem);
          }
        }
      });

      if (legacyDocIdsToDelete.length > 0) {
        Promise.all(legacyDocIdsToDelete.map(docId => deleteDoc(doc(db, 'hung_decor_frame_items', docId)))).catch(console.warn);
      }

      if (frames.length > 0) {
        frames.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
        return {
          frames,
          updatedAt: new Date().toISOString()
        };
      }
    }

    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('hung_decor_frames');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const cleaned = parsed.filter((f: FrameSpecItem) => !isLegacy194Frame(f));
            if (cleaned.length > 0) {
              cleaned.sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
              return { frames: cleaned };
            }
          }
        } catch (e) {}
      }
    }
    return null;
  } catch (error) {
    console.warn('Could not fetch frames from Firestore collection:', error);
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('hung_decor_frames');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const cleaned = parsed.filter((f: FrameSpecItem) => !isLegacy194Frame(f));
            if (cleaned.length > 0) {
              cleaned.sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
              return { frames: cleaned };
            }
          }
        } catch (e) {}
      }
    }
    return null;
  }
}

// 4. Save Frames to Firestore
export async function saveFramesToFirestore(framesList: FrameSpecItem[]): Promise<boolean> {
  try {
    const normalized = (framesList || []).map((f: FrameSpecItem, idx: number) => {
      const rawId = f.id || f.code || `frame_${idx}`;
      const frameId = String(rawId).replace(/[^a-zA-Z0-9_-]/g, '_');
      return {
        ...f,
        id: frameId,
        displayOrder: idx, // Explicit order index
        images: (f.images || []).slice(0, 3).map((img, i) => ({
          ...img,
          id: img.id || `img_${idx}_${i}_${Date.now()}`
        })),
        notes: (f.notes || []).map((n: any, i: number) => ({
          id: n?.id || `note_${idx}_${i}_${Date.now()}`,
          text: typeof n === 'string' ? n : n?.text || ''
        }))
      };
    });

    // Fetch existing document IDs in 'hung_decor_frame_items'
    const colRef = collection(db, 'hung_decor_frame_items');
    const existingSnap = await getDocs(colRef);
    const currentDocIds = new Set(normalized.map(f => f.id));

    // Permanently delete any Firestore document that is no longer in normalized
    const deletePromises: Promise<void>[] = [];
    existingSnap.forEach(d => {
      if (!currentDocIds.has(d.id)) {
        deletePromises.push(deleteDoc(doc(db, 'hung_decor_frame_items', d.id)));
      }
    });
    await Promise.all(deletePromises);

    // Save each current frame with its explicit displayOrder
    const savePromises = normalized.map(frame => {
      const docId = frame.id;
      const itemRef = doc(db, 'hung_decor_frame_items', docId);
      return setDoc(itemRef, cleanUndefined({
        ...frame,
        updatedAt: new Date().toISOString()
      }), { merge: true });
    });

    await Promise.all(savePromises);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hung_decor_frames', JSON.stringify(normalized));
      } catch (e) {
        console.warn('Could not cache frames to localStorage:', e);
      }
    }

    return true;
  } catch (error) {
    console.error('Error saving frames to Firestore collection:', error);
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
    await setDoc(docRef, cleanUndefined({
      ...shopInfo,
      updatedAt: new Date().toISOString(),
    }), { merge: true });
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
    saveRealPhotosToFirestore(defaultRealGalleryPhotos)
  ]);

  return true;
}

// Helper: Compress and resize image file to Base64 (No Firebase Storage needed)
export function compressImageFile(
  file: File,
  maxWidth: number = 700,
  maxHeight: number = 700,
  quality: number = 0.6
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };
      img.onerror = () => {
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// 8. Upload Frame Image (Compressed Base64 directly into document, bypass Storage)
export async function uploadFrameImageToStorage(
  file: File, 
  _frameCode?: string,
  _onProgress?: (progress: number) => void
): Promise<string> {
  return await compressImageFile(file, 1200, 1200, 0.75);
}

// SKU SYSTEM & HUNG DECOR CATALOG PERSISTENCE
// -------------------------------------------------------------

export function getDefaultSKU(
  materialTabId: string,
  mode: 'studio' | 'freelance',
  colKey: string,
  size: string
): string {
  const modeTag = mode === 'studio' ? 'st' : 'fl';
  const normSize = (size || '').toLowerCase();

  // Tab 5: Album - Photobook
  if (materialTabId === 'anh-4k' || materialTabId === 'album' || materialTabId === 'album-photobook') {
    if (normSize.includes('tờ') || normSize.includes('trang') || normSize.includes('to')) {
      return `ab${modeTag}_to`;
    }
    const cleanSize = (size || '')
      .replace(/cm/gi, '')
      .replace(/x/g, '*')
      .replace(/\s+/g, '')
      .trim();
    return `ab${modeTag}${cleanSize}`;
  }

  const cleanSize = (size || '').replace(/x/g, '*').replace(/\s+/g, '').trim();

  // Tab 4 (in-ep-mika) special rules
  if (materialTabId === 'in-ep-mika') {
    let prefix = 'in';
    if (colKey === 'inEpLua') prefix = 'inlua';
    else if (colKey === 'inEpMika' || colKey === 'inEpMikaCol') prefix = 'inep';
    else if (colKey === 'inEpPlastic') prefix = 'inplast';
    else if (colKey === 'khungGiaCo') prefix = 'nep';
    return `${prefix}${modeTag}${cleanSize}`;
  }

  // Material prefix for frame materials
  let matPrefix = 'gl';
  if (materialTabId === 'go-lua') matPrefix = 'gl';
  else if (materialTabId === 'hd-guong-sieu-bong') matPrefix = 'hd';
  else if (materialTabId === 'mika-pho-thong') matPrefix = 'mk';
  else if (materialTabId === 'anh-4k') matPrefix = 'ab';
  else {
    matPrefix = materialTabId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 4) || 'ct';
  }

  // Frame suffix
  let frameSuffix = '';
  if (colKey === 'boVien') frameSuffix = '';
  else if (colKey === 'kx' || colKey === 'k0_k3') frameSuffix = 'kx';
  else if (colKey === 'ht10' || colKey === 'k4_k6') frameSuffix = 'ht10';
  else if (colKey === 'k12' || colKey === 'k10') frameSuffix = 'k12';
  else if (colKey === 'b10' || colKey === 'k11') frameSuffix = 'b10';
  else if (colKey === 'titan1') frameSuffix = 'ttm';
  else if (colKey === 'titan2') frameSuffix = 'ttc';
  else if (colKey === 'donGia') frameSuffix = '';
  else {
    frameSuffix = colKey.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }

  return `${matPrefix}${modeTag}${cleanSize}${frameSuffix}`;
}

export function getCellSKU(
  row: any,
  colKey: string,
  materialTabId: string,
  mode: 'studio' | 'freelance'
): string {
  if (row && row.skus && typeof row.skus[colKey] === 'string' && row.skus[colKey].trim() !== '') {
    return row.skus[colKey].trim();
  }
  return getDefaultSKU(materialTabId, mode, colKey, row?.size || '');
}

export interface CatalogSKUItem {
  sku: string;
  materialTabId: string;
  materialTitle: string;
  mode: 'studio' | 'freelance';
  size: string;
  colKey: string;
  colTitle: string;
  price: number | null;
  updatedAt: string;
}

export const CATALOG_DOC = 'hung_decor_catalog';

export function generateCatalogFromPricing(
  studioPricing: FullPricingState,
  freelancePricing: FullPricingState
): { items: CatalogSKUItem[]; itemsBySku: { [sku: string]: CatalogSKUItem } } {
  const items: CatalogSKUItem[] = [];
  const itemsBySku: { [sku: string]: CatalogSKUItem } = {};
  const updatedAt = new Date().toISOString();

  const processPricing = (pricing: FullPricingState, mode: 'studio' | 'freelance') => {
    const tabs = getAllMaterialTabs(pricing);
    tabs.forEach(tab => {
      const isGoLua = tab.type === 'goLuaBoVien' || tab.id === 'go-lua';
      const isDongKhung = tab.type === 'dongKhung';
      const isAlbum = tab.type === 'album' || tab.id === 'anh-4k' || tab.id === 'album';
      const colKeys = isGoLua
        ? ['boVien']
        : isDongKhung
        ? (pricing.frameColumnKeys || defaultFrameColumnKeys)
        : isAlbum
        ? ['donGia']
        : (pricing.inEpColumnKeys || defaultInEpColumnKeys);

      (tab.rows || []).forEach(row => {
        if (!row.size) return;
        colKeys.forEach(colKey => {
          const sku = getCellSKU(row, colKey, tab.id, mode);
          const colTitle = isAlbum ? 'Đơn Giá' : (pricing.columnLabels?.[colKey] || (defaultColumnLabels as any)[colKey] || colKey);
          const rawPrice = (row as any)[colKey] ?? (row as any).donGia ?? (row as any).k4_k6 ?? (colKey === 'inEpMikaCol' ? row.inEpMika : null) ?? null;

          const catalogItem: CatalogSKUItem = {
            sku,
            materialTabId: tab.id,
            materialTitle: tab.title,
            mode,
            size: row.size,
            colKey,
            colTitle,
            price: typeof rawPrice === 'number' ? rawPrice : null,
            updatedAt
          };

          items.push(catalogItem);
          itemsBySku[sku] = catalogItem;
        });
      });
    });
  };

  processPricing(studioPricing, 'studio');
  processPricing(freelancePricing, 'freelance');

  return { items, itemsBySku };
}

export async function saveCatalogToFirestore(
  studioPricing: FullPricingState,
  freelancePricing: FullPricingState
): Promise<boolean> {
  try {
    const { items, itemsBySku } = generateCatalogFromPricing(studioPricing, freelancePricing);
    const docRef = doc(db, FIRESTORE_COLLECTION, CATALOG_DOC);
    await setDoc(docRef, cleanUndefined({
      version: '2026_HUNG_DECOR_CATALOG_V1',
      updatedAt: new Date().toISOString(),
      totalItems: items.length,
      items,
      itemsBySku
    }), { merge: true });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hung_decor_catalog', JSON.stringify({ items, itemsBySku }));
      } catch (err) {
        console.warn('Could not cache catalog to localStorage:', err);
      }
    }

    return true;
  } catch (error) {
    console.error('Error saving catalog to Firestore:', error);
    return false;
  }
}
