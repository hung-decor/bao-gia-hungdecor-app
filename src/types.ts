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
  type: 'dongKhung' | 'inEpMika' | 'anh4K';
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
}

export interface DongKhungPriceRow {
  size: string;
  boVien: number | null;
  k0_k3: number | null;
  k4_k6: number | null;
  k7_k9: number | null;
  k10: number | null;
  k11: number | null;
  titan1: number | null; // Titan 1 (đen, bạc)
  titan2: number | null; // Titan 2 (xanh, hồng)
}

export interface Anh4KPriceRow {
  size: string;
  k4_k6: number | null;
  titan2: number | null;
}

export interface FrameImageVariant {
  name: string;
  url: string;
  colorHex?: string;
  tag?: string;
}

export interface FrameSpecItem {
  code: string;
  name: string;
  dimensions: string;
  description: string;
  suitableFor: string;
  variants: string;
  hasRealPhotos?: boolean;
  images?: FrameImageVariant[];
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
  boVien: string;
  k0_k3: string;
  k4_k6: string;
  k10: string;
  k11: string;
  titan1: string;
  titan2: string;
  // Tab 4 (In ép & Giá khung gia cố)
  inAnh: string;
  inEpLua: string;
  inEpMikaCol: string;
  inEpPlastic: string;
  khungGiaCo: string;
}
