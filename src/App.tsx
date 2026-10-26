/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import { B2BHeader } from './components/B2BHeader';
import { B2BHeroBar } from './components/B2BHeroBar';
import { OfficialPricingTables } from './components/OfficialPricingTables';
import { FrameReferenceGuide } from './components/FrameReferenceGuide';
import { RealCustomerPhotosSection } from './components/RealCustomerPhotosSection';
import { B2BGuidelinesSection } from './components/B2BGuidelinesSection';
import { B2BFooter } from './components/B2BFooter';
import { B2BStickyMobileBar } from './components/B2BStickyMobileBar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useIsFreelanceMode } from './hooks/usePriceMultiplier';

function MainAppContent() {
  const { shopInfo, isLoading, dataSource } = useAppData();
  const isFreelance = useIsFreelanceMode();

  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      // If freelance mode is active, prevent opening admin via query
      if (params.get('mode')?.toLowerCase() === 'freelance') {
        return path === '/admin' || hash === '#admin';
      }
      return path === '/admin' || hash === '#admin' || params.has('admin');
    }
    return false;
  });

  // Watch URL changes for /admin or #admin
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      if (path === '/admin' || hash === '#admin' || params.has('admin')) {
        setIsAdminView(true);
      }
    };

    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  const handleOpenAdmin = () => {
    setIsAdminView(true);
    // Update hash for easy bookmarking and sharing
    if (window.location.pathname !== '/admin') {
      window.location.hash = '#admin';
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminView(false);
    if (window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
    } else if (window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleScrollToGuidelines = () => {
    const el = document.getElementById('quy-chuan');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isAdminView) {
    return <AdminDashboard onClose={handleCloseAdmin} />;
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#FAF9F5] text-[#1C1917] antialiased selection:bg-[#E2D4C0] selection:text-[#1C1917]">
      {/* 1. Header (Sticky Top Bar with Admin access - hidden in freelance mode) */}
      <B2BHeader onOpenAdmin={isFreelance ? undefined : handleOpenAdmin} />

      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* 3. Hero Overview Bar */}
        <B2BHeroBar />

        {/* 4. TOÀN BỘ BẢNG GIÁ THEO CHẤT LIỆU (Mặc định Dạng Bảng) */}
        <OfficialPricingTables zaloTho={shopInfo.zaloTho} />

        {/* 5. TRA CỨU MÃ KHUNG VÀ THÔNG SỐ KỸ THUẬT */}
        <FrameReferenceGuide />

        {/* 6. ẢNH THỰC TẾ CỦA KHÁCH KHÁCH (LIGHTBOX) */}
        <RealCustomerPhotosSection />

        {/* 7. QUY CHUẨN ĐẶT FILE & CHÍNH SÁCH GIAO HÀNG CHO THỢ */}
        <B2BGuidelinesSection shopInfo={shopInfo} />
      </main>

      {/* 7. Footer with Admin Access & Brand - hidden in freelance mode */}
      <B2BFooter shopInfo={shopInfo} onOpenAdmin={isFreelance ? undefined : handleOpenAdmin} />

      {/* 8. Sticky Mobile Thumb Bar */}
      <B2BStickyMobileBar
        shopInfo={shopInfo}
        onScrollToGuidelines={handleScrollToGuidelines}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <MainAppContent />
    </AppDataProvider>
  );
}
