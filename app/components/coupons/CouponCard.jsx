'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiCopy, FiCheck, FiX } from 'react-icons/fi';

const CouponCard = ({ coupon, onGetCode }) => {
  const [showModal, setShowModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.couponCode);
    setIsCopied(true);
  };

  const getImageSrc = () => {
    if (!coupon.imageUrl) return '/logo.png';
    if (coupon.imageUrl.startsWith('http') || coupon.imageUrl.startsWith('https')) {
      return coupon.imageUrl;
    }
    return `https://api.eslamoffers.com/uploads/${coupon.imageUrl}`;
  };

  const isExpired = !coupon.isActive || new Date(coupon.endDate || coupon.end_date) < new Date();

  // دالة لحساب الوقت المنقضي منذ آخر استخدام
  const getLastUsedTime = () => {
    if (!coupon.lastUseAt) return null;
    
    const lastUseDate = new Date(coupon.lastUseAt);
    const now = new Date();
    
    // التحقق من صحة التاريخ
    if (isNaN(lastUseDate.getTime())) return null;
    
    // إذا كان آخر استخدام في المستقبل (خطأ في الساعة) نعرض "الآن"
    if (lastUseDate > now) return "الآن";
    
    const diffTime = Math.abs(now - lastUseDate);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    // إذا كان الفرق أقل من دقيقة
    if (diffMinutes < 1) {
      return "الآن";
    }
    
    // إذا كان الفرق أقل من ساعة
    if (diffMinutes < 60) {
      return `منذ ${diffMinutes} ${diffMinutes === 1 ? 'دقيقة' : 'دقائق'}`;
    }
    
    // إذا كان الفرق أقل من يوم
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `منذ ${diffHours} ${diffHours === 1 ? 'ساعة' : 'ساعات'}`;
    }
    
    // إذا كان الفرق أكثر من يوم
    const diffDays = Math.floor(diffHours / 24);
    return `منذ ${diffDays} ${diffDays === 1 ? 'يوم' : 'أيام'}`;
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
            <p className="text-sm text-gray-500 line-clamp-2">{coupon.description}</p>
          </div>
        </div>

        {/* عرض آخر استخدام للكود في الكارد الرئيسي */}
        {lastUsedTime && (
<div className="flex items-center justify-center gap-1 mb-1 text-[9px] bg-green-50 text-black rounded py-[2px] px-2">
  <span className="text-green-600">⏱️</span>
  <span>
    آخر استخدام للكود:
    <span className="text-green-600 font-semibold ms-1">{lastUsedTime}</span>
  </span>
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

      {/* مودال الكود - مطابق لمودال CouponSlider */}
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
            <p className="text-center text-gray-500 mb-4">{coupon.description}</p>
            {/* شارة جديدة أو لا تفوت */}
            <div className="flex justify-end gap-2 mb-2">
              <span className="text-xs text-red-500 font-bold flex items-center gap-1">
                <span>جديد</span> <span className="text-orange-400">✨</span>
              </span>
              <span className="text-xs text-orange-500 font-bold flex items-center gap-1">
                <span>لا تفوت</span> <span>🔥</span>
              </span>
            </div>
            {/* عرض آخر استخدام للكود */}
            {lastUsedTime && (
              <div className="bg-blue-50 text-blue-700 rounded-md px-3 py-2 text-center mb-2 font-semibold text-sm flex items-center justify-center gap-2">
                <span className="text-blue-500">⏱️</span>
                <span>آخر استخدام للكود: {lastUsedTime}</span>
              </div>
            )}
            {/* رسالة تم النسخ */}
            {isCopied && (
              <div className="bg-orange-100 text-orange-700 rounded-md px-3 py-2 text-center mb-2 font-semibold text-sm">
                تم نسخ الكود - اذهب الى المتجر
              </div>
            )}
            {/* الكود مع إمكانية النسخ */}
            <div
              className="bg-gray-50 border border-dashed border-teal-400 rounded-lg flex items-center justify-center px-6 py-4 mb-4 cursor-pointer select-all relative"
              onClick={() => {
                navigator.clipboard.writeText(coupon.couponCode);
                setIsCopied(true);
                // تحديث آخر استخدام للكود عند النسخ
                fetch(`https://api.eslamoffers.com/api/Coupons/UpdateLastUse/${coupon.id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }).catch(err => console.error('Error updating last use:', err));
              }}
            >
              {isCopied ? (
                <FiCheck size={28} className="text-green-500 absolute right-4" />
              ) : (
                <FiCopy size={28} className="text-teal-500 absolute right-4" />
              )}
              <span className="text-3xl font-mono text-teal-700 mx-auto">{coupon.couponCode}</span>
            </div>
            {/* زر النسخ أو الذهاب للمتجر */}
            {!isCopied ? (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(coupon.couponCode);
                  setIsCopied(true);
                  // تحديث آخر استخدام للكود عند النسخ
                  fetch(`https://api.eslamoffers.com/api/Coupons/UpdateLastUse/${coupon.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  }).catch(err => console.error('Error updating last use:', err));
                  window.open(coupon.linkRealStore, '_blank', 'noopener,noreferrer');
                }}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg text-lg transition"
              >
                انسخ الكود وتسوق
              </button>
            ) : (
              <a
                href={coupon.linkRealStore}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg text-lg text-center transition"
              >
                اذهب الى المتجر
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CouponCard;
