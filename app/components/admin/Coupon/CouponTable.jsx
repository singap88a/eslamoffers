import React from 'react';
import { FiEdit2, FiTrash2, FiTag, FiClock, FiCode, FiPercent, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const CouponTable = ({ coupons, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
        <p className="text-lg font-semibold text-gray-500 animate-pulse">جاري تحميل الكوبونات...</p>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد كوبونات</h3>
          <p className="text-gray-500">
            لم يتم العثور على كوبونات لهذا المتجر. يمكنك البدء بإضافة كوبون جديد.
          </p>
        </div>
        <button
          onClick={() => {
            // Trigger the modal to open
            const addButton = document.querySelector('[data-add-coupon]');
            if (addButton) {
              addButton.click();
            }
          }}
          className="inline-flex items-center px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
        >
          <span>إضافة كوبون جديد</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full text-right align-middle">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">العنوان</th>
              <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider hidden md:table-cell">الخصم</th>
              <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">الكود</th>
              <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider hidden lg:table-cell">النص البديل</th>
              <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider hidden md:table-cell">تاريخ الانتهاء</th>
              <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider hidden lg:table-cell">النسخ</th>
              <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">الحالة</th>
              <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <FiTag className="text-gray-400"/>
                    <div>
                      <span className="font-semibold text-gray-800">{coupon.title}</span>
                      {(coupon.isBest || coupon.isBastDiscount) && (
                        <span className="inline-block ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          الأفضل
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap hidden md:table-cell">
                    <div className="flex items-center gap-2">
                        <FiPercent className="text-gray-400"/>
                        <span className="text-gray-600">{coupon.discount}%</span>
                    </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        <FiCode className="text-gray-400"/>
                        <span className="font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">{coupon.couponCode}</span>
                    </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm max-w-[150px] truncate" title={coupon.altText || "لا يوجد نص بديل"}>
                      {coupon.altText || "لا يوجد نص بديل"}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <FiClock className="text-gray-400" />
                    <span className="text-gray-600">
                      {new Date(coupon.endDate || coupon.stratDate).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-semibold">{coupon.number || 0}</span>
                    <span className="text-gray-400 text-sm">نسخة</span>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  {coupon.isActive ? (
                    <span className="flex items-center gap-2 text-green-600 bg-green-100 px-3 py-1 rounded-full font-semibold text-xs">
                        <FiCheckCircle />
                        نشط
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-600 bg-red-100 px-3 py-1 rounded-full font-semibold text-xs">
                        <FiXCircle />
                        غير نشط
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      className="flex cursor-pointer items-center gap-1.5 text-sm bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 transition-all font-semibold shadow-sm"
                      onClick={() => onEdit(coupon)}
                      title="تعديل"
                    >
                      <FiEdit2 />
                      تعديل
                    </button>
                    <button
                      className="flex cursor-pointer items-center gap-1.5 text-sm bg-red-100 text-red-700 px-3 py-1.5 rounded-md hover:bg-red-200 transition-all font-semibold shadow-sm"
                      onClick={() => onDelete(coupon)}
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

export default CouponTable; 