import React, { useState, useEffect, useRef } from "react";
import { FiXCircle, FiImage, FiTrash2 } from "react-icons/fi";

const OfferFormModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  // Form fields
  const [title, setTitle] = useState("");
  const [linkPage, setLinkPage] = useState("");
  const [isBast, setIsBast] = useState(false);
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [currencyCodes, setCurrencyCodes] = useState("USD");
  const [couponId, setCouponId] = useState("");
  
  // Product image
  const [productImageUrl, setProductImageUrl] = useState("");
  const [productImageFile, setProductImageFile] = useState(null);
  const [productDragActive, setProductDragActive] = useState(false);
  
  // Store image
  const [storeImageUrl, setStoreImageUrl] = useState("");
  const [storeImageFile, setStoreImageFile] = useState(null);
  const [storeDragActive, setStoreDragActive] = useState(false);
  
  // Refs
  const productFileInputRef = useRef();
  const storeFileInputRef = useRef();

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
      setPrice(initialData.price || 0);
      setDiscount(initialData.discount || 0);
      setCurrencyCodes(initialData.currencyCodes || "USD");
      setCouponId(initialData.couponId || "");

      // Product image
      if (initialData.logoUrl) {
        const productImageUrl = `https://api.eslamoffers.com/uploads/${encodeURIComponent(initialData.logoUrl)}`;
        setProductImageUrl(productImageUrl);
        fetchImageAsFile(productImageUrl, initialData.logoUrl.split('/').pop())
          .then(file => file && setProductImageFile(file));
      } else {
        setProductImageUrl("");
      }

      // Store image
      if (initialData.imageStoreUrl) {
        const storeImageUrl = `https://api.eslamoffers.com/uploads/${encodeURIComponent(initialData.imageStoreUrl)}`;
        setStoreImageUrl(storeImageUrl);
        fetchImageAsFile(storeImageUrl, initialData.imageStoreUrl.split('/').pop())
          .then(file => file && setStoreImageFile(file));
      } else {
        setStoreImageUrl("");
      }
    } else {
      // Reset for new offer
      setTitle("");
      setLinkPage("");
      setIsBast(false);
      setPrice(0);
      setDiscount(0);
      setCurrencyCodes("USD");
      setCouponId("");
      setProductImageUrl("");
      setProductImageFile(null);
      setStoreImageUrl("");
      setStoreImageFile(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Handle file upload for product image
  const handleProductFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImageFile(file);
      setProductImageUrl(URL.createObjectURL(file));
    }
  };

  // Handle file upload for store image
  const handleStoreFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStoreImageFile(file);
      setStoreImageUrl(URL.createObjectURL(file));
    }
  };

  // Drag and drop handlers for product image
  const handleProductDragOver = (e) => {
    e.preventDefault();
    setProductDragActive(true);
  };
  const handleProductDragLeave = (e) => {
    e.preventDefault();
    setProductDragActive(false);
  };
  const handleProductDrop = (e) => {
    e.preventDefault();
    setProductDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setProductImageFile(file);
      setProductImageUrl(URL.createObjectURL(file));
    }
  };

  // Drag and drop handlers for store image
  const handleStoreDragOver = (e) => {
    e.preventDefault();
    setStoreDragActive(true);
  };
  const handleStoreDragLeave = (e) => {
    e.preventDefault();
    setStoreDragActive(false);
  };
  const handleStoreDrop = (e) => {
    e.preventDefault();
    setStoreDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setStoreImageFile(file);
      setStoreImageUrl(URL.createObjectURL(file));
    }
  };

  // Remove product image
  const removeProductImage = () => {
    setProductImageUrl("");
    setProductImageFile(null);
  };

  // Remove store image
  const removeStoreImage = () => {
    setStoreImageUrl("");
    setStoreImageFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = {
      Title: title,
      LinkPage: linkPage,
      IsBast: isBast,
      Price: price,
      Discount: discount,
      CurrencyCodes: currencyCodes,
      couponId: couponId
    };
    
    onSubmit(formData, productImageFile, storeImageFile);
  };

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
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8 relative animate-fadeIn border border-gray-200 overflow-y-auto max-h-[90vh]">
        <button
          className="absolute left-4 top-4 text-gray-400 hover:text-red-500 text-3xl focus:outline-none cursor-pointer"
          onClick={onClose}
          type="button"
          title="إغلاق"
        >
          <FiXCircle />
        </button>
        
        <h2 className="text-2xl font-extrabold mb-6 text-center text-[#14b8a6] drop-shadow-sm">
          {initialData ? "تعديل العرض" : "إضافة عرض جديد"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">عنوان العرض*</label>
            <input
              type="text"
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] shadow-sm text-lg transition text-gray-800"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="أدخل عنوان العرض"
            />
          </div>

          {/* LinkPage */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">رابط الصفحة*</label>
            <input
              type="url"
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] shadow-sm text-lg transition text-gray-800"
              value={linkPage}
              onChange={e => setLinkPage(e.target.value)}
              required
              placeholder="https://example.com"
            />
          </div>

          {/* Price & Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">السعر</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] shadow-sm text-lg transition text-gray-800"
                  value={price}
                  onChange={e => setPrice(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {currencyCodes}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block mb-2 font-semibold text-gray-700">الخصم (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] shadow-sm text-lg transition text-gray-800"
                value={discount}
                onChange={e => setDiscount(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Currency & Coupon */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">العملة</label>
              <select
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] shadow-sm text-lg transition text-gray-800"
                value={currencyCodes}
                onChange={e => setCurrencyCodes(e.target.value)}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="EGP">EGP</option>
                <option value="SAR">SAR</option>
                <option value="AED">AED</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 font-semibold text-gray-700">كود الكوبون</label>
              <input
                type="text"
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] shadow-sm text-lg transition text-gray-800"
                value={couponId}
                onChange={e => setCouponId(e.target.value)}
                placeholder="اختياري"
              />
            </div>
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
            <label htmlFor="isBast" className="font-medium text-gray-700">عرض مميز</label>
          </div>

          {/* Product Image */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">صورة المنتج*</label>
            <div
              className={`w-full h-40 border-2 ${productDragActive ? "border-[#14b8a6]" : "border-dashed border-gray-300"} rounded-xl flex items-center justify-center bg-gray-50/60 cursor-pointer relative transition overflow-hidden`}
              onClick={() => productFileInputRef.current.click()}
              onDragOver={handleProductDragOver}
              onDragLeave={handleProductDragLeave}
              onDrop={handleProductDrop}
            >
              {productImageUrl ? (
                <>
                  <img 
                    src={productImageUrl} 
                    alt="صورة المنتج" 
                    className="w-full h-full object-contain rounded-xl" 
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeProductImage(); }}
                    className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                  >
                    <FiTrash2 className="text-lg" />
                  </button>
                </>
              ) : (
                <span className="flex flex-col items-center text-gray-400 text-base text-center select-none">
                  <FiImage className="text-3xl mb-1" />
                  اسحب الصورة هنا أو اضغط للرفع
                  <span className="text-xs mt-1">الحجم المقترح: 800x800 بكسل</span>
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                ref={productFileInputRef}
                className="hidden"
                onChange={handleProductFileChange}
                required={!productImageUrl}
              />
            </div>
          </div>

          {/* Store Image */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">صورة المتجر</label>
            <div
              className={`w-full h-40 border-2 ${storeDragActive ? "border-[#14b8a6]" : "border-dashed border-gray-300"} rounded-xl flex items-center justify-center bg-gray-50/60 cursor-pointer relative transition overflow-hidden`}
              onClick={() => storeFileInputRef.current.click()}
              onDragOver={handleStoreDragOver}
              onDragLeave={handleStoreDragLeave}
              onDrop={handleStoreDrop}
            >
              {storeImageUrl ? (
                <>
                  <img 
                    src={storeImageUrl} 
                    alt="صورة المتجر" 
                    className="w-full h-full object-contain rounded-xl" 
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeStoreImage(); }}
                    className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                  >
                    <FiTrash2 className="text-lg" />
                  </button>
                </>
              ) : (
                <span className="flex flex-col items-center text-gray-400 text-base text-center select-none">
                  <FiImage className="text-3xl mb-1" />
                  اسحب الصورة هنا أو اضغط للرفع
                  <span className="text-xs mt-1">الحجم المقترح: 400x400 بكسل</span>
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                ref={storeFileInputRef}
                className="hidden"
                onChange={handleStoreFileChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#14b8a6]/90 text-white py-3 rounded-xl hover:bg-[#14b8a6] transition text-lg font-extrabold shadow-lg focus:ring-2 focus:ring-[#14b8a6] focus:outline-none cursor-pointer mt-4 disabled:opacity-70"
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