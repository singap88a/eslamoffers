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
    return `http://147.93.126.19:8080/uploads/${coupon.imageUrl}`;
  };

  const isExpired = !coupon.isActive || new Date(coupon.endDate || coupon.end_date) < new Date();

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
