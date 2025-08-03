"use client";
import React, { useEffect, useState, useMemo } from "react";
import StoreTable from "../../../components/admin/Store/StoreTable";
import StoreFormModal from "../../../components/admin/Store/StoreFormModal";
import ConfirmDialog from "../../../components/admin/Store/ConfirmDialog";
import Toast from "../../../components/admin/Store/Toast";
import { useRouter } from "next/navigation";
import { FiPlus, FiSearch } from "react-icons/fi";

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
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Filter stores based on search term
  const filteredStores = useMemo(() => {
    if (!searchTerm) return stores;
    return stores.filter(store => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (store.slug && store.slug.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (store.headerDescription && store.headerDescription.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [stores, searchTerm]);

  const handleNavigateToCoupons = (store) => {
    router.push(`/admin/dashboard/coupons?storeId=${store.slug || store.id}`);
  };

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
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSubmit = async (formData) => {
    setModalLoading(true);
    setError(null);
    try {
      const token = getCookie("token");
      const isEditing = !!editStore;
      const url = isEditing 
        ? `${API_BASE}/UpdateStore/${editStore.id}`
        : `${API_BASE}/AddStore`;

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(isEditing 
          ? `فشل في تعديل المتجر: ${errorText}` 
          : `فشل في إضافة المتجر: ${errorText}`);
      }

      const data = await res.json();
      setToast({ 
        message: isEditing 
          ? "تم تعديل المتجر بنجاح!" 
          : "تمت إضافة المتجر بنجاح!", 
        type: "success" 
      });
      
      setModalOpen(false);
      setEditStore(null);
      fetchStores();
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setModalLoading(false);
    }
  };

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

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`فشل في حذف المتجر: ${errorText}`);
      }

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

  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">إدارة المتاجر</h1>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full pr-10 p-2.5"
                placeholder="ابحث عن متجر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              className="flex items-center justify-center gap-2 bg-[#14b8a6] text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-[#11a394] transition-all duration-300 font-semibold whitespace-nowrap"
              onClick={() => {
                setEditStore(null);
                setModalOpen(true);
              }}
            >
              <FiPlus size={20} />
              <span>إضافة متجر جديد</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
            <p className="font-bold">خطأ</p>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <Spinner />
        ) : (
          <>
            {searchTerm && (
              <div className="mb-4 text-sm text-gray-600">
                عرض {filteredStores.length} من أصل {stores.length} متجر
                {filteredStores.length !== stores.length && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="mr-2 text-teal-600 hover:text-teal-800"
                  >
                    (إلغاء البحث)
                  </button>
                )}
              </div>
            )}
            
            <StoreTable
              stores={filteredStores}
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
          </>
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