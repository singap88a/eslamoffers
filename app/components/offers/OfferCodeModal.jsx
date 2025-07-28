"use client";
import { FiCopy, FiCheck, FiX, FiClock } from "react-icons/fi";
import Image from "next/image";

const OfferCodeModal = ({
  show,
  offerCode,
  linkPage,
  isCopied,
  onCopy,
  onClose,
  imageSrc,
  offerTitle,
  offerDescription,
  lastUseAt,
  price,
  discount,
  currencyCodes
}) => {
  const getLastUsedTime = () => {
    if (!lastUseAt) return null;

    const lastUseDate = new Date(lastUseAt);
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
        time: `${diffMinutes} دقيقة${diffMinutes > 1 ? " " : ""}`,
      };
    }

    if (diffHours < 24) {
      return {
        text: "تم الاستخدام منذ",
        time: `${diffHours} ساعة${diffHours > 1 ? "ات" : ""}`,
      };
    }

    return {
      text: "تم الاستخدام منذ",
      time: `${diffDays} يوم${diffDays > 1 ? "ين" : ""}`,
    };
  };

  const lastUsedTime = getLastUsedTime();

  const calculateOriginalPrice = () => {
    if (price && discount) {
      return (price / (1 - discount / 100)).toFixed(2);
    }
    return null;
  };

  if (!show) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-[#00000079] bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full relative animate-fadeIn mx-4"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX size={24} />
        </button>

        {/* شعار العرض */}
        <div className="flex flex-col items-center mb-2">
          <div className="w-24 h-16 relative">
            <Image
              src={imageSrc || "/logo.png"}
              alt={offerTitle}
              fill
              className="object-contain rounded-md"
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-center mb-2 text-gray-800">
          {offerTitle}
        </h2>
        <p className="text-center text-gray-500 mb-4">
          {offerDescription}
        </p>

        {/* معلومات الخصم والسعر */}
        <div className="flex justify-between items-center mb-4">
          {discount && (
            <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-bold">
              خصم {discount}%
            </div>
          )}
          <div className="flex items-center gap-2">
            {price && (
              <>
                <span className="text-lg font-bold text-teal-600">
                  {price} {currencyCodes}
                </span>
                {discount && calculateOriginalPrice() && (
                  <span className="text-sm text-gray-400 line-through">
                    {calculateOriginalPrice()} {currencyCodes}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* عرض آخر استخدام للكود */}
        {lastUsedTime && offerCode && (
          <div className="bg-green-50 border border-green-100 rounded-md px-2 flex items-center justify-center gap-1 text-[11px] font-medium w-fit mx-auto mb-3">
            <FiClock className="text-green-500 text-[13px] -mt-[1px]" />
            <span className="text-gray-700">آخر استخدام للكود:</span>
            <span className="text-green-600 font-bold">
              {lastUsedTime.time}
            </span>
          </div>
        )}

        {/* رسالة تم النسخ */}
        {isCopied && (
          <div className="bg-green-100 text-green-700 rounded-md px-3 py-2 text-center mb-2 font-semibold text-sm">
            تم نسخ الكود بنجاح!
          </div>
        )}

        {/* الكود مع إمكانية النسخ */}
        {offerCode && (
          <div
            className="bg-gray-50 border border-dashed border-teal-400 rounded-lg flex items-center justify-center px-6 py-4 mb-4 cursor-pointer select-all relative"
            onClick={onCopy}
          >
            {isCopied ? (
              <FiCheck
                size={28}
                className="text-green-500 absolute right-4"
              />
            ) : (
              <FiCopy size={28} className="text-teal-500 absolute right-4" />
            )}
            <span className="text-3xl font-mono text-teal-700 mx-auto">
              {offerCode}
            </span>
          </div>
        )}

        {/* زر الذهاب للعرض */}
        <a
          href={linkPage}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg text-lg text-center transition"
        >
          اذهب إلى العرض الآن
        </a>
      </div>
    </div>
  );
};

export default OfferCodeModal;