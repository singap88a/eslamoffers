"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiXCircle, FiImage, FiTrash2 } from "react-icons/fi";

const StoreFormModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    headerDescription: "",
    description: "",
    isBast: false,
    logoUrl: "",
    descriptionStores: [],
    categories: []
  });

  const [currentDescription, setCurrentDescription] = useState({
    subHeader: "",
    description: "",
    image: null
  });

  const [logoFile, setLogoFile] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef();
  const descFileInputRef = useRef();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        headerDescription: initialData.headerDescription || "",
        description: initialData.description || "",
        isBast: initialData.isBast || false,
        logoUrl: initialData.logoUrl || "",
        descriptionStores: initialData.descriptionStore || [],
        categories: initialData.categorys || []
      });
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!isOpen) return;
      
      setIsLoadingCategories(true);
      try {
        const response = await fetch("https://api.eslamoffers.com/api/Category/GetAllCategories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategoriesList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      headerDescription: "",
      description: "",
      isBast: false,
      logoUrl: "",
      descriptionStores: [],
      categories: []
    });
    setCurrentDescription({
      subHeader: "",
      description: "",
      image: null
    });
    setLogoFile(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      // إذا كان الحقل هو اسم المتجر وكان الرابط المختصر فارغًا، قم بإنشاء رابط مختصر تلقائيًا
      if (name === 'name' && !prev.slug) {
        const autoSlug = value.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
        return {
          ...prev,
          [name]: value,
          slug: autoSlug
        };
      }
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
    });
  };

  const handleCategoryChange = (categoryId) => {
    setFormData(prev => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId];
      return { ...prev, categories: newCategories };
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setFormData(prev => ({
        ...prev,
        logoUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleDescImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentDescription(prev => ({
        ...prev,
        image: file
      }));
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
    if (e.dataTransfer.files?.[0]) {
      setLogoFile(e.dataTransfer.files[0]);
      setFormData(prev => ({
        ...prev,
        logoUrl: URL.createObjectURL(e.dataTransfer.files[0])
      }));
    }
  };

  const handleCurrentDescChange = (e) => {
    const { name, value } = e.target;
    setCurrentDescription(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addDescriptionStore = () => {
    if (currentDescription.subHeader && currentDescription.description) {
      setFormData(prev => ({
        ...prev,
        descriptionStores: [...prev.descriptionStores, {
          subHeader: currentDescription.subHeader,
          description: currentDescription.description,
          image: currentDescription.image
        }]
      }));
      setCurrentDescription({
        subHeader: "",
        description: "",
        image: null
      });
    }
  };

  const removeDescriptionStore = (index) => {
    setFormData(prev => ({
      ...prev,
      descriptionStores: prev.descriptionStores.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    // إنشاء slug من اسم المتجر إذا كان فارغًا
    const slugValue = formData.slug.trim() || formData.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    
    const formDataToSend = new FormData();
    formDataToSend.append("Name", formData.name);
    formDataToSend.append("Slug", slugValue);
    formDataToSend.append("HeaderDescription", formData.headerDescription);
    formDataToSend.append("Description", formData.description);
    formDataToSend.append("IsBast", formData.isBast.toString());
    formDataToSend.append("IsUpdateCategory", "true");
    
    if (logoFile) {
      formDataToSend.append("ImageUrl", logoFile);
    }
    
    formData.categories.forEach(categoryId => {
      formDataToSend.append("CategoryId", categoryId);
    });
    
    if (formData.descriptionStores.length > 0) {
      formDataToSend.append("descriptionStores", JSON.stringify(formData.descriptionStores));
    }

    onSubmit(formDataToSend);
  };

  const getImageSrc = (url) => {
    if (!url) return null;
    if (url.startsWith('blob:') || url.startsWith('data:')) return url;
    return `https://api.eslamoffers.com/uploads/${url}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute left-4 top-4 text-gray-400 hover:text-red-500 text-3xl"
          onClick={onClose}
        >
          <FiXCircle />
        </button>
        
        <h2 className="text-2xl font-extrabold mb-8 text-center text-[#14b8a6]">
          {initialData ? "تعديل متجر" : "إضافة متجر جديد"}
        </h2>
        
        <form onSubmit={handleSubmitForm} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">اسم المتجر *</label>
            <input
              type="text"
              name="name"
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] shadow-sm text-lg transition text-gray-800"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 font-semibold text-gray-700">الرابط المختصر *</label>
            <input
              type="text"
              name="slug"
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] shadow-sm text-lg transition text-gray-800"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="example-store"
            />
            <p className="text-sm text-gray-500 mt-1">سيظهر في رابط المتجر مثل: /stores/example-store</p>
          </div>
          
          <div>
            <label className="block mb-2 font-semibold text-gray-700">وصف الهيدر</label>
            <input
              type="text"
              name="headerDescription"
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] shadow-sm text-lg transition text-gray-800"
              value={formData.headerDescription}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block mb-2 font-semibold text-gray-700">الوصف</label>
            <textarea
              name="description"
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] shadow-sm text-lg transition text-gray-800 min-h-[100px]"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isBast"
              name="isBast"
              checked={formData.isBast}
              onChange={handleChange}
              className="accent-[#14b8a6] w-5 h-5 rounded focus:ring-2 focus:ring-[#14b8a6] cursor-pointer"
            />
            <label htmlFor="isBast" className="font-medium text-gray-700">متجر مميز؟</label>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">شعار المتجر</label>
            <div
              className={`w-full h-40 border-2 ${dragActive ? "border-[#14b8a6]" : "border-dashed border-gray-300"} rounded-xl flex items-center justify-center bg-gray-50/60 cursor-pointer relative transition`}
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {formData.logoUrl ? (
                <img src={getImageSrc(formData.logoUrl)} alt="شعار المتجر" className="w-full h-full object-contain rounded-xl shadow" />
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
                onChange={handleLogoChange}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">الفئات</label>
            <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
              {isLoadingCategories ? (
                <p className="text-gray-500 text-sm">جارٍ تحميل الفئات...</p>
              ) : categoriesList.length > 0 ? (
                categoriesList.map(category => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={formData.categories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`category-${category.id}`}>{category.name}</label>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">لا توجد فئات متاحة</p>
              )}
            </div>
          </div>

          <div className="space-y-4 border-t pt-4 mt-4">
            <h3 className="font-semibold text-gray-700">إضافة وصف للمتجر</h3>
            <div className="space-y-3">
              <input
                type="text"
                name="subHeader"
                placeholder="العنوان الفرعي"
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] shadow-sm text-lg transition text-gray-800"
                value={currentDescription.subHeader}
                onChange={handleCurrentDescChange}
              />
              <textarea
                name="description"
                placeholder="الوصف"
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] shadow-sm text-lg transition text-gray-800 min-h-[100px]"
                value={currentDescription.description}
                onChange={handleCurrentDescChange}
              />
              <input
                type="file"
                accept="image/*"
                ref={descFileInputRef}
                onChange={handleDescImageChange}
                className="w-full"
              />
              <button
                type="button"
                onClick={addDescriptionStore}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition"
                disabled={!currentDescription.subHeader || !currentDescription.description}
              >
                إضافة وصف
              </button>
            </div>
            
            {formData.descriptionStores.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="font-medium text-gray-700">الأوصاف المضافة:</h4>
                {formData.descriptionStores.map((desc, index) => (
                  <div key={index} className="flex items-start justify-between bg-gray-50 p-3 rounded-lg">
                    <div>
                      <p className="font-medium">{desc.subHeader}</p>
                      <p className="text-sm text-gray-600">{desc.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDescriptionStore(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#14b8a6] text-white py-3 rounded-xl hover:bg-[#14b8a6]/90 transition text-lg font-extrabold shadow-lg focus:ring-2 focus:ring-[#14b8a6] focus:outline-none cursor-pointer mt-2"
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