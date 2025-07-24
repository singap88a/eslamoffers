import React from "react";
import { FiCopy, FiCheck, FiX } from "react-icons/fi";
import Image from "next/image";

const CouponCodeModal = ({
  couponCode,
  linkRealStore,
  isCopied,
  onCopy,
  onClose,
  show,
  onCopyAndGo,
  imageSrc,           // جديد: صورة المتجر
  couponTitle,        // جديد: اسم الكوبون
  couponDescription,  // جديد: وصف الكوبون (اختياري)
}) => {
  if (!show) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-[#00000079] bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full relative animate-fadeIn"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX size={24} />
        </button>
        {/* شعار المتجر */}
        {imageSrc && (
          <div className="flex flex-col items-center mb-2">
            <Image
              src={imageSrc}
              alt={couponTitle || "شعار المتجر"}
              width={80}
              height={40}
              className="mb-2"
            />
          </div>
        )}
        {/* اسم الكوبون */}
        {couponTitle && (
          <h2 className="text-xl font-bold text-center mb-2 text-gray-800">{couponTitle}</h2>
        )}
        {/* وصف الكوبون */}
        {couponDescription && (
          <p className="text-center text-gray-500 mb-4">{couponDescription}</p>
        )}

        <p className="text-center text-gray-500 mb-6">انقر على الكود لنسخه أو استخدم الزر بالأسفل.</p>
        
        {/* الكود مع إمكانية النسخ */}
        <div
          className="bg-gray-50 border border-dashed border-teal-400 rounded-lg flex items-center justify-center px-6 py-4 mb-4 cursor-pointer select-all relative"
          onClick={onCopy}
        >
          {isCopied ? (
            <FiCheck size={28} className="text-green-500 absolute right-4" />
          ) : (
            <FiCopy size={28} className="text-teal-500 absolute right-4" />
          )}
          <span className="text-3xl font-mono text-teal-700 mx-auto">{couponCode}</span>
        </div>

        {/* زر النسخ أو الذهاب للمتجر */}
        {!isCopied ? (
          <button
            onClick={onCopyAndGo ? onCopyAndGo : () => {
              onCopy();
              window.open(linkRealStore, '_blank', 'noopener,noreferrer');
            }}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg text-lg transition"
          >
            انسخ الكود وتسوق
          </button>
        ) : (
          <a
            href={linkRealStore}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg text-lg text-center transition"
          >
            اذهب الى المتجر
          </a>
        )}

        {isCopied && (
          <div className="bg-orange-100 text-orange-700 rounded-md px-3 py-2 text-center mt-4 font-semibold text-sm">
            تم نسخ الكود - اذهب الى المتجر
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponCodeModal;