"use client";
import React, { useState, useEffect } from "react";
import OfferTable from "../../../components/admin/Offer/OfferTable";
import OfferFormModal from "../../../components/admin/Offer/OfferFormModal";
import ConfirmDialog from "../../../components/admin/Offer/ConfirmDialog";
import Toast from "../../../components/admin/Offer/Toast";

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const API_URL = "https://api.eslamoffers.com/api/Offers";

  // دالة للحصول على التوكن من الكوكيز
  const getTokenFromCookies = () => {
    if (typeof window === "undefined") return "";
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("token=")
    );
    return tokenCookie ? tokenCookie.split("=")[1] : "";
  };

  // التحقق من وجود التوكن وإعادة التوجيه إذا لم يكن موجوداً
  useEffect(() => {
    const token = getTokenFromCookies();
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }
  }, []);

  // معالجة أخطاء 401 (غير مصرح)
  useEffect(() => {
    const handleUnauthorizedResponse = (response) => {
      if (!response.ok && response.status === 401) {
        window.location.href = "/admin/login";
      }
      return response;
    };

    // تعديل الدالة fetch للتعامل مع أخطاء 401
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      return handleUnauthorizedResponse(response.clone());
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Fetch all offers
  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/GetAllOffers`, {
        headers: {
          Authorization: `Bearer ${getTokenFromCookies()}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى");
        }
        throw new Error("فشل في جلب العروض");
      }

      const data = await response.json();
      setOffers(data);
    } catch (error) {
      console.error("Error:", error);
      setToast({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Handle Add/Edit
  const handleFormSubmit = async (values, productImageFile, storeImageFile) => {
    setLoading(true);
    const formData = new FormData();

    // أضف كل الحقول هنا
    formData.append("Title", values.Title);
    formData.append("LinkPage", values.LinkPage);
    formData.append("IsBast", values.IsBast);
    formData.append("Price", values.Price || 0);
    formData.append("Discount", values.Discount || 0);
    formData.append("CurrencyCodes", values.CurrencyCodes || "USD");
    formData.append("couponId", values.couponId || "");

    if (productImageFile) formData.append("LogoUrl", productImageFile);
    if (storeImageFile) formData.append("ImageStoreUrl", storeImageFile);

    try {
      const url = selectedOffer
        ? `${API_URL}/UpdateOffer/${selectedOffer.id}`
        : `${API_URL}/AddOffer`;

      const method = selectedOffer ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${getTokenFromCookies()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          throw new Error("غير مصرح به - يرجى تسجيل الدخول مرة أخرى");
        }
        throw new Error(errorText || "فشل في حفظ العرض");
      }

      await fetchOffers();
      setIsModalOpen(false);
      setToast({
        message: selectedOffer ? "تم تحديث العرض بنجاح!" : "تمت إضافة العرض بنجاح!",
        type: "success",
      });
    } catch (error) {
      console.error("Error:", error);
      setToast({
        message: error.message || "حدث خطأ أثناء حفظ العرض",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit
  const handleEdit = (offer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDelete = (offer) => {
    setOfferToDelete(offer);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!offerToDelete) return;
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/DeleteOffer/${offerToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getTokenFromCookies()}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("غير مصرح به - يرجى تسجيل الدخول مرة أخرى");
        }
        throw new Error("فشل في حذف العرض");
      }

      await fetchOffers();
      setIsConfirmOpen(false);
      setOfferToDelete(null);
      setToast({ message: "تم حذف العرض بنجاح!", type: "success" });
    } catch (error) {
      console.error("Error:", error);
      setToast({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">إدارة العروض</h1>
        <button
          onClick={() => {
            setSelectedOffer(null);
            setIsModalOpen(true);
          }}
          className="bg-[#14b8a6] cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-[#14b8a6]/90 transition font-bold shadow-lg"
        >
          إضافة عرض جديد
        </button>
      </div>
      <OfferTable
        offers={offers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <OfferFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedOffer}
        loading={loading}
      />
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        message={`هل أنت متأكد أنك تريد حذف عرض "${offerToDelete?.title}"؟`}
        loading={loading}
      />
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default OffersPage;
