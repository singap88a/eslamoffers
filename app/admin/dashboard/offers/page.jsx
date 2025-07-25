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

  // Fetch all offers
  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/GetAllOffers?t=${new Date().getTime()}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setOffers(data);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setToast({ message: "فشل في جلب العروض.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Handle Add/Edit
  const handleFormSubmit = async (values, imageFile) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("Title", values.Title);
    formData.append("LinkPage", values.LinkPage);
    formData.append("IsBast", values.IsBast);

    if (!imageFile) {
      setToast({ message: "يرجى تقديم شعار للعرض.", type: "error" });
      setLoading(false);
      return;
    }
    formData.append("LogoUrl", imageFile);

    try {
      const url = selectedOffer
        ? `${API_URL}/UpdateOffer/${selectedOffer.id}`
        : `${API_URL}/AddOffer`;
      const method = selectedOffer ? "PUT" : "POST";

      const response = await fetch(url, { method, body: formData });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server Error:", errorText);
        throw new Error(`Failed to save offer. Server responded with ${response.status}: ${errorText}`);
      }
      
      await fetchOffers(); // Refresh data
      setIsModalOpen(false);
      setSelectedOffer(null);
      setToast({
        message: selectedOffer ? "تم تحديث العرض بنجاح!" : "تمت إضافة العرض بنجاح!",
        type: "success",
      });
    } catch (error) {
      console.error("Error saving offer:", error);
      setToast({ message: error.message || "حدث خطأ أثناء حفظ العرض.", type: "error" });
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
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete offer");
      await fetchOffers(); // Refresh
      setIsConfirmOpen(false);
      setOfferToDelete(null);
      setToast({ message: "تم حذف العرض بنجاح!", type: "success" });
    } catch (error) {
      console.error("Error deleting offer:", error);
      setToast({ message: "حدث خطأ أثناء حذف العرض.", type: "error" });
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
          className="bg-[#14b8a6] text-white px-6 py-2 rounded-lg hover:bg-[#14b8a6]/90 transition font-bold shadow-lg"
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