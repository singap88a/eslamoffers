"use client";
import React, { useState, useEffect } from "react";
import { 
  FaSearch, 
  FaTrash, 
  FaEnvelope, 
  FaUser, 
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaExclamationCircle
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // استرجاع التوكن من localStorage عند تحميل الصفحة
    const token = localStorage.getItem('adminToken') || getCookie('token');
    if (!token) {
      toast.error('يجب تسجيل الدخول أولاً');
      router.push('/admin/login');
      return;
    }
    setAuthToken(token);
    fetchFeedbacks(token);
  }, []);

  // دالة لقراءة الكوكيز
  const getCookie = (name) => {
    if (typeof window === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const fetchFeedbacks = async (token) => {
    try {
      setLoading(true);
      const response = await fetch('https://api.eslamoffers.com/api/Feedback/GetFeedBack', {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data);
      } else if (response.status === 401) {
        // إذا كان التوكن غير صالح
        handleLogout();
        throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
      } else {
        throw new Error('Failed to fetch feedbacks');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'حدث خطأ أثناء جلب الرسائل');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!authToken) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`https://api.eslamoffers.com/api/Feedback/DeleteMessage/${id}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        setFeedbacks(feedbacks.filter(fb => fb.id !== id));
        if (selectedFeedback && selectedFeedback.id === id) {
          setSelectedFeedback(null);
        }
        toast.success('تم حذف الرسالة بنجاح');
      } else if (response.status === 401) {
        handleLogout();
        throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
      } else {
        throw new Error('Failed to delete feedback');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error(error.message || 'حدث خطأ أثناء حذف الرسالة');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleLogout = () => {
    // حذف التوكن من localStorage والكوكيز
    localStorage.removeItem('adminToken');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin/login');
  };

  // ... باقي الكود بدون تغيير ...
  const filteredFeedbacks = feedbacks.filter(feedback =>
    feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  if (!authToken) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">لوحة التحكم - رسائل العملاء</h1>
        
        {/* شريط البحث */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="ابحث بالاسم، البريد أو الدولة..."
            className="w-full p-3 pr-10 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* قائمة الرسائل */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-teal-600 text-white">
                <h2 className="text-xl font-semibold">الرسائل ({filteredFeedbacks.length})</h2>
              </div>
              <div className="overflow-y-auto max-h-[600px]">
                {filteredFeedbacks.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">لا توجد رسائل متاحة</div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {filteredFeedbacks.map((feedback) => (
                      <li 
                        key={feedback.id} 
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition ${selectedFeedback?.id === feedback.id ? 'bg-teal-50' : ''}`}
                        onClick={() => setSelectedFeedback(feedback)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800">{feedback.name}</h3>
                            <p className="text-sm text-gray-500 truncate">{feedback.message.substring(0, 50)}...</p>
                          </div>
                          <span className="text-xs text-gray-400">{formatDate(feedback.dateTime)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* تفاصيل الرسالة */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
              {selectedFeedback ? (
                <>
                  <div className="p-4 bg-teal-600 text-white flex justify-between items-center">
                    <h2 className="text-xl font-semibold">تفاصيل الرسالة</h2>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-white hover:text-red-200 transition p-2"
                        title="حذف الرسالة"
                        disabled={isDeleting}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    {showDeleteConfirm && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <div className="flex items-center">
                          <FaExclamationCircle className="text-red-500 mr-2" />
                          <h3 className="text-red-800 font-medium">تأكيد الحذف</h3>
                        </div>
                        <p className="mt-2 text-red-600">هل أنت متأكد من رغبتك في حذف هذه الرسالة؟</p>
                        <div className="flex justify-end gap-3 mt-4">
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                          >
                            إلغاء
                          </button>
                          <button
                            onClick={() => handleDelete(selectedFeedback.id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-2"
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'جاري الحذف...' : 'نعم، احذف'}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-3 bg-teal-100 text-teal-600 rounded-full">
                          <FaUser />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">الاسم</p>
                          <p className="font-medium">{selectedFeedback.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-3 bg-teal-100 text-teal-600 rounded-full">
                          <FaEnvelope />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                          <p className="font-medium">{selectedFeedback.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-3 bg-teal-100 text-teal-600 rounded-full">
                          <FaMapMarkerAlt />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">الدولة</p>
                          <p className="font-medium">{selectedFeedback.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-3 bg-teal-100 text-teal-600 rounded-full">
                          <FaCalendarAlt />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">تاريخ الإرسال</p>
                          <p className="font-medium">{formatDate(selectedFeedback.dateTime)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">محتوى الرسالة</h3>
                      <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-line">
                        {selectedFeedback.message}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <a
                        href={`mailto:${selectedFeedback.email}`}
                        className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition flex items-center gap-2"
                      >
                        <FaEnvelope /> رد عبر البريد
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                  <FaEnvelope className="text-5xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-500">اختر رسالة لعرض تفاصيلها</h3>
                  <p className="text-gray-400 mt-2">اضغط على أي رسالة من القائمة الجانبية</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}