import { InEpMikaPriceRow, DongKhungPriceRow, Anh4KPriceRow, FrameSpecItem, RealGalleryPhoto } from '../types';

// 1. BẢNG GIÁ IN ÉP VÀ GIÁ KHUNG XƯƠNG GIA CỐ (TAB 4)
// Cấu trúc 6 cột: [Kích Thước] | [In Ảnh] | [In Ép Lụa] | [In Ép Mika] | [In Ép Plastic] | [Giá Khung Gia Cố]
export const inEpMikaPricingData: InEpMikaPriceRow[] = [
  { stt: 1, size: '10x15', inAnh: 2000, inEpLua: 2500, inEpMika: null, inEpPlastic: null, khungGiaCo: null },
  { stt: 2, size: '13x18', inAnh: 2500, inEpLua: 4000, inEpMika: 5000, inEpPlastic: 5000, khungGiaCo: null },
  { stt: 3, size: '15x21', inAnh: 4000, inEpLua: 6000, inEpMika: 7000, inEpPlastic: 7000, khungGiaCo: null },
  { stt: 4, size: '20x30', inAnh: 10000, inEpLua: 15000, inEpMika: 20000, inEpPlastic: 15000, khungGiaCo: null },
  { stt: 5, size: '25x38', inAnh: 17000, inEpLua: null, inEpMika: 25000, inEpPlastic: null, khungGiaCo: null },
  { stt: 6, size: '30x45', inAnh: 27000, inEpLua: 40000, inEpMika: 40000, inEpPlastic: 35000, khungGiaCo: null },
  { stt: 7, size: '35x50', inAnh: 35000, inEpLua: null, inEpMika: null, inEpPlastic: null, khungGiaCo: null },
  { stt: 8, size: '40x60', inAnh: 45000, inEpLua: 60000, inEpMika: 60000, inEpPlastic: null, khungGiaCo: null },
  { stt: 9, size: '50x75', inAnh: 55000, inEpLua: 75000, inEpMika: 75000, inEpPlastic: null, khungGiaCo: null },
  { stt: 10, size: '60x90', inAnh: 85000, inEpLua: 115000, inEpMika: 125000, inEpPlastic: null, khungGiaCo: null },
  { stt: 11, size: '60x120', inAnh: null, inEpLua: 145000, inEpMika: 145000, inEpPlastic: null, khungGiaCo: null },
  { stt: 12, size: '70x110', inAnh: null, inEpLua: null, inEpMika: null, inEpPlastic: null, khungGiaCo: null },
  { stt: 13, size: '80x120', inAnh: null, inEpLua: null, inEpMika: null, inEpPlastic: null, khungGiaCo: null },
  { stt: 14, size: '90x140', inAnh: null, inEpLua: null, inEpMika: null, inEpPlastic: null, khungGiaCo: null },
  { stt: 15, size: '100x150', inAnh: null, inEpLua: null, inEpMika: null, inEpPlastic: null, khungGiaCo: null },
  { stt: 16, size: '100x180', inAnh: null, inEpLua: null, inEpMika: null, inEpPlastic: null, khungGiaCo: null }
];
// Backwards compatibility alias
export const boVienPricingData = inEpMikaPricingData;

// 2. GỖ LỤA ĐÓNG KHUNG & IN ẢNH LAB (TAB 1)
// Cột Bo viền lụa của xưởng, các cột khung khác để trống '-'
export const goLuaDongKhungData: DongKhungPriceRow[] = [
  { size: '13x18', boVien: 18000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '15x21', boVien: 20000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '20x30', boVien: 30000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '25x38', boVien: null, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '30x45', boVien: 50000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '35x50', boVien: 70000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '40x60', boVien: 90000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '50x75', boVien: 120000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '60x90', boVien: 160000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '60x120', boVien: null, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '70x110', boVien: 270000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '80x120', boVien: 350000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '90x140', boVien: 500000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '100x150', boVien: null, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '100x180', boVien: null, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null }
];

// 3. MIKA PHỔ THÔNG ĐÓNG KHUNG (TAB 3)
// Đầy đủ Bo viền, Khung KX, HT10, K12, Bản 10cm, Titan M, Titan C theo chuẩn xưởng Hùng Decor
export const mikaPhoThongData: DongKhungPriceRow[] = [
  { size: '13x18', boVien: 20000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '15x21', boVien: 27000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: 35000, titan2: 45000 },
  { size: '20x30', boVien: 37000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: 80000, titan2: 70000 },
  { size: '25x38', boVien: 60000, k0_k3: null, k4_k6: 150000, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '30x45', boVien: 75000, k0_k3: null, k4_k6: null, k7_k9: null, k10: 150000, k11: null, titan1: 120000, titan2: 170000 },
  { size: '35x50', boVien: 85000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '40x60', boVien: 105000, k0_k3: 220000, k4_k6: 240000, k7_k9: null, k10: 170000, k11: null, titan1: 140000, titan2: 240000 },
  { size: '50x75', boVien: 130000, k0_k3: 300000, k4_k6: 320000, k7_k9: null, k10: 230000, k11: null, titan1: 190000, titan2: 270000 },
  { size: '60x90', boVien: 190000, k0_k3: 350000, k4_k6: 370000, k7_k9: null, k10: 300000, k11: null, titan1: 240000, titan2: 320000 },
  { size: '60x120', boVien: 320000, k0_k3: null, k4_k6: null, k7_k9: null, k10: 400000, k11: null, titan1: null, titan2: 450000 },
  { size: '70x110', boVien: 300000, k0_k3: 470000, k4_k6: 470000, k7_k9: null, k10: 360000, k11: 652000, titan1: 430000, titan2: 470000 },
  { size: '80x120', boVien: 460000, k0_k3: 660000, k4_k6: 660000, k7_k9: null, k10: 510000, k11: 844000, titan1: null, titan2: 660000 },
  { size: '90x140', boVien: 560000, k0_k3: 740000, k4_k6: 900000, k7_k9: null, k10: 700000, k11: 992000, titan1: null, titan2: null },
  { size: '100x150', boVien: null, k0_k3: 1014000, k4_k6: 1082000, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '100x180', boVien: null, k0_k3: null, k4_k6: 1780000, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null }
];
// Backwards compatibility alias
export const micaPhoThongData = mikaPhoThongData;

// 4. MIKA HD GƯƠNG 8K (TAB 2)
// Giữ nguyên Bo viền, Titan M, Titan C; Các cột khung gỗ để trống '-'
export const hdGuongSieuBongKhungData: DongKhungPriceRow[] = [
  { size: '13x18', boVien: 30000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: 45000, titan2: 55000 },
  { size: '15x21', boVien: 35000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: 53000, titan2: 73000 },
  { size: '20x30', boVien: 50000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: 68000, titan2: 88000 },
  { size: '25x38', boVien: 75000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: 105000, titan2: 130000 },
  { size: '30x45', boVien: 90000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: 140000, titan2: 170000 },
  { size: '35x50', boVien: 110000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: 155000, titan2: 190000 },
  { size: '40x60', boVien: 140000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: 185000, titan2: 225000 },
  { size: '50x75', boVien: 160000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: 245000, titan2: 295000 },
  { size: '60x90', boVien: 260000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: 290000, titan2: 340000 },
  { size: '60x120', boVien: 360000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: 505000, titan2: 545000 },
  { size: '70x110', boVien: 360000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: 505000, titan2: 545000 },
  { size: '80x120', boVien: 580000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: 640000, titan2: 720000 },
  { size: '90x140', boVien: 680000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: 780000, titan2: 890000 },
  { size: '100x150', boVien: 770000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: 970000, titan2: 1070000 },
  { size: '100x180', boVien: 950000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: 1210000, titan2: 1320000 }
];
// Backwards compatibility alias
export const micaGuongHDKhungData = hdGuongSieuBongKhungData;

export interface AlbumPriceRow {
  stt?: number;
  size: string;
  donGia: number | null;
  k4_k6?: number | null; // Compatibility alias
  titan2?: number | null; // Compatibility alias
  skus?: { [colKey: string]: string };
}

// 5. ALBUM - PHOTOBOOK (TAB 5)
export const albumPricingData: AlbumPriceRow[] = [
  { size: '15x21', donGia: 250000, k4_k6: 250000, titan2: 250000 },
  { size: '20x20', donGia: 350000, k4_k6: 350000, titan2: 350000 },
  { size: '25x25', donGia: 408000, k4_k6: 408000, titan2: 408000 },
  { size: '25x35', donGia: 590000, k4_k6: 590000, titan2: 590000 },
  { size: '30x30', donGia: 650000, k4_k6: 650000, titan2: 650000 },
  { size: 'Thêm trang/tờ', donGia: 37000, k4_k6: 37000, titan2: 37000 }
];

// Backwards compatibility alias
export const anh4KPricingData = albumPricingData as any;

// Chú thích quy cách khung (Trang 7 PDF)
export const frameReferenceGuide: FrameSpecItem[] = [
  {
    code: 'Khung KX - K0',
    name: 'Khung KX - Mẫu K0 (Cánh Gián Viền Vàng)',
    dimensions: 'Bản rộng 3.0 cm',
    description: 'Hệ Khung KX của Hùng Decor - Mẫu K0 truyền thống màu cánh gián vân gỗ chạy viền chỉ vàng. Bản rộng 3cm cứng cáp, phù hợp từ ảnh để bàn đến kích thước 40x60. Nếu làm ảnh lớn hơn, thợ nên cân nhắc chuyển sang Khung K12 hoặc Khung bản 10cm để đảm bảo độ chắc chắn và bề thế.',
    suitableFor: 'Chuyên dùng cho ảnh cụ ông cụ bà, ảnh phục chế truyền thống. Không phù hợp làm ảnh cưới hay ảnh sinh nhật.',
    variants: 'Nâu cánh gián viền chỉ vàng',
    hasRealPhotos: true,
    images: [
      { name: 'Khung KX - K0: Cánh gián viền vàng (3cm)', url: '/images/frames/khung-k0.jpg', colorHex: '#4A2A16', tag: 'KX - K0 Cánh gián' }
    ]
  },
  {
    code: 'Khung KX - K1',
    name: 'Khung KX - Mẫu K1 (Vân Gỗ Đậm)',
    dimensions: 'Bản rộng 2.0 cm (nhìn chính diện)',
    description: 'Hệ Khung KX của Hùng Decor - Mẫu K1 dạng khung úp mặt phẳng, nhìn từ chính diện bản rộng 2cm, màu vân gỗ đậm mộc mạc. Phù hợp cho ảnh để bàn đến kích thước vừa 40x60.',
    suitableFor: 'Ảnh ông bà, ảnh phục chế, ảnh sinh nhật hoặc ảnh kỷ niệm gia đình cỡ vừa và nhỏ.',
    variants: 'Màu vân gỗ đậm',
    hasRealPhotos: true,
    images: [
      { name: 'Khung KX - K1: Vân gỗ đậm (2cm)', url: '/images/frames/khung-k1.jpg', colorHex: '#5C381E', tag: 'KX - K1 Vân gỗ' }
    ]
  },
  {
    code: 'Khung KX - K2',
    name: 'Khung KX - Mẫu K2 (Đen Trơn)',
    dimensions: 'Bản rộng 2.0 cm (nhìn chính diện)',
    description: 'Hệ Khung KX của Hùng Decor - Mẫu K2 cùng kiểu dáng khung úp phẳng bản 2cm nhưng phủ tông màu đen trơn hiện đại. Thích hợp cho ảnh để bàn đến cỡ 40x60.',
    suitableFor: 'Ảnh chân dung, ảnh sinh nhật, ảnh kỷ niệm, ảnh gia đình hiện đại khổ vừa và nhỏ.',
    variants: 'Màu đen trơn',
    hasRealPhotos: true,
    images: [
      { name: 'Khung KX - K2: Đen trơn (2cm)', url: '/images/frames/khung-k2.jpg', colorHex: '#1F1D1B', tag: 'KX - K2 Đen trơn' }
    ]
  },
  {
    code: 'Khung KX - K3',
    name: 'Khung KX - Mẫu K3 (Trắng)',
    dimensions: 'Bản rộng 2.0 cm (nhìn chính diện)',
    description: 'Hệ Khung KX của Hùng Decor - Mẫu K3 kiểu dáng phẳng bản 2cm mang màu trắng sáng tinh tế, sạch sẽ. Phù hợp cho ảnh để bàn đến kích thước 40x60.',
    suitableFor: 'Ảnh em bé, tiệc thôi nôi, sinh nhật, ảnh gia đình trẻ trung từ cỡ để bàn đến 40x60.',
    variants: 'Màu trắng sáng',
    hasRealPhotos: true,
    images: [
      { name: 'Khung KX - K3: Trắng (2cm)', url: '/images/frames/khung-k3.jpg', colorHex: '#FFFFFF', tag: 'KX - K3 Trắng' }
    ]
  },
  {
    code: 'Khung HT10 - K4',
    name: 'Khung HT10 - Mẫu K4 (Trắng - Kiểu Hàn Quốc)',
    dimensions: 'Thành cao 3.5 cm • Bản mặt chính diện 1.0 cm',
    description: 'Hệ Khung HT10 cao cấp của Hùng Decor - Mẫu K4 màu trắng bóng nhẹ, thành cao 3.5cm tạo độ sâu nổi bật nhưng bản mặt nhìn chính diện chỉ 1cm thanh mảnh, hiện đại mà cực kỳ cứng cáp. Phù hợp từ ảnh để bàn đến 70x110.',
    suitableFor: 'Dành cho ảnh cưới hiện đại, ảnh thời trang, ảnh gia đình và ảnh bé. Là lựa chọn hoàn hảo nhất khi phối cùng dòng Ảnh 4K Cao Cấp.',
    variants: 'Trắng (độ bóng vừa phải)',
    hasRealPhotos: true,
    images: [
      { name: 'Khung HT10 - K4: Trắng (Thành 3.5cm, bản 1cm)', url: '/images/frames/khung-k4.JPG', colorHex: '#FFFFFF', tag: 'HT10 - K4 Trắng' }
    ]
  },
  {
    code: 'Khung HT10 - K5',
    name: 'Khung HT10 - Mẫu K5 (Đen - Kiểu Hàn Quốc)',
    dimensions: 'Thành cao 3.5 cm • Bản mặt chính diện 1.0 cm',
    description: 'Hệ Khung HT10 của Hùng Decor - Mẫu K5 mang tông màu đen sang trọng, độ bóng vừa phải. Thành khung cao 3.5cm tạo độ đầm chắc, mặt chính diện 1cm gọn gàng, sắc sảo. Ứng dụng tốt từ ảnh để bàn đến cỡ 70x110.',
    suitableFor: 'Rất hợp với ảnh cưới nghệ thuật, chân dung studio, ảnh thời trang tone cá tính và ảnh 4K cao cấp.',
    variants: 'Đen (độ bóng vừa phải)',
    hasRealPhotos: true,
    images: [
      { name: 'Khung HT10 - K5: Đen (Thành 3.5cm, bản 1cm)', url: '/images/frames/khung-k5.JPG', colorHex: '#1F1E1D', tag: 'HT10 - K5 Đen' }
    ]
  },
  {
    code: 'Khung HT10 - K6',
    name: 'Khung HT10 - Mẫu K6 (Caffe & Gỗ Nhạt)',
    dimensions: 'Thành cao 3.5 cm • Bản mặt chính diện 1.0 cm',
    description: 'Hệ Khung HT10 của Hùng Decor - Mẫu K6 cấu trúc khung nổi cao 3.5cm, bản mặt chính diện 1cm khoác lên 2 tông màu vân gỗ mộc mạc: Nâu Caffe trầm và Gỗ nhạt tự nhiên. Khung đáp ứng độ chắc khỏe từ ảnh để bàn đến khổ 70x110.',
    suitableFor: 'Rất chuộng làm ảnh cưới phong cách Hàn Quốc/ngoại cảnh, ảnh gia đình ấm cúng, ảnh em bé và dòng Ảnh 4K Fomex cao cấp.',
    variants: 'K6 Caffe (Nâu trầm), K6 Gỗ nhạt (Tự nhiên)',
    hasRealPhotos: true,
    images: [
      { name: 'Khung HT10 - K6: Caffe (Thành 3.5cm, bản 1cm)', url: '/images/frames/khung-k6-caffe.JPG', colorHex: '#3F281D', tag: 'HT10 - K6 Caffe' },
      { name: 'Khung HT10 - K6: Gỗ nhạt (Thành 3.5cm, bản 1cm)', url: '/images/frames/khung-k6-nhat1.jpg', colorHex: '#A8815F', tag: 'HT10 - K6 Gỗ nhạt' }
    ]
  },
  {
    code: 'Khung K12',
    name: 'Khung K12 (Bản 5.5cm - Cánh Gián Chỉ Đen)',
    dimensions: 'Bản rộng 5.5 cm • Tăng ~10cm phủ bì mỗi chiều',
    description: 'Khung K12 truyền thống xưởng Hùng Decor với tông màu vân gỗ cánh gián, điểm xuyết viền đen cùng các đường rãnh chìm tinh tế. Độ rộng bản khung 5.5cm tạo độ đầm và chắc khỏe vượt trội, giúp ảnh sau khi vào khung trông bề thế hơn hẳn.',
    suitableFor: 'Đặc biệt phù hợp cho ảnh đại gia đình nhiều thế hệ, ảnh chân dung truyền thống, tranh nghệ thuật hoặc ảnh kỷ niệm trang trọng.',
    variants: 'Màu cánh gián vân gỗ điểm viền đen (Bản rộng 5.5cm)',
    hasRealPhotos: true,
    images: [
      { name: 'Khung K12: Cánh gián chỉ đen (Bản 5.5cm)', url: '/images/frames/khung-k10.JPG', colorHex: '#4A2A1A', tag: 'Khung K12' }
    ]
  },
  {
    code: 'Bản 10cm',
    name: 'Khung Bản 10cm (Bản Đại - Cánh Gián Chỉ Đen)',
    dimensions: 'Bản rộng 10.0 cm • Tăng ~20cm phủ bì mỗi chiều',
    description: 'Khung Bản 10cm bề thế của xưởng Hùng Decor tông màu gỗ cánh gián cổ điển, chạy đường chỉ đen và rãnh khuyết chìm tinh tế. Rất trang nhã, ít bám bụi, dễ lau chùi, toát lên vẻ uy nghi trang trọng cho ảnh phóng đại hội trường, phòng khách.',
    suitableFor: 'Rất phù hợp cho ảnh đại gia đình nhiều thế hệ, khung tranh treo phòng khách, tranh phong cảnh lớn và ảnh truyền thống trang trọng.',
    variants: 'Màu gỗ cánh gián điểm chỉ đen & rãnh khuyết chìm (Bản đại 10cm)',
    hasRealPhotos: true,
    images: [
      { name: 'Khung Bản 10cm: Cánh gián chỉ đen', url: '/images/frames/khung-k11.jpg', colorHex: '#4E2712', tag: 'Khung Bản 10cm' }
    ]
  },
  {
    code: 'Titan M',
    name: 'Khung Nhôm Titan M (Siêu Mỏng - Đen & Bạc Mate)',
    dimensions: 'Viền nhôm siêu mỏng • Bản mặt thanh mảnh vuông vức',
    description: 'Khung Nhôm Titan M của Hùng Decor: Chất liệu hợp kim nhôm nguyên khối với viền cực mỏng, tạo cảm giác trẻ trung, vuông vức và thanh thoát. Rất cứng cáp, chắc khỏe. Hiện có 2 màu: Bạc Mate và Đen Mate.',
    suitableFor: 'Rất hợp cho ảnh thời trang, ảnh cưới, ảnh sinh nhật hay ảnh gia đình nhờ phong cách trẻ trung, hiện đại mà thanh lịch.',
    variants: 'Titan M Đen Mate, Titan M Bạc Mate',
    hasRealPhotos: true,
    images: [
      { name: 'Khung nhôm Titan M: Đen Mate', url: '/images/frames/khung-titan1-den.JPG', colorHex: '#181716', tag: 'Titan M Đen' },
      { name: 'Khung nhôm Titan M: Bạc Mate', url: '/images/frames/khung-titan1-bac.JPG', colorHex: '#DCDDE1', tag: 'Titan M Bạc' }
    ]
  },
  {
    code: 'Titan C',
    name: 'Khung Nhôm Titan C (Bản 2cm - Vàng Hồng & Xanh Rêu)',
    dimensions: 'Bản mặt chính diện 2.0 cm • Cấu trúc đầm chắc',
    description: 'Khung Nhôm Titan C của Hùng Decor: Dòng khung hợp kim kim loại cao cấp với 2 gam màu thời thượng phủ bóng: Vàng hồng bóng (Rose Gold) và Xanh rêu nhẹ bóng. Chi tiết tối giản, sang trọng cùng kết cấu dày dặn, cứng cáp. Độ rộng khung nhìn chính diện là 2.0cm tạo cảm giác đầm chắc, vững vàng.',
    suitableFor: 'Đặc biệt hoàn hảo cho ảnh cưới sang trọng, ảnh kỷ niệm gia đình và các bộ ảnh nghệ thuật cao cấp.',
    variants: 'Titan C Vàng hồng bóng, Titan C Xanh rêu bóng',
    hasRealPhotos: true,
    images: [
      { name: 'Khung nhôm Titan C: Vàng hồng bóng', url: '/images/frames/khung-titan2-hong.jpg', colorHex: '#B87D72', tag: 'Titan C Hồng' },
      { name: 'Khung nhôm Titan C: Xanh rêu bóng', url: '/images/frames/khung-titan2-xanh.JPG', colorHex: '#3B5245', tag: 'Titan C Xanh' }
    ]
  }
];

export const b2bShopInfo2026 = {
  name: 'Hùng Decor',
  subTitle: 'Xưởng In Lab & Gia Công Khung Ảnh B2B Cho Studio & Thợ Ảnh',
  hotlineTech: '0967827194',
  zaloTho: '0967827194',
  address: 'Ql1a, Quỳnh Lưu, Nghệ An',
  workingHours: '08:00 - 20:00 từ thứ 2 đến thứ 7 hàng tuần',
};

export const defaultRealGalleryPhotos: RealGalleryPhoto[] = [];
