import React, { useState } from 'react';
import { Camera, Ruler } from 'lucide-react';
import { FrameConstantItem, EXACT_FRAME_PATHS } from '../constants/frames';
import { FrameSpecItem } from '../types';

interface FrameCardProps {
  frame: FrameConstantItem | FrameSpecItem;
  isSelected?: boolean;
  onSelect?: (frame: FrameConstantItem | FrameSpecItem) => void;
  onViewDetails?: (frame: FrameConstantItem | FrameSpecItem) => void;
  className?: string;
}

export const FrameCard: React.FC<FrameCardProps> = ({
  frame,
  isSelected = false,
  onSelect,
  onViewDetails,
  className = ''
}) => {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const exactPath = EXACT_FRAME_PATHS[frame.code] || EXACT_FRAME_PATHS[frame.code?.toUpperCase()];

  const images = frame.images && frame.images.length > 0
    ? frame.images
    : exactPath || (frame as FrameConstantItem).imageUrl || (frame as FrameConstantItem).image
      ? [
          {
            name: frame.name,
            url: exactPath || (frame as FrameConstantItem).imageUrl || (frame as FrameConstantItem).image || ''
          }
        ]
      : [];

  const currentImage = images[selectedVariantIdx] || images[0];
  const rawUrl = currentImage?.url || exactPath || (frame as FrameConstantItem).imageUrl || '';
  const hasReal = Boolean(rawUrl);

  return (
    <div
      className={`bg-[#FAF9F5] rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all space-y-3 shadow-xs group cursor-pointer ${
        isSelected ? 'border-[#936B34] ring-2 ring-[#936B34]' : 'border-[#E7E2DA] hover:border-[#936B34]'
      } ${className}`}
      onClick={() => {
        if (onSelect) onSelect(frame);
        if (onViewDetails) onViewDetails(frame);
      }}
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#EFEAE2] gap-1.5 flex-wrap">
          <span className="font-mono text-xs sm:text-sm font-bold bg-[#1C1917] text-[#E7C184] px-2.5 py-1 rounded shadow-xs shrink-0">
            {frame.code}
          </span>
          {hasReal ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
              <Camera className="w-3 h-3 text-emerald-700" />
              <span>Ảnh Thật {images.length > 1 ? `(${images.length} màu)` : ''}</span>
            </span>
          ) : (
            <span className="text-xs font-mono font-bold text-[#936B34] shrink-0">
              {frame.dimensions}
            </span>
          )}
        </div>

        {/* Thumbnail or Technical Simulation Placeholder */}
        {hasReal ? (
          <div className="mt-3 space-y-2">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900 border border-[#EFEAE2]">
              <img
                src={encodeURI(rawUrl)}
                alt={`${frame.name} - ${currentImage?.name || ''}`}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Color Switchers if available */}
            {images.length > 1 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5" onClick={(e) => e.stopPropagation()}>
                <span className="text-[10px] font-mono text-[#78716C] mr-0.5">Màu:</span>
                {images.map((img, vIdx) => (
                  <button
                    key={img.url}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVariantIdx(vIdx);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                      selectedVariantIdx === vIdx
                        ? 'bg-[#1C1917] text-[#E7C184] ring-1 ring-[#936B34]'
                        : 'bg-[#EFEAE2] text-[#57534E] hover:bg-[#E5DDCF]'
                    }`}
                  >
                    {img.colorHex && (
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0 inline-block"
                        style={{ backgroundColor: img.colorHex }}
                      />
                    )}
                    <span>{img.name.split(': ')[1] || img.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-3 relative aspect-[4/3] rounded-xl overflow-hidden bg-[#EFEAE2]/60 border border-dashed border-[#D5CDBD] flex flex-col items-center justify-center text-center p-3">
            <Ruler className="w-7 h-7 text-[#936B34]/70 mb-1" />
            <span className="text-xs font-bold text-[#1C1917] font-mono">{frame.dimensions}</span>
            <span className="text-[10px] text-[#78716C] mt-0.5">Mô phỏng kỹ thuật Hùng Decor</span>
          </div>
        )}

        {/* Text Details */}
        <div className="pt-2.5 space-y-1.5">
          <h3 className="font-serif-display font-bold text-sm sm:text-base text-[#1C1917] group-hover:text-[#936B34] transition-colors">
            {frame.name}
          </h3>
          <div className="text-[11px] font-mono font-semibold text-[#936B34]">
            {frame.dimensions}
          </div>
          <p className="text-xs text-[#57534E] leading-relaxed">
            {frame.description}
          </p>
        </div>
      </div>

      <div className="pt-2.5 border-t border-[#EFEAE2] w-full">
        <div className="text-xs text-[#78716C]">
          <div>Màu sắc: <strong className="text-[#1C1917] font-normal">{frame.variants}</strong></div>
        </div>
      </div>
    </div>
  );
};

export default FrameCard;
