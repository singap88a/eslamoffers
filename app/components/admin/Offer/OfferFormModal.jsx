import React, { useState, useEffect, useRef } from "react";
import { FiXCircle, FiImage } from "react-icons/fi";

const OfferFormModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [title, setTitle] = useState("");
  const [logoUrl, setLogoUrl] = useState(""); // For preview
  const [linkPage, setLinkPage] = useState("");
  const [isBast, setIsBast] = useState(false);
  const [logoFile, setLogoFile] = useState(null); // For upload
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (!isOpen) return;

    const fetchImageAsFile = async (url, filename) => {
      try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
      } catch (error) {
        console.error("Error fetching image as file:", error);
        return null;
      }
    };

    if (initialData) {
      setTitle(initialData.title || "");
      setLinkPage(initialData.linkPage || "");
      setIsBast(initialData.isBast || false);
      setLogoFile(null);
      
      if (initialData.logoUrl) {
        const imageUrl = `https://api.eslamoffers.com/uploads/${encodeURIComponent(initialData.logoUrl)}`;
        setLogoUrl(imageUrl); // Set preview URL
        fetchImageAsFile(imageUrl, initialData.logoUrl.split('/').pop()).then(file => {
          if (file) setLogoFile(file);
        });
      } else {
        setLogoUrl("");
      }
    } else { // Reset for new offer
      setTitle("");
      setLinkPage("");
      setIsBast(false);
      setLogoUrl("");
      setLogoFile(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoUrl(URL.createObjectURL(file)); // Update preview
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      setLogoFile(file);
      setLogoUrl(URL.createObjectURL(file)); // Update preview
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ Title: title, IsBast: isBast, LinkPage: linkPage }, logoFile);
  };

  // إغلاق عند الضغط على الخلفية
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8 relative animate-fadeIn border border-gray-200">
        <button
          className="absolute left-4 top-4 text-gray-400 hover:text-red-500 text-3xl focus:outline-none cursor-pointer"
          onClick={onClose}
          type="button"
          title="إغلاق"
        >
          <FiXCircle />
        </button>
        <h2 className="text-2xl font-extrabold mb-8 text-center text-[#14b8a6] drop-shadow-sm">
          {initialData ? "تعديل العرض" : "إضافة عرض جديد"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">عنوان العرض</label>
            <input
              type="text"
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] shadow-sm text-lg transition text-gray-800"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          {/* LinkPage */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">رابط الصفحة</label>
            <input
              type="text"
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] shadow-sm text-lg transition text-gray-800"
              value={linkPage}
              onChange={e => setLinkPage(e.target.value)}
              required
            />
          </div>
          {/* isBast */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isBast"
              checked={isBast}
              onChange={e => setIsBast(e.target.checked)}
              className="accent-[#14b8a6] w-5 h-5 rounded focus:ring-2 focus:ring-[#14b8a6] cursor-pointer"
            />
            <label htmlFor="isBast" className="font-medium text-gray-700">عرض مميز؟</label>
          </div>
          {/* Logo */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">شعار العرض</label>
            <div
              className={`w-full h-40 border-2 ${dragActive ? "border-[#14b8a6]" : "border-dashed border-gray-300"} rounded-xl flex items-center justify-center bg-gray-50/60 cursor-pointer relative transition`}
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {logoUrl ? (
                <img src={logoUrl} alt="شعار العرض" className="w-full h-full object-contain rounded-xl shadow" />
              ) : (
                <span className="flex flex-col items-center text-gray-400 text-base text-center select-none">
                  <FiImage className="text-3xl mb-1" />
                  اسحب الصورة هنا أو اضغط للرفع
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#14b8a6]/90 text-white py-3 rounded-xl hover:bg-[#14b8a6] transition text-lg font-extrabold shadow-lg focus:ring-2 focus:ring-[#14b8a6] focus:outline-none cursor-pointer mt-2"
            disabled={loading}
          >
            {loading ? "جاري الحفظ..." : initialData ? "حفظ التعديلات" : "إضافة العرض"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OfferFormModal; 