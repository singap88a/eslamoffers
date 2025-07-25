import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const OfferTable = ({ offers, onEdit, onDelete, loading }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto border border-gray-200">
      {loading ? (
        <p className="text-center text-gray-500 text-lg font-semibold">جاري التحميل...</p>
      ) : offers.length === 0 ? (
        <p className="text-center text-gray-400 text-lg font-semibold">لا توجد عروض بعد.</p>
      ) : (
        <table className="min-w-full text-right">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-gray-700">الشعار</th>
              <th className="py-3 px-4 text-gray-700">عنوان العرض</th>
              <th className="py-3 px-4 text-gray-700">مميز؟</th>
              <th className="py-3 px-4 text-gray-700">رابط الصفحة</th>
              <th className="py-3 px-4 text-gray-700">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id} className={`border-b hover:bg-gray-50 transition-all duration-200 ${offer.isBast ? 'bg-yellow-50/60' : ''}`}>
                <td className="py-2 px-4">
                  <img
                    src={offer.logoUrl ? `https://api.eslamoffers.com/uploads/${encodeURIComponent(offer.logoUrl)}` : "/default-image.png"}
                    alt={offer.title}
                    className="w-14 h-14 object-contain rounded-lg border border-gray-200 bg-white shadow-sm"
                  />
                </td>
                <td className="py-2 px-4 font-bold text-lg text-gray-800">{offer.title}</td>
                <td className="py-2 px-4">
                  {offer.isBast ? (
                    <span className="inline-block bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow">⭐ عرض مميز</span>
                  ) : (
                    <span className="inline-block bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">عادي</span>
                  )}
                </td>
                <td className="py-2 px-4 text-gray-600">
                    <a href={offer.linkPage} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        زيارة الرابط
                    </a>
                </td>

                <td className="py-2 px-4 flex gap-2">
                  <button
                    className="flex items-center gap-1 bg-[#14b8a6]/90 text-white px-4 py-2 rounded-lg hover:bg-[#14b8a6] transition font-bold shadow text-base cursor-pointer border border-[#14b8a6]/30"
                    onClick={() => onEdit(offer)}
                    title="تعديل"
                  >
                    <FiEdit2 className="text-lg" />
                    تعديل
                  </button>
                  <button
                    className="flex items-center gap-1 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition font-bold shadow text-base cursor-pointer border border-red-200"
                    onClick={() => onDelete(offer)}
                    title="حذف"
                  >
                    <FiTrash2 className="text-lg" />
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

export default OfferTable; 