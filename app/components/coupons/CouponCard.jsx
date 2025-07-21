'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiCopy, FiCheck, FiX } from 'react-icons/fi';

const CouponCard = ({ coupon }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.couponCode);
    setIsCopied(true);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsCopied(false);
  };

  const maskedCode = `${coupon.couponCode.substring(0, 2)}••••••••${coupon.couponCode.substring(
    coupon.couponCode.length - 2
  )}`;
  const isValidUrl = coupon.imageUrl && (coupon.imageUrl.startsWith('http') || coupon.imageUrl.startsWith('https'));

  const getImageSrc = () => {
    if (!coupon.imageUrl) return '/logo.png';
    if (coupon.imageUrl.startsWith('http') || coupon.imageUrl.startsWith('https')) {
      return coupon.imageUrl;
    }
    return `http://147.93.126.19:8080/uploads/${coupon.imageUrl}`;
  };

  return (
    <>
      <div className="bg-white border-2 border-gray-300 border-dashed hover:border-teal-400 rounded-2xl transform   hover:-translate-y-2 duration-300 ease-in-out  transition-all p-6 w-full max-w-sm flex flex-col justify-between">
        <div className=" mx-auto text-center mb-6">
          <a
            href={coupon.linkRealStore}
            target="_blank"
            rel="noopener noreferrer"
            className="w-24 h-16 relative      flex justify-center items-center"
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
            onClick={openModal}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold px-4 py-2 rounded-lg hover:from-teal-600 hover:to-teal-700 transition"
          >
            الحصول على الكود
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-[#00000079] bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full relative animate-fadeIn"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FiX size={24} />
            </button>
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">انسخ الكود الخاص بك</h2>
            <p className="text-center text-gray-500 mb-6">انقر على الزر لنسخ الكود واستخدامه عند الدفع.</p>
            <div className="bg-gray-50 border border-dashed border-teal-400 rounded-lg flex items-center justify-between px-6 py-4">
              <span className="text-2xl font-mono text-teal-600 break-all">{coupon.couponCode}</span>
              {!isCopied ? (
                <button
                  onClick={handleCopy}
                  className="ml-4 px-4 py-2 rounded-md text-white font-semibold transition bg-teal-500 hover:bg-teal-600 flex items-center"
                >
                  <FiCopy size={20} className="mr-2" /> نسخ
                </button>
              ) : (
                <a
                  href={coupon.linkRealStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 px-4 py-2 rounded-md text-white font-semibold transition bg-green-500 hover:bg-green-600"
                >
                  زيارة المتجر
                </a>
              )}
            </div>
            {isCopied && <p className="text-green-500 text-center mt-4 font-medium">تم النسخ بنجاح! يمكنك الآن زيارة المتجر.</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default CouponCard;
