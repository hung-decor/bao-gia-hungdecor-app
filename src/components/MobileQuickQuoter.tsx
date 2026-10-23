import React, { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { usePriceMultiplier, applyMultiplier } from '../hooks/usePriceMultiplier';
import { Calculator, Copy, Check, MessageCircle, ChevronDown, Camera } from 'lucide-react';

interface MobileQuickQuoterProps {
  zaloTho: string;
}

// All standard sizes sorted from smallest to largest, without trailing annotations
const allAvailableSizes = [
  { size: '13x18', label: '13x18' },
  { size: '15x21', label: '15x21' },
  { size: '20x30', label: '20x30' },
  { size: '25x38', label: '25x38' },
  { size: '30x45', label: '30x45' },
  { size: '35x50', label: '35x50' },
  { size: '40x60', label: '40x60' },
  { size: '50x75', label: '50x75' },
  { size: '60x90', label: '60x90' },
  { size: '60x120', label: '60x120' },
  { size: '70x110', label: '70x110' },
  { size: '80x120', label: '80x120' },
  { size: '90x130', label: '90x130' },
  { size: '90x140', label: '90x140' },
  { size: '100x150', label: '100x150' },
  { size: '100x180', label: '100x180' },
  { size: '110x180', label: '110x180' }
];

const materialOptions = [
  { id: 'go-lua', name: 'Gỗ Lụa Đóng Khung' },
  { id: 'hd-guong-sieu-bong', name: 'HD Gương Siêu Bóng', badge: 'Khuyên Dùng' },
  { id: 'mika-pho-thong', name: 'Mika Phổ Thông' },
  { id: 'in-ep-mika', name: 'In ép Mika & Khung xương Gia Cố' },
  { id: 'anh-4k', name: 'Ảnh 4K Fomex' }
];

export const MobileQuickQuoter: React.FC<MobileQuickQuoterProps> = ({ zaloTho }) => {
  const { pricing } = useAppData();

  // Step 1: Kích thước - Mặc định 60x90
  const [selectedSize, setSelectedSize] = useState<string>('60x90');

  // Step 2: Chất liệu - Mặc định HD gương siêu bóng
  const [selectedMaterial, setSelectedMaterial] = useState<string>('hd-guong-sieu-bong');

  // Step 3: Loại khung - Mặc định Chỉ bo viền (Không Khung)
  const [selectedFrame, setSelectedFrame] = useState<string>('boVien');

  // Option for In Ép Mika large sizes: Khung xương gia cố phía sau
  const [hasKhungXuongGiaCo, setHasKhungXuongGiaCo] = useState<boolean>(false);

  // Copy status
  const [copiedCustomer, setCopiedCustomer] = useState<boolean>(false);

  // Available frame options based on selected material
  const frameOptions = useMemo(() => {
    if (selectedMaterial === 'in-ep-mika') {
      return [
        { id: 'inEpMika', label: 'In Ép Mika' }
      ];
    }

    if (selectedMaterial === 'anh-4k') {
      return [
        { id: 'k4_k6', label: 'Khung HT10' },
        { id: 'titan2', label: 'Khung nhôm Titan C' }
      ];
    }

    // Default for Gỗ Lụa, Mika Phổ Thông, HD Gương Siêu Bóng (Chỉ Bo Viền đặt lên đầu làm mặc định)
    return [
      { id: 'boVien', label: 'Chỉ Bo Viền (Không Khung)' },
      { id: 'k0_k3', label: 'Khung KX' },
      { id: 'k4_k6', label: 'Khung HT10' },
      { id: 'k10', label: 'Khung K12' },
      { id: 'k11', label: 'Khung bản 10cm' },
      { id: 'titan1', label: 'Khung nhôm Titan M' },
      { id: 'titan2', label: 'Khung nhôm Titan C' }
    ];
  }, [selectedMaterial]);

  // Adjust selected frame if not valid for selected material
  React.useEffect(() => {
    const validIds = frameOptions.map(f => f.id);
    if (!validIds.includes(selectedFrame)) {
      setSelectedFrame(validIds[0]);
    }
  }, [frameOptions, selectedFrame]);

  const multiplier = usePriceMultiplier();

  // Current In Ép Mika row if applicable
  const currentInEpMikaRow = useMemo(() => {
    if (selectedMaterial !== 'in-ep-mika') return null;
    return pricing.inEpMika.find(r => r.size.replace('*', 'x') === selectedSize.replace('*', 'x'));
  }, [selectedMaterial, selectedSize, pricing.inEpMika]);

  const currentReinforcedFrameCostFormatted = useMemo(() => {
    if (!currentInEpMikaRow?.khungXuongGiaCo) return null;
    return applyMultiplier(currentInEpMikaRow.khungXuongGiaCo, multiplier);
  }, [currentInEpMikaRow, multiplier]);

  // Calculate Base Price
  const rawBasePrice = useMemo<number | null>(() => {
    if (selectedMaterial === 'in-ep-mika') {
      return currentInEpMikaRow?.inEpMika ?? null;
    }

    if (selectedMaterial === 'go-lua') {
      const row = pricing.goLua.find(r => r.size.replace('*', 'x') === selectedSize.replace('*', 'x'));
      if (!row) return null;
      return (row as any)[selectedFrame] ?? null;
    }

    if (selectedMaterial === 'mika-pho-thong') {
      const row = pricing.mikaPhoThong.find(r => r.size.replace('*', 'x') === selectedSize.replace('*', 'x'));
      if (!row) return null;
      return (row as any)[selectedFrame] ?? null;
    }

    if (selectedMaterial === 'hd-guong-sieu-bong') {
      const row = pricing.hdGuong.find(r => r.size.replace('*', 'x') === selectedSize.replace('*', 'x'));
      if (!row) return null;
      return (row as any)[selectedFrame] ?? null;
    }

    if (selectedMaterial === 'anh-4k') {
      const row = pricing.anh4K.find(r => r.size.replace('*', 'x') === selectedSize.replace('*', 'x'));
      if (!row) return null;
      return (row as any)[selectedFrame] ?? null;
    }

    return null;
  }, [selectedMaterial, selectedSize, selectedFrame, currentInEpMikaRow, pricing]);

  const basePrice = useMemo<number | null>(() => {
    return applyMultiplier(rawBasePrice, multiplier);
  }, [rawBasePrice, multiplier]);

  const rawReinforcedFrameCost = useMemo(() => {
    if (selectedMaterial === 'in-ep-mika' && hasKhungXuongGiaCo && currentInEpMikaRow?.khungXuongGiaCo) {
      return currentInEpMikaRow.khungXuongGiaCo;
    }
    return 0;
  }, [selectedMaterial, hasKhungXuongGiaCo, currentInEpMikaRow]);

  const reinforcedFrameCost = useMemo(() => {
    return applyMultiplier(rawReinforcedFrameCost, multiplier) || 0;
  }, [rawReinforcedFrameCost, multiplier]);

  const totalPrice = basePrice !== null ? basePrice + reinforcedFrameCost : null;

  const currentMaterialObj = materialOptions.find(m => m.id === selectedMaterial);
  const currentFrameObj = frameOptions.find(f => f.id === selectedFrame);

  // Copy customer-facing quote
  const handleCopyCustomerQuote = () => {
    if (totalPrice === null) return;
    const frameLabel = selectedMaterial === 'in-ep-mika' 
      ? (hasKhungXuongGiaCo && currentReinforcedFrameCostFormatted ? ' (Có Khung xương gia cố)' : '') 
      : ` - ${currentFrameObj?.label}`;
    const text = `Báo giá ảnh ${selectedSize}cm: ${currentMaterialObj?.name}${frameLabel}: ${totalPrice.toLocaleString('vi-VN')} đ`;
    navigator.clipboard.writeText(text);
    setCopiedCustomer(true);
    setTimeout(() => setCopiedCustomer(false), 2000);
  };

  const generateZaloUrl = () => {
    const frameLabel = selectedMaterial === 'in-ep-mika' 
      ? (hasKhungXuongGiaCo && currentReinforcedFrameCostFormatted ? '\n- Tùy chọn: Khung xương gia cố phía sau (+ ' + currentReinforcedFrameCostFormatted.toLocaleString('vi-VN') + ' đ)' : '') 
      : `\n- Khung: ${currentFrameObj?.label}`;
    const text = `Hùng Decor ơi, mình đặt file:\n- Size: ${selectedSize}\n- Loại: ${currentMaterialObj?.name}${frameLabel}\n- Giá sỉ: ${totalPrice?.toLocaleString('vi-VN')} đ\nNhờ xưởng duyệt file nhé!`;
    return `https://zalo.me/${zaloTho.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="bang-tinh-gia" className="bg-white border-b border-[#E7E2DA] py-3.5 sm:py-5 px-3 sm:px-6 shadow-sm relative z-20 w-full max-w-full overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 w-full max-w-full">
        
        {/* Mobile Header Bar */}
        <div className="flex items-center justify-between w-full max-w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FAF9F5] border border-[#E7E2DA] flex items-center justify-center text-[#936B34] shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1C1917] tracking-tight">
                Tính Giá Nhanh Cho Thợ
              </h2>
              <p className="text-[11px] text-[#78716C]">
                3 bước chọn &rarr; Có ngay giá sỉ chính xác
              </p>
            </div>
          </div>

          <a
            href="#tra-cuu-khung"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#936B34] hover:text-[#7A5828] bg-[#F5EFEB] px-2.5 py-1 rounded-md transition-colors"
          >
            <Camera className="w-3 h-3" />
            <span className="hidden xs:inline">Xem ảnh mẫu khung</span>
            <span className="xs:hidden">Ảnh khung</span>
          </a>
        </div>

        {/* 3 Step Selectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 w-full max-w-full">
          
          {/* STEP 1: SIZE SELECT */}
          <div className="bg-[#FAF9F5] border border-[#E7E2DA] rounded-xl p-2.5 sm:p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#936B34]">
                1. Kích thước (cm)
              </span>
              <span className="text-[10px] text-[#A8A29E] font-mono">15 size</span>
            </div>
            <div className="relative">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full bg-white border border-[#D7D2C9] rounded-lg px-2.5 py-2 text-xs sm:text-sm font-semibold text-[#1C1917] appearance-none focus:outline-none focus:ring-1 focus:ring-[#936B34] focus:border-[#936B34] pr-8 cursor-pointer"
              >
                {allAvailableSizes.map(s => (
                  <option key={s.size} value={s.size}>
                    {s.label} cm
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#78716C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* STEP 2: MATERIAL SELECT */}
          <div className="bg-[#FAF9F5] border border-[#E7E2DA] rounded-xl p-2.5 sm:p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#936B34]">
                2. Chất liệu ảnh
              </span>
              {currentMaterialObj?.badge && (
                <span className="text-[9px] font-semibold text-[#059669] bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                  {currentMaterialObj.badge}
                </span>
              )}
            </div>
            <div className="relative">
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full bg-white border border-[#D7D2C9] rounded-lg px-2.5 py-2 text-xs sm:text-sm font-semibold text-[#1C1917] appearance-none focus:outline-none focus:ring-1 focus:ring-[#936B34] focus:border-[#936B34] pr-8 cursor-pointer"
              >
                {materialOptions.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#78716C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* STEP 3: FRAME TYPE SELECT */}
          <div className="bg-[#FAF9F5] border border-[#E7E2DA] rounded-xl p-2.5 sm:p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#936B34]">
                3. Kiểu khung / Viền
              </span>
              <span className="text-[10px] text-[#A8A29E] font-mono">
                {frameOptions.length} lựa chọn
              </span>
            </div>
            <div className="relative">
              <select
                value={selectedFrame}
                onChange={(e) => setSelectedFrame(e.target.value)}
                className="w-full bg-white border border-[#D7D2C9] rounded-lg px-2.5 py-2 text-xs sm:text-sm font-semibold text-[#1C1917] appearance-none focus:outline-none focus:ring-1 focus:ring-[#936B34] focus:border-[#936B34] pr-8 cursor-pointer"
              >
                {frameOptions.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#78716C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Option for In Ép Mika: Khung xương gia cố phía sau */}
        {selectedMaterial === 'in-ep-mika' && currentInEpMikaRow?.khungXuongGiaCo && (
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasKhungXuongGiaCo}
                onChange={(e) => setHasKhungXuongGiaCo(e.target.checked)}
                className="w-4 h-4 text-[#936B34] rounded border-amber-300 focus:ring-[#936B34]"
              />
              <span className="text-xs font-semibold text-amber-950">
                Thêm tùy chọn Khung xương gia cố phía sau (+ {currentReinforcedFrameCostFormatted?.toLocaleString('vi-VN')} đ)
              </span>
            </label>
            <span className="text-[10px] text-amber-800 font-mono hidden sm:inline">Khuyên dùng cho cỡ &ge; 80x120 chống cong vênh</span>
          </div>
        )}

        {/* RESULT BOX */}
        <div className="bg-[#1C1917] text-white rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md w-full max-w-full">
          
          <div className="space-y-0.5">
            <div className="text-[11px] font-mono text-[#E7C184] uppercase tracking-wider flex items-center gap-1.5">
              <span>Giá Sỉ Gốc Thợ & Studio:</span>
              <span className="text-[9px] bg-white/10 px-1 rounded text-neutral-300 font-sans">Chuẩn Lab</span>
            </div>
            <div className="flex items-baseline gap-2">
              {totalPrice !== null ? (
                <>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                    {totalPrice.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-xs sm:text-sm text-[#E7C184] font-semibold">VNĐ</span>
                </>
              ) : (
                <span className="text-sm sm:text-base font-semibold text-neutral-400 italic">
                  Không áp dụng quy cách này
                </span>
              )}
            </div>
            <div className="text-[11px] text-neutral-400 truncate max-w-md">
              {selectedSize}cm · {currentMaterialObj?.name} {selectedMaterial !== 'in-ep-mika' ? `· ${currentFrameObj?.label}` : ''}
              {hasKhungXuongGiaCo && currentReinforcedFrameCostFormatted ? ' (Có Khung Xương)' : ''}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 pt-1 sm:pt-0 shrink-0">
            {/* Copy Button */}
            <button
              onClick={handleCopyCustomerQuote}
              disabled={totalPrice === null}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                copiedCustomer
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-white active:scale-95 disabled:opacity-40'
              }`}
              title="Sao chép báo giá gửi khách hàng"
            >
              {copiedCustomer ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#E7C184]" />
                  <span>Chép Báo Giá</span>
                </>
              )}
            </button>

            {/* Direct Send Zalo Order */}
            <a
              href={generateZaloUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0068FF] hover:bg-[#0052cc] rounded-lg transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-white" />
              <span>Gửi Đặt Zalo</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
