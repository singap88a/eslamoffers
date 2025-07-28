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
    description: "",
    imageUrl: "",
    discount: 0,
    couponCode: "",
    stratDate: "",
    endDate: "",
    isActive: true,
    isBest: false,
    linkRealStore: "",
    storeId: storeId || "",
    categoryId: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const getInitialFormData = () => {
      if (initialData) {
        return {
          ...initialData,
          stratDate: initialData.stratDate
            ? new Date(initialData.stratDate).toISOString().slice(0, 16)
            : "",
          endDate: initialData.endDate
            ? new Date(initialData.endDate).toISOString().slice(0, 16)
            : "",
          storeId: initialData.storeId || storeId || "",
          categoryId: initialData.categoryId || "",
        };
      }
      return {
        title: "",
        description: "",
        imageUrl: "",
        discount: 0,
        couponCode: "",
        stratDate: "",
        endDate: "",
        isActive: true,
        isBest: false,
        linkRealStore: "",
        storeId: storeId || "",
        categoryId: "",
      };
    };
    setFormData(getInitialFormData());
    setImageFile(null);
    setImagePreview(initialData?.imageUrl || "");
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
    if (!initialData) setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, imageFile });
  };

  const InputField = ({ icon, ...props }) => (
    <div className="relative">
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
        {icon}
      </div>
      <input
        {...props}
        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#14b8a6] focus:border-[#14b8a6] block pr-10 p-2.5 transition"
      />
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-[#00000086] bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl md:max-h-[90vh] overflow-y-auto duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
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
            <input
              icon={<FiTag />}
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="عنوان الكوبون"
              required
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#14b8a6] focus:border-[#14b8a6] block pr-10 p-2.5 transition"
            />
            <input
              icon={<FiCode />}
              name="couponCode"
              value={formData.couponCode}
              onChange={handleChange}
              placeholder="كود الكوبون"
              required
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#14b8a6] focus:border-[#14b8a6] block pr-10 p-2.5 transition"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <FiType />
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="وصف الكوبون"
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#14b8a6] focus:border-[#14b8a6] block pr-10 p-2.5 transition"
              rows="3"
            ></textarea>
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
            <InputField
              icon={<FiLink />}
              name="linkRealStore"
              value={formData.linkRealStore}
              onChange={handleChange}
              placeholder="رابط المتجر"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                فئة الكوبون
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#14b8a6] focus:border-[#14b8a6] block p-2.5"
                required
              >
                <option value="" disabled>
                  -- اختر الفئة --
                </option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                نسبة الخصم
              </label>
              <input
                icon={<FiPercent />}
                type="number"
                name="discount"
                              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#14b8a6] focus:border-[#14b8a6] block pr-10 p-2.5 transition"

                value={formData.discount}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                تاريخ البدء
              </label>
              <InputField
                icon={<FiCalendar />}
                name="stratDate"
                type="datetime-local"
                value={formData.stratDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                تاريخ الانتهاء
              </label>
              <InputField
                icon={<FiCalendar />}
                name="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <input type="hidden" name="storeId" value={formData.storeId} />

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
