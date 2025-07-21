"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import CouponTable from "../../../components/admin/Coupon/CouponTable";
import CouponFormModal from "../../../components/admin/Coupon/CouponFormModal";
import ConfirmDialog from "../../../components/admin/Store/ConfirmDialog";
import Toast from "../../../components/admin/Store/Toast";
import { FiPlus } from "react-icons/fi";

const API_BASE = "http://147.93.126.19:8080/api/Coupons";

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

  useEffect(() => {
    fetchCoupons();
  }, [storeId]);

  const handleSubmit = async (values) => {
    setModalLoading(true);
    const formData = new FormData();
    Object.keys(values).forEach(key => formData.append(key, values[key]));
    
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
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">إدارة الكوبونات</h1>
        <button
          onClick={() => {
            setEditCoupon(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <FiPlus />
          <span>إضافة كوبون</span>
        </button>
      </div>
      {error && <div className="mb-4 text-center text-red-600 font-bold">{error}</div>}
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
  );
};

const CouponsPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CouponsPageContent />
  </Suspense>
);

export default CouponsPage; 