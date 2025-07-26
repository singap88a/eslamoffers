import React, { useState, useEffect, useRef } from "react";
import { FiXCircle, FiImage } from "react-icons/fi";

const StoreFormModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [isBast, setIsBast] = useState(false);
  const [headerDescription, setHeaderDescription] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setLogoUrl(initialData.logoUrl || "");
      setIsBast(initialData.isBast || false);
      setHeaderDescription(initialData.headerDescription || "");
      setDescription(initialData.description || "");
      setLogoFile(null);
    } else {
      setName("");
      setLogoUrl("");
      setIsBast(false);
      setHeaderDescription("");
      setDescription("");
      setLogoFile(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoUrl(URL.createObjectURL(file));
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setLogoFile(e.dataTransfer.files[0]);
      setLogoUrl(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // أرسل البيانات مع الحقول الجديدة
    onSubmit({ 
      Name: name, 
      IsBast: isBast,
      HeaderDescription: headerDescription,
      Description: description 
    }, logoFile);
  };

  // إغلاق عند الضغط على الخلفية
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // تحقق من مسار الصورة وإضافة المسار الكامل إذا لزم الأمر
  const getImageSrc = (url) => {
    if (!url) return null;
    if (url.startsWith('blob:') || url.startsWith('data:')) return url;
    return `https://api.eslamoffers.com/uploads/${url}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8 relative animate-fadeIn border border-gray-200 max-h-[90vh] overflow-y-auto">
        <button
          className="absolute left-4 top-4 text-gray-400 hover:text-red-500 text-3xl focus:outline-none cursor-pointer"
          onClick={onClose}
          type="button"
          title="إغلاق"
        >
          <FiXCircle />
        </button>
        <h2 className="text-2xl font-extrabold mb-8 text-center text-[#14b8a6] drop-shadow-sm">
          {initialData ? "تعديل متجر" : "إضافة متجر جديد"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* الاسم */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">اسم المتجر</label>
            <input
              type="text"
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] shadow-sm text-lg transition text-gray-800"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          
          {/* وصف الهيدر */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">وصف الهيدر</label>
            <input
              type="text"
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] shadow-sm text-lg transition text-gray-800"
              value={headerDescription}
              onChange={e => setHeaderDescription(e.target.value)}
            />
          </div>
          
          {/* الوصف */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">الوصف</label>
            <textarea
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] shadow-sm text-lg transition text-gray-800 min-h-[100px]"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          
          {/* التمييز */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isBast"
              checked={isBast}
              onChange={e => setIsBast(e.target.checked)}
              className="accent-[#14b8a6] w-5 h-5 rounded focus:ring-2 focus:ring-[#14b8a6] cursor-pointer"
            />
            <label htmlFor="isBast" className="font-medium text-gray-700">متجر مميز؟</label>
          </div>
          {/* رفع الصورة */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">شعار المتجر</label>
            <div
              className={`w-full h-40 border-2 ${dragActive ? "border-[#14b8a6]" : "border-dashed border-gray-300"} rounded-xl flex items-center justify-center bg-gray-50/60 cursor-pointer relative transition`}
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {logoUrl ? (
                <img src={getImageSrc(logoUrl)} alt="شعار المتجر" className="w-full h-full object-contain rounded-xl shadow" />
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
          {/* زر الحفظ */}
          <button
            type="submit"
            className="w-full bg-[#14b8a6]/90 text-white py-3 rounded-xl hover:bg-[#14b8a6] transition text-lg font-extrabold shadow-lg focus:ring-2 focus:ring-[#14b8a6] focus:outline-none cursor-pointer mt-2"
            disabled={loading}
          >
            {loading ? "جاري الحفظ..." : initialData ? "حفظ التعديلات" : "إضافة المتجر"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoreFormModal;