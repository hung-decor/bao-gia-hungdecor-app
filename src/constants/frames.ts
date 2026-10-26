export interface FrameConstantItem {
  id: string;
  code: string;
  name: string;
  imageUrl: string;
  image: string; // alias for image / imageUrl
  dimensions: string;
  description: string;
  suitableFor: string;
  variants: string;
  hasRealPhotos: boolean;
  images: Array<{
    id?: string;
    name: string;
    url: string;
    colorHex?: string;
    tag?: string;
  }>;
}

export const FRAMES: FrameConstantItem[] = [
  {
    id: 'boVien',
    code: 'Bo Viền',
    name: 'Bo Viền (Gia Công Viền Trực Tiếp Mép Ảnh)',
    imageUrl: '',
    image: '',
    dimensions: 'Viền bọc tinh tế ôm khít mép ảnh',
    description: 'Quy cách Bo viền chuyên dụng của xưởng Hùng Decor: Viền bọc ôm sát viền mép ảnh Gỗ Lụa hoặc Mika, giúp bảo vệ chống sứt mẻ va đập, tạo viền hoàn thiện gọn gàng, thanh thoát mà không cần lắp khung ngoài.',
    suitableFor: 'Ảnh Mika, Ảnh Gỗ Lụa để bàn, ảnh treo tường tối giản không dùng khung ngoài.',
    variants: 'Viền trắng, viền đen, viền vân gỗ',
    hasRealPhotos: true,
    images: []
  },
  {
    id: 'kx',
    code: 'Khung KX',
    name: 'Khung KX (Bản 2cm - 3cm Chống Cong Vênh)',
    imageUrl: '/images/frames/khung-k0.jpg',
    image: '/images/frames/khung-k0.jpg',
    dimensions: 'Bản rộng 2.0 cm - 3.0 cm',
    description: 'Hệ Khung KX của xưởng Hùng Decor: Cấu trúc khung úp mặt phẳng và chỉ nổi truyền thống, gồm các mẫu màu Cánh gián viền vàng (bản 3cm cứng cáp), Vân gỗ đậm mộc mạc, Đen trơn hiện đại và Trắng sáng tinh tế (bản 2cm). Phù hợp tối ưu từ ảnh để bàn đến kích thước 40x60.',
    suitableFor: 'Ảnh cụ ông cụ bà, ảnh phục chế truyền thống, ảnh gia đình, chân dung studio cỡ vừa và nhỏ.',
    variants: 'Cánh gián viền vàng, Vân gỗ đậm, Đen trơn, Trắng sáng',
    hasRealPhotos: true,
    images: [
      { id: 'img_kx_1', name: 'Khung KX: Cánh gián viền vàng (3cm)', url: '/images/frames/khung-k0.jpg', colorHex: '#4A2A16', tag: 'KX Cánh gián' },
      { id: 'img_kx_2', name: 'Khung KX: Vân gỗ đậm (2cm)', url: '/images/frames/khung-k1.jpg', colorHex: '#5C381E', tag: 'KX Vân gỗ' },
      { id: 'img_kx_3', name: 'Khung KX: Đen trơn (2cm)', url: '/images/frames/khung-k2.jpg', colorHex: '#1F1D1B', tag: 'KX Đen trơn' },
      { id: 'img_kx_4', name: 'Khung KX: Trắng sáng (2cm)', url: '/images/frames/khung-k3.jpg', colorHex: '#FFFFFF', tag: 'KX Trắng' }
    ]
  },
  {
    id: 'ht10',
    code: 'Khung HT10',
    name: 'Khung HT10 (Khung Hộp Kiểu Hàn Quốc Cao Cấp)',
    imageUrl: '/images/frames/khung-k4.JPG',
    image: '/images/frames/khung-k4.JPG',
    dimensions: 'Thành cao 3.5 cm • Bản mặt chính diện 1.0 cm',
    description: 'Hệ Khung HT10 cao cấp xưởng Hùng Decor: Dạng khung hộp phong cách Hàn Quốc với thành khung cao 3.5cm tạo chiều sâu 3D sang trọng, bản mặt nhìn chính diện chỉ 1.0cm thanh mảnh, hiện đại mà cực kỳ đầm chắc. Gồm 4 tông màu: Trắng bóng nhẹ, Đen sang trọng, Vân gỗ Caffe trầm và Gỗ nhạt tự nhiên.',
    suitableFor: 'Ảnh cưới phong cách Hàn Quốc, ảnh thời trang, ảnh gia đình ấm cúng và phối cùng dòng ảnh Mika cao cấp.',
    variants: 'Trắng tinh tế, Đen huyền bí, Caffe trầm, Gỗ nhạt tự nhiên',
    hasRealPhotos: true,
    images: [
      { id: 'img_ht10_1', name: 'Khung HT10: Trắng Hàn Quốc', url: '/images/frames/khung-k4.JPG', colorHex: '#FFFFFF', tag: 'HT10 Trắng' },
      { id: 'img_ht10_2', name: 'Khung HT10: Đen Hàn Quốc', url: '/images/frames/khung-k5.JPG', colorHex: '#1F1E1D', tag: 'HT10 Đen' },
      { id: 'img_ht10_3', name: 'Khung HT10: Caffe trầm', url: '/images/frames/khung-k6-caffe.JPG', colorHex: '#3F281D', tag: 'HT10 Caffe' },
      { id: 'img_ht10_4', name: 'Khung HT10: Gỗ nhạt tự nhiên', url: '/images/frames/khung-k6-nhat1.jpg', colorHex: '#A8815F', tag: 'HT10 Gỗ nhạt' }
    ]
  },
  {
    id: 'k12',
    code: 'Khung K12',
    name: 'Khung K12 (Bản 5.5cm Cánh Gián Chỉ Đen Bề Thế)',
    imageUrl: '/images/frames/khung-k10.JPG',
    image: '/images/frames/khung-k10.JPG',
    dimensions: 'Bản rộng 5.5 cm • Tăng ~10cm phủ bì mỗi chiều',
    description: 'Hệ Khung K12 truyền thống xưởng Hùng Decor: Tông màu vân gỗ cánh gián sang trọng, điểm xuyết đường chỉ đen và hoa văn chìm tinh xảo. Bản rộng 5.5cm tạo độ đầm và bề thế vượt trội, giúp tranh sau khi vào khung trông uy nghi, đĩnh đạc.',
    suitableFor: 'Ảnh đại gia đình nhiều thế hệ, ảnh chân dung truyền thống trang trọng, tranh nghệ thuật khổ lớn.',
    variants: 'Cánh gián vân gỗ điểm viền chỉ đen (Bản rộng 5.5cm)',
    hasRealPhotos: true,
    images: [
      { id: 'img_k12_1', name: 'Khung K12: Cánh gián chỉ đen (Bản 5.5cm)', url: '/images/frames/khung-k10.JPG', colorHex: '#4A2A1A', tag: 'Khung K12' }
    ]
  },
  {
    id: 'b25',
    code: 'Bản khung 2.5cm',
    name: 'Bản Khung 2.5cm (Viền Thanh Lịch Hiện Đại)',
    imageUrl: '',
    image: '',
    dimensions: 'Bản rộng 2.5 cm • Thiết kế thanh thoát',
    description: 'Hệ Bản khung 2.5cm của xưởng Hùng Decor: Độ rộng viền 2.5cm cân đối, mang lại vẻ đẹp thanh lịch, gọn gàng và chống cong vênh tối ưu cho dòng Ảnh Mika.',
    suitableFor: 'Ảnh chân dung, ảnh cưới hiện đại, ảnh gia đình cỡ vừa và nhỏ.',
    variants: 'Đen, Trắng, Vân gỗ tự nhiên, Cánh gián',
    hasRealPhotos: true,
    images: []
  },
  {
    id: 'b4',
    code: 'Bản khung 4cm',
    name: 'Bản Khung 4cm (Viền Cứng Cáp Sang Trọng)',
    imageUrl: '',
    image: '',
    dimensions: 'Bản rộng 4.0 cm • Kết cấu vững chãi',
    description: 'Hệ Bản khung 4cm của xưởng Hùng Decor: Bản phào rộng 4.0cm tạo điểm nhấn sang trọng, đầm chắc cho bức ảnh mà vẫn giữ nét tinh tế cho không gian trưng bày.',
    suitableFor: 'Ảnh cưới cổng, ảnh gia đình treo phòng khách, ảnh thờ trang trọng.',
    variants: 'Cánh gián, Vân gỗ trầm, Trắng viền vàng, Đen hiện đại',
    hasRealPhotos: true,
    images: []
  },
  {
    id: 'b8',
    code: 'Bản khung 8cm',
    name: 'Bản Khung 8cm (Bản Lớn Bề Thế Cao Cấp)',
    imageUrl: '',
    image: '',
    dimensions: 'Bản rộng 8.0 cm • Tăng ~15cm phủ bì mỗi chiều',
    description: 'Hệ Bản khung 8cm của xưởng Hùng Decor: Phào khung bản lớn 8.0cm bề thế, tôn vinh chiều sâu và sự uy nghi cho các tác phẩm Ảnh Mika khổ lớn.',
    suitableFor: 'Ảnh đại gia đình, ảnh phóng lớn phòng khách, sảnh tiệc và hội trường.',
    variants: 'Cánh gián cổ điển, Vân gỗ cao cấp, Hoa văn tân cổ điển',
    hasRealPhotos: true,
    images: []
  },
  {
    id: 'b10',
    code: 'Khung bản 10cm',
    name: 'Khung Bản 10cm (Bản Đại Cổ Điển Bề Thế)',
    imageUrl: '/images/frames/khung-k11.jpg',
    image: '/images/frames/khung-k11.jpg',
    dimensions: 'Bản rộng 10.0 cm • Tăng ~20cm phủ bì mỗi chiều',
    description: 'Hệ Khung Bản 10cm bề thế đẳng cấp của xưởng Hùng Decor: Tông màu gỗ cánh gián cổ điển, chạy đường chỉ đen và rãnh khuyết chìm tinh tế. Ít bám bụi, cực kỳ chắc chắn, toát lên vẻ uy nghi trang trọng cho không gian phòng khách lớn hay hội trường.',
    suitableFor: 'Ảnh đại gia đình, tranh treo phòng khách lớn, ảnh vinh danh và ảnh truyền thống cỡ đại.',
    variants: 'Cánh gián cổ điển chạy chỉ đen & rãnh khuyết chìm (Bản đại 10cm)',
    hasRealPhotos: true,
    images: [
      { id: 'img_b10_1', name: 'Khung Bản 10cm: Cánh gián chỉ đen', url: '/images/frames/khung-k11.jpg', colorHex: '#4E2712', tag: 'Khung Bản 10cm' }
    ]
  },
  {
    id: 'ttm',
    code: 'Khung nhôm Titan M',
    name: 'Khung Nhôm Titan M (Hệ Khung Hợp Kim Nhôm Hùng Decor)',
    imageUrl: '',
    image: '',
    dimensions: 'Hệ khung hợp kim nhôm cao cấp • Mô phỏng kỹ thuật Hùng Decor',
    description: 'Hệ Khung nhôm Titan M chính hãng tại xưởng Hùng Decor: Kết cấu hợp kim nhôm định hình cao cấp, bề mặt hoàn thiện tinh xảo, vuông vức và chống cong vênh, chuyên dụng cho dòng Ảnh Mika cao cấp.',
    suitableFor: 'Ảnh Mika cao cấp, ảnh cưới hiện đại, ảnh chân dung nghệ thuật và ảnh trưng bày phòng khách.',
    variants: 'Theo bảng màu tiêu chuẩn xưởng Hùng Decor',
    hasRealPhotos: false,
    images: []
  },
  {
    id: 'ttc',
    code: 'Khung nhôm Titan C',
    name: 'Khung Nhôm Titan C (Hệ Khung Hợp Kim Nhôm Hùng Decor)',
    imageUrl: '',
    image: '',
    dimensions: 'Hệ khung hợp kim nhôm cao cấp • Mô phỏng kỹ thuật Hùng Decor',
    description: 'Hệ Khung nhôm Titan C chính hãng tại xưởng Hùng Decor: Thiết kế viền nhôm hợp kim cứng cáp, sang trọng, gia công góc ghép chuẩn xác tại xưởng Hùng Decor.',
    suitableFor: 'Ảnh Mika cổng cưới, ảnh gia đình và các tác phẩm ảnh phóng lớn sang trọng.',
    variants: 'Theo bảng màu tiêu chuẩn xưởng Hùng Decor',
    hasRealPhotos: false,
    images: []
  }
];

export const EXACT_FRAME_PATHS: Record<string, string> = {
  'boVien': '',
  'Bo Viền': '',
  'kx': '/images/frames/khung-k0.jpg',
  'Khung KX': '/images/frames/khung-k0.jpg',
  'ht10': '/images/frames/khung-k4.JPG',
  'Khung HT10': '/images/frames/khung-k4.JPG',
  'k12': '/images/frames/khung-k10.JPG',
  'Khung K12': '/images/frames/khung-k10.JPG',
  'b25': '',
  'Bản khung 2.5cm': '',
  'b4': '',
  'Bản khung 4cm': '',
  'b8': '',
  'Bản khung 8cm': '',
  'b10': '/images/frames/khung-k11.jpg',
  'Bản 10cm': '/images/frames/khung-k11.jpg',
  'Khung bản 10cm': '/images/frames/khung-k11.jpg',
  'ttm': '',
  'Titan M': '',
  'Khung nhôm Titan M': '',
  'ttc': '',
  'Titan C': '',
  'Khung nhôm Titan C': ''
};

export function getFrameImageSrc(urlOrCode: string): string {
  if (!urlOrCode) return '';
  const trimmed = urlOrCode.trim();
  if (EXACT_FRAME_PATHS[trimmed]) {
    return encodeURI(EXACT_FRAME_PATHS[trimmed]);
  }
  const upper = trimmed.toUpperCase();
  if (EXACT_FRAME_PATHS[upper]) {
    return encodeURI(EXACT_FRAME_PATHS[upper]);
  }
  return encodeURI(urlOrCode);
}

export function getExactFrameSrc(code: string, fallbackUrl?: string): string {
  if (code && EXACT_FRAME_PATHS[code.trim()]) {
    return encodeURI(EXACT_FRAME_PATHS[code.trim()]);
  }
  if (code && EXACT_FRAME_PATHS[code.trim().toUpperCase()]) {
    return encodeURI(EXACT_FRAME_PATHS[code.trim().toUpperCase()]);
  }
  if (fallbackUrl) {
    return encodeURI(fallbackUrl);
  }
  return '';
}

export default FRAMES;
