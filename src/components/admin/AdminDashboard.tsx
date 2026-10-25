import React, { useState, useMemo } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { 
  FrameSpecItem, 
  InEpMikaPriceRow, 
  DongKhungPriceRow, 
  Anh4KPriceRow,
  TabLabelsConfig,
  ColumnLabelsConfig,
  CustomMaterialTab,
  RealGalleryPhoto
} from '../../types';
import {
  inEpMikaPricingData as defaultInEpMika,
  goLuaDongKhungData as defaultGoLua,
  mikaPhoThongData as defaultMikaPhoThong,
  hdGuongSieuBongKhungData as defaultHdGuong,
  anh4KPricingData as defaultAnh4K
} from '../../data/tiemIn194Pricing2026';
import {
  defaultTabLabels,
  defaultColumnLabels,
  defaultFrameColumnKeys,
  defaultInEpColumnKeys,
  FullPricingState,
  getAllMaterialTabs,
  applyPercentageIncrease,
  syncPricingStructure,
  generateDefaultFreelancePricing,
  getDefaultSKU,
  getCellSKU,
  compressImageFile
} from '../../firebase/dataService';
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
  Copy,
  ChevronUp,
  ChevronDown,
  Camera
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const {
    studioPricing,
    freelancePricing,
    saveStudioPricing,
    saveFreelancePricing,
    saveAllPricing,
    frames,
    saveFrames,
    realPhotos,
    saveRealPhotos,
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
  const [activeTab, setActiveTab] = useState<'pricing' | 'frames' | 'gallery' | 'shop' | 'security'>('pricing');
  const [activeMaterialTabId, setActiveMaterialTabId] = useState<string>('go-lua');

  // Real photos state
  const [localRealPhotos, setLocalRealPhotos] = useState<RealGalleryPhoto[]>(realPhotos);
  React.useEffect(() => {
    setLocalRealPhotos(realPhotos);
  }, [realPhotos]);

  // Form state for adding new real photo
  const [newPhotoTitle, setNewPhotoTitle] = useState<string>('');
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const [newPhotoCaption, setNewPhotoCaption] = useState<string>('');

  // Add New Material Modal State
  const [isAddingMaterialModalOpen, setIsAddingMaterialModalOpen] = useState<boolean>(false);
  const [newMaterialTitle, setNewMaterialTitle] = useState<string>('');
  const [newMaterialType, setNewMaterialType] = useState<'dongKhung' | 'inEpMika'>('dongKhung');

  // Add New Frame Column Modal State
  const [isAddingColumnModalOpen, setIsAddingColumnModalOpen] = useState<boolean>(false);
  const [newColumnTitle, setNewColumnTitle] = useState<string>('');
  const [newColumnTargetType, setNewColumnTargetType] = useState<'dongKhung' | 'inEpMika'>('dongKhung');

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

  // Link copy state - FIXED VERCEL DOMAIN
  const [copiedLinkType, setCopiedLinkType] = useState<'studio' | 'freelance' | null>(null);

  const handleCopyLink = (type: 'studio' | 'freelance') => {
    const url = type === 'studio' 
      ? 'https://bao-gia-hungdecor-app.vercel.app/' 
      : 'https://bao-gia-hungdecor-app.vercel.app/?mode=freelance';
    navigator.clipboard.writeText(url);
    setCopiedLinkType(type);
    showToast('Đã sao chép link gửi Zalo thành công!');
    setTimeout(() => {
      setCopiedLinkType(null);
    }, 2500);
  };

  // Active Pricing SubTab (Studio Base vs Freelance)
  const [activePricingSubTab, setActivePricingSubTab] = useState<'studio' | 'freelance'>('studio');
  const [percentInputValue, setPercentInputValue] = useState<number>(10);

  // Local editable copies of dual pricing data
  const [localStudioPricing, setLocalStudioPricing] = useState<FullPricingState>(studioPricing);
  const [localFreelancePricing, setLocalFreelancePricing] = useState<FullPricingState>(freelancePricing);

  React.useEffect(() => {
    setLocalStudioPricing(studioPricing);
  }, [studioPricing]);

  React.useEffect(() => {
    setLocalFreelancePricing(freelancePricing);
  }, [freelancePricing]);

  // Active pricing dataset currently being edited
  const activePricing = activePricingSubTab === 'studio' ? localStudioPricing : localFreelancePricing;

  // Active pricing updater with automatic structural sync
  const updateActivePricing = (updater: (prev: FullPricingState) => FullPricingState, isStructuralChange: boolean = false) => {
    if (activePricingSubTab === 'studio') {
      setLocalStudioPricing(prevStudio => {
        const updatedStudio = updater(prevStudio);
        if (isStructuralChange) {
          setLocalFreelancePricing(prevFreelance => syncPricingStructure(updatedStudio, prevFreelance));
        }
        return updatedStudio;
      });
    } else {
      setLocalFreelancePricing(prevFreelance => {
        const updatedFreelance = updater(prevFreelance);
        if (isStructuralChange) {
          setLocalStudioPricing(prevStudio => syncPricingStructure(updatedFreelance, prevStudio));
        }
        return updatedFreelance;
      });
    }
  };

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

  // List of active material tabs in Admin
  const adminMaterialTabs = useMemo(() => {
    return getAllMaterialTabs(activePricing);
  }, [activePricing]);

  // Keep activeMaterialTabId valid
  React.useEffect(() => {
    if (adminMaterialTabs.length > 0 && !adminMaterialTabs.some((t: any) => t.id === activeMaterialTabId)) {
      setActiveMaterialTabId(adminMaterialTabs[0].id);
    }
  }, [adminMaterialTabs, activeMaterialTabId]);

  // Delete Material Tab Handler
  const handleDeleteMaterialTab = (tabId: string, tabTitle: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa chất liệu "${tabTitle}" không?`)) {
      updateActivePricing(prev => {
        const isCustom = prev.customTabs?.some(ct => ct.id === tabId);
        let updatedCustomTabs = prev.customTabs || [];
        let updatedDeletedTabIds = prev.deletedTabIds || [];

        if (isCustom) {
          updatedCustomTabs = updatedCustomTabs.filter(ct => ct.id !== tabId);
        } else {
          if (!updatedDeletedTabIds.includes(tabId)) {
            updatedDeletedTabIds = [...updatedDeletedTabIds, tabId];
          }
        }

        return {
          ...prev,
          customTabs: updatedCustomTabs,
          deletedTabIds: updatedDeletedTabIds
        };
      }, true);
      showToast(`Đã xóa chất liệu "${tabTitle}"! Hãy nhấn nút Lưu Bảng Giá để hoàn tất.`);
    }
  };

  // Add Material Tab Handler
  const handleCreateMaterialTab = () => {
    if (!newMaterialTitle.trim()) {
      alert('Vui lòng nhập tên chất liệu mới!');
      return;
    }
    const newId = `custom_${Date.now()}`;
    const defaultSizes = ['13x18', '15x21', '20x30', '25x38', '30x45', '35x50', '40x60', '50x75', '60x90', '60x120', '70x110', '80x120'];
    
    let initialRows: any[] = [];
    if (newMaterialType === 'dongKhung') {
      initialRows = defaultSizes.map(sz => ({
        size: sz,
        boVien: 0,
        k0_k3: 0,
        k4_k6: 0,
        k7_k9: null,
        k10: null,
        k11: null,
        titan1: 0,
        titan2: 0
      }));
    } else {
      initialRows = defaultSizes.map((sz, idx) => ({
        stt: idx + 1,
        size: sz,
        inAnh: 0,
        inEpLua: 0,
        inEpMika: 0,
        inEpPlastic: 0,
        khungGiaCo: 0
      }));
    }

    const newTabObj: CustomMaterialTab = {
      id: newId,
      title: newMaterialTitle.trim(),
      type: newMaterialType,
      rows: initialRows
    };

    updateActivePricing(prev => ({
      ...prev,
      customTabs: [...(prev.customTabs || []), newTabObj]
    }), true);

    setIsAddingMaterialModalOpen(false);
    setNewMaterialTitle('');
    setActiveMaterialTabId(newId);
    showToast(`Đã thêm chất liệu "${newMaterialTitle.trim()}"! Hãy bấm "Lưu Bảng Giá".`);
  };

  // Custom tab row cell update helper
  const updateCustomTabRowCell = (tabId: string, rowIndex: number, field: string, value: any) => {
    updateActivePricing(prev => {
      const customTabs: CustomMaterialTab[] = [...(prev.customTabs || [])];
      const targetIdx = customTabs.findIndex(ct => ct.id === tabId);
      if (targetIdx === -1) return prev;
      const targetTab: CustomMaterialTab = { ...customTabs[targetIdx] };
      const rows = [...targetTab.rows];
      rows[rowIndex] = { ...rows[rowIndex], [field]: value };
      targetTab.rows = rows;
      customTabs[targetIdx] = targetTab;
      return { ...prev, customTabs };
    }, false);
  };

  // Custom tab move row
  const moveCustomTabRow = (tabId: string, rowIndex: number, direction: 'up' | 'down') => {
    updateActivePricing(prev => {
      const customTabs: CustomMaterialTab[] = [...(prev.customTabs || [])];
      const targetIdx = customTabs.findIndex(ct => ct.id === tabId);
      if (targetIdx === -1) return prev;
      const targetTab: CustomMaterialTab = { ...customTabs[targetIdx] };
      const updatedRows = moveRowInArray<any>(targetTab.rows, rowIndex, direction);
      targetTab.rows = updatedRows;
      customTabs[targetIdx] = targetTab;
      return { ...prev, customTabs };
    }, true);
  };

  // Add row to custom tab
  const addSizeToCustomTab = (tabId: string) => {
    updateActivePricing(prev => {
      const customTabs: CustomMaterialTab[] = [...(prev.customTabs || [])];
      const targetIdx = customTabs.findIndex(ct => ct.id === tabId);
      if (targetIdx === -1) return prev;
      const targetTab: CustomMaterialTab = { ...customTabs[targetIdx] };
      const isDongKhung = targetTab.type === 'dongKhung';
      const newRow = isDongKhung ? {
        size: 'Mới',
        boVien: 0,
        k0_k3: 0,
        k4_k6: 0,
        k7_k9: null,
        k10: null,
        k11: null,
        titan1: 0,
        titan2: 0
      } : {
        stt: targetTab.rows.length + 1,
        size: 'Mới',
        inAnh: 0,
        inEpLua: 0,
        inEpMika: 0,
        inEpPlastic: 0,
        khungGiaCo: 0
      };
      targetTab.rows = [...targetTab.rows, newRow];
      customTabs[targetIdx] = targetTab;
      return { ...prev, customTabs };
    }, true);
  };

  // Delete row from custom tab
  const deleteRowFromCustomTab = (tabId: string, rowIndex: number) => {
    updateActivePricing(prev => {
      const customTabs: CustomMaterialTab[] = [...(prev.customTabs || [])];
      const targetIdx = customTabs.findIndex(ct => ct.id === tabId);
      if (targetIdx === -1) return prev;
      const targetTab: CustomMaterialTab = { ...customTabs[targetIdx] };
      targetTab.rows = targetTab.rows.filter((_: any, i: number) => i !== rowIndex);
      customTabs[targetIdx] = targetTab;
      return { ...prev, customTabs };
    }, true);
  };

  // Helper updates for dynamic Tab Labels & Column Labels (updates BOTH datasets for 100% label sync)
  const updateTabLabel = (key: keyof TabLabelsConfig, val: string) => {
    const applyLabel = (prev: FullPricingState) => ({
      ...prev,
      tabLabels: {
        ...(prev.tabLabels || defaultTabLabels),
        [key]: val
      }
    });
    setLocalStudioPricing(applyLabel);
    setLocalFreelancePricing(applyLabel);
  };

  const updateColumnLabel = (key: keyof ColumnLabelsConfig, val: string) => {
    const applyColLabel = (prev: FullPricingState) => ({
      ...prev,
      columnLabels: {
        ...(prev.columnLabels || defaultColumnLabels),
        [key]: val
      }
    });
    setLocalStudioPricing(applyColLabel);
    setLocalFreelancePricing(applyColLabel);
  };

  // Add new frame column handler
  const handleAddNewColumn = () => {
    if (!newColumnTitle.trim()) {
      alert('Vui lòng nhập tên cột khung mới!');
      return;
    }
    const title = newColumnTitle.trim();
    const colKey = 'col_' + Date.now();

    const applyAddCol = (prev: FullPricingState): FullPricingState => {
      const isDongKhung = newColumnTargetType === 'dongKhung';
      const currentKeys = isDongKhung
        ? (prev.frameColumnKeys || defaultFrameColumnKeys)
        : (prev.inEpColumnKeys || defaultInEpColumnKeys);

      const newKeys = [...currentKeys, colKey];

      const addColToRows = (rows: any[]) => (rows || []).map(r => ({ ...r, [colKey]: null }));

      return {
        ...prev,
        columnLabels: {
          ...(prev.columnLabels || defaultColumnLabels),
          [colKey]: title
        },
        frameColumnKeys: isDongKhung ? newKeys : (prev.frameColumnKeys || defaultFrameColumnKeys),
        inEpColumnKeys: !isDongKhung ? newKeys : (prev.inEpColumnKeys || defaultInEpColumnKeys),
        goLua: isDongKhung ? addColToRows(prev.goLua) : prev.goLua,
        hdGuong: isDongKhung ? addColToRows(prev.hdGuong) : prev.hdGuong,
        mikaPhoThong: isDongKhung ? addColToRows(prev.mikaPhoThong) : prev.mikaPhoThong,
        inEpMika: !isDongKhung ? addColToRows(prev.inEpMika) : prev.inEpMika,
        anh4K: isDongKhung ? addColToRows(prev.anh4K) : prev.anh4K,
        customTabs: (prev.customTabs || []).map(ct => ({
          ...ct,
          rows: ((ct.type || 'dongKhung') === newColumnTargetType) ? addColToRows(ct.rows) : ct.rows
        }))
      };
    };

    setLocalStudioPricing(prev => applyAddCol(prev));
    setLocalFreelancePricing(prev => applyAddCol(prev));

    setNewColumnTitle('');
    setIsAddingColumnModalOpen(false);
    showToast(`Đã thêm cột khung "${title}" thành công!`);
  };

  // Delete frame column handler
  const handleDeleteColumn = (colKey: string, colTitle: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn XÓA BỚT cột khung "${colTitle}" không?\nToàn bộ đơn giá ở cột này sẽ bị loại bỏ khỏi bảng giá.`)) {
      const applyDeleteCol = (prev: FullPricingState): FullPricingState => {
        const frameKeys = (prev.frameColumnKeys || defaultFrameColumnKeys).filter(k => k !== colKey);
        const inEpKeys = (prev.inEpColumnKeys || defaultInEpColumnKeys).filter(k => k !== colKey);

        const removeColFromRows = (rows: any[]) => (rows || []).map(r => {
          const copy = { ...r };
          delete copy[colKey];
          return copy;
        });

        const newColLabels = { ...(prev.columnLabels || defaultColumnLabels) };
        delete newColLabels[colKey];

        return {
          ...prev,
          columnLabels: newColLabels,
          frameColumnKeys: frameKeys,
          inEpColumnKeys: inEpKeys,
          goLua: removeColFromRows(prev.goLua),
          hdGuong: removeColFromRows(prev.hdGuong),
          mikaPhoThong: removeColFromRows(prev.mikaPhoThong),
          inEpMika: removeColFromRows(prev.inEpMika),
          anh4K: removeColFromRows(prev.anh4K),
          customTabs: (prev.customTabs || []).map(ct => ({
            ...ct,
            rows: removeColFromRows(ct.rows)
          }))
        };
      };

      setLocalStudioPricing(prev => applyDeleteCol(prev));
      setLocalFreelancePricing(prev => applyDeleteCol(prev));

      showToast(`Đã xóa cột khung "${colTitle}" thành công!`);
    }
  };

  // Update SKU for a row cell
  const updateRowSKU = (materialTabId: string, rowIndex: number, colKey: string, newSKU: string) => {
    updateActivePricing(prev => {
      if (['go-lua', 'hd-guong-sieu-bong', 'mika-pho-thong'].includes(materialTabId)) {
        const currentKey = materialTabId === 'go-lua' ? 'goLua' : materialTabId === 'mika-pho-thong' ? 'mikaPhoThong' : 'hdGuong';
        const copy = [...prev[currentKey]];
        const targetRow = { ...copy[rowIndex] };
        targetRow.skus = { ...(targetRow.skus || {}), [colKey]: newSKU };
        copy[rowIndex] = targetRow;
        return { ...prev, [currentKey]: copy };
      }
      if (materialTabId === 'in-ep-mika') {
        const copy = [...prev.inEpMika];
        const targetRow = { ...copy[rowIndex] };
        targetRow.skus = { ...(targetRow.skus || {}), [colKey]: newSKU };
        copy[rowIndex] = targetRow;
        return { ...prev, inEpMika: copy };
      }
      if (materialTabId === 'anh-4k') {
        const copy = [...prev.anh4K];
        const targetRow = { ...copy[rowIndex] };
        targetRow.skus = { ...(targetRow.skus || {}), [colKey]: newSKU };
        copy[rowIndex] = targetRow;
        return { ...prev, anh4K: copy };
      }
      if (prev.customTabs) {
        const customTabs = [...prev.customTabs];
        const tabIdx = customTabs.findIndex(ct => ct.id === materialTabId);
        if (tabIdx !== -1) {
          const tabCopy = { ...customTabs[tabIdx] };
          const rowsCopy = [...tabCopy.rows];
          const rowCopy = { ...rowsCopy[rowIndex] };
          rowCopy.skus = { ...(rowCopy.skus || {}), [colKey]: newSKU };
          rowsCopy[rowIndex] = rowCopy;
          tabCopy.rows = rowsCopy;
          customTabs[tabIdx] = tabCopy;
          return { ...prev, customTabs };
        }
      }
      return prev;
    }, false);
  };

  const moveRowInArray = <T,>(arr: T[], index: number, direction: 'up' | 'down'): T[] => {
    if (direction === 'up' && index === 0) return arr;
    if (direction === 'down' && index === arr.length - 1) return arr;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const copy = [...arr];
    const [item] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, item);
    return copy;
  };

  // Save Pricing handler
  const handleSaveAllPricing = async () => {
    try {
      await saveAllPricing(localStudioPricing, localFreelancePricing);
      showToast('Đã lưu toàn bộ cấu trúc & đơn giá lên Firestore thành công!');
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

          {/* Quick status & Logout */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {lastUpdated && (
              <span className="text-[11px] text-neutral-400 hidden md:inline">
                Cập nhật: {new Date(lastUpdated).toLocaleTimeString('vi-VN')}
              </span>
            )}

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

              {/* Freelance link */}
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
                    <span>Đã chép Link Freelance!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>Link Bảng Giá Freelance</span>
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
              <span className="text-amber-400 font-bold">● Link Freelance:</span> Bảng giá dành riêng cho thợ chụp tự do (đã cấu hình riêng) và ẩn hoàn toàn nút Admin.
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
            <span>1. Chỉnh Sửa Bảng Giá & Tên Chất Liệu / Khung</span>
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
            <span>2. Quản Lý Mẫu Khung & Tải Ảnh</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-[#E7C184] text-[#1C1917] shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>3. Quản Lý Ảnh Thực Tế</span>
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
            <span>4. Thông Tin Xưởng & Hotline</span>
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
            <span>5. Đổi Mật Khẩu Quản Trị</span>
          </button>
        </div>

        {/* TAB 1: PRICING EDITOR & CUSTOMIZATION */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">

            {/* DUAL PRICING SUBTABS NAVIGATION */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-neutral-900 border border-neutral-800 p-2.5 rounded-2xl shadow-lg">
              <button
                type="button"
                onClick={() => setActivePricingSubTab('studio')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activePricingSubTab === 'studio'
                    ? 'bg-[#E7C184] text-[#1C1917] shadow-md scale-[1.01]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>1. Bảng Giá Sỉ Studio (Gốc)</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePricingSubTab('freelance')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activePricingSubTab === 'freelance'
                    ? 'bg-amber-500 text-neutral-950 shadow-md scale-[1.01]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>2. Bảng Giá Freelance</span>
              </button>
            </div>

            {/* BULK % INCREASE TOOLBAR */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-sm text-white font-serif-display">
                      Công Cụ Tăng Giá Hàng Loạt Theo % ({activePricingSubTab === 'studio' ? 'Bảng Sỉ Studio Gốc' : 'Bảng Freelance'})
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Tự động nhân tỷ lệ % cho toàn bộ đơn giá và làm tròn đến hàng nghìn đồng. Cấu trúc kích thước & tên cột luôn được đồng bộ 100%.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Quick % Presets */}
                  {[5, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setPercentInputValue(pct)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        percentInputValue === pct
                          ? 'bg-[#E7C184] text-neutral-950 shadow-xs'
                          : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
                      }`}
                    >
                      +{pct}%
                    </button>
                  ))}

                  {/* Percentage Custom Input */}
                  <div className="flex items-center bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1 text-xs text-white">
                    <span className="text-neutral-400 mr-1 font-bold">+</span>
                    <input
                      type="number"
                      value={percentInputValue}
                      onChange={(e) => setPercentInputValue(Number(e.target.value) || 0)}
                      className="w-12 bg-transparent text-white font-bold text-center focus:outline-none"
                    />
                    <span className="text-neutral-400 ml-1 font-bold">%</span>
                  </div>

                  {/* Apply % Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (percentInputValue === 0) {
                        alert('Vui lòng nhập số % lớn hơn 0!');
                        return;
                      }
                      if (activePricingSubTab === 'studio') {
                        const boosted = applyPercentageIncrease(localStudioPricing, percentInputValue);
                        setLocalStudioPricing(boosted);
                        setLocalFreelancePricing(prev => syncPricingStructure(boosted, prev));
                        showToast(`Đã tăng +${percentInputValue}% cho toàn bộ Bảng Giá Sỉ Studio Gốc!`);
                      } else {
                        const boosted = applyPercentageIncrease(localFreelancePricing, percentInputValue);
                        setLocalFreelancePricing(boosted);
                        showToast(`Đã tăng +${percentInputValue}% cho toàn bộ Bảng Giá Freelance!`);
                      }
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-all shadow-md cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Áp Dụng Tăng +{percentInputValue}% Toàn Bảng</span>
                  </button>
                </div>
              </div>

              {/* Timestamp of last bulk adjustment */}
              <div className="pt-2 text-[11px] text-neutral-400 italic flex items-center gap-1.5 border-t border-neutral-800/60">
                <span className="text-[#E7C184]">⏱</span>
                {activePricing.lastPriceAdjustmentDate ? (
                  <span>(Lần điều chỉnh gần nhất: {activePricing.lastPriceAdjustmentDate})</span>
                ) : (
                  <span>(Chưa có điều chỉnh hàng loạt)</span>
                )}
              </div>
            </div>

            {/* ACTION & SAVE BAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white font-serif-display flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#E7C184]" />
                  <span>
                    {activePricingSubTab === 'studio' ? 'Đang Chỉnh Sửa: Bảng Giá Sỉ Studio (Gốc)' : 'Đang Chỉnh Sửa: Bảng Giá Freelance'}
                  </span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Anh Hùng có thể nhập sửa bất kỳ ô giá nào thủ công. Nhấn nút bên dưới để lưu tương ứng lên Firestore.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {activePricingSubTab === 'studio' ? (
                  <button
                    type="button"
                    onClick={async () => {
                      await saveStudioPricing(localStudioPricing);
                      showToast('Đã lưu Bảng Giá Sỉ Studio Gốc thành công!');
                    }}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Đang lưu...' : 'Lưu Bảng Giá Gốc'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      await saveFreelancePricing(localFreelancePricing);
                      showToast('Đã lưu Bảng Giá Freelance thành công!');
                    }}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm transition-all shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Đang lưu...' : 'Lưu Bảng Giá Freelance'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={async () => {
                    await saveAllPricing(localStudioPricing, localFreelancePricing);
                    showToast('Đã lưu đồng thời cả 2 Bảng Giá (Studio Gốc & Freelance) thành công!');
                  }}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs sm:text-sm border border-neutral-700 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-[#E7C184]" />
                  <span>Lưu Tất Cả Bảng Giá</span>
                </button>
              </div>
            </div>

            {/* PANEL TÙY BIẾN TÊN TAB VÀ CỘT KHUNG */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="font-bold text-sm text-[#E7C184] font-serif-display flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#E7C184]" />
                  <span>1. Tùy Biến Tên 5 Tab Chất Liệu & Tiêu Đề Cột Khung (Đồng Bộ Cả 2 Bảng)</span>
                </h3>
              </div>

              {/* Tùy biến Tên 5 Tab */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">a. Tên 5 Tab Chất Liệu</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  {[
                    { key: 'goLua' as keyof TabLabelsConfig, defaultVal: defaultTabLabels.goLua, sub: 'Tab 1' },
                    { key: 'hdGuong' as keyof TabLabelsConfig, defaultVal: defaultTabLabels.hdGuong, sub: 'Tab 2' },
                    { key: 'mikaPhoThong' as keyof TabLabelsConfig, defaultVal: defaultTabLabels.mikaPhoThong, sub: 'Tab 3' },
                    { key: 'inEpMika' as keyof TabLabelsConfig, defaultVal: defaultTabLabels.inEpMika, sub: 'Tab 4' },
                    { key: 'anh4K' as keyof TabLabelsConfig, defaultVal: defaultTabLabels.anh4K, sub: 'Tab 5' },
                  ].map((item) => (
                    <div key={item.key}>
                      <label className="block text-[10px] font-mono text-neutral-400 mb-1">{item.sub}</label>
                      <input
                        type="text"
                        value={activePricing.tabLabels?.[item.key] ?? item.defaultVal}
                        onChange={(e) => updateTabLabel(item.key, e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#E7C184] font-semibold"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tùy biến Tên Cột Khung */}
              <div className="pt-3 border-t border-neutral-800/80 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    b. Tên Cột Hệ Khung & In Ép
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingColumnModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Thêm Cột Khung Mới</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
                  {/* DongKhung frame columns */}
                  {(activePricing.frameColumnKeys || defaultFrameColumnKeys).map((colKey) => {
                    const currentVal = activePricing.columnLabels?.[colKey] ?? (defaultColumnLabels as any)[colKey] ?? colKey;
                    return (
                      <div key={colKey} className="bg-neutral-950 p-2 rounded-xl border border-neutral-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-mono text-neutral-400 truncate">Hệ Khung</label>
                          <button
                            type="button"
                            onClick={() => handleDeleteColumn(colKey, currentVal)}
                            className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/60 transition-colors"
                            title={`Xóa cột khung "${currentVal}"`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={currentVal}
                          onChange={(e) => updateColumnLabel(colKey, e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-[#E7C184] focus:outline-none focus:border-[#E7C184] font-semibold"
                        />
                      </div>
                    );
                  })}

                  {/* InEp columns */}
                  {(activePricing.inEpColumnKeys || defaultInEpColumnKeys).map((colKey) => {
                    const currentVal = activePricing.columnLabels?.[colKey] ?? (defaultColumnLabels as any)[colKey] ?? colKey;
                    return (
                      <div key={colKey} className="bg-neutral-950 p-2 rounded-xl border border-neutral-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-mono text-neutral-400 truncate">Hệ In Ép</label>
                          <button
                            type="button"
                            onClick={() => handleDeleteColumn(colKey, currentVal)}
                            className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/60 transition-colors"
                            title={`Xóa cột "${currentVal}"`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={currentVal}
                          onChange={(e) => updateColumnLabel(colKey, e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-[#E7C184] focus:outline-none focus:border-[#E7C184] font-semibold"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Material Selector Subtabs in Admin with ADD and DELETE features */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-neutral-900 border border-neutral-800 p-3 rounded-2xl">
                <div className="text-xs text-neutral-300 font-semibold flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#E7C184]" />
                  <span>Danh Sách Chất Liệu Hiện Có ({adminMaterialTabs.length}):</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingMaterialModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Thêm Chất Liệu Mới</span>
                </button>
              </div>

              {/* Subtabs Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {adminMaterialTabs.map((m: any) => (
                  <div
                    key={m.id}
                    className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all shrink-0 cursor-pointer ${
                      activeMaterialTabId === m.id
                        ? 'bg-neutral-800 border-[#E7C184] text-[#E7C184] shadow-sm'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                    onClick={() => setActiveMaterialTabId(m.id)}
                  >
                    <span>{m.title}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMaterialTab(m.id, m.title);
                      }}
                      className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/60 transition-colors ml-1"
                      title={`Xóa chất liệu "${m.title}"`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Render Active Material Table */}
            {(() => {
              const activeItem = adminMaterialTabs.find((t: any) => t.id === activeMaterialTabId) || adminMaterialTabs[0];
              if (!activeItem) {
                return (
                  <div className="p-8 text-center text-neutral-400 bg-neutral-900 rounded-2xl border border-neutral-800">
                    Chưa có chất liệu nào. Hãy nhấn <strong>"+ Thêm Chất Liệu Mới"</strong> để tạo dòng sản phẩm mới.
                  </div>
                );
              }

              // Built-in Tab: In Ép (in-ep-mika)
              if (activeItem.id === 'in-ep-mika') {
                return (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-4 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-[#E7C184]">{activeItem.title}</h3>
                        <p className="text-xs text-neutral-400">Chỉnh sửa đơn giá VNĐ, tùy biến size & sắp xếp vị trí dòng</p>
                      </div>
                      <button
                        onClick={() => {
                          const newRow: InEpMikaPriceRow = {
                            stt: activePricing.inEpMika.length + 1,
                            size: 'Mới',
                            inAnh: null,
                            inEpLua: null,
                            inEpMika: null,
                            inEpPlastic: null,
                            khungGiaCo: null
                          };
                          updateActivePricing(prev => ({
                            ...prev,
                            inEpMika: [...prev.inEpMika, newRow]
                          }), true);
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
                            <th className="p-3 w-16 text-center">Xếp</th>
                            <th className="p-3 w-24">Kích Thước</th>
                            {(activePricing.inEpColumnKeys || defaultInEpColumnKeys).map(colKey => (
                              <th key={colKey} className="p-3">{activePricing.columnLabels?.[colKey] || (defaultColumnLabels as any)[colKey] || colKey}</th>
                            ))}
                            <th className="p-3 w-12 text-center">Xóa</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800 font-mono">
                          {activePricing.inEpMika.map((row, idx) => (
                            <tr key={idx} className="hover:bg-neutral-800/40">
                              <td className="p-2 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    disabled={idx === 0}
                                    onClick={() => {
                                      updateActivePricing(prev => ({
                                        ...prev,
                                        inEpMika: moveRowInArray(prev.inEpMika, idx, 'up')
                                      }), true);
                                    }}
                                    className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                                    title="Lên trên"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    disabled={idx === activePricing.inEpMika.length - 1}
                                    onClick={() => {
                                      updateActivePricing(prev => ({
                                        ...prev,
                                        inEpMika: moveRowInArray(prev.inEpMika, idx, 'down')
                                      }), true);
                                    }}
                                    className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                                    title="Xuống dưới"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                              <td className="p-3 font-bold text-white">
                                <input
                                  type="text"
                                  value={row.size}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateActivePricing(prev => {
                                      const copy = [...prev.inEpMika];
                                      copy[idx].size = val;
                                      return { ...prev, inEpMika: copy };
                                    }, true);
                                  }}
                                  className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white w-20 font-mono text-xs focus:outline-none focus:border-[#E7C184]"
                                />
                              </td>
                              {(activePricing.inEpColumnKeys || defaultInEpColumnKeys).map((colKey) => (
                                <td key={colKey} className="p-2 align-top">
                                  <div className="flex flex-col gap-1">
                                    <input
                                      type="number"
                                      value={(row as any)[colKey] ?? (colKey === 'inEpMikaCol' ? row.inEpMika : '') ?? ''}
                                      placeholder="-"
                                      onChange={(e) => {
                                        const val = e.target.value === '' ? null : Number(e.target.value);
                                        updateActivePricing(prev => {
                                          const copy = [...prev.inEpMika];
                                          (copy[idx] as any)[colKey] = val;
                                          if (colKey === 'inEpMikaCol') {
                                            (copy[idx] as any).inEpMika = val;
                                          }
                                          return { ...prev, inEpMika: copy };
                                        }, false);
                                      }}
                                      className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-emerald-400 w-28 font-mono text-xs focus:outline-none focus:border-emerald-400 font-semibold"
                                    />
                                    <div className="flex items-center gap-1">
                                      <span className="text-[9px] font-mono text-neutral-500 font-bold select-none">SKU:</span>
                                      <input
                                        type="text"
                                        value={getCellSKU(row, colKey, 'in-ep-mika', activePricingSubTab)}
                                        onChange={(e) => updateRowSKU('in-ep-mika', idx, colKey, e.target.value)}
                                        placeholder={getDefaultSKU('in-ep-mika', activePricingSubTab, colKey, row.size)}
                                        className="bg-neutral-950/90 border border-neutral-800 focus:border-[#E7C184] rounded px-1.5 py-0.5 text-[10px] text-amber-200/90 font-mono tracking-tight focus:outline-none w-24"
                                        title="Sửa mã SKU thủ công"
                                      />
                                    </div>
                                  </div>
                                </td>
                              ))}
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => {
                                    updateActivePricing(prev => ({
                                      ...prev,
                                      inEpMika: prev.inEpMika.filter((_, i) => i !== idx)
                                    }), true);
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
              }

              // Built-in Tab 1: Gỗ Lụa Bo Viền (go-lua)
              if (activeItem.id === 'go-lua' || activeItem.type === 'goLuaBoVien') {
                const rows = activePricing.goLua;
                const updateCell = (rowIndex: number, field: string, val: any) => {
                  updateActivePricing(prev => {
                    const copy = [...prev.goLua];
                    copy[rowIndex] = { ...copy[rowIndex], [field]: val };
                    return { ...prev, goLua: copy };
                  }, field === 'size');
                };

                return (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-4 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-[#E7C184]">{activeItem.title}</h3>
                        <p className="text-xs text-neutral-400">Danh mục Gỗ Lụa Bo Viền gồm Cỡ Ảnh, Đơn Giá Bo Viền và Mã SKU chuẩn</p>
                      </div>
                      <button
                        onClick={() => {
                          const newRow: DongKhungPriceRow = {
                            size: 'Mới',
                            boVien: 0,
                            k0_k3: null,
                            k4_k6: null,
                            k7_k9: null,
                            k10: null,
                            k11: null,
                            titan1: null,
                            titan2: null
                          };
                          updateActivePricing(prev => ({
                            ...prev,
                            goLua: [...prev.goLua, newRow]
                          }), true);
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
                            <th className="p-2.5 w-16 text-center">Xếp</th>
                            <th className="p-2.5 w-28">Cỡ Ảnh</th>
                            <th className="p-2.5">Bo Viền (VNĐ)</th>
                            <th className="p-2.5 w-12 text-center">Xóa</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800 font-mono">
                          {rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-neutral-800/40">
                              <td className="p-2 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    disabled={idx === 0}
                                    onClick={() => {
                                      updateActivePricing(prev => ({
                                        ...prev,
                                        goLua: moveRowInArray(prev.goLua, idx, 'up')
                                      }), true);
                                    }}
                                    className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                                    title="Lên trên"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    disabled={idx === rows.length - 1}
                                    onClick={() => {
                                      updateActivePricing(prev => ({
                                        ...prev,
                                        goLua: moveRowInArray(prev.goLua, idx, 'down')
                                      }), true);
                                    }}
                                    className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                                    title="Xuống dưới"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                              <td className="p-2 font-bold text-white">
                                <input
                                  type="text"
                                  value={row.size}
                                  onChange={(e) => updateCell(idx, 'size', e.target.value)}
                                  className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white w-24 font-mono text-xs focus:outline-none focus:border-[#E7C184]"
                                />
                              </td>
                              <td className="p-2 align-top">
                                <div className="flex flex-col gap-1">
                                  <input
                                    type="number"
                                    value={row.boVien ?? ''}
                                    placeholder="-"
                                    onChange={(e) => {
                                      const val = e.target.value === '' ? null : Number(e.target.value);
                                      updateCell(idx, 'boVien', val);
                                    }}
                                    className="bg-neutral-800 border border-neutral-700 rounded px-2.5 py-1 text-emerald-400 w-32 font-mono text-xs focus:outline-none focus:border-emerald-400 font-semibold"
                                  />
                                  <div className="flex items-center gap-1">
                                    <span className="text-[9px] font-mono text-neutral-500 font-bold select-none">SKU:</span>
                                    <input
                                      type="text"
                                      value={getCellSKU(row, 'boVien', 'go-lua', activePricingSubTab)}
                                      onChange={(e) => updateRowSKU('go-lua', idx, 'boVien', e.target.value)}
                                      placeholder={getDefaultSKU('go-lua', activePricingSubTab, 'boVien', row.size)}
                                      className="bg-neutral-950/90 border border-neutral-800 focus:border-[#E7C184] rounded px-1.5 py-0.5 text-[10px] text-amber-200/90 font-mono tracking-tight focus:outline-none w-28"
                                      title="Sửa mã SKU thủ công"
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  onClick={() => {
                                    updateActivePricing(prev => ({
                                      ...prev,
                                      goLua: prev.goLua.filter((_, i) => i !== idx)
                                    }), true);
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
              }

              // Built-in Tab: Dong Khung (hd-guong-sieu-bong, mika-pho-thong)
              if (['hd-guong-sieu-bong', 'mika-pho-thong'].includes(activeItem.id)) {
                const currentKey = activeItem.id === 'mika-pho-thong' ? 'mikaPhoThong' : 'hdGuong';
                const rows = activePricing[currentKey];
                const updateCell = (rowIndex: number, field: string, val: any) => {
                  updateActivePricing(prev => {
                    const copy = [...prev[currentKey]];
                    copy[rowIndex] = { ...copy[rowIndex], [field]: val };
                    return { ...prev, [currentKey]: copy };
                  }, field === 'size');
                };
                const colConfig = activePricing.columnLabels || defaultColumnLabels;

                return (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-4 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-[#E7C184]">{activeItem.title}</h3>
                        <p className="text-xs text-neutral-400">Chỉnh sửa giá trực tiếp cho từng hệ khung, tùy biến cỡ ảnh & thứ tự dòng</p>
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
                          updateActivePricing(prev => ({
                            ...prev,
                            [currentKey]: [...prev[currentKey], newRow]
                          }), true);
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
                            <th className="p-2.5 w-16 text-center">Xếp</th>
                            <th className="p-2.5 w-24">Cỡ Ảnh</th>
                            {(activePricing.frameColumnKeys || defaultFrameColumnKeys).map(colKey => (
                              <th key={colKey} className="p-2.5">{colConfig[colKey as keyof typeof colConfig] || colKey}</th>
                            ))}
                            <th className="p-2.5 w-12 text-center">Xóa</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800 font-mono">
                          {rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-neutral-800/40">
                              <td className="p-2 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    disabled={idx === 0}
                                    onClick={() => {
                                      updateActivePricing(prev => ({
                                        ...prev,
                                        [currentKey]: moveRowInArray(prev[currentKey], idx, 'up')
                                      }), true);
                                    }}
                                    className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                                    title="Lên trên"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    disabled={idx === rows.length - 1}
                                    onClick={() => {
                                      updateActivePricing(prev => ({
                                        ...prev,
                                        [currentKey]: moveRowInArray(prev[currentKey], idx, 'down')
                                      }), true);
                                    }}
                                    className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                                    title="Xuống dưới"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                              <td className="p-2 font-bold text-white">
                                <input
                                  type="text"
                                  value={row.size}
                                  onChange={(e) => updateCell(idx, 'size', e.target.value)}
                                  className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white w-20 font-mono text-xs focus:outline-none focus:border-[#E7C184]"
                                />
                              </td>
                              {(activePricing.frameColumnKeys || defaultFrameColumnKeys).map((colKey) => (
                                <td key={colKey} className="p-2 align-top">
                                  <div className="flex flex-col gap-1">
                                    <input
                                      type="number"
                                      value={(row as any)[colKey] ?? ''}
                                      placeholder="-"
                                      onChange={(e) => {
                                        const val = e.target.value === '' ? null : Number(e.target.value);
                                        updateCell(idx, colKey, val);
                                      }}
                                      className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-neutral-200 w-28 font-mono text-xs focus:outline-none focus:border-[#E7C184] font-semibold"
                                    />
                                    <div className="flex items-center gap-1">
                                      <span className="text-[9px] font-mono text-neutral-500 font-bold select-none">SKU:</span>
                                      <input
                                        type="text"
                                        value={getCellSKU(row, colKey, activeItem.id, activePricingSubTab)}
                                        onChange={(e) => updateRowSKU(activeItem.id, idx, colKey, e.target.value)}
                                        placeholder={getDefaultSKU(activeItem.id, activePricingSubTab, colKey, row.size)}
                                        className="bg-neutral-950/90 border border-neutral-800 focus:border-[#E7C184] rounded px-1.5 py-0.5 text-[10px] text-amber-200/90 font-mono tracking-tight focus:outline-none w-24"
                                        title="Sửa mã SKU thủ công"
                                      />
                                    </div>
                                  </div>
                                </td>
                              ))}
                              <td className="p-2 text-center">
                                <button
                                  onClick={() => {
                                    updateActivePricing(prev => ({
                                      ...prev,
                                      [currentKey]: prev[currentKey].filter((_, i) => i !== idx)
                                    }), true);
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
              }

              // Built-in Tab: Tab 5 (Album - Photobook)
              if (activeItem.id === 'anh-4k' || activeItem.type === 'album') {
                return (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-4 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-[#E7C184]">{activeItem.title}</h3>
                        <p className="text-xs text-neutral-400">Danh mục Album - Photobook gồm Kích Thước, Đơn Giá và Mã SKU chuẩn</p>
                      </div>
                      <button
                        onClick={() => {
                          const newRow: any = {
                            size: 'Mới',
                            donGia: 0,
                            k4_k6: 0
                          };
                          updateActivePricing(prev => ({
                            ...prev,
                            anh4K: [...prev.anh4K, newRow]
                          }), true);
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
                            <th className="p-3 w-16 text-center">Xếp</th>
                            <th className="p-3 w-36">Kích Thước</th>
                            <th className="p-3">Đơn Giá VNĐ (Trọn gói)</th>
                            <th className="p-3 w-14 text-center">Xóa</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800 font-mono">
                          {activePricing.anh4K.map((row: any, idx: number) => (
                            <tr key={idx} className="hover:bg-neutral-800/40">
                              <td className="p-2 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    disabled={idx === 0}
                                    onClick={() => {
                                      updateActivePricing(prev => ({
                                        ...prev,
                                        anh4K: moveRowInArray(prev.anh4K, idx, 'up')
                                      }), true);
                                    }}
                                    className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                                    title="Lên trên"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    disabled={idx === activePricing.anh4K.length - 1}
                                    onClick={() => {
                                      updateActivePricing(prev => ({
                                        ...prev,
                                        anh4K: moveRowInArray(prev.anh4K, idx, 'down')
                                      }), true);
                                    }}
                                    className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                                    title="Xuống dưới"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                              <td className="p-3 font-bold text-white">
                                <input
                                  type="text"
                                  value={row.size}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateActivePricing(prev => {
                                      const copy = [...prev.anh4K];
                                      copy[idx].size = val;
                                      return { ...prev, anh4K: copy };
                                    }, true);
                                  }}
                                  className="bg-neutral-800 border border-neutral-700 rounded px-2.5 py-1 text-white w-32 font-mono text-xs focus:outline-none focus:border-[#E7C184]"
                                />
                              </td>
                              <td className="p-2 align-top">
                                <div className="flex flex-col gap-1">
                                  <input
                                    type="number"
                                    value={row.donGia ?? row.k4_k6 ?? ''}
                                    onChange={(e) => {
                                      const val = e.target.value === '' ? null : Number(e.target.value);
                                      updateActivePricing(prev => {
                                        const copy = [...prev.anh4K];
                                        (copy[idx] as any).donGia = val;
                                        (copy[idx] as any).k4_k6 = val;
                                        return { ...prev, anh4K: copy };
                                      }, false);
                                    }}
                                    className="bg-neutral-800 border border-neutral-700 rounded px-2.5 py-1 text-emerald-400 w-36 font-mono text-xs focus:outline-none focus:border-emerald-400 font-semibold"
                                  />
                                  <div className="flex items-center gap-1">
                                    <span className="text-[9px] font-mono text-neutral-500 font-bold select-none">SKU:</span>
                                    <input
                                      type="text"
                                      value={getCellSKU(row, 'donGia', 'anh-4k', activePricingSubTab)}
                                      onChange={(e) => updateRowSKU('anh-4k', idx, 'donGia', e.target.value)}
                                      placeholder={getDefaultSKU('anh-4k', activePricingSubTab, 'donGia', row.size)}
                                      className="bg-neutral-950/90 border border-neutral-800 focus:border-[#E7C184] rounded px-1.5 py-0.5 text-[10px] text-amber-200/90 font-mono tracking-tight focus:outline-none w-28"
                                      title="Sửa mã SKU thủ công"
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => {
                                    updateActivePricing(prev => ({
                                      ...prev,
                                      anh4K: prev.anh4K.filter((_, i) => i !== idx)
                                    }), true);
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
              }

              // Custom Material Tab Render
              const isDongKhungCustom = activeItem.type === 'dongKhung';
              const colConfig = activePricing.columnLabels || defaultColumnLabels;

              return (
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-4 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#E7C184]">{activeItem.title}</h3>
                      <p className="text-xs text-neutral-400">
                        Chất liệu tùy chỉnh ({isDongKhungCustom ? 'Hệ Đóng Khung' : 'Hệ In Ép'}). Chỉnh sửa giá VNĐ, tùy biến size & thứ tự dòng.
                      </p>
                    </div>
                    <button
                      onClick={() => addSizeToCustomTab(activeItem.id)}
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
                          <th className="p-2.5 w-16 text-center">Xếp</th>
                          <th className="p-2.5 w-24">Cỡ Ảnh</th>
                          {(isDongKhungCustom ? (activePricing.frameColumnKeys || defaultFrameColumnKeys) : (activePricing.inEpColumnKeys || defaultInEpColumnKeys)).map(colKey => (
                            <th key={colKey} className="p-2.5">{colConfig[colKey as keyof typeof colConfig] || colKey}</th>
                          ))}
                          <th className="p-2.5 w-12 text-center">Xóa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800 font-mono">
                        {activeItem.rows.map((row: any, idx: number) => (
                          <tr key={idx} className="hover:bg-neutral-800/40">
                            <td className="p-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  disabled={idx === 0}
                                  onClick={() => moveCustomTabRow(activeItem.id, idx, 'up')}
                                  className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                                  title="Lên trên"
                                >
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  disabled={idx === activeItem.rows.length - 1}
                                  onClick={() => moveCustomTabRow(activeItem.id, idx, 'down')}
                                  className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                                  title="Xuống dưới"
                                >
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                            <td className="p-2 font-bold text-white">
                              <input
                                type="text"
                                value={row.size}
                                onChange={(e) => updateCustomTabRowCell(activeItem.id, idx, 'size', e.target.value)}
                                className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white w-20 font-mono text-xs focus:outline-none focus:border-[#E7C184]"
                              />
                            </td>
                            {(isDongKhungCustom ? (activePricing.frameColumnKeys || defaultFrameColumnKeys) : (activePricing.inEpColumnKeys || defaultInEpColumnKeys)).map((colKey) => (
                              <td key={colKey} className="p-2 align-top">
                                <div className="flex flex-col gap-1">
                                  <input
                                    type="number"
                                    value={row[colKey] ?? (colKey === 'inEpMikaCol' ? row.inEpMika : '') ?? ''}
                                    placeholder="-"
                                    onChange={(e) => {
                                      const val = e.target.value === '' ? null : Number(e.target.value);
                                      updateCustomTabRowCell(activeItem.id, idx, colKey, val);
                                      if (colKey === 'inEpMikaCol') {
                                        updateCustomTabRowCell(activeItem.id, idx, 'inEpMika', val);
                                      }
                                    }}
                                    className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-[#E7C184] w-28 font-mono text-xs focus:outline-none focus:border-[#E7C184] font-semibold"
                                  />
                                  <div className="flex items-center gap-1">
                                    <span className="text-[9px] font-mono text-neutral-500 font-bold select-none">SKU:</span>
                                    <input
                                      type="text"
                                      value={getCellSKU(row, colKey, activeItem.id, activePricingSubTab)}
                                      onChange={(e) => updateRowSKU(activeItem.id, idx, colKey, e.target.value)}
                                      placeholder={getDefaultSKU(activeItem.id, activePricingSubTab, colKey, row.size)}
                                      className="bg-neutral-950/90 border border-neutral-800 focus:border-[#E7C184] rounded px-1.5 py-0.5 text-[10px] text-amber-200/90 font-mono tracking-tight focus:outline-none w-24"
                                      title="Sửa mã SKU thủ công"
                                    />
                                  </div>
                                </div>
                              </td>
                            ))}
                            <td className="p-2 text-center">
                              <button
                                onClick={() => deleteRowFromCustomTab(activeItem.id, idx)}
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

                  {/* DIRECT BASE64 IMAGE COMPRESSION UPLOAD SECTION */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#E7C184]" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Ảnh Chụp Thật (Lưu Trực Tiếp Vào Firestore)
                        </span>
                      </div>
                      
                      {/* Direct Compressed File Upload */}
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors shadow">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Đang nén ảnh...' : 'Tải Ảnh Mới Lên'}</span>
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
                              const base64Url = await compressImageFile(file, 1200, 1200, 0.75);
                              const newImageItem = {
                                name: `${frameFormData.name || frameFormData.code}: ${file.name}`,
                                url: base64Url,
                                tag: frameFormData.code || 'Mẫu mới',
                                colorHex: '#4A2A16'
                              };
                              setFrameFormData(prev => ({
                                ...prev,
                                hasRealPhotos: true,
                                images: [...(prev.images || []), newImageItem]
                              }));
                              showToast('Đã nén & nạp ảnh mẫu khung thành công!');
                            } catch (err) {
                              console.error(err);
                              showToast('Lỗi khi nén ảnh!', 'error');
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
                                <span className="text-[10px] text-neutral-400 truncate hidden sm:inline">Chuỗi ảnh nén Base64</span>
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
                          Chưa có ảnh nào. Bấm nút <strong>"Tải Ảnh Mới Lên"</strong> để chọn ảnh từ máy hoặc chụp từ điện thoại (tự động nén lưu trực tiếp vào Firestore).
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

        {/* TAB 3: GALLERY REAL PHOTOS */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/80 border border-neutral-800 p-4 sm:p-5 rounded-2xl shadow-xl">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white font-serif-display flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#E7C184]" />
                  <span>Quản Lý Ảnh Thực Tế Của Khách (Album & Khung Hoàn Thiện)</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Đăng tải hình ảnh thực tế sản phẩm xưởng đã bàn giao cho khách. Hiển thị ở cuối trang chủ với chế độ xem phóng to (Lightbox) tối ưu cho điện thoại & máy tính.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm('Bạn có chắc chắn muốn XÓA SẠCH toàn bộ ảnh thực tế khỏi hệ thống?')) {
                      setLocalRealPhotos([]);
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('hung_decor_real_photos');
                      }
                      try {
                        await saveRealPhotos([]);
                        showToast('Đã xóa sạch toàn bộ ảnh thực tế trên Firestore thành công!');
                      } catch (e) {
                        showToast('Lỗi khi xóa ảnh trên Firestore', 'error');
                      }
                    }
                  }}
                  disabled={isSaving || localRealPhotos.length === 0}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa Hết Ảnh Mẫu</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await saveRealPhotos(localRealPhotos);
                      showToast('Đã lưu danh sách Ảnh Thực Tế lên Firestore thành công!');
                    } catch (e) {
                      showToast('Lỗi khi lưu danh sách ảnh thực tế!', 'error');
                    }
                  }}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Đang lưu...' : 'Lưu Danh Sách Ảnh Thực Tế'}</span>
                </button>
              </div>
            </div>

            {/* Form Thêm Ảnh Mới */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
              <h3 className="text-sm font-bold text-[#E7C184] uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Thêm Ảnh Thực Tế Mới</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Tiêu Đề Ảnh / Tên Sản Phẩm
                  </label>
                  <input
                    type="text"
                    value={newPhotoTitle}
                    onChange={(e) => setNewPhotoTitle(e.target.value)}
                    placeholder="vd: Khung Gỗ Óc Chó 60x90cm"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Ghi Chú / Chú Thích Phụ
                  </label>
                  <input
                    type="text"
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    placeholder="vd: Ảnh cưới phủ Mika bóng - Studio Hùng Decor"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Đường Dẫn Ảnh (URL) Hoặc Tải Từ Máy
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#E7C184] truncate"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-semibold cursor-pointer shrink-0 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#E7C184]" />
                      <span>Chọn file</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const base64Url = await compressImageFile(file, 1200, 1200, 0.75);
                            setNewPhotoUrl(base64Url);
                            showToast('Đã nén & nạp file ảnh thành công!');
                          } catch (err) {
                            console.error(err);
                            showToast('Lỗi khi nén ảnh!', 'error');
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!newPhotoUrl.trim()) {
                      alert('Vui lòng chọn file ảnh hoặc dán URL ảnh!');
                      return;
                    }
                    const newPhoto: RealGalleryPhoto = {
                      id: `photo_${Date.now()}`,
                      title: newPhotoTitle.trim() || 'Ảnh thực tế sản phẩm',
                      url: newPhotoUrl.trim(),
                      caption: newPhotoCaption.trim() || 'Hùng Decor Fine Art Print'
                    };
                    setLocalRealPhotos(prev => [newPhoto, ...prev]);
                    setNewPhotoTitle('');
                    setNewPhotoUrl('');
                    setNewPhotoCaption('');
                    showToast('Đã thêm ảnh vào danh sách! Hãy bấm "Lưu Danh Sách Ảnh Thực Tế".');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#E7C184] hover:bg-[#D4AF37] text-[#1C1917] font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Ảnh Vào Thư Viện</span>
                </button>
              </div>
            </div>

            {/* Danh Sách Ảnh Hiện Tại */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>Danh Sách Ảnh Đang Hiển Thị ({localRealPhotos.length})</span>
                </h3>
                <span className="text-xs text-neutral-400">
                  Tỉ lệ hiển thị chuẩn: 2:3 (Đứng)
                </span>
              </div>

              {localRealPhotos.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-xs">
                  Chưa có ảnh nào trong thư viện. Thêm ảnh mới ở khung phía trên.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {localRealPhotos.map((photo, idx) => (
                    <div
                      key={photo.id || idx}
                      className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex flex-col justify-between space-y-3 relative group"
                    >
                      {/* Image Preview */}
                      <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-neutral-900 border border-white/10">
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#E7C184]">
                          #{idx + 1}
                        </div>
                      </div>

                      {/* Photo inputs */}
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase">Tiêu đề</label>
                          <input
                            type="text"
                            value={photo.title}
                            onChange={(e) => {
                              const copy = [...localRealPhotos];
                              copy[idx] = { ...copy[idx], title: e.target.value };
                              setLocalRealPhotos(copy);
                            }}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#E7C184]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase">Ghi chú</label>
                          <input
                            type="text"
                            value={photo.caption || ''}
                            onChange={(e) => {
                              const copy = [...localRealPhotos];
                              copy[idx] = { ...copy[idx], caption: e.target.value };
                              setLocalRealPhotos(copy);
                            }}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-300 focus:outline-none focus:border-[#E7C184]"
                          />
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const updated = moveRowInArray(localRealPhotos, idx, 'up');
                              setLocalRealPhotos(updated);
                            }}
                            className="p-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 cursor-pointer"
                            title="Chuyển lên trước"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === localRealPhotos.length - 1}
                            onClick={() => {
                              const updated = moveRowInArray(localRealPhotos, idx, 'down');
                              setLocalRealPhotos(updated);
                            }}
                            className="p-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 cursor-pointer"
                            title="Chuyển xuống sau"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (window.confirm('Bạn có chắc muốn xóa ảnh này?')) {
                              const photoId = photo.id;
                              setLocalRealPhotos(prev => prev.filter((p, i) => photoId ? p.id !== photoId : i !== idx));
                              showToast('Đã xóa ảnh khỏi danh sách!');
                            }
                          }}
                          className="relative z-20 inline-flex items-center justify-center p-2 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/30 rounded-lg transition-all cursor-pointer shadow-xs active:scale-95"
                          title="Xóa ngay ảnh này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: SHOP INFO */}
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

      {/* MODAL: THÊM CHẤT LIỆU MỚI */}
      {isAddingMaterialModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#121110]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1C1917] border border-neutral-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-serif-display font-bold text-base text-white">Thêm Chất Liệu Mới</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingMaterialModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Tên dòng sản phẩm / Chất liệu mới
                </label>
                <input
                  type="text"
                  value={newMaterialTitle}
                  onChange={(e) => setNewMaterialTitle(e.target.value)}
                  placeholder="Ví dụ: 6. Tráng Gương Pha Lê Premium"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Kiểu cấu trúc bảng giá
                </label>
                <div className="space-y-2">
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    newMaterialType === 'dongKhung'
                      ? 'bg-neutral-800 border-[#E7C184] text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}>
                    <input
                      type="radio"
                      name="materialType"
                      checked={newMaterialType === 'dongKhung'}
                      onChange={() => setNewMaterialType('dongKhung')}
                      className="mt-0.5 accent-[#E7C184]"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">Cấu trúc Bảng Khung</div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Có đơn giá Bo viền & các loại hệ khung (KX, HT10, K12, Titan M, Titan C...)</p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    newMaterialType === 'inEpMika'
                      ? 'bg-neutral-800 border-[#E7C184] text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}>
                    <input
                      type="radio"
                      name="materialType"
                      checked={newMaterialType === 'inEpMika'}
                      onChange={() => setNewMaterialType('inEpMika')}
                      className="mt-0.5 accent-[#E7C184]"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">Cấu trúc Bảng In Ép</div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Có các cột In ảnh, In ép lụa, In ép Mika, In Plastic, Khung gia cố</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAddingMaterialModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-neutral-300 bg-white/10 hover:bg-white/15 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleCreateMaterialTab}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Xác nhận tạo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: THÊM CỘT KHUNG MỚI */}
      {isAddingColumnModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#121110]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1C1917] border border-neutral-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-serif-display font-bold text-base text-white">Thêm Cột Khung Mới</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingColumnModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Tên tiêu đề cột khung mới
                </label>
                <input
                  type="text"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="Ví dụ: Khung Gỗ Hàn Quốc, Khung Phào Chỉ..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E7C184]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Áp dụng cho loại bảng
                </label>
                <div className="space-y-2">
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    newColumnTargetType === 'dongKhung'
                      ? 'bg-neutral-800 border-[#E7C184] text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}>
                    <input
                      type="radio"
                      name="columnTargetType"
                      checked={newColumnTargetType === 'dongKhung'}
                      onChange={() => setNewColumnTargetType('dongKhung')}
                      className="mt-0.5 accent-[#E7C184]"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">Bảng Các Hệ Khung (Mặc định)</div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Thêm cột này vào các dòng sản phẩm Gỗ Lụa, HD Gương, Mika...</p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    newColumnTargetType === 'inEpMika'
                      ? 'bg-neutral-800 border-[#E7C184] text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}>
                    <input
                      type="radio"
                      name="columnTargetType"
                      checked={newColumnTargetType === 'inEpMika'}
                      onChange={() => setNewColumnTargetType('inEpMika')}
                      className="mt-0.5 accent-[#E7C184]"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">Bảng In Ép & Gia Cố</div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Thêm cột này vào dòng sản phẩm In Ép & Giá khung gia cố</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAddingColumnModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-neutral-300 bg-white/10 hover:bg-white/15 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleAddNewColumn}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Cột Ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

