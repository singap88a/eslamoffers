"use client";
import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiList } from "react-icons/fi";
import { RiCoupon3Line } from "react-icons/ri";

const StoreTable = ({ stores, onEdit, onDelete, onNavigateToCoupons, onManageDescriptions, loading }) => {
  const [categories, setCategories] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

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

  const toggleDescription = (id) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const truncateText = (text, maxLength = 20) => {
    if (!text) return "-";
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : stores.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-lg font-medium text-gray-600">لا توجد متاجر متاحة حالياً</p>
          <p className="text-sm mt-2 text-gray-400">يمكنك البدء بإضافة متجر جديد</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-teal-50 to-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-right text-sm font-semibold text-teal-800 uppercase tracking-wider">
                  المتجر
                </th>
                <th scope="col" className="px-6 py-4 text-right text-sm font-semibold text-teal-800 uppercase tracking-wider">
                  التفاصيل
                </th>
                <th scope="col" className="px-6 py-4 text-right text-sm font-semibold text-teal-800 uppercase tracking-wider">
                  الحالة
                </th>
                <th scope="col" className="px-6 py-4 text-right text-sm font-semibold text-teal-800 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stores.map((store) => (
                <tr key={store.id} className={store.isBast ? "bg-amber-50 hover:bg-amber-100" : "hover:bg-gray-50"}>
                  {/* Column 1: Store Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-contain border border-gray-200 bg-white shadow-sm"
                          src={store.logoUrl ? `https://api.eslamoffers.com/uploads/${store.logoUrl}` : "/default-store.png"}
                          alt={store.altText || store.name}
                        />
                      </div>
                      <div className="mr-4">
                        <div className="text-lg font-bold text-gray-800">{store.name}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          /{store.slug || "---"}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Column 2: Details */}
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div 
                        className="text-sm text-gray-600 cursor-pointer hover:text-teal-600 transition"
                        onClick={() => toggleDescription(store.id)}
                      >
                        {expandedDescriptions[store.id] ? (
                          <>
                            <span className="font-medium">وصف الهيدر:</span> {store.headerDescription || "لا يوجد وصف"}
                            <FiChevronUp className="inline mr-1 text-teal-600" />
                          </>
                        ) : (
                          <>
                            <span className="font-medium">وصف الهيدر:</span> {truncateText(store.headerDescription, 25) || "---"}
                            {store.headerDescription && store.headerDescription.length > 25 && (
                              <FiChevronDown className="inline mr-1 text-teal-600" />
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {store.categorys?.slice(0, 3).map(categoryId => (
                          <span
                            key={categoryId}
                            className="px-2 py-1 text-xs bg-teal-100 text-teal-800 rounded-full"
                          >
                            {getCategoryName(categoryId)}
                          </span>
                        ))}
                        {store.categorys?.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{store.categorys.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  {/* Column 3: Status */}
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                        ${store.isBast ? 'bg-amber-200 text-amber-900' : 'bg-gray-200 text-gray-800'}`}>
                        {store.isBast ? '⭐ متجر مميز' : 'متجر عادي'}
                      </span>
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                        ${store.isactive ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>
                        {store.isactive ? '🟢 نشط' : '🔴 غير نشط'}
                      </span>
                    </div>
                  </td>
                  
                  {/* Column 4: Actions */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => onNavigateToCoupons(store)}
                        className="flex items-center justify-center cursor-pointer space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
                      >
                        <RiCoupon3Line className="h-5 w-5" />
                        <span>كوبونات المتجر</span>
                      </button>
                      <button
                        onClick={() => onManageDescriptions(store)}
                        className="flex items-center  cursor-pointer justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
                      >
                        <FiList className="h-4 w-4" />
                        <span className="text-[14px]">إدارة معلومات المتجر</span>
                      </button>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(store)}
                          className="flex-1 flex items-center cursor-pointer justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
                        >
                          <FiEdit2 className="h-4 w-4" />
                          <span>تعديل</span>
                        </button>
                        <button
                          onClick={() => onDelete(store)}
                          className="flex-1 flex items-center cursor-pointer justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
                        >
                          <FiTrash2 className="h-4 w-4" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StoreTable;