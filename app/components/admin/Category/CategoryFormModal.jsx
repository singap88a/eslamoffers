'use client';
import React, { useState, useEffect } from 'react';

const CategoryFormModal = ({ isOpen, onClose, onSave, category }) => {
  const [name, setName] = useState('');
  const [iconUrl, setIconUrl] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIconUrl(category.iconUrl);
    } else {
      setName('');
      setIconUrl('');
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...category, name, iconUrl });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{category ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              اسم الفئة
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="iconUrl">
              رابط الأيقونة
            </label>
            <input
              type="text"
              id="iconUrl"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {category ? 'حفظ التغييرات' : 'إضافة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal; 