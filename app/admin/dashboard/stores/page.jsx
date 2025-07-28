"use client";
import React, { useEffect, useState } from "react";
import StoreTable from "../../../components/admin/Store/StoreTable";
import StoreFormModal from "../../../components/admin/Store/StoreFormModal";
// import ConfirmDialog from "../../../../components/admin/Store/ConfirmDialog";
import ConfirmDialog from "../../../components/admin/Store/ConfirmDialog";

import Toast from "../../../components/admin/Store/Toast";
 import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
const API_BASE = "https://api.eslamoffers.com/api/Store";

const getCookie = (name) => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const Spinner = () => (
  <div className="flex justify-center items-center min-h-[300px]">
    <svg className="animate-spin h-12 w-12 text-[#14b8a6]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
);

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
  const handleSubmit = async (values, imageFile) => {
    setModalLoading(true);
    setError(null);
    try {
      const token = getCookie("token");
      let res, data;
      const formData = new FormData();
      formData.append("Name", values.Name);
      formData.append("IsBast", values.IsBast ? "true" : "false"); // أرسلها كنص
      formData.append("HeaderDescription", values.HeaderDescription || "");
      formData.append("Description", values.Description || "");
      if (imageFile) {
        formData.append("ImageUrl", imageFile);
      }
      // Debug: اطبع القيم
      for (let pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]);
      }
      if (editStore) {
        // Update
        res = await fetch(`${API_BASE}/UpdateStore/${editStore.id}`, {
          method: "PUT",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error("فشل في تعديل المتجر: " + errorText);
        }
        data = await res.json();
        setToast({ message: "تم تعديل المتجر بنجاح!", type: "success" });
      } else {
        // Add
        res = await fetch(`${API_BASE}/AddStore`, {
          method: "POST",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error("فشل في إضافة المتجر: " + errorText);
        }
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
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">إدارة المتاجر</h1>
          <button
            className="flex items-center cursor-pointer
 gap-2 bg-[#14b8a6] text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-[#11a394] transition-all duration-300 font-semibold"
            onClick={() => {
              setEditStore(null);
              setModalOpen(true);
            }}
          >
            <FiPlus size={20} />
            <span>إضافة متجر جديد</span>
          </button>
        </div>
        {error && <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md"><p className="font-bold">خطأ</p><p>{error}</p></div>}
        {loading ? (
          <Spinner />
        ) : (
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
        )}
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
    </div>
  );
};

export default StoresPage;