import React from "react";
import { FiCopy, FiX } from "react-icons/fi";

const CouponCodeModal = ({ couponCode, linkRealStore, isCopied, onCopy, onClose, show }) => {
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
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">انسخ الكود الخاص بك</h2>
        <p className="text-center text-gray-500 mb-6">انقر على الزر لنسخ الكود واستخدامه عند الدفع.</p>
        <div className="bg-gray-50 border border-dashed border-teal-400 rounded-lg flex items-center justify-between px-6 py-4">
          <span className="text-2xl font-mono text-teal-600 break-all">{couponCode}</span>
          {!isCopied ? (
            <button
              onClick={onCopy}
              className="ml-4 px-4 py-2 rounded-md text-white font-semibold transition bg-teal-500 hover:bg-teal-600 flex items-center"
            >
              <FiCopy size={20} className="mr-2" /> نسخ
            </button>
          ) : (
            <a
              href={linkRealStore}
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
  );
};

export default CouponCodeModal; 