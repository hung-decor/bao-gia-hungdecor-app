import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { FrameSpecItem, InEpMikaPriceRow, DongKhungPriceRow, Anh4KPriceRow } from '../../types';
import {
  inEpMikaPricingData as defaultInEpMika,
  goLuaDongKhungData as defaultGoLua,
  mikaPhoThongData as defaultMikaPhoThong,
  hdGuongSieuBongKhungData as defaultHdGuong,
  anh4KPricingData as defaultAnh4K
} from '../../data/tiemIn194Pricing2026';
import { 
  Lock, 
  Unlock, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  AlertCircle, 
  ArrowLeft, 
  Database, 
  RefreshCw, 
  Sparkles,
  Layers,
  Ruler,
  Phone,
  Eye,
  EyeOff,
  LogOut,
  X,
  Copy
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const {
    pricing,
    savePricing,
    frames,
    saveFrames,
    shopInfo,
    saveShopInfo,
    adminPassword,
    changeAdminPassword,
    isSaving,
    dataSource,
    lastUpdated,
    seedInitialData,
    reloadFromFirestore,
    uploadFrameImage
  } = useAppData();

  // Authentication state (saved in sessionStorage)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('hung_decor_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'pricing' | 'frames' | 'shop' | 'security'>('pricing');
  const [activeMaterialTab, setActiveMaterialTab] = useState<number>(0);

  // Status Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Change Password State
  const [oldPasswordInput, setOldPasswordInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [changePasswordError, setChangePasswordError] = useState<string>('');
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  // Link copy state
  const [copiedLinkType, setCopiedLinkType] = useState<'studio' | 'freelance' | null>(null);

  const handleCopyLink = (type: 'studio' | 'freelance') => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = type === 'studio' ? `${origin}/` : `${origin}/?mode=freelance`;
    navigator.clipboard.writeText(url);
    setCopiedLinkType(type);
    showToast(
      type === 'studio' 
        ? 'Đã sao chép: Link Bảng Giá Sỉ Studio (Gốc)' 
        : 'Đã sao chép: Link Bảng Giá Freelance (+10%)'
    );
    setTimeout(() => {
      setCopiedLinkType(null);
    }, 2500);
  };

  // Local editable copies of pricing data
  const [localPricing, setLocalPricing] = useState(pricing);
  // Synchronize when pricing updates from context
  React.useEffect(() => {
    setLocalPricing(pricing);
  }, [pricing]);

  // Frame editing states
  const [editingFrameIndex, setEditingFrameIndex] = useState<number | null>(null);
  const [isAddingNewFrame, setIsAddingNewFrame] = useState<boolean>(false);
  const [frameFormData, setFrameFormData] = useState<FrameSpecItem>({
    code: '',
    name: '',
    dimensions: '',
    description: '',
    suitableFor: '',
    variants: '',
    hasRealPhotos: true,
    images: []
  });
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Shop info editing
  const [localShopInfo, setLocalShopInfo] = useState(shopInfo);
  React.useEffect(() => {
    setLocalShopInfo(shopInfo);
  }, [shopInfo]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('hung_decor_admin_auth', 'true');
      setPasswordError('');
      showToast('Đăng nhập quản trị Hùng Decor thành công!');
    } else {
      setPasswordError('Mật khẩu không chính xác!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('hung_decor_admin_auth');
    setPasswordInput('');
  };

  // Save Pricing handler
  const handleSaveAllPricing = async () => {
    try {
      await savePricing(localPricing);
      showToast('Đã lưu toàn bộ bảng giá lên Firestore thành công!');
    } catch (e) {
      showToast('Lỗi khi lưu bảng giá lên Firestore. Vui lòng thử lại!', 'error');
    }
  };

  // Save Frames handler
  const handleSaveAllFrames = async (newFramesList: FrameSpecItem[]) => {
    try {
      await saveFrames(newFramesList);
      showToast('Đã lưu danh mục khung lên Firestore thành công!');
    } catch (e) {
      showToast('Lỗi khi lưu khung lên Firestore!', 'error');
    }
  };

  // Handle Initial Data Seed
  const handleSeed = async () => {
    if (window.confirm('Bạn có chắc muốn đồng bộ / khởi tạo toàn bộ dữ liệu mẫu ban đầu lên Firestore?')) {
      try {
        await seedInitialData();
        showToast('Khởi tạo dữ liệu gốc lên Firestore thành công!');
      } catch (e) {
        showToast('Lỗi khởi tạo dữ liệu lên Firestore', 'error');
      }
    }
  };

  // 1. Password Protection Modal
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#121110]/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#1C1917] border border-white/15 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-white">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#E7C184]/20 border border-[#E7C184]/30 flex items-center justify-center text-[#E7C184]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-display font-bold text-lg text-white">Quản Trị Hùng Decor</h3>
                <p className="text-xs text-neutral-400">Đăng nhập để chỉnh sửa giá & khung</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                MẬT KHẨU QUẢN TRỊ
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError('');
                  }}
                  placeholder="Nhập mật khẩu..."
                  autoFocus
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E7C184] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{passwordError}</span>
                </p>
              )}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-neutral-300 bg-white/10 hover:bg-white/15 transition-colors"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-[#1C1917] bg-[#E7C184] hover:bg-[#D4AF37] transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <Unlock className="w-4 h-4" />
                <span>Đăng Nhập</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 2. Full Admin Dashboard
  return (
    <div className="min-h-screen bg-[#141312] text-neutral-100 flex flex-col font-sans-body w-full max-w-full">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-3 ${
          toastMessage.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toastMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Admin Top Bar */}
      <header className="sticky top-0 z-40 bg-[#1C1917]/95 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Về Trang Khách</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="font-serif-display font-bold text-base sm:text-lg text-white">
                Hùng <span className="text-[#FF0000]">Decor</span> Admin
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold flex items-center gap-1 ${
                dataSource === 'firestore' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                <Database className="w-3 h-3" />
                {dataSource === 'firestore' ? 'Firestore Live' : 'Dữ liệu Gốc'}
              </span>
            </div>
          </div>

          {/* Quick status & Seed */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {lastUpdated && (
              <span className="text-[11px] text-neutral-400 hidden md:inline">
                Cập nhật: {new Date(lastUpdated).toLocaleTimeString('vi-VN')}
              </span>
            )}

            <button
              onClick={handleSeed}
              disabled={isSaving}
              title="Đồng bộ / Ghi đè bộ dữ liệu mẫu chuẩn lên Firestore"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Khởi tạo Gốc</span>
            </button>

            <button
              onClick={() => reloadFromFirestore()}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-white/10 hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
              <span>Tải lại</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Thoát</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Quick Link Sharing Box for Anh Hùng */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E7C184] animate-pulse"></span>
                <h3 className="font-serif-display font-bold text-sm sm:text-base text-white">
                  Chia Sẻ Bảng Giá Cho Khách Hàng / Đối Tác
                </h3>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Gửi link riêng biệt cho thợ ảnh / studio ruột hoặc khách chụp tự do (Freelance).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Studio wholesale link */}
              <button
                type="button"
                onClick={() => handleCopyLink('studio')}
                className={`inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-sm ${
                  copiedLinkType === 'studio'
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-neutral-800 hover:bg-neutral-750 border-neutral-700 text-white hover:border-[#E7C184]'
                }`}
              >
                {copiedLinkType === 'studio' ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Đã chép Link Sỉ Studio!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#E7C184]" />
                    <span>Link Bảng Giá Sỉ Studio (Gốc)</span>
                  </>
                )}
              </button>

              {/* Freelance +10% link */}
              <button
                type="button"
                onClick={() => handleCopyLink('freelance')}
                className={`inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-sm ${
                  copiedLinkType === 'freelance'
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-200 hover:border-amber-400'
                }`}
              >
                {copiedLinkType === 'freelance' ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Đã chép Link Freelance (+10%)!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>Link Bảng Giá Freelance (+10%)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-neutral-400 gap-2">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">● Link Studio:</span> Giá sỉ xưởng 100%, có hiển thị nút Admin cho anh Hùng.
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-amber-400 font-bold">● Link Freelance:</span> Tự động +10% toàn bộ đơn giá và ẩn hoàn toàn nút Admin.
            </span>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'pricing'
                ? 'bg-[#E7C184] text-[#1C1917] shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Chỉnh Sửa Bảng Giá 5 Chất Liệu</span>
          </button>

          <button
            onClick={() => setActiveTab('frames')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'frames'
                ? 'bg-[#E7C184] text-[#1C1917] shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>2. Quản Lý Mẫu Khung & Tải Ảnh (Khung KX, HT10, K12, Bản 10cm, Titan...)</span>
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'shop'
                ? 'bg-[#E7C184] text-[#1C1917] shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>3. Thông Tin Xưởng & Hotline</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#E7C184] text-[#1C1917] shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>4. Đổi Mật Khẩu Quản Trị</span>
          </button>
        </div>

        {/* TAB 1: PRICING EDITOR */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/60 border border-neutral-800 p-4 rounded-2xl">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white font-serif-display">
                  Chỉnh Sửa Đơn Giá Từng Kích Cỡ & Từng Chất Liệu
                </h2>
                <p className="text-xs text-neutral-400">
                  Nhập số tiền VNĐ vào từng ô. Sau khi hoàn tất bấm nút <strong>"Lưu Thay Đổi Lên Firestore"</strong> để cập nhật ngay cho thợ xem.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm('Bạn có muốn đồng bộ lại bảng giá mới theo đúng chuẩn thực tế xưởng Hùng Decor lên Firestore?')) {
                      const updatedPricing = {
                        inEpMika: defaultInEpMika,
                        goLua: defaultGoLua,
                        mikaPhoThong: defaultMikaPhoThong,
                        hdGuong: defaultHdGuong,
                        anh4K: defaultAnh4K,
                      };
                      setLocalPricing(updatedPricing);
                      await savePricing(updatedPricing);
                      showToast('Đã nạp và lưu bảng giá mới của Hùng Decor lên Firestore thành công!');
                    }
                  }}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
                  title="Tải bảng giá chuẩn thực tế xưởng Hùng Decor và lưu lên Firestore"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Đồng Bộ Giá Gốc Hùng Decor</span>
                </button>

                <button
                  onClick={handleSaveAllPricing}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Đang lưu lên Firestore...' : 'Lưu Thay Đổi Bảng Giá'}</span>
                </button>
              </div>
            </div>

            {/* Material Selector Subtabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 0, title: 'In Ép Mika' },
                { id: 1, title: 'Gỗ Lụa Đóng Khung' },
                { id: 2, title: 'Mika Phổ Thông' },
                { id: 3, title: 'HD Gương Siêu Bóng' },
                { id: 4, title: 'Ảnh 4K Fomex' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMaterialTab(m.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                    activeMaterialTab === m.id
                      ? 'bg-neutral-800 border-[#E7C184] text-[#E7C184] shadow-sm'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {m.title}
                </button>
              ))}
            </div>

            {/* Subtab 0: In Ép Mika Table */}
            {activeMaterialTab === 0 && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#E7C184]">Bảng Giá In Ép Mika & Khung Xương Gia Cố</h3>
                    <p className="text-xs text-neutral-400">Đơn vị tính: VNĐ</p>
                  </div>
                  <button
                    onClick={() => {
                      const newRow: InEpMikaPriceRow = {
                        stt: localPricing.inEpMika.length + 1,
                        size: 'Mới',
                        inEpMika: 0,
                        khungXuongGiaCo: null
                      };
                      setLocalPricing({
                        ...localPricing,
                        inEpMika: [...localPricing.inEpMika, newRow]
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm Kích Thước</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                        <th className="p-3 w-12 text-center">STT</th>
                        <th className="p-3 w-28">Kích Thước</th>
                        <th className="p-3">Đơn Giá In Ép Mika (đ)</th>
                        <th className="p-3">Khung Xương Gia Cố Sau (đ)</th>
                        <th className="p-3 w-14 text-center">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 font-mono">
                      {localPricing.inEpMika.map((row, idx) => (
                        <tr key={idx} className="hover:bg-neutral-800/40">
                          <td className="p-3 text-center text-neutral-400">{row.stt}</td>
                          <td className="p-3 font-bold text-white">
                            <input
                              type="text"
                              value={row.size}
                              onChange={(e) => {
                                const copy = [...localPricing.inEpMika];
                                copy[idx].size = e.target.value;
                                setLocalPricing({ ...localPricing, inEpMika: copy });
                              }}
                              className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white w-24 font-mono text-xs focus:outline-none focus:border-[#E7C184]"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              value={row.inEpMika ?? ''}
                              onChange={(e) => {
                                const copy = [...localPricing.inEpMika];
                                copy[idx].inEpMika = e.target.value === '' ? null : Number(e.target.value);
                                setLocalPricing({ ...localPricing, inEpMika: copy });
                              }}
                              className="bg-neutral-800 border border-neutral-700 rounded px-2.5 py-1 text-emerald-400 w-36 font-mono text-xs focus:outline-none focus:border-emerald-400"
                            />
                            <span className="text-[10px] text-neutral-500 ml-2 font-sans">
                              {row.inEpMika ? `${row.inEpMika.toLocaleString('vi-VN')} đ` : '-'}
                            </span>
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              value={row.khungXuongGiaCo ?? ''}
                              placeholder="Không có"
                              onChange={(e) => {
                                const copy = [...localPricing.inEpMika];
                                copy[idx].khungXuongGiaCo = e.target.value === '' ? null : Number(e.target.value);
                                setLocalPricing({ ...localPricing, inEpMika: copy });
                              }}
                              className="bg-neutral-800 border border-neutral-700 rounded px-2.5 py-1 text-amber-300 w-36 font-mono text-xs focus:outline-none focus:border-amber-400"
                            />
                            <span className="text-[10px] text-neutral-500 ml-2 font-sans">
                              {row.khungXuongGiaCo ? `${row.khungXuongGiaCo.toLocaleString('vi-VN')} đ` : '-'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                const copy = localPricing.inEpMika.filter((_, i) => i !== idx);
                                setLocalPricing({ ...localPricing, inEpMika: copy });
                              }}
                              className="text-neutral-500 hover:text-red-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Subtab 1, 2, 3: Dong Khung Tables (Gỗ lụa, Mika phổ thông, HD gương) */}
            {(activeMaterialTab === 1 || activeMaterialTab === 2 || activeMaterialTab === 3) && (() => {
              const currentKey = activeMaterialTab === 1 ? 'goLua' : activeMaterialTab === 2 ? 'mikaPhoThong' : 'hdGuong';
              const rows = localPricing[currentKey];
              const title = activeMaterialTab === 1 
                ? 'Bảng Giá Gỗ Lụa Đóng Khung' 
                : activeMaterialTab === 2 
                ? 'Bảng Giá Mika Phổ Thông Đóng Khung' 
                : 'Bảng Giá HD Gương Siêu Bóng Khung';

              const updateCell = (rowIndex: number, field: keyof DongKhungPriceRow, val: any) => {
                const copy = [...rows];
                copy[rowIndex] = { ...copy[rowIndex], [field]: val };
                setLocalPricing({ ...localPricing, [currentKey]: copy });
              };

              return (
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-4 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#E7C184]">{title}</h3>
                      <p className="text-xs text-neutral-400">Chỉnh sửa giá trực tiếp cho từng hệ khung: Bo viền, Khung KX, Khung HT10, Khung K12, Khung bản 10cm, Khung nhôm Titan M, Khung nhôm Titan C</p>
                    </div>
                    <button
                      onClick={() => {
                        const newRow: DongKhungPriceRow = {
                          size: 'Mới',
                          boVien: 0,
                          k0_k3: 0,
                          k4_k6: 0,
                          k7_k9: null,
                          k10: null,
                          k11: null,
                          titan1: 0,
                          titan2: 0
                        };
                        setLocalPricing({
                          ...localPricing,
                          [currentKey]: [...rows, newRow]
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Kích Thước</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto max-h-[600px]">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="sticky top-0 bg-neutral-950 text-neutral-400 border-b border-neutral-800 z-10 shadow-sm">
                        <tr>
                          <th className="p-2.5 w-24">Cỡ Ảnh</th>
                          <th className="p-2.5">Bo Viền</th>
                          <th className="p-2.5">Khung KX</th>
                          <th className="p-2.5">Khung HT10</th>
                          <th className="p-2.5">Khung K12</th>
                          <th className="p-2.5">Khung bản 10cm</th>
                          <th className="p-2.5">Khung nhôm Titan M</th>
                          <th className="p-2.5">Khung nhôm Titan C</th>
                          <th className="p-2.5 w-12 text-center">Xóa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800 font-mono">
                        {rows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-neutral-800/40">
                            <td className="p-2 font-bold text-white">
                              <input
                                type="text"
                                value={row.size}
                                onChange={(e) => updateCell(idx, 'size', e.target.value)}
                                className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white w-20 font-mono text-xs focus:outline-none focus:border-[#E7C184]"
                              />
                            </td>
                            {(['boVien', 'k0_k3', 'k4_k6', 'k10', 'k11', 'titan1', 'titan2'] as (keyof DongKhungPriceRow)[]).map((field) => (
                              <td key={field} className="p-2">
                                <input
                                  type="number"
                                  value={row[field] ?? ''}
                                  placeholder="-"
                                  onChange={(e) => {
                                    const val = e.target.value === '' ? null : Number(e.target.value);
                                    updateCell(idx, field, val);
                                  }}
                                  className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-neutral-200 w-24 font-mono text-xs focus:outline-none focus:border-[#E7C184]"
                                />
                              </td>
                            ))}
                            <td className="p-2 text-center">
                              <button
                                onClick={() => {
                                  const copy = rows.filter((_, i) => i !== idx);
                                  setLocalPricing({ ...localPricing, [currentKey]: copy });
                                }}
                                className="text-neutral-500 hover:text-red-400 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* Subtab 4: Ảnh 4K Table */}
            {activeMaterialTab === 4 && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#E7C184]">Bảng Giá Ảnh 4K Fomex Cao Cấp</h3>
                    <p className="text-xs text-neutral-400">Áp dụng Khung HT10 và Khung nhôm Titan C</p>
                  </div>
                  <button
                    onClick={() => {
                      const newRow: Anh4KPriceRow = {
                        size: 'Mới',
                        k4_k6: 0,
                        titan2: 0
                      };
                      setLocalPricing({
                        ...localPricing,
                        anh4K: [...localPricing.anh4K, newRow]
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm Kích Thước</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                        <th className="p-3 w-32">Kích Thước</th>
                        <th className="p-3">Khung HT10 (đ)</th>
                        <th className="p-3">Khung nhôm Titan C (đ)</th>
                        <th className="p-3 w-14 text-center">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 font-mono">
                      {localPricing.anh4K.map((row, idx) => (
                        <tr key={idx} className="hover:bg-neutral-800/40">
                          <td className="p-3 font-bold text-white">
                            <input
                              type="text"
                              value={row.size}
                              onChange={(e) => {
                                const copy = [...localPricing.anh4K];
                                copy[idx].size = e.target.value;
                                setLocalPricing({ ...localPricing, anh4K: copy });
                              }}
                              className="bg-neutral-800 border border-neutral-700 rounded px-2.5 py-1 text-white w-28 font-mono text-xs focus:outline-none focus:border-[#E7C184]"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              value={row.k4_k6 ?? ''}
                              onChange={(e) => {
                                const copy = [...localPricing.anh4K];
                                copy[idx].k4_k6 = e.target.value === '' ? null : Number(e.target.value);
                                setLocalPricing({ ...localPricing, anh4K: copy });
                              }}
                              className="bg-neutral-800 border border-neutral-700 rounded px-2.5 py-1 text-emerald-400 w-36 font-mono text-xs focus:outline-none focus:border-emerald-400"
                            />
                            <span className="text-[10px] text-neutral-500 ml-2 font-sans">
                              {row.k4_k6 ? `${row.k4_k6.toLocaleString('vi-VN')} đ` : '-'}
                            </span>
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              value={row.titan2 ?? ''}
                              onChange={(e) => {
                                const copy = [...localPricing.anh4K];
                                copy[idx].titan2 = e.target.value === '' ? null : Number(e.target.value);
                                setLocalPricing({ ...localPricing, anh4K: copy });
                              }}
                              className="bg-neutral-800 border border-neutral-700 rounded px-2.5 py-1 text-amber-300 w-36 font-mono text-xs focus:outline-none focus:border-amber-400"
                            />
                            <span className="text-[10px] text-neutral-500 ml-2 font-sans">
                              {row.titan2 ? `${row.titan2.toLocaleString('vi-VN')} đ` : '-'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                const copy = localPricing.anh4K.filter((_, i) => i !== idx);
                                setLocalPricing({ ...localPricing, anh4K: copy });
                              }}
                              className="text-neutral-500 hover:text-red-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FRAME MANAGEMENT & FIREBASE STORAGE UPLOAD */}
        {activeTab === 'frames' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/60 border border-neutral-800 p-4 rounded-2xl">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white font-serif-display">
                  Quản Lý Danh Mục Khung Mẫu & Tải Ảnh Lên Firebase Storage
                </h2>
                <p className="text-xs text-neutral-400">
                  Thêm mẫu khung mới, chỉnh sửa thông số viền, mô tả kỹ thuật và tải ảnh chụp thật trực tiếp từ điện thoại / máy tính lên Storage.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setFrameFormData({
                      code: `K${frames.length}`,
                      name: '',
                      dimensions: 'Bản rộng 2.0 cm',
                      description: '',
                      suitableFor: '',
                      variants: '',
                      hasRealPhotos: true,
                      images: []
                    });
                    setIsAddingNewFrame(true);
                    setEditingFrameIndex(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E7C184] hover:bg-[#D4AF37] text-[#1C1917] font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Mẫu Khung Mới</span>
                </button>
              </div>
            </div>

            {/* List of Frames */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {frames.map((frame, idx) => (
                <div
                  key={frame.code + idx}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between hover:border-neutral-700 transition-colors shadow-lg space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-[#E7C184]/20 text-[#E7C184] border border-[#E7C184]/30 px-2.5 py-1 rounded-lg">
                          {frame.code}
                        </span>
                        <h4 className="font-bold text-white text-sm leading-snug">{frame.name}</h4>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setFrameFormData({ ...frame });
                            setEditingFrameIndex(idx);
                            setIsAddingNewFrame(false);
                          }}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                          title="Sửa thông tin & ảnh"
                        >
                          <Edit3 className="w-4 h-4 text-[#E7C184]" />
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Bạn có chắc muốn xóa mẫu khung ${frame.code} (${frame.name})?`)) {
                              const updated = frames.filter((_, i) => i !== idx);
                              await handleSaveAllFrames(updated);
                            }
                          }}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                          title="Xóa mẫu khung"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-neutral-300 font-mono flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-[#E7C184]" />
                      <span>{frame.dimensions}</span>
                    </div>

                    <p className="mt-2 text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                      {frame.description}
                    </p>
                  </div>

                  {/* Photos preview */}
                  <div className="pt-2 border-t border-neutral-800">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-2">
                      <span>Ảnh chụp thật ({frame.images?.length || 0})</span>
                      <span className="text-[#E7C184] font-medium">{frame.variants}</span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {frame.images && frame.images.length > 0 ? (
                        frame.images.map((img, imgIdx) => (
                          <div key={imgIdx} className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10 group">
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[9px] text-white text-center p-1 font-mono">
                              {img.tag || 'Ảnh'}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-neutral-500 italic py-2">Chưa có ảnh thực tế</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Frame Edit / Add Modal */}
            {(editingFrameIndex !== null || isAddingNewFrame) && (
              <div className="fixed inset-0 z-50 bg-[#121110]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-[#1C1917] border border-neutral-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8 text-neutral-200">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <h3 className="font-serif-display font-bold text-lg text-white">
                      {isAddingNewFrame ? 'Thêm Mẫu Khung Mới' : `Chỉnh Sửa Mẫu Khung: ${frameFormData.code}`}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingFrameIndex(null);
                        setIsAddingNewFrame(false);
                      }}
                      className="p-1 rounded-lg text-neutral-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Mã Khung (vd: K12, Titan 3)</label>
                      <input
                        type="text"
                        value={frameFormData.code}
                        onChange={(e) => setFrameFormData({ ...frameFormData, code: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Tên Gọi Đầy Đủ</label>
                      <input
                        type="text"
                        value={frameFormData.name}
                        onChange={(e) => setFrameFormData({ ...frameFormData, name: e.target.value })}
                        placeholder="vd: Khung Nổi K12 (Gỗ Óc Chó)"
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Kích Thước Viền / Quy Cách</label>
                    <input
                      type="text"
                      value={frameFormData.dimensions}
                      onChange={(e) => setFrameFormData({ ...frameFormData, dimensions: e.target.value })}
                      placeholder="vd: Bản rộng 2.0 cm (nhìn chính diện) • Thành sâu 3.5cm"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Mô Tả Kỹ Thuật Cho Thợ</label>
                    <textarea
                      rows={3}
                      value={frameFormData.description}
                      onChange={(e) => setFrameFormData({ ...frameFormData, description: e.target.value })}
                      placeholder="Chi tiết cấu tạo, độ chịu lực, lưu ý gia cố khung xương cho ảnh lớn..."
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Phù Hợp Cho Thể Loại Ảnh Nào</label>
                      <input
                        type="text"
                        value={frameFormData.suitableFor}
                        onChange={(e) => setFrameFormData({ ...frameFormData, suitableFor: e.target.value })}
                        placeholder="vd: Ảnh cưới, ảnh gia đình, thôi nôi..."
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Màu Sắc / Biến Thể</label>
                      <input
                        type="text"
                        value={frameFormData.variants}
                        onChange={(e) => setFrameFormData({ ...frameFormData, variants: e.target.value })}
                        placeholder="vd: Vân gỗ óc chó đậm, Đen mờ"
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                      />
                    </div>
                  </div>

                  {/* FIREBASE STORAGE IMAGE UPLOAD SECTION */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#E7C184]" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Ảnh Chụp Thật (Firebase Storage)
                        </span>
                      </div>
                      
                      {/* Direct File Upload to Firebase Storage */}
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors shadow">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Đang tải lên Storage...' : 'Tải Ảnh Mới Lên'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingImage}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              setUploadingImage(true);
                              const downloadUrl = await uploadFrameImage(file, frameFormData.code || 'frame');
                              const newImageItem = {
                                name: `${frameFormData.name || frameFormData.code}: ${file.name}`,
                                url: downloadUrl,
                                tag: frameFormData.code || 'Mẫu mới',
                                colorHex: '#4A2A16'
                              };
                              setFrameFormData(prev => ({
                                ...prev,
                                hasRealPhotos: true,
                                images: [...(prev.images || []), newImageItem]
                              }));
                              showToast('Tải ảnh lên Firebase Storage thành công!');
                            } catch (err) {
                              console.error(err);
                              showToast('Lỗi khi tải ảnh lên Storage', 'error');
                            } finally {
                              setUploadingImage(false);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Image list */}
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {frameFormData.images && frameFormData.images.length > 0 ? (
                        frameFormData.images.map((img, i) => (
                          <div key={i} className="flex items-center justify-between gap-3 bg-neutral-950 p-2 rounded-lg border border-neutral-800">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <img src={img.url} alt={img.name} className="w-10 h-10 object-cover rounded-md shrink-0 border border-white/10" />
                              <div className="text-xs truncate">
                                <input
                                  type="text"
                                  value={img.tag || ''}
                                  placeholder="Tên tag (vd: Đen trơn)"
                                  onChange={(e) => {
                                    const copy = [...(frameFormData.images || [])];
                                    copy[i].tag = e.target.value;
                                    setFrameFormData({ ...frameFormData, images: copy });
                                  }}
                                  className="bg-neutral-800 text-white px-2 py-0.5 rounded text-xs w-28 mr-2"
                                />
                                <span className="text-[10px] text-neutral-400 truncate hidden sm:inline">{img.url}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const copy = (frameFormData.images || []).filter((_, idx2) => idx2 !== i);
                                setFrameFormData({ ...frameFormData, images: copy });
                              }}
                              className="text-neutral-500 hover:text-red-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-neutral-500 italic py-2 text-center">
                          Chưa có ảnh nào. Bấm nút <strong>"Tải Ảnh Mới Lên"</strong> để chọn ảnh từ máy hoặc chụp từ điện thoại tải lên Firebase Storage.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFrameIndex(null);
                        setIsAddingNewFrame(false);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!frameFormData.code.trim()) {
                          alert('Vui lòng nhập mã khung!');
                          return;
                        }
                        let updatedList = [...frames];
                        if (isAddingNewFrame) {
                          updatedList = [frameFormData, ...updatedList];
                        } else if (editingFrameIndex !== null) {
                          updatedList[editingFrameIndex] = frameFormData;
                        }
                        await handleSaveAllFrames(updatedList);
                        setEditingFrameIndex(null);
                        setIsAddingNewFrame(false);
                      }}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-[#1C1917] bg-[#E7C184] hover:bg-[#D4AF37] transition-colors shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Lưu Lên Firestore</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SHOP INFO */}
        {activeTab === 'shop' && (
          <div className="max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-serif-display">
                Thông Tin Thương Hiệu & Kênh Tiếp Nhận File
              </h2>
              <p className="text-xs text-neutral-400">
                Hiển thị trên toàn bộ trang chủ, header, footer và tin nhắn gửi Zalo tự động.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Tên Thương Hiệu</label>
                <input
                  type="text"
                  value={localShopInfo.name}
                  onChange={(e) => setLocalShopInfo({ ...localShopInfo, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Khẩu Hiệu / Tiêu Đề Phụ</label>
                <input
                  type="text"
                  value={localShopInfo.subTitle}
                  onChange={(e) => setLocalShopInfo({ ...localShopInfo, subTitle: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Hotline Kỹ Thuật</label>
                  <input
                    type="text"
                    value={localShopInfo.hotlineTech}
                    onChange={(e) => setLocalShopInfo({ ...localShopInfo, hotlineTech: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Số Zalo Thợ Nhận File</label>
                  <input
                    type="text"
                    value={localShopInfo.zaloTho}
                    onChange={(e) => setLocalShopInfo({ ...localShopInfo, zaloTho: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Địa Chỉ Xưởng</label>
                <input
                  type="text"
                  value={localShopInfo.address}
                  onChange={(e) => setLocalShopInfo({ ...localShopInfo, address: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Giờ Làm Việc</label>
                <input
                  type="text"
                  value={localShopInfo.workingHours}
                  onChange={(e) => setLocalShopInfo({ ...localShopInfo, workingHours: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    await saveShopInfo(localShopInfo);
                    showToast('Đã lưu thông tin xưởng lên Firestore!');
                  }}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Đang lưu...' : 'Lưu Thông Tin Xưởng Lên Firestore'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CHANGE ADMIN PASSWORD & SECURITY */}
        {activeTab === 'security' && (
          <div className="max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E7C184]/20 border border-[#E7C184]/30 flex items-center justify-center text-[#E7C184]">
                  <Lock className="w-4 h-4" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white font-serif-display">
                  Đổi Mật Khẩu Quản Trị Hệ Thống
                </h2>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Thay đổi mật khẩu đăng nhập vào giao diện Admin. Mật khẩu mới sẽ được lưu bảo mật trên Firestore và có hiệu lực ngay lập tức.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setChangePasswordError('');

                if (oldPasswordInput !== adminPassword) {
                  setChangePasswordError('Mật khẩu hiện tại không chính xác!');
                  return;
                }
                if (!newPasswordInput || newPasswordInput.length < 4) {
                  setChangePasswordError('Mật khẩu mới phải có tối thiểu 4 ký tự!');
                  return;
                }
                if (newPasswordInput !== confirmPasswordInput) {
                  setChangePasswordError('Xác nhận mật khẩu mới không trùng khớp!');
                  return;
                }

                try {
                  setIsChangingPassword(true);
                  await changeAdminPassword(newPasswordInput);
                  setOldPasswordInput('');
                  setNewPasswordInput('');
                  setConfirmPasswordInput('');
                  showToast('Đã đổi mật khẩu quản trị mới thành công!');
                } catch (err) {
                  setChangePasswordError('Lỗi cập nhật mật khẩu lên Firestore. Vui lòng thử lại!');
                } finally {
                  setIsChangingPassword(false);
                }
              }}
              className="space-y-4 pt-2"
            >
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={oldPasswordInput}
                  onChange={(e) => {
                    setOldPasswordInput(e.target.value);
                    setChangePasswordError('');
                  }}
                  placeholder="Nhập mật khẩu đang dùng..."
                  required
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Mật khẩu mới (tối thiểu 4 ký tự)
                </label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => {
                    setNewPasswordInput(e.target.value);
                    setChangePasswordError('');
                  }}
                  placeholder="Nhập mật khẩu mới..."
                  required
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Xác nhận lại mật khẩu mới
                </label>
                <input
                  type="password"
                  value={confirmPasswordInput}
                  onChange={(e) => {
                    setConfirmPasswordInput(e.target.value);
                    setChangePasswordError('');
                  }}
                  placeholder="Nhập lại mật khẩu mới..."
                  required
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                />
              </div>

              {changePasswordError && (
                <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{changePasswordError}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isChangingPassword ? 'Đang lưu...' : 'Cập Nhật Mật Khẩu Mới'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};
