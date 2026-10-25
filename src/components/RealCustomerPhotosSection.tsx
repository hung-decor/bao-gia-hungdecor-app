import React, { useState, useEffect } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2, Image as ImageIcon } from 'lucide-react';

export const RealCustomerPhotosSection: React.FC = () => {
  const { realPhotos } = useAppData();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const activePhoto = lightboxIndex !== null ? realPhotos[lightboxIndex] : null;

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex === null || realPhotos.length === 0) return;
    setLightboxIndex((prev) => (prev === 0 ? realPhotos.length - 1 : (prev as number) - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex === null || realPhotos.length === 0) return;
    setLightboxIndex((prev) => (prev === realPhotos.length - 1 ? 0 : (prev as number) + 1));
  };

  const handleClose = () => {
    setLightboxIndex(null);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, realPhotos.length]);

  if (!realPhotos || realPhotos.length === 0) {
    return null;
  }

  return (
    <section id="anh-thuc-te" className="py-8 sm:py-12 md:py-16 bg-[#FAF9F5] border-t border-[#E7E2DA] w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 w-full max-w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EFEB] border border-[#E2D4C0] text-[#936B34] text-xs font-bold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>Thư Viện Sản Phẩm Mẫu</span>
          </div>
          <h2 className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1917] tracking-tight">
            Ảnh Thực Tế Của Khách
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E]">
            Sản phẩm khung & in ảnh hoàn thiện được chụp trực tiếp tại xưởng Hùng Decor & gửi từ studio đối tác (Chạm/bấm vào ảnh để phóng to toàn màn hình)
          </p>
        </div>

        {/* Photos Grid: 3 cols on PC, 2 cols on Mobile, Aspect 2:3 vertical */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-full">
          {realPhotos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              onClick={() => setLightboxIndex(idx)}
              className="group cursor-pointer rounded-2xl border border-[#E7E2DA] overflow-hidden bg-[#1C1917] relative aspect-[2/3] shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image with hover zoom */}
              <img
                src={photo.url}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
              />

              {/* Gradient overlay on hover/tap */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-3 sm:p-4 flex flex-col justify-end text-white transition-opacity duration-300">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  <Maximize2 className="w-4 h-4" />
                </div>
                
                <h3 className="font-serif-display font-bold text-xs sm:text-sm md:text-base text-white line-clamp-2 leading-snug drop-shadow-md">
                  {photo.title}
                </h3>
                {photo.caption && (
                  <p className="text-[11px] sm:text-xs text-neutral-300 line-clamp-2 mt-1 font-sans drop-shadow-xs">
                    {photo.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Fullscreen Modal */}
      {lightboxIndex !== null && activePhoto && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 select-none"
        >
          {/* Close Button ✕ (Top Right) */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 z-50 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 border border-white/25 text-white flex items-center justify-center transition-colors shadow-2xl active:scale-90 cursor-pointer"
            title="Đóng (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Arrow Button < */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center shadow-2xl transition-all active:scale-90 cursor-pointer"
            title="Ảnh trước (<)"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Next Arrow Button > */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center shadow-2xl transition-all active:scale-90 cursor-pointer"
            title="Ảnh tiếp (>)"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Center Content Box */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full max-h-full flex flex-col items-center justify-center relative space-y-3 p-1"
          >
            {/* Enlarged Photo */}
            <div className="relative flex items-center justify-center max-h-[75vh] sm:max-h-[80vh] overflow-hidden">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                className="max-h-[75vh] sm:max-h-[80vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </div>

            {/* Bottom Caption & Counter Bar */}
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl px-4 py-3 text-center max-w-xl w-full shadow-2xl space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#E7C184] font-bold">
                Ảnh {lightboxIndex + 1} / {realPhotos.length}
              </div>
              <h3 className="font-serif-display font-bold text-sm sm:text-base text-white">
                {activePhoto.title}
              </h3>
              {activePhoto.caption && (
                <p className="text-xs text-neutral-300">
                  {activePhoto.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
