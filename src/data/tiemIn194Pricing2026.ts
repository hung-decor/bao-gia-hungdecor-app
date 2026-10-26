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
  { size: '13x18', boVien: 18000, kx: null, ht10: null, k12: null, b10: null, titan1: null, titan2: null },
  { size: '15x21', boVien: 20000, kx: null, ht10: null, k12: null, b10: null, titan1: null, titan2: null },
  { size: '20x30', boVien: 30000, kx: null, ht10: null, k12: null, b10: null, titan1: null, titan2: null },
  { size: '25x38', boVien: null, kx: null, ht10: null, k12: null, b10: null, titan1: null, titan2: null },
  { size: '30x45', boVien: 50000, kx: null, ht10: null, k12: null, b10: null, titan1: null, titan2: null },
  { size: '35x50', boVien: 70000, kx: null, ht10: null, k12: null, b10: null, titan1: null, titan2: null },
  { size: '40x60', boVien: 90000, kx: null, ht10: null, k12: null, b10: null, titan1: null, titan2: null },
  { size: '50x75', boVien: 120000, kx: null, ht10: null, k12: null, b10: null, titan1: null, titan2: null },
  { size: '60x90', boVien: 160000, kx: null, ht10: null, k12: null, b10: null, titan1: null, titan2: null },
  { size: '60x120', boVien: null, kx: null, ht10: null, k12: null, b10: null, titan1: null, titan2: null },
  { size: '70x110', boVien: 270000, kx: null, ht10: null, k12: null, b10: null, titan1: null, titan2: null },
  { size: '80x120', boVien: 350000, kx: null, ht10: null, k12: null, b10: null, titan1: null, titan2: null },
  { size: '90x140', boVien: 500000, kx: null, ht10: null, k12: null, b10: null, titan1: null, titan2: null },
  { size: '100x150', boVien: null, kx: null, ht10: null, k12: null, b10: null, titan1: null, titan2: null },
  { size: '100x180', boVien: null, kx: null, ht10: null, k12: null, b10: null, titan1: null, titan2: null }
];

// 3. MIKA PHỔ THÔNG ĐÓNG KHUNG (TAB 3)
// Đầy đủ Bo viền, Khung KX, HT10, K12, Bản 10cm, Titan M, Titan C theo chuẩn xưởng Hùng Decor
export const mikaPhoThongData: DongKhungPriceRow[] = [
  { size: '13x18', boVien: 20000, kx: null, ht10: null, k12: null, b10: null, titan1: null, titan2: null },
  { size: '15x21', boVien: 27000, kx: null, ht10: null, k12: null, b10: null, titan1: 35000, titan2: 45000 },
  { size: '20x30', boVien: 37000, kx: null, ht10: null, k12: null, b10: null, titan1: 80000, titan2: 70000 },
  { size: '25x38', boVien: 60000, kx: null, ht10: 150000, k12: null, b10: null, titan1: null, titan2: null },
  { size: '30x45', boVien: 75000, kx: null, ht10: null, k12: 150000, b10: null, titan1: 120000, titan2: 170000 },
  { size: '35x50', boVien: 85000, kx: null, ht10: null, k12: null, b10: null, titan1: null, titan2: null },
  { size: '40x60', boVien: 105000, kx: 220000, ht10: 240000, k12: 170000, b10: null, titan1: 140000, titan2: 240000 },
  { size: '50x75', boVien: 130000, kx: 300000, ht10: 320000, k12: 230000, b10: null, titan1: 190000, titan2: 270000 },
  { size: '60x90', boVien: 190000, kx: 350000, ht10: 370000, k12: 300000, b10: null, titan1: 240000, titan2: 320000 },
  { size: '60x120', boVien: 320000, kx: null, ht10: null, k12: 400000, b10: null, titan1: null, titan2: 450000 },
  { size: '70x110', boVien: 300000, kx: 470000, ht10: 470000, k12: 360000, b10: 652000, titan1: 430000, titan2: 470000 },
  { size: '80x120', boVien: 460000, kx: 660000, ht10: 660000, k12: 510000, b10: 844000, titan1: null, titan2: 660000 },
  { size: '90x140', boVien: 560000, kx: 740000, ht10: 900000, k12: 700000, b10: 992000, titan1: null, titan2: null },
  { size: '100x150', boVien: null, kx: 1014000, ht10: 1082000, k12: null, b10: null, titan1: null, titan2: null },
  { size: '100x180', boVien: null, kx: null, ht10: 1780000, k12: null, b10: null, titan1: null, titan2: null }
];
// Backwards compatibility alias
export const micaPhoThongData = mikaPhoThongData;

// 4. MIKA HD GƯƠNG 8K (TAB 2)
// Giữ nguyên Bo viền, Titan M, Titan C; Các cột khung gỗ để trống '-'
export const hdGuongSieuBongKhungData: DongKhungPriceRow[] = [
  { size: '13x18', boVien: 30000, kx: null, ht10: null, k12: null, b10: null, titan1: 45000, titan2: 55000 },
  { size: '15x21', boVien: 35000, kx: null, ht10: null, k12: null, b10: null, titan1: 53000, titan2: 73000 },
  { size: '20x30', boVien: 50000, kx: null, ht10: null, k12: null, b10: null, titan1: 68000, titan2: 88000 },
  { size: '25x38', boVien: 75000, kx: null, ht10: null, k12: null, b10: null, titan1: 105000, titan2: 130000 },
  { size: '30x45', boVien: 90000, kx: null, ht10: null, k12: null, b10: null, titan1: 140000, titan2: 170000 },
  { size: '35x50', boVien: 110000, kx: null, ht10: null, k12: null, b10: null, titan1: 155000, titan2: 190000 },
  { size: '40x60', boVien: 140000, kx: null, ht10: null, k12: null, b10: null, titan1: 185000, titan2: 225000 },
  { size: '50x75', boVien: 160000, kx: null, ht10: null, k12: null, b10: null, titan1: 245000, titan2: 295000 },
  { size: '60x90', boVien: 260000, kx: null, ht10: null, k12: null, b10: null, titan1: 290000, titan2: 340000 },
  { size: '60x120', boVien: 360000, kx: null, ht10: null, k12: null, b10: null, titan1: 505000, titan2: 545000 },
  { size: '70x110', boVien: 360000, kx: null, ht10: null, k12: null, b10: null, titan1: 505000, titan2: 545000 },
  { size: '80x120', boVien: 580000, kx: null, ht10: null, k12: null, b10: null, titan1: 640000, titan2: 720000 },
  { size: '90x140', boVien: 680000, kx: null, ht10: null, k12: null, b10: null, titan1: 780000, titan2: 890000 },
  { size: '100x150', boVien: 770000, kx: null, ht10: null, k12: null, b10: null, titan1: 970000, titan2: 1070000 },
  { size: '100x180', boVien: 950000, kx: null, ht10: null, k12: null, b10: null, titan1: 1210000, titan2: 1320000 }
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

// Chú thích quy cách khung xưởng Hùng Decor 2026
export const frameReferenceGuide: FrameSpecItem[] = [
  {
    id: 'frame_album',
    code: 'Album - Photobook',
    name: 'Album - Photobook (Mặt Mika 8K & Bìa Da/Mika Cao Cấp)',
    dimensions: 'Kích thước đa dạng • Mở phẳng 180 độ',
    description: 'Dòng Album - Photobook cao cấp xưởng Hùng Decor: Công nghệ in Lab Mới sắc nét, mở phẳng 180 độ không cong vênh, chống ẩm mốc. Đa dạng kích thước 15x21, 20x20, 25x25, 25x35, 30x30.',
    suitableFor: 'Album cưới cao cấp, Album phóng sự cưới, Album em bé, Photobook gia đình và du lịch.',
    variants: 'Bìa Mika 8K, Bìa Da cao cấp, Bìa Gỗ lụa',
    hasRealPhotos: true,
    images: [],
    notes: [
      { id: 'note_album_1', text: 'Trang in mở phẳng 180 độ sắc nét công nghệ in Lab' },
      { id: 'note_album_2', text: 'Gia công đóng cuốn chắc chắn chống ẩm bền bỉ' }
    ],
    displayOrder: 0
  },
  {
    id: 'frame_boVien',
    code: 'Bo Viền',
    name: 'Bo Viền (Gia Công Viền Trực Tiếp Mép Ảnh)',
    dimensions: 'Viền bọc tinh tế ôm khít mép ảnh',
    description: 'Quy cách Bo viền chuyên dụng của xưởng Hùng Decor: Viền bọc ôm sát viền mép ảnh Gỗ Lụa hoặc Mika, giúp bảo vệ chống sứt mẻ va đập, tạo viền hoàn thiện gọn gàng, thanh thoát mà không cần lắp khung ngoài.',
    suitableFor: 'Ảnh Gỗ Lụa để bàn, ảnh treo tường tối giản không dùng khung ngoài.',
    variants: 'Viền trắng, viền đen, viền vân gỗ',
    hasRealPhotos: true,
    images: [],
    notes: [
      { id: 'note_boVien_1', text: 'Bảo vệ cạnh ảnh chống sứt mép, độ bền cao' }
    ],
    displayOrder: 1
  },
  {
    id: 'frame_kx',
    code: 'Khung KX',
    name: 'Khung KX (Bản 2cm - 3cm Chống Cong Vênh)',
    dimensions: 'Bản rộng 2.0 cm - 3.0 cm',
    description: 'Hệ Khung KX của xưởng Hùng Decor: Cấu trúc khung úp mặt phẳng và chỉ nổi truyền thống, gồm các mẫu màu Cánh gián viền vàng (bản 3cm cứng cáp), Vân gỗ đậm mộc mạc, Đen trơn hiện đại và Trắng sáng tinh tế (bản 2cm). Phù hợp tối ưu từ ảnh để bàn đến kích thước 40x60.',
    suitableFor: 'Ảnh cụ ông cụ bà, ảnh phục chế truyền thống, ảnh gia đình, chân dung studio cỡ vừa và nhỏ.',
    variants: 'Cánh gián viền vàng, Vân gỗ đậm, Đen trơn, Trắng sáng',
    hasRealPhotos: true,
    images: [],
    notes: [
      { id: 'note_kx_1', text: 'Bản rộng 2.0cm - 3.0cm gia công chắc chắn chống cong vênh' },
      { id: 'note_kx_2', text: 'Tối ưu cho ảnh để bàn và ảnh treo tường đến cỡ 40x60' }
    ],
    displayOrder: 2
  },
  {
    id: 'frame_ht10',
    code: 'Khung HT10',
    name: 'Khung HT10 (Khung Hộp Kiểu Hàn Quốc Cao Cấp)',
    dimensions: 'Thành cao 3.5 cm • Bản mặt chính diện 1.0 cm',
    description: 'Hệ Khung HT10 cao cấp xưởng Hùng Decor: Dạng khung hộp phong cách Hàn Quốc với thành khung cao 3.5cm tạo chiều sâu 3D sang trọng, bản mặt nhìn chính diện chỉ 1.0cm thanh mảnh, hiện đại mà cực kỳ đầm chắc. Gồm 4 tông màu: Trắng bóng nhẹ, Đen sang trọng, Vân gỗ Caffe trầm và Gỗ nhạt tự nhiên.',
    suitableFor: 'Ảnh cưới phong cách Hàn Quốc, ảnh thời trang, ảnh gia đình ấm cúng và phối cùng dòng ảnh 4K cao cấp.',
    variants: 'Trắng tinh tế, Đen huyền bí, Caffe trầm, Gỗ nhạt tự nhiên',
    hasRealPhotos: true,
    images: [],
    notes: [
      { id: 'note_ht10_1', text: 'Thành khung cao 3.5cm tạo hiệu ứng khối 3D sâu và sang trọng' },
      { id: 'note_ht10_2', text: 'Mặt viền 1.0cm thanh thoát, kết cấu xương gỗ gia cố chịu lực cao' }
    ],
    displayOrder: 3
  },
  {
    id: 'frame_k12',
    code: 'Khung K12',
    name: 'Khung K12 (Bản 5.5cm Cánh Gián Chỉ Đen Bề Thế)',
    dimensions: 'Bản rộng 5.5 cm • Tăng ~10cm phủ bì mỗi chiều',
    description: 'Hệ Khung K12 truyền thống xưởng Hùng Decor: Tông màu vân gỗ cánh gián sang trọng, điểm xuyết đường chỉ đen và hoa văn chìm tinh xảo. Bản rộng 5.5cm tạo độ đầm và bề thế vượt trội, giúp tranh sau khi vào khung trông uy nghi, đĩnh đạc.',
    suitableFor: 'Ảnh đại gia đình nhiều thế hệ, ảnh chân dung truyền thống trang trọng, tranh nghệ thuật khổ lớn.',
    variants: 'Cánh gián vân gỗ điểm viền chỉ đen (Bản rộng 5.5cm)',
    hasRealPhotos: true,
    images: [],
    notes: [
      { id: 'note_k12_1', text: 'Bản rộng 5.5cm bề thế, giúp tăng khoảng 10cm kích thước phủ bì' },
      { id: 'note_k12_2', text: 'Gia cố hậu chống ẩm mốc cho ảnh phóng đại gia đình' }
    ],
    displayOrder: 4
  },
  {
    id: 'frame_b10',
    code: 'Khung bản 10cm',
    name: 'Khung Bản 10cm (Bản Đại Cổ Điển Bề Thế)',
    dimensions: 'Bản rộng 10.0 cm • Tăng ~20cm phủ bì mỗi chiều',
    description: 'Hệ Khung Bản 10cm bề thế đẳng cấp của xưởng Hùng Decor: Tông màu gỗ cánh gián cổ điển, chạy đường chỉ đen và rãnh khuyết chìm tinh tế. Ít bám bụi, cực kỳ chắc chắn, toát lên vẻ uy nghi trang trọng cho không gian phòng khách lớn hay hội trường.',
    suitableFor: 'Ảnh đại gia đình, tranh treo phòng khách lớn, ảnh vinh danh và ảnh truyền thống cỡ đại.',
    variants: 'Cánh gián cổ điển chạy chỉ đen & rãnh khuyết chìm (Bản đại 10cm)',
    hasRealPhotos: true,
    images: [],
    notes: [
      { id: 'note_b10_1', text: 'Bản đại 10cm siêu chắc, tăng khoảng 20cm kích thước phủ bì ảnh' },
      { id: 'note_b10_2', text: 'Hệ khung gỗ đầm nặng, phù hợp kích thước từ 60x90 trở lên' }
    ],
    displayOrder: 5
  },
  {
    id: 'frame_titan1',
    code: 'Khung nhôm Titan M',
    name: 'Khung Nhôm Titan M (Siêu Mỏng Đen & Bạc Mate)',
    dimensions: 'Viền nhôm siêu mỏng • Bản mặt thanh mảnh vuông vức',
    description: 'Hệ Khung Nhôm Titan M của Hùng Decor: Chất liệu hợp kim nhôm Anode nguyên khối với viền siêu mỏng, phong cách tối giản thanh lịch, vuông vức, chống oxy hóa vĩnh viễn. Hiện có 2 màu: Bạc Mate và Đen Mate.',
    suitableFor: 'Ảnh thời trang, ảnh cưới Minimalist, ảnh chân dung nghệ thuật, ảnh sinh nhật và gia đình trẻ.',
    variants: 'Titan M Đen Mate, Titan M Bạc Mate',
    hasRealPhotos: true,
    images: [],
    notes: [
      { id: 'note_titan1_1', text: 'Hợp kim nhôm nguyên khối siêu nhẹ, chống rỉ sét và bay màu' },
      { id: 'note_titan1_2', text: 'Góc bo ghép 45 độ chuẩn xác công nghệ CNC' }
    ],
    displayOrder: 6
  },
  {
    id: 'frame_titan2',
    code: 'Khung nhôm Titan C',
    name: 'Khung Nhôm Titan C (Bản 2cm Vàng Hồng & Xanh Rêu)',
    dimensions: 'Bản mặt chính diện 2.0 cm • Cấu trúc đầm chắc',
    description: 'Hệ Khung Nhôm Titan C của Hùng Decor: Dòng khung hợp kim kim loại cao cấp với bản mặt chính diện rộng 2.0cm tạo cảm giác vững chãi, thời thượng. Hai gam màu phủ bóng sang trọng: Vàng Hồng bóng (Rose Gold) và Xanh Rêu bóng cổ điển.',
    suitableFor: 'Ảnh cưới sang trọng cao cấp, ảnh gia đình tân cổ điển và các tác phẩm trưng bày triển lãm.',
    variants: 'Titan C Vàng hồng bóng, Titan C Xanh rêu bóng',
    hasRealPhotos: true,
    images: [],
    notes: [
      { id: 'note_titan2_1', text: 'Bản mặt chính diện 2.0cm phủ bóng công nghệ mạ điện cao cấp' },
      { id: 'note_titan2_2', text: 'Khả năng chịu lực cao, phù hợp cho mọi kích thước ảnh phóng' }
    ],
    displayOrder: 7
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
