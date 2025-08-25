import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiEdit2, FiTrash2, FiTag, FiImage, FiEye } from 'react-icons/fi';

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  const [categoryTags, setCategoryTags] = useState({});
  const [expandedTags, setExpandedTags] = useState({});

  useEffect(() => {
    // Load tags for all categories
    const loadAllTags = async () => {
      const tagsData = {};
      for (const category of categories) {
        try {
          console.log(`Loading tags for category: ${category.name} (${category.id})`);
          const response = await fetch(`https://api.eslamoffers.com/api/Category/GetCategoryTags/${category.id}`);
          if (response.ok) {
            const data = await response.json();
            console.log(`Tags response for ${category.name}:`, data);
            if (Array.isArray(data)) {
              const tagStrings = data.map(t => t?.slug || t?.name).filter(Boolean);
              tagsData[category.id] = tagStrings;
              console.log(`Tags loaded for ${category.name}:`, tagStrings);
            } else {
              console.log(`Tags response for ${category.name} is not an array:`, data);
            }
          } else {
            console.error(`Failed to load tags for ${category.name}:`, response.status, response.statusText);
          }
        } catch (error) {
          console.error(`Failed to load tags for category ${category.id}:`, error);
        }
      }
      setCategoryTags(tagsData);
    };

    if (categories.length > 0) {
      loadAllTags();
    }
  }, [categories]);

  const toggleTags = (categoryId) => {
    setExpandedTags(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

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
              <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">الرابط المختصر</th>
              <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">نص بديل للصورة</th>
              <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">الوسوم</th>
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
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {category.slug || 'غير محدد'}
                  </span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="max-w-xs">
                    <span className="text-sm text-gray-600">
                      {category.altText || 'غير محدد'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="max-w-xs">
                    {categoryTags[category.id] && categoryTags[category.id].length > 0 ? (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <button
                            onClick={() => toggleTags(category.id)}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <FiEye size={14} />
                            {expandedTags[category.id] ? 'إخفاء' : 'عرض'} الوسوم
                          </button>
                          <span className="text-xs text-gray-500">
                            ({categoryTags[category.id].length} وسوم)
                          </span>
                        </div>
                        {expandedTags[category.id] && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {categoryTags[category.id].map((tag, index) => (
                              <span
                                key={index}
                                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">لا توجد وسوم</span>
                        <button
                          onClick={() => window.location.reload()}
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                          title="تحديث الصفحة"
                        >
                          تحديث
                        </button>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <img
                      src={category.iconUrl ? `https://api.eslamoffers.com/uploads/${category.iconUrl}` : '/logo.png'}
                      alt={category.altText || category.name}
                      width={40}
                      height={40}
                      className="rounded-full border border-gray-200 shadow"
                    />
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center cursor-pointer gap-1.5 text-sm bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 transition-all font-semibold shadow-sm"
                      onClick={() => onEdit(category)}
                      title="تعديل"
                    >
                      <FiEdit2 />
                      تعديل
                    </button>
                    <button
                      className="flex items-center gap-1.5 cursor-pointer text-sm bg-red-100 text-red-700 px-3 py-1.5 rounded-md hover:bg-red-200 transition-all font-semibold shadow-sm"
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