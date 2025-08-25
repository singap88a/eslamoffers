"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiXCircle, FiImage, FiTrash2, FiPlus, FiChevronDown, FiChevronUp, FiEdit2, FiCheck, FiX, FiArrowLeft, FiArrowRight } from "react-icons/fi";

const StoreFormModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    headerDescription: "",
    description: "",
    isBast: false,
    logoUrl: "",
    altText: "",
    categories: []
  });

  const [logoFile, setLogoFile] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        headerDescription: initialData.headerDescription || "",
        description: initialData.description || "",
        isBast: initialData.isBast || false,
        logoUrl: initialData.logoUrl || "",
        altText: initialData.altText || "",
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

  // Prefill tags for edit mode
  useEffect(() => {
    const loadTags = async () => {
      try {
        if (!isOpen || !initialData?.id) return;
        const res = await fetch(`https://api.eslamoffers.com/api/Store/GetStoreTags/${initialData.id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) {
          const tags = data.map(t => t?.slug || t?.name).filter(Boolean).join(",");
          setTagsInput(tags);
        }
      } catch {}
    };
    loadTags();
  }, [isOpen, initialData]);

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      headerDescription: "",
      description: "",
      isBast: false,
      logoUrl: "",
      altText: "",
      categories: []
    });
    setLogoFile(null);
    setTagsInput("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      if (name === 'name' && !prev.slug) {
        const autoSlug = value.trim().toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '');
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

  const handleCategoryChange = (categoryValue) => {
    setFormData(prev => {
      const newCategories = prev.categories.includes(categoryValue)
        ? prev.categories.filter(value => value !== categoryValue)
        : [...prev.categories, categoryValue];
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

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    const slugValue = formData.slug.trim() || formData.name.trim().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    
    const formDataToSend = new FormData();
    formDataToSend.append("Name", formData.name);
    formDataToSend.append("Slug", slugValue);
    formDataToSend.append("HeaderDescription", formData.headerDescription);
    formDataToSend.append("Description", formData.description);
    formDataToSend.append("AltText", formData.altText || "");
    formDataToSend.append("IsBast", formData.isBast.toString());
    formDataToSend.append("IsUpdateCategory", "true");
    
    if (logoFile) {
      formDataToSend.append("ImageUrl", logoFile);
    } else if (initialData?.logoUrl && !logoFile) {
      formDataToSend.append("ImageUrl", initialData.logoUrl);
    }
    
    formData.categories.forEach(categoryValue => {
      formDataToSend.append("SlugCategory", categoryValue);
    });
    
    // Tags: comma-separated
    if (tagsInput && tagsInput.trim().length > 0) {
      formDataToSend.append("Tags", tagsInput.trim());
    }

    onSubmit({ formData: formDataToSend, tags: (tagsInput || "").trim(), isEditing: !!initialData });
  };

  const getImageSrc = (url) => {
    if (!url) return null;
    if (url.startsWith('blob:') || url.startsWith('data:')) return url;
    return `https://api.eslamoffers.com/uploads/${url}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-teal-600">
            {initialData ? "تعديل متجر" : "إضافة متجر جديد"}
          </h2>
          <button
            className="text-gray-500 hover:text-red-500 text-2xl transition"
            onClick={onClose}
          >
            <FiXCircle />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmitForm} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700">اسم المتجر *</label>
                <input
                  type="text"
                  name="name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-gray-700">الرابط المختصر *</label>
                <input
                  type="text"
                  name="slug"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  placeholder="example-store"
                />
                <p className="text-sm text-gray-500 mt-1">سيظهر في رابط المتجر مثل: /stores/example-store</p>
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-gray-700">وصف الهيدر</label>
                <input
                  type="text"
                  name="headerDescription"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={formData.headerDescription}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">نص بديل للصورة (Alt Text)</label>
                <input
                  type="text"
                  name="altText"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={formData.altText}
                  onChange={handleChange}
                  placeholder="وصف موجز للصورة لتحسين الوصول ومحركات البحث"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isBast"
                  name="isBast"
                  checked={formData.isBast}
                  onChange={handleChange}
                  className="h-5 w-5 text-teal-600 rounded focus:ring-teal-500"
                />
                <label htmlFor="isBast" className="mr-2 font-medium text-gray-700">متجر مميز</label>
              </div>
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-gray-700">شعار المتجر</label>
              <div
                className={`w-full h-48 border-2 ${dragActive ? "border-teal-500" : "border-dashed border-gray-300"} rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer relative transition`}
                onClick={() => fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {formData.logoUrl ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={getImageSrc(formData.logoUrl)} 
                      alt="شعار المتجر" 
                      className="w-full h-full object-contain rounded-lg" 
                    />
                    <button
                      type="button"
                      className="absolute top-2 left-2 bg-white rounded-full p-1 shadow-md text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLogoFile(null);
                        setFormData(prev => ({...prev, logoUrl: ""}));
                      }}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <FiImage className="text-3xl mb-2" />
                    <p>اسحب الصورة هنا أو اضغط للرفع</p>
                    <p className="text-sm mt-1 text-gray-500">الحجم الموصى به: 300x300 بكسل</p>
                  </div>
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
              <div className="mb-2">
                <label className="font-medium text-gray-700 block mb-2">الفئات</label>
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className="flex items-center justify-between w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <span>
                      {formData.categories.length > 0 
                        ? `${formData.categories.length} فئة محددة` 
                        : 'اختر الفئات'}
                    </span>
                    {categoriesOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  
                  {categoriesOpen && (
                    <div className="absolute z-10 mt-1 w-full border rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
                      {isLoadingCategories ? (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                        </div>
                      ) : categoriesList.length > 0 ? (
                        <div className="p-2">
                          {categoriesList.map(category => (
                            <div 
                              key={category.id} 
                              className={`flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${formData.categories.includes(category.slug || category.id) ? 'bg-teal-50' : ''}`}
                              onClick={() => handleCategoryChange(category.slug || category.id)}
                            >
                              <input
                                type="checkbox"
                                id={`category-${category.id}`}
                                checked={formData.categories.includes(category.slug || category.id)}
                                onChange={() => {}} // تم نقل المعالجة إلى الـ div الأب
                                className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
                              />
                              <label htmlFor={`category-${category.id}`} className="mr-2 text-sm text-gray-700 cursor-pointer flex-1">
                                {category.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm py-2 px-4">لا توجد فئات متاحة</p>
                      )}
                    </div>
                  )}
                </div>
                
                {formData.categories.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.categories.map(categoryValue => {
                      const category = categoriesList.find(c => (c.slug || c.id) === categoryValue);
                      return category ? (
                        <span key={categoryValue} className="inline-flex items-center bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">
                          {category.name}
                          <button 
                            type="button" 
                            className="mr-1 text-teal-600 hover:text-teal-800"
                            onClick={() => handleCategoryChange(categoryValue)}
                          >
                            <FiX size={14} />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">الوسوم (Tags)</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="افصل الوسوم بفواصل، مثال: black-friday,7447,summer"
              />
              <p className="text-xs text-gray-500 mt-1">يُمكن إدخال أسماء/سلاجات الوسوم مفصولة بفواصل.</p>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">الوصف الرئيسي لمعلومات المتجر
</label>
              <textarea
                name="description"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[100px]"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium disabled:opacity-70"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    جاري الحفظ...
                  </span>
                ) : initialData ? "حفظ التعديلات" : "إضافة المتجر"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StoreFormModal;