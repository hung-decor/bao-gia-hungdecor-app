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
    suitableFor: 'Ảnh cưới phong cách Hàn Quốc, ảnh thời trang, ảnh gia đình ấm cúng và phối cùng dòng ảnh 4K cao cấp.',
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
    id: 'titan1',
    code: 'Khung nhôm Titan M',
    name: 'Khung Nhôm Titan M (Siêu Mỏng Đen & Bạc Mate)',
    imageUrl: '/images/frames/khung-titan1-den.JPG',
    image: '/images/frames/khung-titan1-den.JPG',
    dimensions: 'Viền nhôm siêu mỏng • Bản mặt thanh mảnh vuông vức',
    description: 'Hệ Khung Nhôm Titan M của Hùng Decor: Chất liệu hợp kim nhôm Anode nguyên khối với viền siêu mỏng, phong cách tối giản thanh lịch, vuông vức, chống oxy hóa vĩnh viễn. Hiện có 2 màu: Bạc Mate và Đen Mate.',
    suitableFor: 'Ảnh thời trang, ảnh cưới Minimalist, ảnh chân dung nghệ thuật, ảnh sinh nhật và gia đình trẻ.',
    variants: 'Titan M Đen Mate, Titan M Bạc Mate',
    hasRealPhotos: true,
    images: [
      { id: 'img_titan1_1', name: 'Khung nhôm Titan M: Đen Mate', url: '/images/frames/khung-titan1-den.JPG', colorHex: '#181716', tag: 'Titan M Đen' },
      { id: 'img_titan1_2', name: 'Khung nhôm Titan M: Bạc Mate', url: '/images/frames/khung-titan1-bac.JPG', colorHex: '#DCDDE1', tag: 'Titan M Bạc' }
    ]
  },
  {
    id: 'titan2',
    code: 'Khung nhôm Titan C',
    name: 'Khung Nhôm Titan C (Bản 2cm Vàng Hồng & Xanh Rêu)',
    imageUrl: '/images/frames/khung-titan2-hong.jpg',
    image: '/images/frames/khung-titan2-hong.jpg',
    dimensions: 'Bản mặt chính diện 2.0 cm • Cấu trúc đầm chắc',
    description: 'Hệ Khung Nhôm Titan C của Hùng Decor: Dòng khung hợp kim kim loại cao cấp với bản mặt chính diện rộng 2.0cm tạo cảm giác vững chãi, thời thượng. Hai gam màu phủ bóng sang trọng: Vàng Hồng bóng (Rose Gold) và Xanh Rêu bóng cổ điển.',
    suitableFor: 'Ảnh cưới sang trọng cao cấp, ảnh gia đình tân cổ điển và các tác phẩm trưng bày triển lãm.',
    variants: 'Titan C Vàng hồng bóng, Titan C Xanh rêu bóng',
    hasRealPhotos: true,
    images: [
      { id: 'img_titan2_1', name: 'Khung nhôm Titan C: Vàng hồng bóng', url: '/images/frames/khung-titan2-hong.jpg', colorHex: '#B87D72', tag: 'Titan C Hồng' },
      { id: 'img_titan2_2', name: 'Khung nhôm Titan C: Xanh rêu bóng', url: '/images/frames/khung-titan2-xanh.JPG', colorHex: '#3B5245', tag: 'Titan C Xanh' }
    ]
  },
  {
    id: 'boVien',
    code: 'Bo Viền',
    name: 'Bo Viền (Gia Công Viền Trực Tiếp Mép Ảnh)',
    imageUrl: '',
    image: '',
    dimensions: 'Viền bọc tinh tế ôm khít mép ảnh',
    description: 'Quy cách Bo viền chuyên dụng của xưởng Hùng Decor: Viền bọc ôm sát viền mép ảnh Gỗ Lụa hoặc Mika, giúp bảo vệ chống sứt mẻ va đập, tạo viền hoàn thiện gọn gàng, thanh thoát mà không cần lắp khung ngoài.',
    suitableFor: 'Ảnh Gỗ Lụa để bàn, ảnh treo tường tối giản không dùng khung ngoài.',
    variants: 'Viền trắng, viền đen, viền vân gỗ',
    hasRealPhotos: true,
    images: []
  }
];

export const EXACT_FRAME_PATHS: Record<string, string> = {
  'kx': '/images/frames/khung-k0.jpg',
  'Khung KX': '/images/frames/khung-k0.jpg',
  'ht10': '/images/frames/khung-k4.JPG',
  'Khung HT10': '/images/frames/khung-k4.JPG',
  'k12': '/images/frames/khung-k10.JPG',
  'Khung K12': '/images/frames/khung-k10.JPG',
  'b10': '/images/frames/khung-k11.jpg',
  'Bản 10cm': '/images/frames/khung-k11.jpg',
  'Khung bản 10cm': '/images/frames/khung-k11.jpg',
  'titan1': '/images/frames/khung-titan1-den.JPG',
  'Titan M': '/images/frames/khung-titan1-den.JPG',
  'Khung nhôm Titan M': '/images/frames/khung-titan1-den.JPG',
  'titan2': '/images/frames/khung-titan2-hong.jpg',
  'Titan C': '/images/frames/khung-titan2-hong.jpg',
  'Khung nhôm Titan C': '/images/frames/khung-titan2-hong.jpg',
  'boVien': '',
  'Bo Viền': ''
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
