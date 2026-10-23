import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';
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

export interface FullPricingState {
  inEpMika: InEpMikaPriceRow[];
  goLua: DongKhungPriceRow[];
  mikaPhoThong: DongKhungPriceRow[];
  hdGuong: DongKhungPriceRow[];
  anh4K: Anh4KPriceRow[];
}

export const FIRESTORE_COLLECTION = 'hung_decor';
export const PRICING_DOC = 'pricing';
export const FRAMES_DOC = 'frames';
export const SHOP_INFO_DOC = 'shop_info';

// 1. Fetch Pricing from Firestore
export async function fetchPricingFromFirestore(): Promise<{ data: FullPricingState; updatedAt?: string } | null> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, PRICING_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const d = snap.data();
      if (d.inEpMika && d.goLua) {
        return {
          data: {
            inEpMika: d.inEpMika,
            goLua: d.goLua,
            mikaPhoThong: d.mikaPhoThong,
            hdGuong: d.hdGuong,
            anh4K: d.anh4K,
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
    const docRef = doc(db, FIRESTORE_COLLECTION, PRICING_DOC);
    await setDoc(docRef, {
      ...pricing,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving pricing to Firestore:', error);
    throw error;
  }
}

// 3. Fetch Frames from Firestore
export async function fetchFramesFromFirestore(): Promise<{ frames: FrameSpecItem[]; updatedAt?: string } | null> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, FRAMES_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const d = snap.data();
      if (Array.isArray(d.framesList)) {
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
