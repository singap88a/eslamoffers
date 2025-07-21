import React from 'react';
import Image from 'next/image';

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="text-right py-3 px-4 uppercase font-semibold text-sm">الاسم</th>
            <th className="text-right py-3 px-4 uppercase font-semibold text-sm">الأيقونة</th>
            <th className="text-right py-3 px-4 uppercase font-semibold text-sm">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="text-right py-3 px-4">{category.name}</td>
              <td className="text-right py-3 px-4">
                <Image src={category.iconUrl} alt={category.name} width={40} height={40} className="rounded-full" />
              </td>
              <td className="text-right py-3 px-4">
                <button
                  onClick={() => onEdit(category)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 ml-2"
                >
                  تعديل
                </button>
                <button
                  onClick={() => onDelete(category.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable; 