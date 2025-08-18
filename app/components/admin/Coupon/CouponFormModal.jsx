"use client";
import React, { useState, useEffect, useRef, useTransition } from "react";
import {
  FiX,
  FiTag,
  FiType,
  FiImage,
  FiPercent,
  FiCode,
  FiLink,
  FiCalendar,
  FiCheckSquare,
  FiStar,
} from "react-icons/fi";

const CouponFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
  storeId,
  categories,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    descriptionCoupon: "",
    imageUrl: "",
    altText: "",
    discount: 0,
    couponCode: "",
    stratDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    isActive: true,
    isBest: false,
    isBestDiscount: false,
    linkRealStore: "",
    storeId: storeId || "",
    slugStore: storeId || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        descriptionCoupon: initialData.descriptionCoupon || "",
        imageUrl: initialData.imageUrl || "",
        altText: initialData.altText || "",
        discount: initialData.discount || 0,
        couponCode: initialData.couponCode || "",
        stratDate: initialData.stratDate 
          ? new Date(initialData.stratDate).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        endDate: initialData.endDate 
          ? new Date(initialData.endDate).toISOString().slice(0, 16)
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        isActive: initialData.isActive ?? true,
        isBest: initialData.isBest ?? false,
        isBestDiscount: initialData.isBestDiscount ?? false,
        linkRealStore: initialData.linkRealStore || "",
        storeId: initialData.storeId || storeId || "",
        slugStore: initialData.slugStore || storeId || "",
      });
      setImagePreview(initialData.imageUrl ? `https://api.eslamoffers.com/uploads/${initialData.imageUrl}` : "");
    } else {
      setFormData({
        title: "",
        descriptionCoupon: "",
        imageUrl: "",
        altText: "",
        discount: 0,
        couponCode: "",
        stratDate: new Date().toISOString().slice(0, 16),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        isActive: true,
        isBest: false,
        isBestDiscount: false,
        linkRealStore: "",
        storeId: storeId || "",
        slugStore: storeId || "",
      });
      setImagePreview("");
    }
    setImageFile(null);
  }, [initialData, storeId, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (!initialData?.imageUrl) {
      setFormData(prev => ({ ...prev, imageUrl: "" }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      imageFile,
      isBestDiscount: formData.isBestDiscount,
      description: formData.descriptionCoupon, // للحفاظ على التوافق مع الخادم
    };
    onSubmit(dataToSubmit);
  };

  return (
    <div
      className="fixed inset-0 bg-[#00000086] bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl md:max-h-[90vh] overflow-y-auto duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b cursor-pointer">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? "تعديل بيانات الكوبون" : "إضافة كوبون جديد"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full cursor-pointer"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <FiTag />
              </div>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="عنوان الكوبون"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#14b8a6] focus:border-[#14b8a6] block pl-10 p-2.5 transition"
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <FiLink />
              </div>
              <input
                name="linkRealStore"
                value={formData.linkRealStore}
                onChange={handleChange}
                placeholder="رابط المتجر"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#14b8a6] focus:border-[#14b8a6] block pl-10 p-2.5 transition"
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <FiType />
            </div>
            <textarea
              name="descriptionCoupon"
              value={formData.descriptionCoupon}
              onChange={handleChange}
              placeholder="وصف الكوبون"
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#14b8a6] focus:border-[#14b8a6] block pl-10 p-2.5 transition"
              rows="3"
            ></textarea>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <FiImage />
            </div>
            <input
              name="altText"
              value={formData.altText}
              onChange={handleChange}
              placeholder="نص بديل للصورة (Alt Text)"
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#14b8a6] focus:border-[#14b8a6] block pl-10 p-2.5 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="block mb-1 text-sm font-medium text-gray-600">
                صورة الكوبون
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition ${
                  imagePreview
                    ? "border-[#14b8a6]"
                    : "border-gray-300 hover:border-[#14b8a6]"
                }`}
                onDrop={handleImageDrop}
                onDragOver={handleDragOver}
                onClick={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
              >
                {imagePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-contain rounded mb-2"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-red-500 text-xs underline cursor-pointer"
                    >
                      إزالة الصورة
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <FiImage size={32} />
                    <span className="text-xs">
                      اسحب الصورة هنا أو اضغط لاختيار صورة
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                نسبة الخصم
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <FiPercent />
                </div>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#14b8a6] focus:border-[#14b8a6] block pl-10 p-2.5 transition"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                كود الكوبون
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <FiCode />
                </div>
                <input
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleChange}
                  placeholder="كود الكوبون"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#14b8a6] focus:border-[#14b8a6] block pl-10 p-2.5 transition"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                تاريخ البدء
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <FiCalendar />
                </div>
                <input
                  name="stratDate"
                  type="datetime-local"
                  value={formData.stratDate}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#14b8a6] focus:border-[#14b8a6] block pl-10 p-2.5 transition"
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                تاريخ الانتهاء
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <FiCalendar />
                </div>
                <input
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#14b8a6] focus:border-[#14b8a6] block pl-10 p-2.5 transition"
                  required
                />
              </div>
            </div>
          </div>

          <input type="hidden" name="storeId" value={formData.storeId} />
          <input type="hidden" name="slugStore" value={formData.slugStore} />

          <div className="flex items-center gap-6 pt-4 border-t mt-6">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 text-[#14b8a6] bg-gray-100 border-gray-300 rounded focus:ring-[#14b8a6] focus:ring-2"
              />
              <FiCheckSquare className="text-green-500" />
              <span>نشط للجميع</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="checkbox"
                name="isBest"
                checked={formData.isBest}
                onChange={handleChange}
                className="w-5 h-5 text-[#14b8a6] bg-gray-100 border-gray-300 rounded focus:ring-[#14b8a6] focus:ring-2"
              />
              <FiStar className="text-yellow-500" />
              <span>أفضل كوبون</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="checkbox"
                name="isBestDiscount"
                checked={formData.isBestDiscount}
                onChange={handleChange}
                className="w-5 h-5 text-[#14b8a6] bg-gray-100 border-gray-300 rounded focus:ring-[#14b8a6] focus:ring-2"
              />
              <FiStar className="text-orange-500" />
              <span>أفضل الخصومات</span>
            </label>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#14b8a6] hover:bg-[#11a394] text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-teal-200 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  جاري الحفظ...
                </>
              ) : initialData ? (
                "حفظ التعديلات"
              ) : (
                "إضافة الكوبون"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponFormModal;