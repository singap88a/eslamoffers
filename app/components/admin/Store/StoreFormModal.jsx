"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiXCircle, FiImage, FiTrash2, FiPlus, FiMinus, FiChevronDown, FiChevronUp, FiEdit2, FiCheck, FiX } from "react-icons/fi";

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
    image: null,
    isEditing: false,
    editIndex: null
  });

  const [logoFile, setLogoFile] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const fileInputRef = useRef();
  const descFileInputRef = useRef();

  useEffect(() => {
    if (initialData) {
      let descriptions = [];
      if (initialData.descriptionStores && Array.isArray(initialData.descriptionStores)) {
        descriptions = initialData.descriptionStores;
      } else if (initialData.descriptionStore) {
        descriptions = Array.isArray(initialData.descriptionStore) 
          ? initialData.descriptionStore 
          : [initialData.descriptionStore];
      }
      
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        headerDescription: initialData.headerDescription || "",
        description: initialData.description || "",
        isBast: initialData.isBast || false,
        logoUrl: initialData.logoUrl || "",
        descriptionStores: descriptions,
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
      const descData = {
        subHeader: currentDescription.subHeader,
        description: currentDescription.description,
        image: currentDescription.image
      };
      
      // إذا كان في وضع التعديل
      if (currentDescription.isEditing && typeof currentDescription.editIndex === 'number') {
        const index = currentDescription.editIndex;
        const descToEdit = formData.descriptionStores[index];
        
        // إذا كان الوصف له معرف (موجود في قاعدة البيانات)، نقوم بإرسال طلب تعديل للـ API
        if (descToEdit.id && initialData?.id) {
          // إنشاء FormData للتعديل
          const editFormData = new FormData();
          editFormData.append("SubHeader", descData.subHeader);
          editFormData.append("Description", descData.description);
          
          // إضافة الصورة إذا كانت موجودة
          if (descData.image instanceof File) {
            editFormData.append("Image", descData.image);
          } else if (typeof descData.image === 'string' && descData.image) {
            editFormData.append("Image", descData.image);
          }
          
          // إرسال طلب التعديل
          fetch(`https://api.eslamoffers.com/api/Store/UpdateDescriptionStore/${initialData.id}/${descToEdit.id}`, {
            method: 'PUT',
            headers: {
              'accept': '*/*',
              'Authorization': `Bearer ${localStorage.getItem('token')}` // استخدام التوكن المخزن
            },
            body: editFormData
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('فشل تعديل الوصف');
            }
            return response.json();
          })
          .then(data => {
            // تحديث الوصف في حالة النموذج
            setFormData(prev => ({
              ...prev,
              descriptionStores: prev.descriptionStores.map((desc, i) => 
                i === index ? { ...data } : desc
              )
            }));
            alert('تم تعديل الوصف بنجاح');
          })
          .catch(error => {
            console.error('Error updating description:', error);
            alert('حدث خطأ أثناء تعديل الوصف');
          });
        } else {
          // إذا كان الوصف غير موجود في قاعدة البيانات، نقوم بتحديثه محليًا فقط
          setFormData(prev => ({
            ...prev,
            descriptionStores: prev.descriptionStores.map((desc, i) => 
              i === index ? { ...desc, ...descData } : desc
            )
          }));
        }
      } else {
        // إضافة وصف جديد
        setFormData(prev => ({
          ...prev,
          descriptionStores: [...prev.descriptionStores, descData]
        }));
      }
      
      // إعادة تعيين حالة الوصف الحالي
      setCurrentDescription({
        subHeader: "",
        description: "",
        image: null,
        isEditing: false,
        editIndex: null
      });
      
      if (descFileInputRef.current) {
        descFileInputRef.current.value = "";
      }
    }
  };

  // وظيفة لتعديل وصف إضافي موجود
  const editDescriptionStore = (index, updatedDesc) => {
    // إذا كان الوصف له معرف (موجود في قاعدة البيانات)، نقوم بإرسال طلب تعديل للـ API
    const descToEdit = formData.descriptionStores[index];
    
    if (descToEdit.id && initialData?.id) {
      // إنشاء FormData للتعديل
      const editFormData = new FormData();
      editFormData.append("SubHeader", updatedDesc.subHeader);
      editFormData.append("Description", updatedDesc.description);
      
      // إضافة الصورة إذا كانت موجودة
      if (updatedDesc.image instanceof File) {
        editFormData.append("Image", updatedDesc.image);
      } else if (typeof updatedDesc.image === 'string' && updatedDesc.image) {
        editFormData.append("Image", updatedDesc.image);
      }
      
      // إرسال طلب التعديل
      fetch(`https://api.eslamoffers.com/api/Store/UpdateDescriptionStore/${initialData.id}/${descToEdit.id}`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // استخدام التوكن المخزن
        },
        body: editFormData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('فشل تعديل الوصف');
        }
        return response.json();
      })
      .then(data => {
        // تحديث الوصف في حالة النموذج
        setFormData(prev => ({
          ...prev,
          descriptionStores: prev.descriptionStores.map((desc, i) => 
            i === index ? { ...data } : desc
          )
        }));
        alert('تم تعديل الوصف بنجاح');
      })
      .catch(error => {
        console.error('Error updating description:', error);
        alert('حدث خطأ أثناء تعديل الوصف');
      });
    } else {
      // إذا كان الوصف غير موجود في قاعدة البيانات، نقوم بتحديثه محليًا فقط
      setFormData(prev => ({
        ...prev,
        descriptionStores: prev.descriptionStores.map((desc, i) => 
          i === index ? { ...desc, ...updatedDesc } : desc
        )
      }));
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
    formDataToSend.append("IsBast", formData.isBast.toString());
    formDataToSend.append("IsUpdateCategory", "true");
    formDataToSend.append("IsUpdateDescriptionStore", "true");
    
    if (logoFile) {
      formDataToSend.append("ImageUrl", logoFile);
    } else if (initialData?.logoUrl && !logoFile) {
      formDataToSend.append("ImageUrl", initialData.logoUrl);
    }
    
    formData.categories.forEach(categoryId => {
      formDataToSend.append("CategoryId", categoryId);
    });
    
    // تصفية الأوصاف الإضافية للتأكد من أنها تحتوي على البيانات المطلوبة
    const validDescriptions = formData.descriptionStores.filter(
      desc => desc.subHeader && desc.description
    );
    
    // إضافة علامة تحديث الأوصاف الإضافية
    formDataToSend.append('IsUpdateDescriptionStore', 'true');
    
    if (validDescriptions.length === 0) {
      // إذا لم تكن هناك أوصاف إضافية، نرسل مصفوفة فارغة
      formDataToSend.append('descriptionStores', JSON.stringify([]));
    } else {
      // إضافة الأوصاف الإضافية الصالحة
      validDescriptions.forEach((desc, index) => {
      if (desc.id) {
        formDataToSend.append(`descriptionStores[${index}].id`, desc.id);
      }
      formDataToSend.append(`descriptionStores[${index}].subHeader`, desc.subHeader);
      formDataToSend.append(`descriptionStores[${index}].description`, desc.description);
      
      if (desc.image instanceof File) {
        formDataToSend.append(`descriptionStores[${index}].image`, desc.image);
      } else if (typeof desc.image === 'string' && desc.image) {
        formDataToSend.append(`descriptionStores[${index}].image`, desc.image);
      }
    });
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
        
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium ${activeTab === 'basic' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('basic')}
          >
            المعلومات الأساسية
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === 'description' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('description')}
          >
            الأوصاف الإضافية
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmitForm} className="space-y-6">
            {activeTab === 'basic' && (
              <>
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
                                  className={`flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${formData.categories.includes(category.id) ? 'bg-teal-50' : ''}`}
                                  onClick={() => handleCategoryChange(category.id)}
                                >
                                  <input
                                    type="checkbox"
                                    id={`category-${category.id}`}
                                    checked={formData.categories.includes(category.id)}
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
                        {formData.categories.map(categoryId => {
                          const category = categoriesList.find(c => c.id === categoryId);
                          return category ? (
                            <span key={categoryId} className="inline-flex items-center bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">
                              {category.name}
                              <button 
                                type="button" 
                                className="mr-1 text-teal-600 hover:text-teal-800"
                                onClick={() => handleCategoryChange(categoryId)}
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
              </>
            )}
            
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">الوصف</label>
                    <input
                      name="description"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                  <h3 className="font-medium text-gray-700">إضافة وصف جديد</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="subHeader"
                      placeholder="العنوان الفرعي"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={currentDescription.subHeader}
                      onChange={handleCurrentDescChange}
                    />
                    <textarea
                      name="description"
                      placeholder="الوصف"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[100px]"
                      value={currentDescription.description}
                      onChange={handleCurrentDescChange}
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => descFileInputRef.current.click()}
                        className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      >
                        <FiImage />
                        {currentDescription.image ? "تغيير الصورة" : "إضافة صورة"}
                      </button>
                      {currentDescription.image && (
                        <span className="text-sm text-gray-600 truncate flex-1">
                          {currentDescription.image.name || "صورة مرفوعة"}
                        </span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        ref={descFileInputRef}
                        onChange={handleDescImageChange}
                        className="hidden"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addDescriptionStore}
                      className="flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition w-full"
                      disabled={!currentDescription.subHeader || !currentDescription.description}
                    >
                      {currentDescription.isEditing ? (
                        <>
                          <FiCheck />
                          حفظ التعديل
                        </>
                      ) : (
                        <>
                          <FiPlus />
                          إضافة وصف
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {formData.descriptionStores.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">الأوصاف المضافة</h3>
                    <div className="space-y-3">
                      {formData.descriptionStores.map((desc, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800">{desc.subHeader}</h4>
                              <p className="text-sm text-gray-600 mt-1">{desc.description}</p>
                              {desc.image && (
                                <div className="mt-2">
                                  <img 
                                    src={typeof desc.image === 'string' ? getImageSrc(desc.image) : URL.createObjectURL(desc.image)} 
                                    alt={`وصف ${index + 1}`} 
                                    className="max-h-32 object-contain rounded"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex">
                              <button
                                type="button"
                                onClick={() => {
                                  // تعيين الوصف الحالي للتعديل
                                  setCurrentDescription({
                                    ...desc,
                                    isEditing: true,
                                    editIndex: index
                                  });
                                }}
                                className="text-blue-500 hover:text-blue-700 p-1 ml-2"
                                title="تعديل"
                              >
                                <FiEdit2 />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeDescriptionStore(index)}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="حذف"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
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