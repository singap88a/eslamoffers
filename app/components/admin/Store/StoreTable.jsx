"use client";
import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { RiCoupon3Line } from "react-icons/ri";

const StoreTable = ({ stores, onEdit, onDelete, onNavigateToCoupons, loading }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://api.eslamoffers.com/api/Category/GetAllCategories");
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto border border-gray-200">
      {loading ? (
        <p className="text-center text-gray-500 text-lg font-semibold">جاري التحميل...</p>
      ) : stores.length === 0 ? (
        <p className="text-center text-gray-400 text-lg font-semibold">لا توجد متاجر بعد.</p>
      ) : (
        <table className="min-w-full text-right">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-gray-700">الشعار</th>
              <th className="py-3 px-4 text-gray-700">اسم المتجر</th>
              <th className="py-3 px-4 text-gray-700">الرابط المختصر</th>
              <th className="py-3 px-4 text-gray-700">وصف الهيدر</th>
              <th className="py-3 px-4 text-gray-700">مميز؟</th>
              <th className="py-3 px-4 text-gray-700">تاريخ الإنشاء</th>
              <th className="py-3 px-4 text-gray-700">الحالة</th>
              <th className="py-3 px-4 text-gray-700">إجراءات</th>
              <th className="px-4 py-2 text-right">الفئات</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id} className={`border-b hover:bg-gray-50 transition-all duration-200 ${store.isBast ? 'bg-yellow-50/60' : ''}`}>
                <td className="py-2 px-4">
                  <img
                    src={store.logoUrl ? `https://api.eslamoffers.com/uploads/${store.logoUrl}` : "/default-image.png"}
                    alt={store.name}
                    className="w-14 h-14 object-contain rounded-lg border border-gray-200 bg-white shadow-sm"
                  />
                </td>
                <td className="py-2 px-4 font-bold text-lg text-gray-800">{store.name}</td>
                <td className="py-2 px-4 text-gray-600">
                  {store.slug ? (
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-mono">{store.slug}</span>
                  ) : (
                    <span className="text-red-500 text-sm">غير محدد</span>
                  )}
                </td>
                <td className="py-2 px-4 text-gray-600 max-w-[200px] truncate">{store.headerDescription || "-"}</td>
                <td className="py-2 px-4">
                  {store.isBast ? (
                    <span className="inline-block bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow">⭐ أفضل متجر</span>
                  ) : (
                    <span className="inline-block bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">عادي</span>
                  )}
                </td>
                <td className="py-2 px-4 text-gray-600">
                  {store.createdAt
                    ? new Date(store.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="py-2 px-4">
                  {store.isactive ? (
                    <span className="text-green-600 font-bold">نشط</span>
                  ) : (
                    <span className="text-red-600 font-bold">غير نشط</span>
                  )}
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition font-bold shadow text-base cursor-pointer border border-blue-200"
                    onClick={() => onNavigateToCoupons(store.id)}
                    title="الكوبونات"
                  >
                    <RiCoupon3Line className="text-lg" />
                    الكوبونات
                  </button>
                  <button
                    className="flex items-center gap-1 bg-[#14b8a6]/90 text-white px-4 py-2 rounded-lg hover:bg-[#14b8a6] transition font-bold shadow text-base cursor-pointer border border-[#14b8a6]/30"
                    onClick={() => onEdit(store)}
                    title="تعديل"
                  >
                    <FiEdit2 className="text-lg" />
                    تعديل
                  </button>
                  <button
                    className="flex items-center gap-1 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition font-bold shadow text-base cursor-pointer border border-red-200"
                    onClick={() => onDelete(store)}
                    title="حذف"
                  >
                    <FiTrash2 className="text-lg" />
                    حذف
                  </button>
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    {store.categorys?.map((categoryId) => (
                      <span
                        key={categoryId}
                        className="px-2 py-1 text-sm bg-teal-100 text-teal-800 rounded-full"
                      >
                        {getCategoryName(categoryId)}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StoreTable;