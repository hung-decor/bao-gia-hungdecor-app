import React, { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { usePriceMultiplier, applyMultiplier } from '../hooks/usePriceMultiplier';
import { MaterialTabId } from '../types';
import { Search } from 'lucide-react';
import { getAllMaterialTabs, getMaterialColumns } from '../firebase/dataService';

interface OfficialPricingTablesProps {
  onSelectSizeForCalculator?: (productLine: string, size: string) => void;
  zaloTho: string;
}

export const OfficialPricingTables: React.FC<OfficialPricingTablesProps> = ({
  zaloTho
}) => {
  const { pricing } = useAppData();
  const allMaterialTabs = useMemo(() => getAllMaterialTabs(pricing), [pricing]);
  const [activeTab, setActiveTab] = useState<string>(() => allMaterialTabs[0]?.id || 'mika-pho-thong');
  const [searchSize, setSearchSize] = useState<string>('');
  const multiplier = usePriceMultiplier();

  // Keep activeTab valid if material tabs change
  React.useEffect(() => {
    if (allMaterialTabs.length > 0 && !allMaterialTabs.some((t: any) => t.id === activeTab)) {
      setActiveTab(allMaterialTabs[0].id);
    }
  }, [allMaterialTabs, activeTab]);

  const colLabels = useMemo(() => {
    return {
      boVien: pricing.columnLabels?.boVien || 'Bo Viền',
      kx: pricing.columnLabels?.kx || 'Khung KX',
      ht10: pricing.columnLabels?.ht10 || 'Khung HT10',
      k12: pricing.columnLabels?.k12 || 'Khung K12',
      b25: pricing.columnLabels?.b25 || 'Bản khung 2.5cm',
      b4: pricing.columnLabels?.b4 || 'Bản khung 4cm',
      b8: pricing.columnLabels?.b8 || 'Bản khung 8cm',
      b10: pricing.columnLabels?.b10 || 'Khung bản 10cm',
      titan1: pricing.columnLabels?.titan1 || 'Khung nhôm Titan M',
      titan2: pricing.columnLabels?.titan2 || 'Khung nhôm Titan C',
      // Legacy fallback keys
      k0_k3: pricing.columnLabels?.k0_k3 || 'Khung KX',
      k4_k6: pricing.columnLabels?.k4_k6 || 'Khung HT10',
      k10: pricing.columnLabels?.k10 || 'Khung K12',
      k11: pricing.columnLabels?.k11 || 'Khung bản 10cm',
      inAnh: pricing.columnLabels?.inAnh || 'In Ảnh',
      inEpLua: pricing.columnLabels?.inEpLua || 'In Ép Lụa',
      inEpMikaCol: pricing.columnLabels?.inEpMikaCol || 'In Ép Mika',
      inEpPlastic: pricing.columnLabels?.inEpPlastic || 'In Ép Plastic',
      khungGiaCo: pricing.columnLabels?.khungGiaCo || 'Giá Khung Gia Cố',
    };
  }, [pricing.columnLabels]);

  const formatPrice = (val: number | null) => {
    if (val === null || val === undefined) return <span className="text-neutral-300">-</span>;
    return <span className="font-mono tabular-nums">{val.toLocaleString('vi-VN')} đ</span>;
  };

  const isHighlighted = (size: string) => {
    return size.includes('60x90') || size.includes('60*90') || size.includes('20x30') || size.includes('20*30') || size.includes('40x60') || size.includes('40*60');
  };

  const matchesSearch = (size: string) => {
    if (!searchSize.trim()) return true;
    return size.toLowerCase().includes(searchSize.toLowerCase().trim());
  };

  const activeTabItem = useMemo(() => {
    return allMaterialTabs.find((t: any) => t.id === activeTab) || allMaterialTabs[0];
  }, [allMaterialTabs, activeTab]);

  const activeColumnsCount = useMemo(() => {
    return activeTabItem ? getMaterialColumns(pricing, activeTabItem.id).length : 0;
  }, [pricing, activeTabItem]);

  // Swipe Gesture Guide State
  const [showSwipeGuide, setShowSwipeGuide] = useState<boolean>(true);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Re-trigger gesture guide when switching activeTab if table has > 2 columns
  React.useEffect(() => {
    if (activeColumnsCount > 2) {
      setShowSwipeGuide(true);
      const timer = setTimeout(() => {
        setShowSwipeGuide(false);
      }, 9000); // 9 seconds
      return () => clearTimeout(timer);
    } else {
      setShowSwipeGuide(false);
    }
  }, [activeTab, activeColumnsCount]);

  const handleTableScroll = () => {
    if (scrollContainerRef.current) {
      if (scrollContainerRef.current.scrollLeft > 25) {
        setShowSwipeGuide(false);
      }
    }
  };

  const handleTouchStart = () => {
    setShowSwipeGuide(false);
  };

  return (
    <section id="bang-gia-chi-tiet" className="py-6 md:py-12 bg-[#FAF9F5] w-full max-w-full overflow-hidden">
      {/* CSS Keyframes for Upgraded Swipe Gesture Simulation */}
      <style>{`
        @keyframes swipeLeftMotion {
          0% {
            transform: translateX(80px);
            opacity: 0.1;
          }
          20% {
            transform: translateX(80px);
            opacity: 1;
          }
          75% {
            transform: translateX(-80px);
            opacity: 1;
          }
          100% {
            transform: translateX(-80px);
            opacity: 0.1;
          }
        }
        @keyframes trailGlowPulse {
          0% {
            width: 10px;
            opacity: 0.2;
            transform: translateX(70px);
          }
          40% {
            width: 140px;
            opacity: 0.9;
            transform: translateX(0px);
          }
          100% {
            width: 10px;
            opacity: 0.1;
            transform: translateX(-70px);
          }
        }
        .animate-swipe-hand-long {
          animation: swipeLeftMotion 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-trail-glow {
          animation: trailGlowPulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 w-full max-w-full">
        
        {/* Header & Controls */}
        <div className="space-y-4 pb-4 border-b border-[#E7E2DA] w-full max-w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 w-full max-w-full">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#936B34]">
                Bảng Giá Chi Tiết 2026
              </div>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">
                Toàn Bộ Bảng Giá Sỉ Theo Chất Liệu
              </h2>
              <p className="text-xs text-[#57534E] mt-0.5">
                Dữ liệu gốc từ xưởng Hùng <span className="text-[#FF0000] font-bold">Decor</span>
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64 max-w-full">
              <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Lọc cỡ ảnh (60x90, 20x30)..."
                value={searchSize}
                onChange={(e) => setSearchSize(e.target.value)}
                className="w-full max-w-full h-11 pl-9 pr-3 text-xs bg-white border border-[#E7E2DA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#936B34] shadow-xs"
              />
            </div>
          </div>

          {/* Dynamic Material Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 w-full max-w-full">
            {allMaterialTabs.map((tab: any, idx: number) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[44px] py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-snug max-w-full ${
                  idx === 4 ? 'col-span-2 sm:col-span-1' : ''
                } ${
                  activeTab === tab.id
                    ? 'bg-[#1C1917] text-white shadow-xs'
                    : 'bg-[#EFEAE2] text-[#57534E] hover:text-[#1C1917] hover:bg-[#E5DDCF]'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* DẠNG BẢNG DUY NHẤT (STICKY CỘT CỠ ẢNH BÊN TRÁI)               */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-2xl border border-[#E7E2DA] overflow-hidden shadow-xs w-full max-w-full relative">
          
          <div className="p-3 bg-[#FAF9F5] border-b border-[#E7E2DA] flex items-center justify-between text-xs text-[#78716C] max-w-full">
            <span>💡 Cột <strong>CỠ ẢNH</strong> được cố định bên trái khi bạn vuốt ngang</span>
            <span className="font-mono font-bold text-[#1C1917] shrink-0 ml-2">Đơn vị: VNĐ</span>
          </div>

          {/* UPGRADED SWIPE GESTURE GUIDE OVERLAY (MOBILE ONLY, POINTER-EVENTS-NONE) */}
          {showSwipeGuide && activeColumnsCount > 2 && (
            <div
              className="md:hidden pointer-events-none absolute inset-x-0 top-10 z-30 flex flex-col justify-center items-center px-3 transition-all duration-500 ease-out animate-in fade-in zoom-in-95"
            >
              {/* Hand Icon & Light Trail Container */}
              <div className="relative flex items-center justify-center h-14 w-full max-w-xs mb-1">
                {/* Glowing light trail */}
                <div className="absolute h-2.5 bg-gradient-to-l from-red-500/80 via-amber-400/90 to-transparent rounded-full animate-trail-glow shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                
                {/* Large Neon Red Finger Hand */}
                <div className="animate-swipe-hand-long text-4xl text-[#EF4444] filter drop-shadow-[0_0_12px_rgba(239,68,68,0.9)] shrink-0 select-none">
                  👈
                </div>
              </div>

              {/* Notification Card */}
              <div className="bg-slate-900/95 border-2 border-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.4)] text-white px-3.5 py-2 rounded-2xl backdrop-blur-md flex items-center justify-between gap-2 max-w-xs w-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-red-500 font-black text-sm animate-pulse">👈</span>
                  <span className="text-[11px] sm:text-xs font-black text-amber-300 uppercase tracking-tight whitespace-nowrap">
                    VUỐT SANG TRÁI ĐỂ XEM THÊM CỘT KHUNG
                  </span>
                </div>

                {/* Dismiss Button with pointer-events-auto */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSwipeGuide(false);
                  }}
                  className="pointer-events-auto bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md transition-all shrink-0 cursor-pointer border border-red-400/50"
                  title="Tắt hướng dẫn"
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          )}

          <div
            ref={scrollContainerRef}
            onScroll={handleTableScroll}
            onTouchStart={handleTouchStart}
            className="overflow-x-auto max-w-full relative p-1"
          >
            
            {activeTabItem && (activeTabItem.type === 'goLuaBoVien' || activeTabItem.id === 'go-lua') && (
              <div className="max-w-2xl mx-auto">
                <table className="w-full text-center text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAF9F5] border-b border-[#E7E2DA] text-[#57534E]">
                      <th className="py-3 px-3.5 text-center font-bold text-[#1C1917] sticky left-0 bg-[#FAF9F5] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-[#E7E2DA] whitespace-nowrap w-32 min-w-[120px]">
                        Cỡ Ảnh
                      </th>
                      {getMaterialColumns(pricing, activeTabItem.id).map(k => (
                        <th key={k} className="py-3 px-3 text-center font-bold text-[#1C1917] whitespace-nowrap min-w-[140px] w-44">
                          {colLabels[k as keyof typeof colLabels] || pricing.columnLabels?.[k] || k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EBE3]">
                    {activeTabItem.rows.filter((r: any) => matchesSearch(r.size)).map((row: any) => (
                      <tr key={row.size} className={`hover:bg-[#FCFBF8] ${isHighlighted(row.size) ? 'bg-[#FFFDF9]' : ''}`}>
                        <td className="py-2.5 px-3.5 text-center font-bold font-mono text-[#1C1917] sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-[#E7E2DA] whitespace-nowrap">
                          {row.size}
                        </td>
                        {getMaterialColumns(pricing, activeTabItem.id).map(k => (
                          <td key={k} className="py-2.5 px-3 text-center font-bold text-[#1C1917] whitespace-nowrap">
                            {formatPrice(applyMultiplier(row[k], multiplier))}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTabItem && (activeTabItem.type === 'dongKhung' || activeTabItem.isCustom) && activeTabItem.id !== 'go-lua' && activeTabItem.type !== 'inEpMika' && activeTabItem.type !== 'album' && (
              <div className={getMaterialColumns(pricing, activeTabItem.id).length <= 2 ? "max-w-2xl mx-auto" : ""}>
                <table className="w-full text-center text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAF9F5] border-b border-[#E7E2DA] text-[#57534E]">
                      <th className="py-3 px-3.5 text-center font-bold text-[#1C1917] sticky left-0 bg-[#FAF9F5] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-[#E7E2DA] whitespace-nowrap w-32 min-w-[120px]">
                        Cỡ Ảnh
                      </th>
                      {getMaterialColumns(pricing, activeTabItem.id).map(k => (
                        <th key={k} className="py-3 px-3 text-center font-bold text-[#1C1917] whitespace-nowrap min-w-[130px] w-40">
                          {colLabels[k as keyof typeof colLabels] || pricing.columnLabels?.[k] || k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EBE3]">
                    {activeTabItem.rows.filter((r: any) => matchesSearch(r.size)).map((row: any) => (
                      <tr key={row.size} className={`hover:bg-[#FCFBF8] ${isHighlighted(row.size) ? 'bg-[#FFFDF9]' : ''}`}>
                        <td className="py-2.5 px-3.5 text-center font-bold font-mono text-[#1C1917] sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-[#E7E2DA] whitespace-nowrap">
                          {row.size}
                        </td>
                        {getMaterialColumns(pricing, activeTabItem.id).map(k => (
                          <td key={k} className="py-2.5 px-3 text-center font-semibold text-[#1C1917] whitespace-nowrap">
                            {formatPrice(applyMultiplier(row[k], multiplier))}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTabItem && activeTabItem.type === 'inEpMika' && (
              <div className="space-y-3">
                <div className="p-3 bg-[#FFFDF9] border-b border-[#E7E2DA] flex items-center gap-2 text-xs text-[#57534E]">
                  <span className="text-[#936B34] font-bold text-sm shrink-0">💡</span>
                  <span>
                    Bảng giá in ảnh Lab, in ép lụa, in ép Mika, ép Plastic và Khung xương gia cố chịu lực của xưởng Hùng Decor.
                  </span>
                </div>

                <div className={getMaterialColumns(pricing, activeTabItem.id).length <= 2 ? "max-w-2xl mx-auto" : ""}>
                  <table className="w-full text-center text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FAF9F5] border-b border-[#E7E2DA] text-[#57534E]">
                        <th className="py-3 px-3.5 text-center font-bold text-[#1C1917] sticky left-0 bg-[#FAF9F5] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-[#E7E2DA] whitespace-nowrap w-32 min-w-[120px]">
                          Kích Thước
                        </th>
                        {getMaterialColumns(pricing, activeTabItem.id).map(k => (
                          <th key={k} className="py-3 px-3 text-center font-bold text-[#1C1917] whitespace-nowrap min-w-[130px] w-40">
                            {colLabels[k as keyof typeof colLabels] || pricing.columnLabels?.[k] || k}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EBE3]">
                      {activeTabItem.rows.filter((r: any) => matchesSearch(r.size)).map((row: any) => (
                        <tr key={row.stt || row.size} className={`hover:bg-[#FCFBF8] ${isHighlighted(row.size) ? 'bg-[#FFFDF9]' : ''}`}>
                          <td className="py-2.5 px-3.5 text-center font-bold font-mono text-[#1C1917] sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-[#E7E2DA] whitespace-nowrap">
                            {row.size}
                          </td>
                          {getMaterialColumns(pricing, activeTabItem.id).map(k => (
                            <td key={k} className="py-2.5 px-3 text-center font-semibold text-[#1C1917] whitespace-nowrap">
                              {formatPrice(applyMultiplier(row[k] ?? (k === 'inEpMikaCol' ? row.inEpMika : null), multiplier))}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTabItem && (activeTabItem.type === 'album' || activeTabItem.id === 'anh-4k' || activeTabItem.id === 'album') && (
              <div className="max-w-2xl mx-auto">
                <table className="w-full text-center text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAF9F5] border-b border-[#E7E2DA] text-[#57534E]">
                      <th className="py-3 px-3.5 text-center font-bold text-[#1C1917] sticky left-0 bg-[#FAF9F5] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-[#E7E2DA] whitespace-nowrap w-32 min-w-[120px]">
                        Kích Thước
                      </th>
                      <th className="py-3 px-3 text-center font-bold text-[#1C1917] whitespace-nowrap min-w-[140px] w-44">
                        Đơn Giá
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EBE3]">
                    {activeTabItem.rows.filter((r: any) => matchesSearch(r.size)).map((row: any) => (
                      <tr key={row.size} className={`hover:bg-[#FCFBF8] ${isHighlighted(row.size) ? 'bg-[#FFFDF9]' : ''}`}>
                        <td className="py-2.5 px-3.5 text-center font-bold font-mono text-[#1C1917] sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-[#E7E2DA] whitespace-nowrap">
                          {row.size}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#1C1917] whitespace-nowrap">
                          {formatPrice(applyMultiplier(row.donGia ?? row.price, multiplier))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};
