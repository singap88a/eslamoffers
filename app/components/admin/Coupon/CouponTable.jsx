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
        <p className="text-lg font-semibold text-gray-400">لم يتم العثور على كوبونات.</p>
        <p className="text-gray-400 mt-2">جرب إضافة كوبون جديد لهذا المتجر.</p>
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
              <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider hidden md:table-cell">تاريخ الانتهاء</th>
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
                    <span className="font-semibold text-gray-800">{coupon.title}</span>
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
                <td className="py-4 px-6 whitespace-nowrap hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <FiClock className="text-gray-400" />
                    <span className="text-gray-600">{new Date(coupon.endDate).toLocaleDateString('ar-EG')}</span>
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
                      className="flex items-center gap-1.5 text-sm bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 transition-all font-semibold shadow-sm"
                      onClick={() => onEdit(coupon)}
                      title="تعديل"
                    >
                      <FiEdit2 />
                      تعديل
                    </button>
                    <button
                      className="flex items-center gap-1.5 text-sm bg-red-100 text-red-700 px-3 py-1.5 rounded-md hover:bg-red-200 transition-all font-semibold shadow-sm"
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