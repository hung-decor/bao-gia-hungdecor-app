import React, { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { usePriceMultiplier, applyMultiplier } from '../hooks/usePriceMultiplier';
import { Calculator, Copy, Check, MessageCircle, ChevronDown, Camera } from 'lucide-react';
import { getAllMaterialTabs } from '../firebase/dataService';

interface MobileQuickQuoterProps {
  zaloTho: string;
}

export const MobileQuickQuoter: React.FC<MobileQuickQuoterProps> = ({ zaloTho }) => {
  const { pricing } = useAppData();
  const allMaterialTabs = useMemo(() => getAllMaterialTabs(pricing), [pricing]);

  // All standard sizes sorted and derived dynamically from active pricing datasets
  const allAvailableSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    allMaterialTabs.forEach((t: any) => {
      t.rows.forEach((r: any) => r.size && sizeSet.add(r.size));
    });

    if (sizeSet.size === 0) {
      return [{ size: '60x90', label: '60x90' }];
    }
    return Array.from(sizeSet).map(s => ({ size: s, label: s }));
  }, [allMaterialTabs]);

  // Material options derived dynamically from active material tabs
  const materialOptions = useMemo(() => {
    return allMaterialTabs.map((t: any) => ({
      id: t.id,
      name: t.title,
      badge: t.id === 'hd-guong-sieu-bong' ? 'Khuyên Dùng' : undefined
    }));
  }, [allMaterialTabs]);

  // Step 1: Kích thước - Mặc định 60x90
  const [selectedSize, setSelectedSize] = useState<string>('60x90');

  // Step 2: Chất liệu - Mặc định HD gương siêu bóng hoặc tab đầu tiên
  const [selectedMaterial, setSelectedMaterial] = useState<string>(() => allMaterialTabs[0]?.id || 'hd-guong-sieu-bong');

  // Keep selectedMaterial valid
  React.useEffect(() => {
    if (allMaterialTabs.length > 0 && !allMaterialTabs.some((m: any) => m.id === selectedMaterial)) {
      setSelectedMaterial(allMaterialTabs[0].id);
    }
  }, [allMaterialTabs, selectedMaterial]);

  // Step 3: Loại khung - Mặc định Chỉ bo viền (Không Khung)
  const [selectedFrame, setSelectedFrame] = useState<string>('boVien');

  // Copy status
  const [copiedCustomer, setCopiedCustomer] = useState<boolean>(false);

  const selectedTabItem = useMemo(() => {
    return allMaterialTabs.find((t: any) => t.id === selectedMaterial) || allMaterialTabs[0];
  }, [allMaterialTabs, selectedMaterial]);

  const frameOptions = useMemo(() => {
    const col = pricing.columnLabels;
    if (selectedTabItem?.type === 'inEpMika') {
      const keys = pricing.inEpColumnKeys || ['inAnh', 'inEpLua', 'inEpMikaCol', 'inEpPlastic', 'khungGiaCo'];
      return keys.map(k => ({
        id: k === 'inEpMikaCol' ? 'inEpMika' : k,
        label: col?.[k] || k
      }));
    }

    if (selectedTabItem?.type === 'anh4K') {
      return [
        { id: 'k4_k6', label: col?.k4_k6 || 'Khung HT10' },
        { id: 'titan2', label: col?.titan2 || 'Khung nhôm Titan C' }
      ];
    }

    const keys = pricing.frameColumnKeys || ['boVien', 'k0_k3', 'k4_k6', 'k10', 'k11', 'titan1', 'titan2'];
    return keys.map(k => {
      let labelTitle = col?.[k] || k;
      if (k === 'boVien') {
        labelTitle = col?.boVien ? `Chỉ ${col.boVien} (Không Khung)` : 'Chỉ Bo Viền (Không Khung)';
      }
      return {
        id: k,
        label: labelTitle
      };
    });
  }, [selectedTabItem, pricing.columnLabels, pricing.frameColumnKeys, pricing.inEpColumnKeys]);

  // Adjust selected frame if not valid for selected material
  React.useEffect(() => {
    const validIds = frameOptions.map(f => f.id);
    if (!validIds.includes(selectedFrame)) {
      setSelectedFrame(validIds[0]);
    }
  }, [frameOptions, selectedFrame]);

  const multiplier = usePriceMultiplier();

  // Calculate Base Price
  const rawBasePrice = useMemo<number | null>(() => {
    if (!selectedTabItem || !selectedTabItem.rows) return null;
    const row = selectedTabItem.rows.find((r: any) => r.size && r.size.replace('*', 'x') === selectedSize.replace('*', 'x'));
    if (!row) return null;
    return (row as any)[selectedFrame] ?? null;
  }, [selectedTabItem, selectedSize, selectedFrame]);

  const totalPrice = useMemo<number | null>(() => {
    if (rawBasePrice === null || rawBasePrice === 0) return null;
    return applyMultiplier(rawBasePrice, multiplier);
  }, [rawBasePrice, multiplier]);

  const currentMaterialObj = materialOptions.find((m: any) => m.id === selectedMaterial);
  const currentFrameObj = frameOptions.find(f => f.id === selectedFrame);

  // Copy customer-facing quote
  const handleCopyCustomerQuote = () => {
    const frameLabel = ` - ${currentFrameObj?.label}`;
    const priceDisplay = totalPrice !== null ? `${totalPrice.toLocaleString('vi-VN')} đ` : 'Liên hệ xưởng';
    const text = `Báo giá ảnh ${selectedSize}cm: ${currentMaterialObj?.name}${frameLabel}: ${priceDisplay}`;
    navigator.clipboard.writeText(text);
    setCopiedCustomer(true);
    setTimeout(() => setCopiedCustomer(false), 2000);
  };

  const generateZaloUrl = () => {
    const frameLabel = `\n- Quy cách / Khung: ${currentFrameObj?.label}`;
    const priceStr = totalPrice !== null ? `${totalPrice.toLocaleString('vi-VN')} đ` : 'Liên hệ xưởng';
    const text = `Hùng Decor ơi, mình đặt file:\n- Size: ${selectedSize}\n- Loại: ${currentMaterialObj?.name}${frameLabel}\n- Giá sỉ: ${priceStr}\nNhờ xưởng kiểm tra file và báo giá nhé!`;
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
                {materialOptions.map((m: any) => (
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
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold text-amber-400 font-sans tracking-tight">
                    Liên hệ xưởng
                  </span>
                  <span className="text-[11px] text-amber-200/90 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 font-sans">
                    Chưa có giá cố định
                  </span>
                </div>
              )}
            </div>
            <div className="text-[11px] text-neutral-400 truncate max-w-md">
              {selectedSize}cm · {currentMaterialObj?.name} · {currentFrameObj?.label}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 pt-1 sm:pt-0 shrink-0">
            {/* Copy Button */}
            <button
              onClick={handleCopyCustomerQuote}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                copiedCustomer
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-white active:scale-95'
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
