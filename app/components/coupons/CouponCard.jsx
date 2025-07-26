'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiCopy, FiCheck, FiX, FiClock } from 'react-icons/fi';

const CouponCard = ({ coupon, onGetCode }) => {
  const [showModal, setShowModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.couponCode);
    setIsCopied(true);
    fetch(`https://api.eslamoffers.com/api/Coupons/NumberUsed/${coupon.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxOTcwZGYxMi00ZDZiLTQ0OTYtOGZmNi1jZmVmMDJlMjhlM2MiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjQ5YmFjNWVmLWY4MjktNGRjMy1hZWIyLTFjNmQ1ZTgxYWE3YSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJyZWRhc2FhZDAxMDI2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6ImFkbWluIiwiZXhwIjoxNzUzNTY5NjQyLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MjYyLyIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjcyNjIvIn0.uNVL0lKRVGO30MifLDc4PQTeA4RzRYWRrnQo_G_elhQ'
      }
    }).catch(err => console.error('Error updating last use:', err));
  };

  const getImageSrc = () => {
    if (!coupon.imageUrl) return '/logo.png';
    if (coupon.imageUrl.startsWith('http') || coupon.imageUrl.startsWith('https')) {
      return coupon.imageUrl;
    }
    return `https://api.eslamoffers.com/uploads/${coupon.imageUrl}`;
  };

  const isExpired = !coupon.isActive || new Date(coupon.endDate || coupon.end_date) < new Date();

  const getLastUsedTime = () => {
    if (!coupon.lastUseAt) return null;
    
    const lastUseDate = new Date(coupon.lastUseAt);
    const now = new Date();
    
    if (isNaN(lastUseDate.getTime())) return null;
    if (lastUseDate > now) return { text: "الآن", time: "" };
    
    const diffTime = Math.abs(now - lastUseDate);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) {
      return { text: "تم الاستخدام", time: "الآن" };
    }
    
    if (diffMinutes < 60) {
      return { 
        text: "تم الاستخدام منذ", 
        time: `${diffMinutes} دقيقة${diffMinutes > 1 ? ' ' : ''}`
      };
    }
    
    if (diffHours < 24) {
      return { 
        text: "تم الاستخدام منذ", 
        time: `${diffHours} ساعات${diffHours > 1 ? ' ' : ''}`
      };
    }
    
    return { 
      text: "تم الاستخدام منذ", 
      time: `${diffDays} يوم${diffDays > 1 ? 'ين' : ''}`
    };
  };

  const lastUsedTime = getLastUsedTime();

  return (
    <>
      <div className="relative bg-white border-2 border-gray-300 border-dashed hover:border-teal-400 rounded-2xl transform hover:-translate-y-2 duration-300 ease-in-out transition-all p-6 w-full max-w-sm flex flex-col justify-between">
        {/* شارة الحالة */}
        <span
          className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold ${
            isExpired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}
        >
          {isExpired ? 'منتهي' : 'نشط'}
        </span>
        
        {/* شارة أفضل كوبون */}
        {coupon.isBest && (
          <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs font-bold">
            الأفضل
          </span>
        )}

        <div className="mx-auto text-center mb-6">
          <a
            href={coupon.linkRealStore}
            target="_blank"
            rel="noopener noreferrer"
            className="w-24 h-16 relative flex justify-center items-center"
          >
            <Image
              src={getImageSrc()}
              alt={coupon.title}
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
          </a>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{coupon.title}</h3>
          </div>
        </div>
        
        {/* عرض آخر استخدام للكود - تصميم جديد */}
{lastUsedTime && (
  <div className="bg-green-50 border border-green-100 rounded-md px-2   flex items-center justify-center gap-1 text-[11px] font-medium w-fit mx-auto">
    <FiClock className="text-green-500 text-[13px] -mt-[1px]" />
    <span className="text-gray-700">آخر استخدام للكود:</span>
    <span className="text-green-600 font-bold">{lastUsedTime.time}</span>
  </div>
)}



        <div className="flex items-center justify-between gap-2 mt-4">
          <button
            onClick={() => {
              if (onGetCode) {
                onGetCode(coupon);
              } else {
                setShowModal(true);
                setIsCopied(false);
              }
            }}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold px-4 py-2 rounded-lg hover:from-teal-600 hover:to-teal-700 transition"
          >
            انسخ الكود
          </button>
        </div>
      </div>

      {/* مودال الكود */}
      {showModal && (
        <div
          onClick={() => { setShowModal(false); setIsCopied(false); }}
          className="fixed inset-0 bg-[#00000079] bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full relative animate-fadeIn"
          >
            <button
              onClick={() => { setShowModal(false); setIsCopied(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FiX size={24} />
            </button>
            
            {/* شعار المتجر */}
            <div className="flex flex-col items-center mb-2">
              <Image
                src={getImageSrc()}
                alt={coupon.title}
                width={80}
                height={40}
                className="mb-2"
              />
            </div>
            
            <h2 className="text-xl font-bold text-center mb-2 text-gray-800">{coupon.title}</h2>
            <p className="text-center text-gray-500 mb-4">{coupon.descriptionCoupon || coupon.description}</p>
            
            {/* معلومات الخصم */}
            <div className="flex justify-between items-center mb-4">
              <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-bold">
                خصم {coupon.discount}%
              </div>
              <div className="text-sm text-gray-500">
                صالح حتى: {new Date(coupon.endDate).toLocaleDateString('ar-EG')}
              </div>
            </div>
            
            {/* عرض عدد مرات الاستخدام */}
            {coupon.number > 0 && (
              <div className="bg-purple-50 text-purple-700 rounded-md px-3 py-2 text-center mb-2 font-semibold text-sm">
                تم استخدام هذا الكود {coupon.number} مرة
              </div>
            )}
            
            {/* رسالة تم النسخ */}
            {isCopied && (
              <div className="bg-green-100 text-green-700 rounded-md px-3 py-2 text-center mb-2 font-semibold text-sm">
                تم نسخ الكود بنجاح!
              </div>
            )}
            
            {/* الكود مع إمكانية النسخ */}
            <div
              className="bg-gray-50 border border-dashed border-teal-400 rounded-lg flex items-center justify-center px-6 py-4 mb-4 cursor-pointer select-all relative"
              onClick={handleCopy}
            >
              {isCopied ? (
                <FiCheck size={28} className="text-green-500 absolute right-4" />
              ) : (
                <FiCopy size={28} className="text-teal-500 absolute right-4" />
              )}
              <span className="text-3xl font-mono text-teal-700 mx-auto">{coupon.couponCode}</span>
            </div>
            
            {/* زر الذهاب للمتجر */}
            <a
              href={coupon.linkRealStore}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg text-lg text-center transition"
            >
              اذهب إلى المتجر الآن
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default CouponCard;