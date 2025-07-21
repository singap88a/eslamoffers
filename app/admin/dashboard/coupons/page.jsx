"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import CouponTable from "../../../components/admin/Coupon/CouponTable";
import CouponFormModal from "../../../components/admin/Coupon/CouponFormModal";
import ConfirmDialog from "../../../components/admin/Store/ConfirmDialog";
import Toast from "../../../components/admin/Store/Toast";
import { FiPlus } from "react-icons/fi";

const API_BASE = "http://147.93.126.19:8080/api/Coupons";
const CATEGORY_API_URL = "http://147.93.126.19:8080/api/Category";

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
      const res = await fetch(`${API_BASE}/GetAllCoupons`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("فشل في جلب الكوبونات");
      let data = await res.json();
      data = data.filter(c => c.storeId === storeId);
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
    // Ensure storeId is included
    if (!values.storeId && storeId) {
        formData.set('storeId', storeId);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">إدارة الكوبونات</h1>
          <button
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