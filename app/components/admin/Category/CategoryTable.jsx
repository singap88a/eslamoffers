import React from 'react';
import Image from 'next/image';
import { FiEdit2, FiTrash2, FiTag, FiImage } from 'react-icons/fi';

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
        <p className="text-lg font-semibold text-gray-400">لم يتم العثور على فئات.</p>
        <p className="text-gray-400 mt-2">جرب إضافة فئة جديدة.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full text-right align-middle">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">الاسم</th>
              <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">الأيقونة</th>
              <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <FiTag className="text-gray-400" />
                    <span className="font-semibold text-gray-800">{category.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {/* <FiImage className="text-gray-400" /> */}
                    <img
                      src={category.iconUrl ? `http://147.93.126.19:8080/uploads/${category.iconUrl}` : '/logo.png'}
                      alt={category.name}
                      width={40}
                      height={40}
                      className="rounded-full border border-gray-200 shadow"
                    />
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-1.5 text-sm bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 transition-all font-semibold shadow-sm"
                      onClick={() => onEdit(category)}
                      title="تعديل"
                    >
                      <FiEdit2 />
                      تعديل
                    </button>
                    <button
                      className="flex items-center gap-1.5 text-sm bg-red-100 text-red-700 px-3 py-1.5 rounded-md hover:bg-red-200 transition-all font-semibold shadow-sm"
                      onClick={() => onDelete(category.id)}
                      title="حذف"
                    >
                      <FiTrash2 />
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable; 