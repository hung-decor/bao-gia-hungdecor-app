export type MaterialTabId = 
  | 'go-lua'
  | 'hd-guong-sieu-bong'
  | 'mika-pho-thong'
  | 'in-ep-mika'
  | 'anh-4k'
  | string;

export interface CustomMaterialTab {
  id: string;
  title: string;
  type: 'dongKhung' | 'inEpMika' | 'anh4K' | 'album';
  rows: any[];
}

export interface InEpMikaPriceRow {
  stt: number;
  size: string;
  inAnh: number | null;
  inEpLua: number | null;
  inEpMika: number | null;
  inEpPlastic: number | null;
  khungGiaCo: number | null;
  khungXuongGiaCo?: number | null; // Compatibility alias
  skus?: { [colKey: string]: string };
}

export interface DongKhungPriceRow {
  size: string;
  boVien: number | null;
  kx: number | null;
  ht10: number | null;
  k12: number | null;
  b25?: number | null;
  b4?: number | null;
  b8?: number | null;
  b10: number | null;
  ttm: number | null; // Khung nhôm Titan M (đen, bạc)
  ttc: number | null; // Khung nhôm Titan C (xanh, hồng)
  // Optional backward compatibility
  k0_k3?: number | null;
  k4_k6?: number | null;
  k7_k9?: number | null;
  k10?: number | null;
  k11?: number | null;
  skus?: { [colKey: string]: string };
  [key: string]: any;
}

export interface Anh4KPriceRow {
  size: string;
  donGia: number | null;
  skus?: { [colKey: string]: string };
}

export interface FrameImageVariant {
  id?: string;
  name: string;
  url: string;
  colorHex?: string;
  tag?: string;
}

export interface FrameAnnotationItem {
  id: string;
  text: string;
}

export interface RealGalleryPhoto {
  id: string;
  url: string;
  title: string;
  caption?: string;
  category?: string;
  createdAt?: string;
}

export interface FrameSpecItem {
  id?: string;
  code: string;
  name: string;
  dimensions: string;
  description: string;
  suitableFor: string;
  variants: string;
  hasRealPhotos?: boolean;
  images?: FrameImageVariant[];
  notes?: FrameAnnotationItem[];
  displayOrder?: number;
}

export interface B2BShopInfo {
  name: string;
  subTitle: string;
  hotlineTech: string;
  zaloTho: string;
  address: string;
  workingHours: string;
}

export interface TabLabelsConfig {
  goLua: string;
  hdGuong: string;
  mikaPhoThong: string;
  inEpMika: string;
  anh4K: string;
}

export interface ColumnLabelsConfig {
  // DongKhung tables
  boVien?: string;
  kx?: string;
  ht10?: string;
  k12?: string;
  b25?: string;
  b4?: string;
  b8?: string;
  b10?: string;
  ttm?: string;
  ttc?: string;
  // Backward compatibility keys
  k0_k3?: string;
  k4_k6?: string;
  k10?: string;
  k11?: string;
  // Tab 4 (In ép & Giá khung gia cố)
  inAnh?: string;
  inEpLua?: string;
  inEpMikaCol?: string;
  inEpPlastic?: string;
  khungGiaCo?: string;
  // Dynamic custom columns
  [key: string]: string | undefined;
}

