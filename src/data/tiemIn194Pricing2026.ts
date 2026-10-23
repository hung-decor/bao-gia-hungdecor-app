import { InEpMikaPriceRow, DongKhungPriceRow, Anh4KPriceRow, FrameSpecItem } from '../types';

// 1. BẢNG GIÁ IN ÉP MIKA & BO VIỀN MIKA
export const inEpMikaPricingData: InEpMikaPriceRow[] = [
  { stt: 1, size: '13x18', inEpMika: 20000 },
  { stt: 2, size: '15x21', inEpMika: 27000 },
  { stt: 3, size: '20x30', inEpMika: 37000 },
  { stt: 4, size: '25x38', inEpMika: 60000 },
  { stt: 5, size: '30x45', inEpMika: 75000 },
  { stt: 6, size: '35x50', inEpMika: 85000 },
  { stt: 7, size: '40x60', inEpMika: 105000 },
  { stt: 8, size: '50x75', inEpMika: 130000 },
  { stt: 9, size: '60x90', inEpMika: 190000 },
  { stt: 10, size: '60x120', inEpMika: 320000 },
  { stt: 11, size: '70x110', inEpMika: 300000 },
  { stt: 12, size: '80x120', inEpMika: 460000, khungXuongGiaCo: 180000 },
  { stt: 13, size: '90x140', inEpMika: 560000, khungXuongGiaCo: 200000 },
  { stt: 14, size: '100x150', inEpMika: 690000, khungXuongGiaCo: 220000 },
  { stt: 15, size: '100x180', inEpMika: 850000, khungXuongGiaCo: 310000 }
];
// Backwards compatibility alias
export const boVienPricingData = inEpMikaPricingData;

// 2. GỖ LỤA ĐÓNG KHUNG & IN ẢNH LAB (Khớp các cột theo thực tế Hùng Decor)
export const goLuaDongKhungData: DongKhungPriceRow[] = [
  { size: '13x18', boVien: 18000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '15x21', boVien: 20000, k0_k3: 32000, k4_k6: 48000, k7_k9: 48000, k10: null, k11: null, titan1: 35000, titan2: 45000 },
  { size: '20x30', boVien: 30000, k0_k3: 43000, k4_k6: 63000, k7_k9: 63000, k10: null, k11: null, titan1: 80000, titan2: 70000 },
  { size: '25x38', boVien: 55000, k0_k3: 75000, k4_k6: 150000, k7_k9: 100000, k10: null, k11: null, titan1: 95000, titan2: 120000 },
  { size: '30x45', boVien: 50000, k0_k3: 100000, k4_k6: 130000, k7_k9: 130000, k10: 150000, k11: null, titan1: 120000, titan2: 170000 },
  { size: '35x50', boVien: 70000, k0_k3: 118000, k4_k6: 150000, k7_k9: 150000, k10: 170000, k11: null, titan1: 145000, titan2: 175000 },
  { size: '40x60', boVien: 90000, k0_k3: 220000, k4_k6: 240000, k7_k9: 180000, k10: 170000, k11: 240000, titan1: 140000, titan2: 240000 },
  { size: '50x75', boVien: 120000, k0_k3: 300000, k4_k6: 320000, k7_k9: 235000, k10: 230000, k11: 310000, titan1: 190000, titan2: 270000 },
  { size: '60x90', boVien: 160000, k0_k3: 350000, k4_k6: 370000, k7_k9: 260000, k10: 300000, k11: 350000, titan1: 240000, titan2: 320000 },
  { size: '60x120', boVien: 310000, k0_k3: 365000, k4_k6: 436000, k7_k9: 436000, k10: 400000, k11: 544000, titan1: 420000, titan2: 450000 },
  { size: '70x110', boVien: 270000, k0_k3: 470000, k4_k6: 470000, k7_k9: 450000, k10: 360000, k11: 652000, titan1: 430000, titan2: 470000 },
  { size: '80x120', boVien: 350000, k0_k3: 660000, k4_k6: 660000, k7_k9: 520000, k10: 510000, k11: 844000, titan1: 500000, titan2: 660000 },
  { size: '90x140', boVien: 500000, k0_k3: 740000, k4_k6: 900000, k7_k9: 650000, k10: 700000, k11: 992000, titan1: 750000, titan2: 850000 },
  { size: '100x150', boVien: 670000, k0_k3: 1014000, k4_k6: 1082000, k7_k9: 895000, k10: 920000, k11: 995000, titan1: 870000, titan2: 970000 },
  { size: '100x180', boVien: 800000, k0_k3: 1200000, k4_k6: 1780000, k7_k9: 1100000, k10: 1250000, k11: 1400000, titan1: 1250000, titan2: 1350000 }
];

// 3. MIKA PHỔ THÔNG ĐÓNG KHUNG
export const mikaPhoThongData: DongKhungPriceRow[] = [
  { size: '13x18', boVien: 20000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: null, titan2: null },
  { size: '15x21', boVien: 27000, k0_k3: 38000, k4_k6: 55000, k7_k9: 55000, k10: null, k11: null, titan1: 48000, titan2: 68000 },
  { size: '20x30', boVien: 37000, k0_k3: 48000, k4_k6: 70000, k7_k9: 70000, k10: null, k11: null, titan1: 65000, titan2: 85000 },
  { size: '25x38', boVien: 60000, k0_k3: 80000, k4_k6: 105000, k7_k9: 105000, k10: null, k11: null, titan1: 100000, titan2: 125000 },
  { size: '30x45', boVien: 75000, k0_k3: 110000, k4_k6: 140000, k7_k9: 140000, k10: 155000, k11: 185000, titan1: 135000, titan2: 165000 },
  { size: '35x50', boVien: 85000, k0_k3: 125000, k4_k6: 160000, k7_k9: 160000, k10: 176000, k11: 210000, titan1: 150000, titan2: 185000 },
  { size: '40x60', boVien: 105000, k0_k3: 145000, k4_k6: 185000, k7_k9: 185000, k10: 205000, k11: 245000, titan1: 175000, titan2: 215000 },
  { size: '50x75', boVien: 130000, k0_k3: 190000, k4_k6: 245000, k7_k9: 245000, k10: 265000, k11: 315000, titan1: 230000, titan2: 280000 },
  { size: '60x90', boVien: 190000, k0_k3: 220000, k4_k6: 280000, k7_k9: 280000, k10: 310000, k11: 370000, titan1: 265000, titan2: 325000 },
  { size: '60x120', boVien: 320000, k0_k3: 390000, k4_k6: 460000, k7_k9: 460000, k10: 495000, k11: 570000, titan1: 445000, titan2: 515000 },
  { size: '70x110', boVien: 300000, k0_k3: 375000, k4_k6: 480000, k7_k9: 480000, k10: 500000, k11: 555000, titan1: 465000, titan2: 515000 },
  { size: '80x120', boVien: 460000, k0_k3: 435000, k4_k6: 555000, k7_k9: 555000, k10: 575000, k11: 635000, titan1: 535000, titan2: 615000 },
  { size: '90x140', boVien: 560000, k0_k3: 560000, k4_k6: 700000, k7_k9: 700000, k10: 740000, k11: 820000, titan1: 710000, titan2: 800000 },
  { size: '100x150', boVien: 690000, k0_k3: 770000, k4_k6: 920000, k7_k9: 920000, k10: 945000, k11: 1020000, titan1: 895000, titan2: 995000 },
  { size: '100x180', boVien: 850000, k0_k3: 970000, k4_k6: 1140000, k7_k9: 1140000, k10: 1170000, k11: 1257000, titan1: 1115000, titan2: 1225000 }
];
// Backwards compatibility alias
export const micaPhoThongData = mikaPhoThongData;

// 4. HD GƯƠNG SIÊU BÓNG (MIKA GƯƠNG HD 8K)
export const hdGuongSieuBongKhungData: DongKhungPriceRow[] = [
  { size: '13x18', boVien: 30000, k0_k3: null, k4_k6: null, k7_k9: null, k10: null, k11: null, titan1: 45000, titan2: 55000 },
  { size: '15x21', boVien: 35000, k0_k3: 43000, k4_k6: 58200, k7_k9: 58200, k10: null, k11: null, titan1: 53000, titan2: 73000 },
  { size: '20x30', boVien: 50000, k0_k3: 53000, k4_k6: 73000, k7_k9: 73000, k10: null, k11: null, titan1: 68000, titan2: 88000 },
  { size: '25x38', boVien: 75000, k0_k3: 85000, k4_k6: 110000, k7_k9: 110000, k10: null, k11: null, titan1: 105000, titan2: 130000 },
  { size: '30x45', boVien: 90000, k0_k3: 118000, k4_k6: 145000, k7_k9: 145000, k10: 165000, k11: 195000, titan1: 140000, titan2: 170000 },
  { size: '35x50', boVien: 110000, k0_k3: 130000, k4_k6: 165000, k7_k9: 165000, k10: 180000, k11: 215000, titan1: 155000, titan2: 190000 },
  { size: '40x60', boVien: 140000, k0_k3: 155000, k4_k6: 195000, k7_k9: 195000, k10: 215000, k11: 255000, titan1: 185000, titan2: 225000 },
  { size: '50x75', boVien: 160000, k0_k3: 205000, k4_k6: 255000, k7_k9: 255000, k10: 285000, k11: 335000, titan1: 245000, titan2: 295000 },
  { size: '60x90', boVien: 260000, k0_k3: 235000, k4_k6: 295000, k7_k9: 295000, k10: 325000, k11: 385000, titan1: 290000, titan2: 340000 },
  { size: '60x120', boVien: 360000, k0_k3: 405000, k4_k6: 475000, k7_k9: 475000, k10: 515000, k11: 585000, titan1: 505000, titan2: 545000 },
  { size: '70x110', boVien: 360000, k0_k3: 405000, k4_k6: 515000, k7_k9: 515000, k10: 530000, k11: 585000, titan1: 505000, titan2: 545000 },
  { size: '80x120', boVien: 580000, k0_k3: 485000, k4_k6: 605000, k7_k9: 605000, k10: 625000, k11: 685000, titan1: 640000, titan2: 720000 },
  { size: '90x140', boVien: 680000, k0_k3: 650000, k4_k6: 780000, k7_k9: 780000, k10: 820000, k11: 890000, titan1: 780000, titan2: 890000 },
  { size: '100x150', boVien: 770000, k0_k3: 845000, k4_k6: 995000, k7_k9: 995000, k10: 1020000, k11: 1095000, titan1: 970000, titan2: 1070000 },
  { size: '100x180', boVien: 950000, k0_k3: 1059000, k4_k6: 1235000, k7_k9: 1235000, k10: 1265000, k11: 1350000, titan1: 1210000, titan2: 1320000 }
];
// Backwards compatibility alias
export const micaGuongHDKhungData = hdGuongSieuBongKhungData;

// 5. ẢNH 4K (Trang 5 PDF)
export const anh4KPricingData: Anh4KPriceRow[] = [
  { size: '15x21', k4_k6: 58000, titan2: 70000 },
  { size: '20x30', k4_k6: 80000, titan2: 90000 },
  { size: '25x38', k4_k6: 110000, titan2: 120000 },
  { size: '30x45', k4_k6: 170000, titan2: 190000 },
  { size: '35x50', k4_k6: 220000, titan2: 240000 },
  { size: '40x60', k4_k6: 355000, titan2: 375000 },
  { size: '50x75', k4_k6: 430000, titan2: 465000 },
  { size: '60x90', k4_k6: 470000, titan2: 515000 },
  { size: '60x120', k4_k6: 850000, titan2: 915000 },
  { size: '70x110', k4_k6: 820000, titan2: 870000 },
  { size: '80x120', k4_k6: 925000, titan2: 975000 },
  { size: '90x130', k4_k6: 1260000, titan2: 1365000 },
  { size: '100x150', k4_k6: 1580000, titan2: 1680000 }
];

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
