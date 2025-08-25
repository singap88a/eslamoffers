"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiXCircle, FiImage, FiTrash2, FiPlus, FiEdit2, FiCheck, FiX } from "react-icons/fi";

const StoreDescriptionsModal = ({ isOpen, onClose, store, token, onUpdate }) => {
  const [descriptions, setDescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDescription, setCurrentDescription] = useState({
    subHeader: "",
    description: "",
    image: null,
    altText: "",
    isEditing: false,
    editIndex: null
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    descId: null,
    descIndex: null,
    descTitle: ""
  });
  const fileInputRef = useRef();

  useEffect(() => {
    if (isOpen && store) {
      fetchDescriptions();
    }
  }, [isOpen, store]);

  const fetchDescriptions = async () => {
    if (!store.id) return;
    
    setLoading(true);
    try {
      try {
        const response = await fetch(`https://api.eslamoffers.com/api/Store/GetStoreDescriptions/${store.id}`, {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setDescriptions(Array.isArray(data) ? data : []);
        } else {
          if (store.descriptionStore && Array.isArray(store.descriptionStore)) {
            setDescriptions(store.descriptionStore);
          } else {
            setDescriptions([]);
          }
        }
      } catch (error) {
        console.error("Error fetching descriptions:", error);
        if (store.descriptionStore && Array.isArray(store.descriptionStore)) {
          setDescriptions(store.descriptionStore);
        } else {
          setDescriptions([]);
        }
      }
    } catch (error) {
      console.error("Error processing descriptions:", error);
      setDescriptions([]);
    } finally {
      setLoading(false);
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

  const handleCurrentDescChange = (e) => {
    const { name, value } = e.target;
    setCurrentDescription(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addDescription = async () => {
    if (!currentDescription.subHeader || !currentDescription.description) return;
    
    try {
      const formData = new FormData();
      formData.append("SubHeader", currentDescription.subHeader);
      formData.append("Description", currentDescription.description);
      formData.append("AltText", currentDescription.altText || "");
      
      if (currentDescription.image) {
        formData.append("Image", currentDescription.image);
      }
      
      const response = await fetch(`https://api.eslamoffers.com/api/Store/AddDescriptionStore/${store.id}`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        const newDesc = await response.json();
        setDescriptions(prev => [...prev, newDesc]);
        setCurrentDescription({
          subHeader: "",
          description: "",
          image: null,
          altText: "",
          isEditing: false,
          editIndex: null
        });
        if (onUpdate) onUpdate();
      } else {
        console.error("Failed to add description");
      }
    } catch (error) {
      console.error("Error adding description:", error);
    }
  };

  const updateDescription = async () => {
    if (!currentDescription.subHeader || !currentDescription.description || currentDescription.editIndex === null) return;
    
    const descId = descriptions[currentDescription.editIndex].id;
    
    try {
      const formData = new FormData();
      formData.append("SubHeader", currentDescription.subHeader);
      formData.append("Description", currentDescription.description);
      formData.append("AltText", currentDescription.altText || "");
      
      if (currentDescription.image) {
        formData.append("Image", currentDescription.image);
      }
      
      const response = await fetch(`https://api.eslamoffers.com/api/Store/UpdateDescriptionStore/${store.id}/${descId}`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        const updatedDesc = await response.json();
        setDescriptions(prev => 
          prev.map((desc, index) => 
            index === currentDescription.editIndex ? updatedDesc : desc
          )
        );
        setCurrentDescription({
          subHeader: "",
          description: "",
          image: null,
          altText: "",
          isEditing: false,
          editIndex: null
        });
        if (onUpdate) onUpdate();
      } else {
        console.error("Failed to update description");
      }
    } catch (error) {
      console.error("Error updating description:", error);
    }
  };

  const confirmDelete = (id, index, title) => {
    setDeleteConfirm({
      isOpen: true,
      descId: id,
      descIndex: index,
      descTitle: title
    });
  };

  const cancelDelete = () => {
    setDeleteConfirm({
      isOpen: false,
      descId: null,
      descIndex: null,
      descTitle: ""
    });
  };

  const deleteDescription = async () => {
    if (deleteConfirm.descId === null || deleteConfirm.descIndex === null) return;
    
    try {
      const response = await fetch(`https://api.eslamoffers.com/api/Store/DeleteDescriptionStore/${store.id}/${deleteConfirm.descId}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setDescriptions(prev => prev.filter((desc, i) => i !== deleteConfirm.descIndex));
        setDeleteConfirm({
          isOpen: false,
          descId: null,
          descIndex: null,
          descTitle: ""
        });
        if (onUpdate) onUpdate();
      } else {
        console.error("Failed to delete description");
      }
    } catch (error) {
      console.error("Error deleting description:", error);
    }
  };

  const startEditing = (index) => {
    const desc = descriptions[index];
    setCurrentDescription({
      subHeader: desc.subHeader || "",
      description: desc.description || "",
      image: null,
      altText: desc.altText || "",
      isEditing: true,
      editIndex: index
    });
    
    // التمرير إلى الأعلى لعرض الفورم
    document.querySelector('.descriptions-container')?.scrollTo(0, 0);
  };

  const cancelEditing = () => {
    setCurrentDescription({
      subHeader: "",
      description: "",
      image: null,
      altText: "",
      isEditing: false,
      editIndex: null
    });
  };

  const getImageSrc = (url) => {
    if (!url) return null;
    if (url.startsWith('blob:') || url.startsWith('data:')) return url;
    return `https://api.eslamoffers.com/uploads/${url}`;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-purple-600">
              إدارة أوصاف المتجر: {store.name}
            </h2>
            <button
              className="text-gray-500 hover:text-red-500 text-2xl transition"
              onClick={onClose}
            >
              <FiXCircle />
            </button>
          </div>
          
          <div className="overflow-y-auto flex-1 p-6 descriptions-container">
            {/* فورم إضافة/تعديل وصف */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-gray-700">
                {currentDescription.isEditing ? "تعديل وصف" : "إضافة وصف جديد"}
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  name="subHeader"
                  placeholder="العنوان الفرعي"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={currentDescription.subHeader}
                  onChange={handleCurrentDescChange}
                />
                <textarea
                  name="description"
                  placeholder="الوصف"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px]"
                  value={currentDescription.description}
                  onChange={handleCurrentDescChange}
                />
                <input
                  type="text"
                  name="altText"
                  placeholder="النص البديل للصورة (Alt Text)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={currentDescription.altText}
                  onChange={handleCurrentDescChange}
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
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
                    ref={fileInputRef}
                    onChange={handleDescImageChange}
                    className="hidden"
                  />
                </div>
                <div className="flex gap-2">
                  {currentDescription.isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={updateDescription}
                        className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex-1"
                        disabled={!currentDescription.subHeader || !currentDescription.description}
                      >
                        <FiCheck />
                        حفظ التعديلات
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                      >
                        <FiX />
                        إلغاء
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={addDescription}
                      className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition w-full"
                      disabled={!currentDescription.subHeader || !currentDescription.description}
                    >
                      <FiPlus />
                      إضافة وصف
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* عرض الأوصاف الحالية */}
            <div>
              <h3 className="font-medium text-gray-700 mb-4">الأوصاف الإضافية الحالية</h3>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : descriptions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">لا توجد أوصاف إضافية مضافة</p>
              ) : (
                <div className="space-y-3">
                  {descriptions.map((desc, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{desc.subHeader}</h4>
                          <p className="text-sm text-gray-600 mt-1">{desc.description}</p>
                          {desc.altText && (
                            <p className="text-xs text-gray-500 mt-1">النص البديل: {desc.altText}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(index)}
                            className="text-blue-500 hover:text-blue-700 p-1"
                            title="تعديل"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => confirmDelete(desc.id, index, desc.subHeader)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="حذف"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      {desc.image && (
                        <div className="mt-2">
                          <img 
                            src={getImageSrc(desc.image)} 
                            alt={desc.altText || desc.subHeader} 
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>

      {/* مودال تأكيد الحذف */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="text-center">
              <FiTrash2 className="mx-auto text-red-500 text-4xl mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">تأكيد الحذف</h3>
              <p className="text-gray-600 mb-6">
                هل أنت متأكد من أنك تريد حذف الوصف "{deleteConfirm.descTitle}"؟ هذا الإجراء لا يمكن التراجع عنه.
              </p>
              
              <div className="flex justify-center gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={deleteDescription}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  نعم، احذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoreDescriptionsModal;