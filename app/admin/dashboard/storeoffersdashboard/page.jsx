"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const StoreOffersDashboard = () => {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // حالة النموذج
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    logoUrl: null,
    altText: '',
    linkPage: '',
    slugStore: '',
    isBest: false,
    isBastDiscount: false
  });
  
  const [logoPreview, setLogoPreview] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // رابط API الأساسي
  const API_BASE_URL = 'https://api.eslamoffers.com/api';
  const UPLOADS_BASE_URL = 'https://api.eslamoffers.com/uploads/';

  // الحصول على التوكن من الكوكيز
  const getTokenFromCookies = () => {
    if (typeof window === 'undefined') return '';
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : '';
  };

  // إعادة التوجيه إذا لم يكن هناك توكن
  useEffect(() => {
    const token = getTokenFromCookies();
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  // تكوين نسخة axios
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${getTokenFromCookies()}`,
      'Content-Type': 'multipart/form-data'
    }
  });

  // إضافة معالج للردود للتعامل مع أخطاء 401
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        router.push('/admin/login');
      }
      return Promise.reject(error);
    }
  );

  // جلب جميع العروض
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/StoreOffers/GetAllOffers');
      setOffers(response.data);
      setError('');
    } catch (err) {
      setError('فشل في جلب العروض: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // جلب جميع المتاجر
  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Store/GetAllStores');
      setStores(response.data);
      setError('');
    } catch (err) {
      setError('فشل في جلب المتاجر');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // التعامل مع تغييرات إدخال النموذج
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // التعامل مع تغييرات ملف الإدخال
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFormData(prev => ({
      ...prev,
      logoUrl: file
    }));
    
    // إنشاء معاينة
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // التعامل مع إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('Title', formData.title);
      formDataToSend.append('Description', formData.description);
      if (formData.logoUrl) {
        formDataToSend.append('LogoUrl', formData.logoUrl);
      }
      formDataToSend.append('AltText', formData.altText);
      formDataToSend.append('LinkPage', formData.linkPage);
      formDataToSend.append('SlugStore', formData.slugStore);
      formDataToSend.append('IsBest', formData.isBest);
      formDataToSend.append('IsBastDiscount', formData.isBastDiscount);

      let response;
      if (isEditing) {
        response = await api.put(`/StoreOffers/UpdateOffer/${formData.id}`, formDataToSend);
      } else {
        response = await api.post('/StoreOffers/AddOffer', formDataToSend);
      }

      setSuccess(`تم ${isEditing ? 'تحديث' : 'إضافة'} العرض بنجاح!`);
      resetForm();
      fetchOffers();
    } catch (err) {
      setError('فشلت العملية: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // تعديل العرض
  const handleEdit = (offer) => {
    setIsEditing(true);
    setFormData({
      id: offer.id,
      title: offer.title,
      description: offer.description,
      logoUrl: null,
      altText: offer.altText,
      linkPage: offer.linkPage,
      slugStore: offer.slugStore,
      isBest: offer.isBest || false,
      isBastDiscount: offer.isBastDiscount || false
    });
    setLogoPreview(offer.logoUrl ? `${UPLOADS_BASE_URL}${offer.logoUrl}` : '');
  };

  // حذف العرض
  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد أنك تريد حذف هذا العرض؟')) {
      try {
        setLoading(true);
        await api.delete(`/StoreOffers/DeleteOffer/${id}`);
        setSuccess('تم حذف العرض بنجاح!');
        fetchOffers();
      } catch (err) {
        setError('فشل في حذف العرض');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      logoUrl: null,
      altText: '',
      linkPage: '',
      slugStore: '',
      isBest: false,
      isBastDiscount: false
    });
    setLogoPreview('');
    setIsEditing(false);
  };

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchOffers();
    fetchStores();
  }, []);

  // إغلاق رسالة النجاح بعد 5 ثوان
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* العنوان */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">لوحة تحكم عروض المتاجر</h1>
            <p className="text-gray-600 mt-1">إدارة جميع عروض المتاجر في مكان واحد</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={fetchOffers}
              className="px-4 py-2 cursor-pointer bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              تحديث
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-green-600 cursor-pointer text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              عرض جديد
            </button>
          </div>
        </div>
        
        {/* الرسائل */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-100 inline-flex h-8 w-8"
              >
                <span className="sr-only">إغلاق</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
              <button
                onClick={() => setSuccess('')}
                className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-100 inline-flex h-8 w-8"
              >
                <span className="sr-only">إغلاق</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* شاشة التحميل */}
        {loading && (
          <div className="fixed inset-0 bg-[#0000006e] bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              <p className="mt-3 text-gray-700">جاري معالجة طلبك...</p>
            </div>
          </div>
        )}
        
        {/* قسم النموذج */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 pb-2 border-b border-gray-200">
            {isEditing ? 'تعديل العرض' : 'إضافة عرض جديد'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* العنوان */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العنوان *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  required
                  placeholder="عنوان العرض"
                />
              </div>
              
              {/* الوصف */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف *</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  required
                  placeholder="وصف العرض"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* تحميل الشعار */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الشعار {!isEditing && '*'}</label>
                <div className="flex items-center gap-4">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">انقر للتحميل</span> أو اسحب وأفلت
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG (الحد الأقصى 5MB)</p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      required={!isEditing}
                    />
                  </label>
                  {logoPreview && (
                    <div className="relative group">
                      <img 
                        src={logoPreview} 
                        alt="معاينة الشعار" 
                        className="h-32 w-32 object-contain rounded-lg border border-gray-200" 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview('');
                          setFormData(prev => ({ ...prev, logoUrl: null }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* النص البديل */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">النص البديل *</label>
                <input
                  type="text"
                  name="altText"
                  value={formData.altText}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  required
                  placeholder="النص البديل للشعار"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* رابط الصفحة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رابط الصفحة *</label>
                <input
                  type="url"
                  name="linkPage"
                  value={formData.linkPage}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  required
                  placeholder="https://example.com/offer"
                />
              </div>
              
              {/* المتجر */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المتجر *</label>
                <div className="flex gap-3">
                  <select
                    name="slugStore"
                    value={formData.slugStore}
                    onChange={handleChange}
                    className="flex-1 px-4 cursor-pointer py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    required
                  >
                    <option value="">اختر متجرًا</option>
                    {stores.map(store => (
                      <option key={store.id} value={store.slug}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={fetchStores}
                    className="px-4 py-2 bg-gray-100 cursor-pointer text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                    title="تحديث قائمة المتاجر"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* خيارات نوع العرض */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isBest"
                  name="isBest"
                  checked={formData.isBest}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 cursor-pointer focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isBest" className="ml-2 block text-sm cursor-pointer text-gray-700">
                  تضمين في أفضل العروض
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isBastDiscount"
                  name="isBastDiscount"
                  checked={formData.isBastDiscount}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 cursor-pointer focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isBastDiscount" className="ml-2 block text-sm cursor-pointer text-gray-700">
                  تضمين في أفضل عروض الخصم
                </label>
              </div>
            </div>
            
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                className="px-6 py-3 cursor-pointer bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
              >
                {isEditing ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    تحديث العرض
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    إضافة عرض
                  </>
                )}
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 cursor-pointer bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  إلغاء
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* قائمة العروض */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">جميع العروض</h2>
            <p className="text-sm text-gray-500">تم العثور على {offers.length} عرض</p>
          </div>
          
          {offers.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-gray-600">لا توجد عروض متاحة</p>
              <button
                onClick={resetForm}
                className="mt-4 px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                أضف أول عرض لك
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">الشعار</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">العنوان</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">الوصف</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">المتجر</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">أفضل عروض</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">أفضل خصم</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {offers.map(offer => (
                    <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {offer.logoUrl && (
                          <img 
                            src={offer.logoUrl.includes('http') ? offer.logoUrl : `${UPLOADS_BASE_URL}${offer.logoUrl}`} 
                            alt={offer.altText} 
                            className="h-10 w-10 object-contain rounded"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100?text=No+Image'
                            }}
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">{offer.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{offer.slugStore}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {offer.isBest ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              نعم
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              لا
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {offer.isBastDiscount ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              نعم
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              لا
                            </span>
                          )}
                        </div>
                      </td>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  <div className="flex gap-3">
    <button
      onClick={() => handleEdit(offer)}
      className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 flex items-center gap-1 shadow-sm hover:shadow-md"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
      تعديل
    </button>
    <button
      onClick={() => handleDelete(offer.id)}
      className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 flex items-center gap-1 shadow-sm hover:shadow-md"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      حذف
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
      </div>
    </div>
  );
};

export default StoreOffersDashboard;