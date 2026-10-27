import React, { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { usePriceMultiplier, applyMultiplier, useIsFreelanceMode } from '../hooks/usePriceMultiplier';
import { getAllMaterialTabs, getMaterialColumns } from '../firebase/dataService';

interface OfficialPricingTablesProps {
  onSelectSizeForCalculator?: (productLine: string, size: string) => void;
  zaloTho: string;
}

export const OfficialPricingTables: React.FC<OfficialPricingTablesProps> = ({
  zaloTho
}) => {
  const { pricing, frames } = useAppData();
  const isRetailView = useIsFreelanceMode();
  const allMaterialTabs = useMemo(() => getAllMaterialTabs(pricing, isRetailView), [pricing, isRetailView]);
  const [activeTab, setActiveTab] = useState<string>(() => allMaterialTabs[0]?.id || 'mika-pho-thong');
  const multiplier = usePriceMultiplier();

  const albumSampleItem = useMemo(() => {
    if (isRetailView) return null;
    return (frames || []).find((f) => {
      const idStr = (f.id || '').toLowerCase();
      const codeStr = (f.code || '').toLowerCase();
      const nameStr = (f.name || '').toLowerCase();
      return (
        idStr.includes('album') ||
        idStr.includes('abum') ||
        codeStr.includes('album') ||
        codeStr.includes('abum') ||
        nameStr.includes('album') ||
        nameStr.includes('abum') ||
        codeStr.includes('photobook') ||
        nameStr.includes('photobook') ||
        nameStr.includes('photobokk')
      );
    }) || null;
  }, [frames, isRetailView]);

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
      ttm: pricing.columnLabels?.ttm || 'Khung nhôm Titan M',
      ttc: pricing.columnLabels?.ttc || 'Khung nhôm Titan C',
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
    if (val === null || val === undefined) {
      return <span className="text-neutral-300">-</span>;
    }
    return (
      <span className="font-mono tabular-nums text-[#1C1917]">
        {val.toLocaleString('vi-VN')} đ
      </span>
    );
  };

  const isHighlighted = (size: string) => {
    return size.includes('60x90') || size.includes('60*90') || size.includes('20x30') || size.includes('20*30') || size.includes('40x60') || size.includes('40*60');
  };

  const activeTabItem = useMemo(() => {
    return allMaterialTabs.find((t: any) => t.id === activeTab) || allMaterialTabs[0];
  }, [allMaterialTabs, activeTab]);

  return (
    <section id="bang-gia-chi-tiet" className="py-6 md:py-12 bg-[#FAF9F5] w-full max-w-full overflow-hidden">
      {/* CSS Keyframes for Fixed Mobile Banner Finger Animation */}
      <style>{`
        @keyframes swipeHandInfinite {
          0%, 100% { transform: translateX(5px); opacity: 0.8; }
          50% { transform: translateX(-5px); opacity: 1; }
        }
        .animate-swipe-hand-infinite {
          animation: swipeHandInfinite 1.2s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 w-full max-w-full">
        
        {/* Header & Controls */}
        <div className="space-y-4 pb-4 border-b border-[#E7E2DA] w-full max-w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 w-full max-w-full">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#936B34]">
                {isRetailView ? 'Bảng Báo Giá Chính Thức 2026' : 'Bảng Giá Chi Tiết 2026'}
              </div>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">
                {isRetailView ? 'Bảng Báo Giá Dịch Vụ Hùng Decor' : 'Toàn Bộ Bảng Giá Sỉ Theo Chất Liệu'}
              </h2>
              <p className="text-xs text-[#57534E] mt-0.5">
                {isRetailView ? (
                  <>Chất lượng hoàn thiện sắc nét chuẩn Lab tại xưởng Hùng <span className="text-[#FF0000] font-bold">Decor</span></>
                ) : (
                  <>Dữ liệu gốc từ xưởng Hùng <span className="text-[#FF0000] font-bold">Decor</span></>
                )}
              </p>
            </div>
          </div>

          {/* Dynamic Material Tabs */}
          <div className={`grid gap-2 w-full max-w-full ${
            allMaterialTabs.length === 2
              ? 'grid-cols-2 max-w-lg'
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
          }`}>
            {allMaterialTabs.map((tab: any, idx: number) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[44px] py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center leading-snug max-w-full ${
                  allMaterialTabs.length > 2 && idx === 4 ? 'col-span-2 sm:col-span-1' : ''
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
          
          {/* DEDICATED HIGH-VISIBILITY FIXED BANNER FOR MOBILE ONLY */}
          <div className="md:hidden bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white py-2 px-3 flex items-center justify-center shadow-sm border-b border-red-700">
            <div className="flex items-center gap-1.5 justify-center">
              <span className="text-lg text-yellow-300 inline-block animate-swipe-hand-infinite font-bold shrink-0 drop-shadow-xs">
                👈
              </span>
              <span className="text-[11px] sm:text-xs font-black tracking-tight text-white uppercase drop-shadow-xs whitespace-nowrap">
                Vuốt sang trái để xem thêm các mẫu khung
              </span>
            </div>
          </div>

          {/* DESKTOP TOP BAR */}
          <div className="hidden md:flex p-3 bg-[#FAF9F5] border-b border-[#E7E2DA] items-center justify-between text-xs text-[#78716C] max-w-full">
            <span>💡 Cột <strong>CỠ ẢNH</strong> được cố định bên trái khi bạn vuốt ngang</span>
            <span className="font-mono font-bold text-[#1C1917] shrink-0 ml-2">Đơn vị: VNĐ</span>
          </div>

          <div className="overflow-x-auto max-w-full relative p-1">
            
            {activeTabItem && (activeTabItem.type === 'goLuaBoVien' || activeTabItem.id === 'go-lua') && (
              <div className="max-w-2xl mx-auto">
                <table className="w-full text-center text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAF9F5] border-b border-[#E7E2DA]">
                      <th className="py-3 px-3.5 text-center text-[#DC2626] font-extrabold text-[1.15em] sticky left-0 bg-[#FAF9F5] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-[#E7E2DA] whitespace-nowrap w-32 min-w-[120px]">
                        Cỡ Ảnh
                      </th>
                      {getMaterialColumns(pricing, activeTabItem.id).map(k => (
                        <th
                          key={k}
                          className="py-3 px-3 text-center whitespace-nowrap min-w-[140px] w-44 text-[#DC2626] font-extrabold text-[1.15em]"
                        >
                          {colLabels[k as keyof typeof colLabels] || pricing.columnLabels?.[k] || k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EBE3]">
                    {activeTabItem.rows.map((row: any) => (
                      <tr key={row.size} className={`hover:bg-[#FCFBF8] ${isHighlighted(row.size) ? 'bg-[#FFFDF9]' : ''}`}>
                        <td className="py-2.5 px-3.5 text-center font-bold font-mono text-[#1C1917] sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-[#E7E2DA] whitespace-nowrap">
                          {row.size}
                        </td>
                        {getMaterialColumns(pricing, activeTabItem.id).map(k => (
                          <td
                            key={k}
                            className="py-2.5 px-3 text-center whitespace-nowrap font-semibold text-[#1C1917]"
                          >
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
                    <tr className="bg-[#FAF9F5] border-b border-[#E7E2DA]">
                      <th className="py-3 px-3.5 text-center text-[#DC2626] font-extrabold text-[1.15em] sticky left-0 bg-[#FAF9F5] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-[#E7E2DA] whitespace-nowrap w-32 min-w-[120px]">
                        Cỡ Ảnh
                      </th>
                      {getMaterialColumns(pricing, activeTabItem.id).map(k => (
                        <th
                          key={k}
                          className="py-3 px-3 text-center whitespace-nowrap min-w-[130px] w-40 text-[#DC2626] font-extrabold text-[1.15em]"
                        >
                          {colLabels[k as keyof typeof colLabels] || pricing.columnLabels?.[k] || k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EBE3]">
                    {activeTabItem.rows.map((row: any) => (
                      <tr key={row.size} className={`hover:bg-[#FCFBF8] ${isHighlighted(row.size) ? 'bg-[#FFFDF9]' : ''}`}>
                        <td className="py-2.5 px-3.5 text-center font-bold font-mono text-[#1C1917] sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-[#E7E2DA] whitespace-nowrap">
                          {row.size}
                        </td>
                        {getMaterialColumns(pricing, activeTabItem.id).map(k => (
                          <td
                            key={k}
                            className="py-2.5 px-3 text-center whitespace-nowrap font-semibold text-[#1C1917]"
                          >
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
                      <tr className="bg-[#FAF9F5] border-b border-[#E7E2DA]">
                        <th className="py-3 px-3.5 text-center text-[#DC2626] font-extrabold text-[1.15em] sticky left-0 bg-[#FAF9F5] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-[#E7E2DA] whitespace-nowrap w-32 min-w-[120px]">
                          Kích Thước
                        </th>
                        {getMaterialColumns(pricing, activeTabItem.id).map(k => (
                          <th
                            key={k}
                            className="py-3 px-3 text-center whitespace-nowrap min-w-[130px] w-40 text-[#DC2626] font-extrabold text-[1.15em]"
                          >
                            {colLabels[k as keyof typeof colLabels] || pricing.columnLabels?.[k] || k}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EBE3]">
                      {activeTabItem.rows.map((row: any) => (
                        <tr key={row.stt || row.size} className={`hover:bg-[#FCFBF8] ${isHighlighted(row.size) ? 'bg-[#FFFDF9]' : ''}`}>
                          <td className="py-2.5 px-3.5 text-center font-bold font-mono text-[#1C1917] sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-[#E7E2DA] whitespace-nowrap">
                            {row.size}
                          </td>
                          {getMaterialColumns(pricing, activeTabItem.id).map(k => (
                            <td
                              key={k}
                              className="py-2.5 px-3 text-center whitespace-nowrap font-semibold text-[#1C1917]"
                            >
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

            {!isRetailView && activeTabItem && (activeTabItem.type === 'album' || activeTabItem.id === 'anh-4k' || activeTabItem.id === 'album') && (
              <div className="space-y-4 p-2 sm:p-4">
                <div className="max-w-2xl mx-auto border border-[#E7E2DA] rounded-xl overflow-hidden">
                  <table className="w-full text-center text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FAF9F5] border-b border-[#E7E2DA]">
                        <th className="py-3 px-3.5 text-center text-[#DC2626] font-extrabold text-[1.15em] sticky left-0 bg-[#FAF9F5] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-[#E7E2DA] whitespace-nowrap w-32 min-w-[120px]">
                          Kích Thước
                        </th>
                        <th className="py-3 px-3 text-center text-[#DC2626] font-extrabold text-[1.15em] whitespace-nowrap min-w-[140px] w-44">
                          Đơn Giá
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EBE3]">
                      {activeTabItem.rows.map((row: any) => (
                        <tr key={row.size} className={`hover:bg-[#FCFBF8] ${isHighlighted(row.size) ? 'bg-[#FFFDF9]' : ''}`}>
                          <td className="py-2.5 px-3.5 text-center font-bold font-mono text-[#1C1917] sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-[#E7E2DA] whitespace-nowrap">
                            {row.size}
                          </td>
                          <td className="py-2.5 px-3 text-center font-semibold text-[#1C1917] whitespace-nowrap">
                            {formatPrice(applyMultiplier(row.donGia ?? row.price, multiplier))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Khối ảnh mẫu thực tế & quy cách kỹ thuật dòng Album - Photobook dành riêng cho Bảng Giá Sỉ Studio */}
                <div className="max-w-4xl mx-auto bg-[#FAF9F5] border border-[#E7E2DA] rounded-2xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {albumSampleItem && albumSampleItem.images && albumSampleItem.images.length > 0 && (
                    <div className="md:col-span-5">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900 border border-[#EFEAE2]">
                        <img
                          src={encodeURI(albumSampleItem.images[0].url)}
                          alt={albumSampleItem.name}
                          className="w-full h-full object-cover object-center"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}
                  <div className={albumSampleItem && albumSampleItem.images && albumSampleItem.images.length > 0 ? 'md:col-span-7 space-y-2' : 'md:col-span-12 space-y-2'}>
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#936B34]">
                      Quy Cách Kỹ Thuật Dòng Album – Photobook Tại Xưởng
                    </div>
                    <h4 className="font-serif-display text-base sm:text-lg font-bold text-[#1C1917]">
                      {albumSampleItem?.name || 'Album – Photobook Mở Phẳng 180 Độ Cao Cấp'}
                    </h4>
                    <p className="text-xs text-[#57534E] leading-relaxed">
                      {albumSampleItem?.description || 'Dạng album mở phẳng hiện đại & sang trọng, in chuẩn màu Lab sắc nét.'}
                    </p>
                    <ul className="text-xs text-[#57534E] space-y-1 pt-1">
                      <li>• <strong>Quy cách bìa:</strong> Bìa cứng bọc da / bìa Mika tràn lề / bìa tạp chí sang trọng, chống cong vênh.</li>
                      <li>• <strong>Quy cách gáy & ruột:</strong> Đóng gáy mở phẳng 180 độ không gãy gáy, ghép trang liền mạch cho ảnh phóng ngang.</li>
                      <li>• <strong>Hoàn thiện bề mặt:</strong> Cán màng bảo vệ chống ẩm mốc, chống bám vân tay, độ bền màu lâu dài cho Studio.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};
