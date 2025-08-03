"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import CouponTable from "../../../components/admin/Coupon/CouponTable";
import CouponFormModal from "../../../components/admin/Coupon/CouponFormModal";
import ConfirmDialog from "../../../components/admin/Store/ConfirmDialog";
import Toast from "../../../components/admin/Store/Toast";
import { FiPlus, FiArrowRight } from "react-icons/fi";

const API_BASE = "https://api.eslamoffers.com/api/Coupons";
const CATEGORY_API_URL = "https://api.eslamoffers.com/api/Category";

const getCookie = (name) => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const CouponsPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get('storeId');

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [categories, setCategories] = useState([]);
  const [storeInfo, setStoreInfo] = useState(null);

  useEffect(() => {
    // The middleware now handles the auth check, so this is just for the storeId check.
    if (!storeId) {
      router.replace('/admin/dashboard/stores');
    }
  }, [router, storeId]);

  const fetchCoupons = async () => {
    if (!storeId) return;
    setLoading(true);
    setError(null);
    try {
      const token = getCookie("token");
      // جلب الكوبونات باستخدام API الجديد
      const res = await fetch(`${API_BASE}/GetCouponsByStore/${storeId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("فشل في جلب الكوبونات");
      let data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreInfo = async () => {
    if (!storeId) return;
    try {
      const token = getCookie("token");
      const res = await fetch(`https://api.eslamoffers.com/api/Store/GetStoreBySlug/${storeId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("فشل في جلب معلومات المتجر");
      const data = await res.json();
      setStoreInfo(Array.isArray(data) ? data[0] : data);
    } catch (err) {
      console.error("Error fetching store info:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${CATEGORY_API_URL}/GetAllCategories`);
      if (!res.ok) throw new Error("فشل في جلب الفئات");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message); // Or handle category-specific error state
    }
  };


  useEffect(() => {
    fetchCoupons();
    fetchCategories();
    fetchStoreInfo();
  }, [storeId]);

  const handleSubmit = async (values) => {
    setModalLoading(true);
    const formData = new FormData();
    // Handle image file upload
    if (values.imageFile) {
      formData.append('imageUrl', values.imageFile);
    } else if (values.imageUrl) {
      // If editing and no new image, keep the old imageUrl string
      formData.append('imageUrl', values.imageUrl);
    }
    // Append other fields except imageFile and imageUrl (already handled)
    Object.keys(values).forEach(key => {
      if (key !== 'imageFile' && key !== 'imageUrl') {
        formData.append(key, values[key]);
      }
    });
    // Ensure storeId and slugStore are included
    if (!values.storeId && storeId) {
        formData.set('storeId', storeId);
    }
    if (!values.slugStore && storeId) {
        formData.set('slugStore', storeId);
    }
    try {
      const token = getCookie("token");
      let res;
      if (editCoupon) {
        res = await fetch(`${API_BASE}/UpdateCoupon/${editCoupon.id}`, {
          method: "PUT",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) throw new Error("فشل في تعديل الكوبون");
        setToast({ message: "تم تعديل الكوبون بنجاح!", type: "success" });
      } else {
        res = await fetch(`${API_BASE}/AddCoupon`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) throw new Error("فشل في إضافة الكوبون");
        setToast({ message: "تمت إضافة الكوبون بنجاح!", type: "success" });
      }
      setModalOpen(false);
      setEditCoupon(null);
      fetchCoupons();
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!couponToDelete) return;
    setConfirmLoading(true);
    try {
      const token = getCookie("token");
      const res = await fetch(`${API_BASE}/DeleteCoupons/${couponToDelete.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("فشل في حذف الكوبون");
      setToast({ message: "تم حذف الكوبون بنجاح!", type: "success" });
      setConfirmOpen(false);
      setCouponToDelete(null);
      fetchCoupons();
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* معلومات المتجر */}
        {storeInfo && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={storeInfo.logoUrl ? `https://api.eslamoffers.com/uploads/${storeInfo.logoUrl}` : "/default-store.png"}
                  alt={storeInfo.name}
                  className="w-16 h-16 rounded-lg object-contain border border-gray-200 bg-white shadow-sm"
                />
                <div className="mr-4">
                  <h2 className="text-2xl font-bold text-gray-800">{storeInfo.name}</h2>
                  <p className="text-gray-600">إدارة كوبونات المتجر</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {storeInfo.isBast && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
                      متجر مميز
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    storeInfo.isactive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {storeInfo.isactive ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
                <button
                  onClick={() => router.push('/admin/dashboard/stores')}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  <FiArrowRight className="w-4 h-4" />
                  <span>العودة للمتاجر</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {storeInfo ? `كوبونات ${storeInfo.name}` : 'إدارة الكوبونات'}
          </h1>
          <button
            data-add-coupon
            onClick={() => {
              setEditCoupon(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#14b8a6] text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-[#11a394] transition-all duration-300 font-semibold"
          >
            <FiPlus size={20} />
            <span>إضافة كوبون جديد</span>
          </button>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-teal-600 mb-2">{coupons.length}</div>
            <div className="text-gray-600">إجمالي الكوبونات</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {coupons.filter(c => c.isActive).length}
            </div>
            <div className="text-gray-600">كوبونات نشطة</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {coupons.filter(c => c.isBest || c.isBastDiscount).length}
            </div>
            <div className="text-gray-600">كوبونات مميزة</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {coupons.filter(c => c.isBastDiscount).length}
            </div>
            <div className="text-gray-600">أفضل الخصومات</div>
          </div>
        </div>
        {error && (
          <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
            <p className="font-bold">خطأ</p>
            <p>{error}</p>
          </div>
        )}
        <CouponTable
          coupons={coupons}
          loading={loading}
          onEdit={(coupon) => {
            setEditCoupon(coupon);
            setModalOpen(true);
          }}
          onDelete={(coupon) => {
            setCouponToDelete(coupon);
            setConfirmOpen(true);
          }}
        />
        <CouponFormModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditCoupon(null);
          }}
          onSubmit={handleSubmit}
          initialData={editCoupon}
          loading={modalLoading}
          storeId={storeId}
          categories={categories}
        />
        <ConfirmDialog
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleDelete}
          message={couponToDelete ? `هل أنت متأكد أنك تريد حذف الكوبون "${couponToDelete.title}"؟` : ""}
          loading={confirmLoading}
        />
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, message: "" })}
        />
      </div>
    </div>
  );
};

const CouponsPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CouponsPageContent />
  </Suspense>
);

export default CouponsPage; 