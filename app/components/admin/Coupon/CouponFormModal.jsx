"use client";
import React, { useState, useEffect } from 'react';

const CouponFormModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    discount: 0,
    couponCode: '',
    stratDate: '',
    endDate: '',
    isActive: true,
    isBest: false,
    linkRealStore: '',
    storeId: '',
    categoryId: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        stratDate: initialData.stratDate ? new Date(initialData.stratDate).toISOString().slice(0, 16) : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        discount: 0,
        couponCode: '',
        stratDate: '',
        endDate: '',
        isActive: true,
        isBest: false,
        linkRealStore: '',
        storeId: '',
        categoryId: '',
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">{initialData ? 'تعديل الكوبون' : 'إضافة كوبون جديد'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="عنوان الكوبون" className="p-2 border rounded" />
          <input name="description" value={formData.description} onChange={handleChange} placeholder="الوصف" className="p-2 border rounded" />
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="رابط صورة الكوبون" className="p-2 border rounded" />
          <input name="discount" type="number" value={formData.discount} onChange={handleChange} placeholder="نسبة الخصم" className="p-2 border rounded" />
          <input name="couponCode" value={formData.couponCode} onChange={handleChange} placeholder="كود الكوبون" className="p-2 border rounded" />
          <input name="linkRealStore" value={formData.linkRealStore} onChange={handleChange} placeholder="رابط المتجر" className="p-2 border rounded" />
          <input name="storeId" value={formData.storeId} onChange={handleChange} placeholder="معرف المتجر" className="p-2 border rounded" />
          <input name="categoryId" value={formData.categoryId} onChange={handleChange} placeholder="معرف الفئة" className="p-2 border rounded" />
          <div className="col-span-1">
            <label>تاريخ البدء</label>
            <input name="stratDate" type="datetime-local" value={formData.stratDate} onChange={handleChange} className="p-2 border rounded w-full" />
          </div>
          <div className="col-span-1">
            <label>تاريخ الانتهاء</label>
            <input name="endDate" type="datetime-local" value={formData.endDate} onChange={handleChange} className="p-2 border rounded w-full" />
          </div>
          <div className="flex items-center gap-4">
            <label><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} /> نشط</label>
            <label><input type="checkbox" name="isBest" checked={formData.isBest} onChange={handleChange} /> مميز</label>
          </div>
          <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
            <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded">إلغاء</button>
            <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:bg-blue-300">
              {loading ? 'جاري الحفظ...' : (initialData ? 'حفظ التعديلات' : 'إضافة الكوبون')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponFormModal; 