'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Delete, Edit, Add, Close, CloudUpload } from '@mui/icons-material';

const API_BASE_URL = 'https://api.eslamoffers.com/api';

export default function BannerManagement() {
  // State for banners
  const [banners, setBanners] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for banner form
  const [bannerData, setBannerData] = useState({
    imageUrl: null,
    altText: '',
    link: '',
    priority: 0
  });
  
  // State for file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // State for edit/delete operations
  const [editBannerId, setEditBannerId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteBannerId, setDeleteBannerId] = useState(null);
  
  // State for feedback
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  // State for linking to store
  const [linkType, setLinkType] = useState('external');
  const [selectedStore, setSelectedStore] = useState('');

  // دالة للحصول على التوكن من الكوكيز
  const getTokenFromCookies = () => {
    if (typeof window === 'undefined') return '';
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : '';
  };
  
  // التحقق من وجود التوكن وإعادة التوجيه إذا لم يكن موجوداً
  useEffect(() => {
    const token = getTokenFromCookies();
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchBanners();
    fetchStores();
  }, []);
  
  // معالجة أخطاء 401 (غير مصرح)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);
  
  // Auto-hide snackbar after 3 seconds
  useEffect(() => {
    if (openSnackbar) {
      const timer = setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [openSnackbar]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/Banner/GetAllBanners`);
      setBanners(response.data);
    } catch (error) {
      showMessage('Failed to fetch banners', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStores = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Store/GetAllStores`);
      setStores(response.data);
    } catch (error) {
      showMessage('Failed to fetch stores', 'error');
    }
  };
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
      handleFile(file);
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };
  
  const handleFile = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleLinkTypeChange = (event) => {
    setLinkType(event.target.value);
    setBannerData({
      ...bannerData,
      link: ''
    });
    setSelectedStore('');
  };
  
  const handleStoreChange = (event) => {
    const storeId = event.target.value;
    const selectedStore = stores.find(store => store.id === storeId);
    setSelectedStore(storeId);
    setBannerData({
      ...bannerData,
      link: `/stores/${selectedStore.slug || storeId}`
    });
  };
  
  const handleAddBanner = async () => {
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('ImageUrl', selectedFile);
      }
      formData.append('AltText', bannerData.altText);
      formData.append('Link', bannerData.link);
      formData.append('Priority', bannerData.priority);
      
      await axios.post(`${API_BASE_URL}/Banner/AddBanner`, formData);
      showMessage('Banner added successfully', 'success');
      resetForm();
      fetchBanners();
      setOpenModal(false);
    } catch (error) {
      showMessage('Failed to add banner', 'error');
    }
  };
  
  const handleUpdateBanner = async () => {
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('ImageUrl', selectedFile);
      }
      formData.append('AltText', bannerData.altText);
      formData.append('Link', bannerData.link);
      formData.append('Priority', bannerData.priority);
      
      await axios.put(`${API_BASE_URL}/Banner/UpdateBanner/${editBannerId}`, formData);
      showMessage('Banner updated successfully', 'success');
      resetForm();
      fetchBanners();
      setOpenModal(false);
    } catch (error) {
      showMessage('Failed to update banner', 'error');
    }
  };
  
  const handleDeleteBanner = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/Banner/DeleteBanner/${deleteBannerId}`);
      showMessage('Banner deleted successfully', 'success');
      setOpenDeleteDialog(false);
      fetchBanners();
    } catch (error) {
      showMessage('Failed to delete banner', 'error');
    }
  };
  
  const openEditDialog = (banner) => {
    setEditBannerId(banner.id);
    setBannerData({
      link: banner.link,
      altText: banner.altText || '',
      priority: banner.priority
    });
    
    if (banner.link && banner.link.startsWith('/stores/')) {
      setLinkType('store');
      const pathParts = banner.link.split('/');
      const storeIdentifier = pathParts[pathParts.length - 1];
      
      // البحث عن المتجر باستخدام الـ slug أو الـ ID
      const store = stores.find(s => s.slug === storeIdentifier || s.id === storeIdentifier);
      setSelectedStore(store?.id || '');
    } else {
      setLinkType('external');
      setSelectedStore('');
    }
    
    setPreviewUrl(banner.imageUrl ? `https://api.eslamoffers.com/uploads/${banner.imageUrl}` : '');
    setOpenModal(true);
  };
  
  const resetForm = () => {
    setBannerData({
      imageUrl: null,
      altText: '',
      link: '',
      priority: 0
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setEditBannerId(null);
    setLinkType('external');
    setSelectedStore('');
  };
  
  const showMessage = (msg, sev) => {
    setMessage(msg);
    setSeverity(sev);
    setOpenSnackbar(true);
  };

  // دالة لاستخراج اسم المتجر من الرابط
  const getStoreNameFromLink = (link) => {
    if (!link || !link.startsWith('/stores/')) return null;
    
    const pathParts = link.split('/');
    const storeIdentifier = pathParts[pathParts.length - 1];
    
    // البحث عن المتجر باستخدام الـ slug أو الـ ID
    const store = stores.find(s => s.slug === storeIdentifier || s.id === storeIdentifier);
    return store?.name || null;
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold text-center mb-8 text-teal-600">إدارة البانرات</h1>
      
      {/* Add Banner Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            resetForm();
            setOpenModal(true);
          }}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer transition-colors duration-200"
        >
          <Add className="ml-1" />
          إضافة بانر جديد
        </button>
      </div>
      
      {/* Feedback Snackbar */}
      {openSnackbar && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 ${
          severity === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          <div className="flex justify-between items-center">
            <span>{message}</span>
            <button onClick={() => setOpenSnackbar(false)} className="ml-4 cursor-pointer">
              <Close className="text-lg" />
            </button>
          </div>
        </div>
      )}
      
      {/* Add/Edit Banner Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-[#00000098] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-teal-600">
                {editBannerId ? 'تعديل البانر' : 'إضافة بانر جديد'}
              </h2>
              <button 
                onClick={() => {
                  resetForm();
                  setOpenModal(false);
                }} 
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <Close />
              </button>
            </div>
            
            <div className="p-6">
              {/* Professional Drag & Drop Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">صورة البانر</label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                    isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-teal-400'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {previewUrl ? (
                    <div className="relative">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="mx-auto h-40 w-auto rounded-lg object-contain border border-gray-200"
                      />
                      <button
                        onClick={() => {
                          setPreviewUrl('');
                          setSelectedFile(null);
                        }}
                        className="absolute top-0 left-0 bg-red-500 text-white rounded-full p-1 -translate-x-1/2 -translate-y-1/2 shadow-md hover:bg-red-600 cursor-pointer"
                      >
                        <Close className="text-sm" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <CloudUpload className="text-4xl text-gray-400 mb-3" />
                      <p className="text-gray-500 mb-2">اسحب وأسقط الصورة هنا أو</p>
                      <label className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg inline-flex items-center transition-colors duration-200">
                        اختر صورة
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="text-xs text-gray-400 mt-2">JPG, PNG, GIF (الحد الأقصى: 5MB)</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Alt Text Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">نص بديل للصورة (Alt Text)</label>
                <input
                  type="text"
                  value={bannerData.altText}
                  onChange={(e) => setBannerData({...bannerData, altText: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  placeholder="أدخل النص البديل للصورة"
                />
                <p className="text-xs text-gray-500 mt-1">هذا النص يظهر عندما لا تظهر الصورة، وهو مهم لتحسين محركات البحث</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع الرابط</label>
                <select
                  value={linkType}
                  onChange={handleLinkTypeChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 cursor-pointer"
                >
                  <option value="external">رابط خارجي</option>
                  <option value="store">متجر</option>
                </select>
              </div>
              
              {linkType === 'external' ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">الرابط</label>
                  <input
                    type="text"
                    value={bannerData.link}
                    onChange={(e) => setBannerData({...bannerData, link: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    placeholder="أدخل الرابط"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">اختر المتجر</label>
                  <select
                    value={selectedStore}
                    onChange={handleStoreChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 cursor-pointer"
                  >
                    <option value="">اختر متجر</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">الأولوية</label>
                <input
                  type="number"
                  value={bannerData.priority}
                  onChange={(e) => setBannerData({...bannerData, priority: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  placeholder="أدخل الأولوية"
                />
                <p className="text-xs text-gray-500 mt-1">كلما زاد الرقم زادت أولوية ظهور البانر</p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    resetForm();
                    setOpenModal(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                >
                  إلغاء
                </button>
                <button
                  onClick={editBannerId ? handleUpdateBanner : handleAddBanner}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg cursor-pointer transition-colors duration-200"
                >
                  {editBannerId ? 'تحديث البانر' : 'حفظ البانر'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Banners List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-teal-600">قائمة البانرات</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
          </div>
        ) : banners.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            لا توجد بانرات متاحة
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصورة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النص البديل</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الرابط</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الأولوية</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الإنشاء</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {banner.imageUrl ? (
                        <div className="relative group w-[150px]">
                          <img 
                            src={`https://api.eslamoffers.com/uploads/${banner.imageUrl}`} 
                            alt={banner.altText || 'بصري إعلاني'} 
                            className="h-16 rounded-lg w-[300px] border border-gray-200"
                          />
                         </div>
                      ) : (
                        <span className="text-gray-400">لا توجد صورة</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {banner.altText
                        ? banner.altText.split(" ").slice(0, 5).join(" ") + 
                          (banner.altText.split(" ").length > 5 ? "..." : "")
                        : 'لا يوجد نص بديل'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {banner.link ? (
                        banner.link.startsWith('/stores/') ? (
                          getStoreNameFromLink(banner.link) || banner.link
                        ) : (
                          banner.link.length > 30
                            ? banner.link.substring(0, 30) + "..."
                            : banner.link
                        )
                      ) : 'لا يوجد رابط'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {banner.priority}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(banner.createdAt).toLocaleDateString('ar-EG')}
                    </td>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  <div className="flex items-center gap-2">
    <button
      onClick={() => openEditDialog(banner)}
      className="bg-teal-100 text-teal-700 hover:bg-teal-200 p-2 rounded-lg hover:shadow-md cursor-pointer transition-all duration-200 mr-2"
      title="تعديل"
    >
      تعديل
      <Edit className="text-xl" />
    </button>
    <button
      onClick={() => {
        setDeleteBannerId(banner.id);
        setOpenDeleteDialog(true);
      }}
      className="bg-red-100 text-red-700 hover:bg-red-200 p-2 rounded-lg hover:shadow-md cursor-pointer transition-all duration-200"
      title="حذف"
    >
      حذف
      <Delete className="text-xl" />
    </button>
  </div>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      {openDeleteDialog && (
        <div className="fixed inset-0 bg-[#00000098] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">تأكيد الحذف</h3>
              <button 
                onClick={() => setOpenDeleteDialog(false)} 
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <Close />
              </button>
            </div>
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Delete className="text-red-600 text-3xl" />
                </div>
              </div>
              <p className="text-gray-600 text-center">هل أنت متأكد من حذف هذا البانر؟ لا يمكن التراجع عن هذا الإجراء.</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setOpenDeleteDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteBanner}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer transition-colors duration-200"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}