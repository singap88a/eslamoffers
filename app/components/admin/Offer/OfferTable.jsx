import React from "react";
import { FiEdit2, FiTrash2, FiExternalLink, FiStar, FiDollarSign, FiPercent } from "react-icons/fi";

const OfferTable = ({ offers, onEdit, onDelete, loading }) => {
  const getImageUrl = (url) => {
    if (!url) return "/default-image.png";
    if (url.startsWith('http')) return url;
    return `https://api.eslamoffers.com/uploads/${encodeURIComponent(url)}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto border border-gray-200">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-center text-gray-500 text-lg font-semibold">جاري تحميل العروض...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-center text-gray-400 text-lg font-semibold">لا توجد عروض متاحة حالياً</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المنتج
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                السعر
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الخصم
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المتجر
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {offers.map((offer) => (
              <tr 
                key={offer.id} 
                className={`hover:bg-gray-50 transition-colors ${offer.isBast ? 'bg-yellow-50' : ''}`}
              >
                {/* Product Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16 relative">
                      <img
                        className="h-full w-full object-contain rounded-lg border border-gray-200"
                        src={getImageUrl(offer.logoUrl)}
                        alt={offer.title}
                      />
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                      <div className="text-sm text-gray-500">
                        <a 
                          href={offer.linkPage} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-500 hover:underline"
                        >
                          <FiExternalLink className="ml-1" /> زيارة العرض
                        </a>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Price Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {offer.price > 0 ? (
                    <div className="flex items-center">
                      <FiDollarSign className="text-gray-400 ml-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {offer.price.toLocaleString()} {offer.currencyCodes || 'USD'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">غير محدد</span>
                  )}
                </td>

                {/* Discount Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {offer.discount > 0 ? (
                    <div className="flex items-center">
                      <FiPercent className="text-gray-400 ml-1" />
                      <span className="text-sm font-medium text-green-600">
                        {offer.discount}%
                      </span>
                      {offer.price > 0 && (
                        <span className="text-xs text-gray-500 mr-2">
                          ({Math.round(offer.price * (1 - offer.discount/100))} {offer.currencyCodes || 'USD'})
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">لا يوجد</span>
                  )}
                </td>

                {/* Store Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <img
                        className="h-full w-full object-cover rounded-full border border-gray-200"
                        src={getImageUrl(offer.imageStoreUrl)}
                        alt="متجر"
                      />
                    </div>
                    {offer.couponId && (
                      <span className="mr-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        كوبون
                      </span>
                    )}
                  </div>
                </td>

                {/* Status Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    {offer.isBast && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 flex items-center">
                        <FiStar className="ml-1" /> مميز
                      </span>
                    )}
                    {offer.createdAt && (
                      <span className="text-xs text-gray-500">
                        {new Date(offer.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </td>

                {/* Actions Column */}
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  <div className="flex space-x-2 space-x-reverse gap-2">
    <button
      onClick={() => onEdit(offer)}
      className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded-lg cursor-pointer transition-colors duration-200 flex items-center"
    >
      <FiEdit2 className="ml-1" /> تعديل
    </button>
    <button
      onClick={() => onDelete(offer)}
      className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-lg cursor-pointer transition-colors duration-200 flex items-center"
    >
      <FiTrash2 className="ml-1" /> حذف
    </button>
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

export default OfferTable;