'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Delete, Edit, Close, CloudUpload, Add, Star, LocalOffer, Store } from '@mui/icons-material';

const API_BASE_URL = 'https://api.eslamoffers.com/api';

const CouponsAdminPanel = () => {
  // State management
  const [coupons, setCoupons] = useState([]);
  const [bestCoupons, setBestCoupons] = useState([]);
  const [bestDiscountCoupons, setBestDiscountCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [stores, setStores] = useState([]);
  const [storeSearchTerm, setStoreSearchTerm] = useState('');
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  
  // Add coupon state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    title: '',
    descriptionCoupon: '',
    discount: 10,
    couponCode: '',
    stratDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    isActive: true,
    isBest: false,
    isBestDiscount: false,
    linkRealStore: '',
    slugStore: '',
    selectedStore: null,
    altText: ''
  });
  
  // Edit coupon state
  const [editCoupon, setEditCoupon] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showEditStoreDropdown, setShowEditStoreDropdown] = useState(false);
  const [editStoreSearchTerm, setEditStoreSearchTerm] = useState('');
  
  // Delete coupon state
  const [deleteCouponId, setDeleteCouponId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // UI feedback
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Get token from cookies
  const getTokenFromCookies = () => {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
      return tokenCookie ? tokenCookie.split('=')[1] : '';
    }
    return '';
  };

  // Initialize token from cookies
  useEffect(() => {
    const tokenFromCookies = getTokenFromCookies();
    if (!tokenFromCookies) {
      window.location.href = '/admin/login';
    }
    setToken(tokenFromCookies);
  }, []);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchAllData();
      fetchStores();
    }
  }, [token]);

  // Response interceptor for handling 401 errors
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

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [allCoupons, best, bestDiscount] = await Promise.all([
        axios.get(`${API_BASE_URL}/Coupons/GetAllCoupons`),
        axios.get(`${API_BASE_URL}/Coupons/GetBestCoupons/Best`),
        axios.get(`${API_BASE_URL}/Coupons/GetBestCoupons/BestDiscount`)
      ]);
      
      // Clean and ensure all fields are strings
      const cleanCoupons = (coupons) => {
        return coupons.map(coupon => ({
          ...coupon,
          title: typeof coupon.title === 'string' ? coupon.title : String(coupon.title || ''),
          descriptionCoupon: typeof coupon.descriptionCoupon === 'string' ? coupon.descriptionCoupon : String(coupon.descriptionCoupon || ''),
          couponCode: typeof coupon.couponCode === 'string' ? coupon.couponCode : String(coupon.couponCode || ''),
          linkRealStore: typeof coupon.linkRealStore === 'string' ? coupon.linkRealStore : String(coupon.linkRealStore || ''),
          altText: typeof coupon.altText === 'string' ? coupon.altText : String(coupon.altText || ''),
          imageUrl: typeof coupon.imageUrl === 'string' ? coupon.imageUrl : String(coupon.imageUrl || ''),
          slugStore: typeof coupon.slugStore === 'string' ? coupon.slugStore : String(coupon.slugStore || '')
        }));
      };
      
      setCoupons(cleanCoupons(allCoupons.data));
      setBestCoupons(cleanCoupons(best.data));
      setBestDiscountCoupons(cleanCoupons(bestDiscount.data));
    } catch (error) {
      const errorMessage = error.response?.data ? 
        (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : 
        'فشل في جلب بيانات الكوبونات';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stores
  const fetchStores = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Store/GetAllStores`);
      setStores(response.data);
    } catch (error) {
      const errorMessage = error.response?.data ? 
        (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : 
        'فشل في جلب بيانات المتاجر';
      showMessage(errorMessage, 'error');
    }
  };

  // Handle file change for both add and edit
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new coupon
  const handleAddCoupon = async () => {
    try {
      const formData = new FormData();
      
      // Append all fields to formData
      formData.append('Title', newCoupon.title);
      formData.append('Description', newCoupon.descriptionCoupon);
      formData.append('Discount', newCoupon.discount);
      formData.append('CouponCode', newCoupon.couponCode);
      formData.append('StratDate', newCoupon.stratDate);
      formData.append('EndDate', newCoupon.endDate);
      formData.append('IsActive', newCoupon.isActive);
      formData.append('IsBest', newCoupon.isBest);
      formData.append('IsBestDiscount', newCoupon.isBestDiscount);
      formData.append('LinkRealStore', newCoupon.linkRealStore);
      formData.append('SlugStore', newCoupon.slugStore);
      formData.append('AltText', newCoupon.altText);
      
      if (selectedFile) {
        formData.append('ImageUrl', selectedFile);
      }

      await axios.post(`${API_BASE_URL}/Coupons/AddCoupon`, formData);
      
      showMessage('تمت إضافة الكوبون بنجاح', 'success');
      setOpenAddModal(false);
      resetNewCouponForm();
      fetchAllData();
    } catch (error) {
      const errorMessage = error.response?.data ? 
        (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : 
        'فشل في إضافة الكوبون';
      showMessage(errorMessage, 'error');
    }
  };

  // Update coupon
  const handleUpdateCoupon = async () => {
    try {
      const formData = new FormData();
      
      // Append all fields to formData
      formData.append('Title', editCoupon.title);
      formData.append('Description', editCoupon.descriptionCoupon);
      formData.append('Discount', editCoupon.discount);
      formData.append('CouponCode', editCoupon.couponCode);
      formData.append('StratDate', editCoupon.stratDate);
      formData.append('EndDate', editCoupon.endDate);
      formData.append('IsActive', editCoupon.isActive);
      formData.append('IsBest', editCoupon.isBest);
      formData.append('IsBestDiscount', editCoupon.isBestDiscount);
      formData.append('LinkRealStore', editCoupon.linkRealStore);
      formData.append('SlugStore', editCoupon.slugStore);
      formData.append('AltText', editCoupon.altText);
      
      if (selectedFile) {
        formData.append('ImageUrl', selectedFile);
      }

      await axios.put(`${API_BASE_URL}/Coupons/UpdateCoupon/${editCoupon.id}`, formData);
      
      showMessage('تم تحديث الكوبون بنجاح', 'success');
      setOpenEditModal(false);
      fetchAllData();
    } catch (error) {
      const errorMessage = error.response?.data ? 
        (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : 
        'فشل في تحديث الكوبون';
      showMessage(errorMessage, 'error');
    }
  };

  // Delete coupon
  const handleDeleteCoupon = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/Coupons/DeleteCoupons/${deleteCouponId}`);
      showMessage('تم حذف الكوبون بنجاح', 'success');
      setOpenDeleteDialog(false);
      fetchAllData();
    } catch (error) {
      const errorMessage = error.response?.data ? 
        (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : 
        'فشل في حذف الكوبون';
      showMessage(errorMessage, 'error');
    }
  };

  // Increment coupon usage
  const incrementCouponUsage = async (couponId) => {
    try {
      await axios.put(`${API_BASE_URL}/Coupons/NumberUsed/${couponId}`);
      fetchAllData();
    } catch (error) {
      const errorMessage = error.response?.data ? 
        (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : 
        'فشل في تحديث استخدام الكوبون';
      showMessage(errorMessage, 'error');
    }
  };

  // Open edit dialog
  const openEditDialog = (coupon) => {
    // Find the store that matches the coupon's slugStore
    const matchingStore = stores.find(store => store.slug === coupon.slugStore);
    
    setEditCoupon({
      ...coupon,
      stratDate: coupon.stratDate.slice(0, 16),
      endDate: coupon.endDate.slice(0, 16),
      selectedStore: matchingStore || null
    });
    setPreviewUrl(coupon.imageUrl ? `https://api.eslamoffers.com/uploads/${coupon.imageUrl}` : '');
    setSelectedFile(null);
    setOpenEditModal(true);
    setEditStoreSearchTerm('');
  };

  // Reset new coupon form
  const resetNewCouponForm = () => {
    setNewCoupon({
      title: '',
      descriptionCoupon: '',
      discount: 10,
      couponCode: '',
      stratDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      isActive: true,
      isBest: false,
      isBestDiscount: false,
      linkRealStore: '',
      slugStore: '',
      selectedStore: null,
      altText: ''
    });
    setPreviewUrl('');
    setSelectedFile(null);
    setStoreSearchTerm('');
  };

  // Show message
  const showMessage = (msg, sev) => {
    setMessage(msg);
    setSeverity(sev);
    setOpenSnackbar(true);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get current coupons based on active tab
  const getCurrentCoupons = () => {
    switch (activeTab) {
      case 'best':
        return bestCoupons;
      case 'bestDiscount':
        return bestDiscountCoupons;
      default:
        return coupons;
    }
  };

  // Handle store selection for new coupon
  const handleStoreSelect = (store) => {
    setNewCoupon({
      ...newCoupon,
      slugStore: store.slug,
      selectedStore: store
    });
    setShowStoreDropdown(false);
  };

  // Handle store selection for edit coupon
  const handleEditStoreSelect = (store) => {
    setEditCoupon({
      ...editCoupon,
      slugStore: store.slug,
      selectedStore: store
    });
    setShowEditStoreDropdown(false);
  };

  // Filter stores based on search term
  const filteredStores = (searchTerm) => {
    return stores.filter(store => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      store.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold text-center mb-8 text-teal-600">إدارة الكوبونات</h1>
      
      {/* Feedback Snackbar */}
      {openSnackbar && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 ${
          severity === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          <div className="flex justify-between items-center">
            <span>{message}</span>
            <button onClick={() => setOpenSnackbar(false)} className="mr-4 cursor-pointer">
              <Close className="text-lg" />
            </button>
          </div>
        </div>
      )}
      
      {/* Tabs and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg cursor-pointer ${activeTab === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            جميع الكوبونات
          </button>
          <button
            onClick={() => setActiveTab('best')}
            className={`px-4 py-2 cursor-pointer rounded-lg flex items-center ${activeTab === 'best' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <Star className="ml-1" /> أفضل الكوبونات
          </button>
          <button
            onClick={() => setActiveTab('bestDiscount')}
            className={`px-4 py-2 rounded-lg cursor-pointer flex items-center ${activeTab === 'bestDiscount' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <LocalOffer className="ml-1" /> أفضل الخصومات
          </button>
        </div>
        
        <button
          onClick={() => setOpenAddModal(true)}
          className="px-4 py-2 cursor-pointer bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center"
        >
          <Add className="ml-1" /> إضافة كوبون
        </button>
      </div>
      
      {/* Coupons List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل الكوبونات...</p>
          </div>
        ) : getCurrentCoupons().length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            لا توجد كوبونات متاحة في هذه الفئة
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصورة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العنوان</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكود</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الخصم</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التواريخ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentCoupons().map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.imageUrl ? (
                        <img 
                          src={`https://api.eslamoffers.com/uploads/${typeof coupon.imageUrl === 'string' ? coupon.imageUrl : String(coupon.imageUrl || '')}`} 
                          alt={typeof (coupon.altText || coupon.title) === 'string' ? (coupon.altText || coupon.title) : String(coupon.altText || coupon.title || "Coupon")} 
                          className="     "
                        />
                      ) : (
                        <span className="text-gray-400">لا توجد صورة</span>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-medium">{typeof coupon.title === 'string' ? coupon.title : String(coupon.title || '')}</div>
                      <div className="text-sm text-gray-500 truncate">{typeof coupon.descriptionCoupon === 'string' ? coupon.descriptionCoupon : String(coupon.descriptionCoupon || '')}</div>
                      {coupon.slugStore && (
                        <div className="text-xs text-gray-400 mt-1 flex items-center">
                          <Store className="text-xs ml-1" /> 
                          {typeof coupon.slugStore === 'string' ? coupon.slugStore : String(coupon.slugStore || '')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      {typeof coupon.couponCode === 'string' ? coupon.couponCode : String(coupon.couponCode || '')}
                      <div className="text-xs text-gray-500 mt-1">استخدم: {typeof coupon.number === 'number' ? coupon.number : (typeof coupon.number === 'string' ? parseInt(coupon.number) || 0 : 0)} مرة</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                        {typeof coupon.discount === 'number' ? coupon.discount : (typeof coupon.discount === 'string' ? parseInt(coupon.discount) || 0 : 0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div>البداية: {formatDate(typeof coupon.stratDate === 'string' ? coupon.stratDate : String(coupon.stratDate || ''))}</div>
                      <div>النهاية: {formatDate(typeof coupon.endDate === 'string' ? coupon.endDate : String(coupon.endDate || ''))}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        Boolean(coupon.isActive) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {Boolean(coupon.isActive) ? 'نشط' : 'غير نشط'}
                      </span>
                      {Boolean(coupon.isBest) && (
                        <span className="mr-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          أفضل
                        </span>
                      )}
                      {Boolean(coupon.isBestDiscount) && (
                        <span className="mr-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          أفضل خصم
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => incrementCouponUsage(coupon.id)}
                        className="text-blue-600 hover:text-blue-900 ml-2 p-1 rounded-full hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                        title="زيادة الاستخدام"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => openEditDialog(coupon)}
                        className="text-teal-600 hover:text-teal-900 ml-2 p-1 rounded-full hover:bg-teal-50 cursor-pointer transition-colors duration-200"
                        title="تعديل"
                      >
                        <Edit className="text-xl" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteCouponId(coupon.id);
                          setOpenDeleteDialog(true);
                        }}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 cursor-pointer transition-colors duration-200"
                        title="حذف"
                      >
                        <Delete className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Add Coupon Modal */}
      {openAddModal && (
        <div className="fixed inset-0 bg-[#00000098] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-teal-600">إضافة كوبون جديد</h2>
              <button 
                onClick={() => {
                  setOpenAddModal(false);
                  resetNewCouponForm();
                }} 
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <Close />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Right Column */}
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">صورة الكوبون</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
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
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 translate-x-1/2 -translate-y-1/2 shadow-md hover:bg-red-600 cursor-pointer"
                          >
                            <Close className="text-sm" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <CloudUpload className="text-4xl text-gray-400 mb-3" />
                          <label className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg inline-flex items-center transition-colors duration-200">
                            رفع صورة
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">كود الكوبون</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      value={newCoupon.couponCode}
                      onChange={(e) => setNewCoupon({...newCoupon, couponCode: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">نسبة الخصم (%)</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      value={newCoupon.discount}
                      onChange={(e) => setNewCoupon({...newCoupon, discount: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">رابط المتجر</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      value={newCoupon.linkRealStore}
                      onChange={(e) => setNewCoupon({...newCoupon, linkRealStore: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">المتجر</label>
                    <div className="relative">
                      <div 
                        className="w-full p-2 border border-gray-300 rounded-lg flex justify-between items-center cursor-pointer"
                        onClick={() => setShowStoreDropdown(!showStoreDropdown)}
                      >
                        <div className="flex items-center">
                          {newCoupon.selectedStore ? (
                            <>
                              <img 
                                src={`https://api.eslamoffers.com/uploads/${newCoupon.selectedStore.logoUrl}`} 
                                alt={newCoupon.selectedStore.name} 
                                className="h-6 w-6 object-cover rounded-full mr-2"
                              />
                              <span>{newCoupon.selectedStore.name}</span>
                            </>
                          ) : (
                            <span className="text-gray-500">اختر متجر</span>
                          )}
                        </div>
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                      
                      {showStoreDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          <div className="p-2 sticky top-0 bg-white border-b">
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                              placeholder="بحث عن متجر..."
                              value={storeSearchTerm}
                              onChange={(e) => setStoreSearchTerm(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          {filteredStores(storeSearchTerm).length > 0 ? (
                            filteredStores(storeSearchTerm).map(store => (
                              <div 
                                key={store.id} 
                                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                onClick={() => handleStoreSelect(store)}
                              >
                                {store.logoUrl && (
                                  <img 
                                    src={`https://api.eslamoffers.com/uploads/${store.logoUrl}`} 
                                    alt={store.name} 
                                    className="h-6 w-6 object-cover rounded-full ml-2"
                                  />
                                )}
                                <div>
                                  <div className="font-medium">{store.name}</div>
                                  <div className="text-xs text-gray-500">{store.slug}</div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500">لا توجد متاجر مطابقة</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Left Column */}
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      value={newCoupon.title}
                      onChange={(e) => setNewCoupon({...newCoupon, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      rows="3"
                      value={newCoupon.descriptionCoupon}
                      onChange={(e) => setNewCoupon({...newCoupon, descriptionCoupon: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">النص البديل للصورة (Alt Text)</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      value={newCoupon.altText}
                      onChange={(e) => setNewCoupon({...newCoupon, altText: e.target.value})}
                      placeholder="أدخل نص بديل للصورة لتحسين إمكانية الوصول"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البداية</label>
                      <input
                        type="datetime-local"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        value={newCoupon.stratDate}
                        onChange={(e) => setNewCoupon({...newCoupon, stratDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ النهاية</label>
                      <input
                        type="datetime-local"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        value={newCoupon.endDate}
                        onChange={(e) => setNewCoupon({...newCoupon, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-teal-600 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                        checked={newCoupon.isActive}
                        onChange={(e) => setNewCoupon({...newCoupon, isActive: e.target.checked})}
                      />
                      <span className="mr-2 text-sm text-gray-700">نشط</span>
                    </label>
                    
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-teal-600 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                        checked={newCoupon.isBest}
                        onChange={(e) => setNewCoupon({...newCoupon, isBest: e.target.checked})}
                      />
                      <span className="mr-2 text-sm text-gray-700">أفضل كوبون</span>
                    </label>
                    
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-teal-600 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                        checked={newCoupon.isBestDiscount}
                        onChange={(e) => setNewCoupon({...newCoupon, isBestDiscount: e.target.checked})}
                      />
                      <span className="mr-2 text-sm text-gray-700">أفضل خصم</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleAddCoupon}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg cursor-pointer transition-colors duration-200 ml-3"
                >
                  إضافة كوبون
                </button>
                <button
                  onClick={() => {
                    setOpenAddModal(false);
                    resetNewCouponForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Coupon Modal */}
      {openEditModal && editCoupon && (
        <div className="fixed inset-0 bg-[#00000098] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-teal-600">تعديل الكوبون</h2>
              <button 
                onClick={() => setOpenEditModal(false)} 
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <Close />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Right Column */}
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">صورة الكوبون</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
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
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 translate-x-1/2 -translate-y-1/2 shadow-md hover:bg-red-600 cursor-pointer"
                          >
                            <Close className="text-sm" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <CloudUpload className="text-4xl text-gray-400 mb-3" />
                          <label className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg inline-flex items-center transition-colors duration-200">
                            {editCoupon.imageUrl ? 'تغيير الصورة' : 'رفع صورة'}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">كود الكوبون</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      value={editCoupon.couponCode}
                      onChange={(e) => setEditCoupon({...editCoupon, couponCode: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">نسبة الخصم (%)</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      value={editCoupon.discount}
                      onChange={(e) => setEditCoupon({...editCoupon, discount: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">رابط المتجر</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      value={editCoupon.linkRealStore}
                      onChange={(e) => setEditCoupon({...editCoupon, linkRealStore: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">المتجر</label>
                    <div className="relative">
                      <div 
                        className="w-full p-2 border border-gray-300 rounded-lg flex justify-between items-center cursor-pointer"
                        onClick={() => setShowEditStoreDropdown(!showEditStoreDropdown)}
                      >
                        <div className="flex items-center">
                          {editCoupon.selectedStore ? (
                            <>
                              <img 
                                src={`https://api.eslamoffers.com/uploads/${editCoupon.selectedStore.logoUrl}`} 
                                alt={editCoupon.selectedStore.name} 
                                className="h-6 w-6 object-cover rounded-full mr-2"
                              />
                              <span>{editCoupon.selectedStore.name}</span>
                            </>
                          ) : (
                            <span className="text-gray-500">{editCoupon.slugStore || 'اختر متجر'}</span>
                          )}
                        </div>
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                      
                      {showEditStoreDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          <div className="p-2 sticky top-0 bg-white border-b">
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                              placeholder="بحث عن متجر..."
                              value={editStoreSearchTerm}
                              onChange={(e) => setEditStoreSearchTerm(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          {filteredStores(editStoreSearchTerm).length > 0 ? (
                            filteredStores(editStoreSearchTerm).map(store => (
                              <div 
                                key={store.id} 
                                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                onClick={() => handleEditStoreSelect(store)}
                              >
                                {store.logoUrl && (
                                  <img 
                                    src={`https://api.eslamoffers.com/uploads/${store.logoUrl}`} 
                                    alt={store.name} 
                                    className="h-6 w-6 object-cover rounded-full ml-2"
                                  />
                                )}
                                <div>
                                  <div className="font-medium">{store.name}</div>
                                  <div className="text-xs text-gray-500">{store.slug}</div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500">لا توجد متاجر مطابقة</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Left Column */}
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      value={editCoupon.title}
                      onChange={(e) => setEditCoupon({...editCoupon, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      rows="3"
                      value={editCoupon.descriptionCoupon}
                      onChange={(e) => setEditCoupon({...editCoupon, descriptionCoupon: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">النص البديل للصورة (Alt Text)</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      value={editCoupon.altText || ''}
                      onChange={(e) => setEditCoupon({...editCoupon, altText: e.target.value})}
                      placeholder="أدخل نص بديل للصورة لتحسين إمكانية الوصول"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البداية</label>
                      <input
                        type="datetime-local"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        value={editCoupon.stratDate}
                        onChange={(e) => setEditCoupon({...editCoupon, stratDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ النهاية</label>
                      <input
                        type="datetime-local"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        value={editCoupon.endDate}
                        onChange={(e) => setEditCoupon({...editCoupon, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-teal-600 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                        checked={editCoupon.isActive}
                        onChange={(e) => setEditCoupon({...editCoupon, isActive: e.target.checked})}
                      />
                      <span className="mr-2 text-sm text-gray-700">نشط</span>
                    </label>
                    
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-teal-600 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                        checked={editCoupon.isBest}
                        onChange={(e) => setEditCoupon({...editCoupon, isBest: e.target.checked})}
                      />
                      <span className="mr-2 text-sm text-gray-700">أفضل كوبون</span>
                    </label>
                    
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-teal-600 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                        checked={editCoupon.isBestDiscount}
                        onChange={(e) => setEditCoupon({...editCoupon, isBestDiscount: e.target.checked})}
                      />
                      <span className="mr-2 text-sm text-gray-700">أفضل خصم</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleUpdateCoupon}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg cursor-pointer transition-colors duration-200 ml-3"
                >
                  تحديث الكوبون
                </button>
                <button
                  onClick={() => setOpenEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
              <p className="text-gray-600 text-center">هل أنت متأكد من رغبتك في حذف هذا الكوبون؟ لا يمكن التراجع عن هذا الإجراء.</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCoupon}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer transition-colors duration-200 ml-3"
              >
                حذف
              </button>
              <button
                onClick={() => setOpenDeleteDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsAdminPanel;