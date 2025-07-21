"use client";
import React, { useEffect, useState } from "react";
import StoreTable from "../../../components/admin/Store/StoreTable";
import StoreFormModal from "../../../components/admin/Store/StoreFormModal";
// import ConfirmDialog from "../../../../components/admin/Store/ConfirmDialog";
import ConfirmDialog from "../../../components/admin/Store/ConfirmDialog";

import Toast from "../../../components/admin/Store/Toast";
 import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
const API_BASE = "http://147.93.126.19:8080/api/Store";

const getCookie = (name) => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editStore, setEditStore] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const router = useRouter();

  const handleNavigateToCoupons = (storeId) => {
    router.push(`/admin/dashboard/coupons?storeId=${storeId}`);
  };

  // The middleware now handles the auth check, so this useEffect is no longer needed.
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const token = getCookie('token');
  //     if (!token) {
  //       router.replace('/admin/login');
  //     }
  //   }
  // }, [router]);

  // Fetch stores
  const fetchStores = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getCookie("token");
      const res = await fetch(`${API_BASE}/GetAllStores`, {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("فشل في جلب المتاجر");
      const data = await res.json();
      setStores(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Add or Edit Store
  const handleSubmit = async (values) => {
    setModalLoading(true);
    setError(null);
    try {
      const token = getCookie("token");
      let res, data;
      if (editStore) {
        // Update
        res = await fetch(`${API_BASE}/UpdateStore/${editStore.id}`, {
          method: "PUT",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error("فشل في تعديل المتجر");
        data = await res.json();
        setToast({ message: "تم تعديل المتجر بنجاح!", type: "success" });
      } else {
        // Add
        res = await fetch(`${API_BASE}/AddStore`, {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error("فشل في إضافة المتجر");
        data = await res.json();
        setToast({ message: "تمت إضافة المتجر بنجاح!", type: "success" });
      }
      setModalOpen(false);
      setEditStore(null);
      fetchStores();
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setModalLoading(false);
    }
  };

  // Delete Store
  const handleDelete = async () => {
    if (!storeToDelete) return;
    setConfirmLoading(true);
    setError(null);
    try {
      const token = getCookie("token");
      const res = await fetch(`${API_BASE}/DeleteStore/${storeToDelete.id}`, {
        method: "DELETE",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("فشل في حذف المتجر");
      setToast({ message: "تم حذف المتجر بنجاح!", type: "success" });
      setConfirmOpen(false);
      setStoreToDelete(null);
      fetchStores();
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setConfirmLoading(false);
    }
  };

  // UI
  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-gradient-to-br from-[#14b8a6]/10 via-white/60 to-[#14b8a6]/10 backdrop-blur-[2px]">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#14b8a6] drop-shadow-sm flex items-center gap-2">
          <span className="inline-block bg-white/70 rounded-lg px-3 py-1 shadow">إدارة المتاجر</span>
        </h1>
        <button
          className="flex items-center gap-2 bg-[#14b8a6] text-white px-6 py-2 rounded-xl shadow-lg hover:bg-[#0e9488] transition text-lg font-semibold focus:ring-2 focus:ring-[#14b8a6] focus:outline-none cursor-pointer"
          onClick={() => {
            setEditStore(null);
            setModalOpen(true);
          }}
        >
          <FiPlus className="text-2xl" />
          <span>+ إضافة متجر جديد</span>
        </button>
      </div>
      {error && <div className="mb-4 text-center text-red-600 font-bold">{error}</div>}
      <StoreTable
        stores={stores}
        loading={loading}
        onEdit={(store) => {
          setEditStore(store);
          setModalOpen(true);
        }}
        onDelete={(store) => {
          setStoreToDelete(store);
          setConfirmOpen(true);
        }}
        onNavigateToCoupons={handleNavigateToCoupons}
      />
      <StoreFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditStore(null);
        }}
        onSubmit={handleSubmit}
        initialData={editStore}
        loading={modalLoading}
      />
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setStoreToDelete(null);
        }}
        onConfirm={handleDelete}
        message={storeToDelete ? `هل أنت متأكد أنك تريد حذف المتجر "${storeToDelete.name}"؟` : ""}
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

export default StoresPage; 