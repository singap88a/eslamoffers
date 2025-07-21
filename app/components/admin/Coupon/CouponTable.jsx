import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const CouponTable = ({ coupons, onEdit, onDelete, loading }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto border border-gray-200">
      {loading ? (
        <p className="text-center text-gray-500 text-lg font-semibold">جاري تحميل الكوبونات...</p>
      ) : coupons.length === 0 ? (
        <p className="text-center text-gray-400 text-lg font-semibold">لا توجد كوبونات لهذا المتجر بعد.</p>
      ) : (
        <table className="min-w-full text-right">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-gray-700">العنوان</th>
              <th className="py-3 px-4 text-gray-700">الخصم</th>
              <th className="py-3 px-4 text-gray-700">الكود</th>
              <th className="py-3 px-4 text-gray-700">تاريخ الانتهاء</th>
              <th className="py-3 px-4 text-gray-700">الحالة</th>
              <th className="py-3 px-4 text-gray-700">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b hover:bg-gray-50 transition-all duration-200">
                <td className="py-2 px-4 font-bold text-gray-800">{coupon.title}</td>
                <td className="py-2 px-4 text-gray-600">{coupon.discount}%</td>
                <td className="py-2 px-4 text-gray-600 font-mono">{coupon.couponCode}</td>
                <td className="py-2 px-4 text-gray-600">
                  {new Date(coupon.endDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  {coupon.isActive ? (
                    <span className="text-green-600 font-bold">نشط</span>
                  ) : (
                    <span className="text-red-600 font-bold">غير نشط</span>
                  )}
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    className="flex items-center gap-1 bg-[#14b8a6]/90 text-white px-4 py-2 rounded-lg hover:bg-[#14b8a6] transition font-bold shadow text-base cursor-pointer"
                    onClick={() => onEdit(coupon)}
                    title="تعديل"
                  >
                    <FiEdit2 />
                    تعديل
                  </button>
                  <button
                    className="flex items-center gap-1 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition font-bold shadow text-base cursor-pointer"
                    onClick={() => onDelete(coupon)}
                    title="حذف"
                  >
                    <FiTrash2 />
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CouponTable; 