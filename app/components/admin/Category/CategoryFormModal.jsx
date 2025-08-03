'use client';
import React, { useState, useEffect } from 'react';
import { FiX, FiTag, FiImage } from 'react-icons/fi';
import Toast from '../Store/Toast';

const InputField = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
      {icon}
    </div>
    <input {...props} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#14b8a6] focus:border-[#14b8a6] block pr-10 p-2.5 transition" />
  </div>
);

const CategoryFormModal = ({ isOpen, onClose, onSave, category }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug || '');
      setIconUrl(category.iconUrl);
      setImageFile(null);
    } else {
      setName('');
      setSlug('');
      setIconUrl('');
      setImageFile(null);
    }
  }, [category]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setIconUrl(URL.createObjectURL(file));
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
      setImageFile(e.dataTransfer.files[0]);
      setIconUrl(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...category, name, slug, iconUrl }, imageFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000086] bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md duration-300 scale-95" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{category ? 'تعديل بيانات الفئة' : 'إضافة فئة جديدة'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full">
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField icon={<FiTag />} name="name" value={name} onChange={e => setName(e.target.value)} placeholder="اسم الفئة" required />
          <InputField icon={<FiTag />} name="slug" value={slug} onChange={e => setSlug(e.target.value)} placeholder="الرابط المختصر (بالعربية)" required dir="rtl" />
          {/* Drag & Drop Image Upload */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${dragActive ? 'border-[#14b8a6]' : 'hover:border-[#14b8a6]'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current.click()}
            style={{ position: 'relative' }}
          >
            <input
              id="category-image-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            {iconUrl ? (
              <img
                src={iconUrl.startsWith('blob:') || iconUrl.startsWith('data:') ? iconUrl : `https://api.eslamoffers.com/uploads/${iconUrl}`}
                alt="Category Icon"
                className="mx-auto mb-2 rounded-full border w-20 h-20 object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <FiImage size={36} />
                <span className="mt-2">اسحب الصورة هنا أو اضغط لاختيار صورة</span>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors">
              إلغاء
            </button>
            <button type="submit" className="bg-[#14b8a6] hover:bg-[#11a394] text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
              {category ? 'حفظ التعديلات' : 'إضافة الفئة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;