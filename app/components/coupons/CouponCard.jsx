"use client";

import { useState } from "react";
import Image from "next/image";
import { FiCopy, FiCheck, FiX, FiClock } from "react-icons/fi";
import Link from "next/link";

const CouponCard = ({
  coupon,
  onGetCode,
  showLastUsed = true,
  showBadges = true,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.couponCode);
    setIsCopied(true);
    fetch(`https://api.eslamoffers.com/api/Coupons/NumberUsed/${coupon.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxOTcwZGYxMi00ZDZiLTQ0OTYtOGZmNi1jZmVmMDJlMjhlM2MiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjQ5YmFjNWVmLWY4MjktNGRjMy1hZWIyLTFjNmQ1ZTgxYWE3YSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJyZWRhc2FhZDAxMDI2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6ImFkbWluIiwiZXhwIjoxNzUzNTY5NjQyLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MjYyLyIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjcyNjIvIn0.uNVL0lKRVGO30MifLDc4PQTeA4RzRYWRrnQo_G_elhQ",
      },
    }).catch((err) => console.error("Error updating last use:", err));
  };

  const getImageSrc = () => {
    if (!coupon.imageUrl) return "/logo.png";
    if (
      coupon.imageUrl.startsWith("http") ||
      coupon.imageUrl.startsWith("https")
    ) {
      return coupon.imageUrl;
    }
    return `https://api.eslamoffers.com/uploads/${coupon.imageUrl}`;
  };

  const isExpired =
    !coupon.isActive ||
    new Date(coupon.endDate || coupon.end_date || coupon.stratDate) <
      new Date();

  const getLastUsedTime = () => {
    if (!coupon.lastUseAt || coupon.lastUseAt === coupon.createdAt) return null;

    const lastUseDate = new Date(coupon.lastUseAt);
    const now = new Date();

    if (isNaN(lastUseDate.getTime())) return null;
    if (lastUseDate > now) return { text: "الآن", time: "" };

    // إذا كان lastUpdatedAt موجودًا، نستخدمه بدلاً من الحساب
    if (coupon.lastUpdatedAt && coupon.lastUpdatedAt !== "0:0:0") {
      return {
        text: "آخر نسخ للكود",
        time: coupon.lastUpdatedAt,
      };
    }

    const diffTime = Math.abs(now - lastUseDate);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return { text: "تم النسخ", time: "الآن" };
    }

    if (diffMinutes < 60) {
      return {
        text: "تم النسخ منذ",
        time: `${diffMinutes} دقيقة${diffMinutes > 1 ? " " : ""}`,
      };
    }

    if (diffHours < 24) {
      return {
        text: "تم النسخ منذ",
        time: `${diffHours} ساعات${diffHours > 1 ? "  " : ""}`,
      };
    }

    return {
      text: "تم النسخ منذ",
      time: `${diffDays} يوم${diffDays > 1 ? "ين" : ""}`,
    };
  };

  // إنشاء رابط المتجر الداخلي
  const getStoreInternalLink = () => {
    if (!coupon.slugStore) return "#";
    return `/stores/${coupon.slugStore}`;
  };

  const lastUsedTime = getLastUsedTime();

  const handleOpenModal = () => {
    if (onGetCode) {
      onGetCode(coupon);
    } else {
      setShowModal(true);
      setIsCopied(false);
    }
  };

  return (
    <>
      <div className="relative bg-white border-2 border-gray-300 border-dashed hover:border-teal-400 rounded-2xl transform hover:-translate-y-2 duration-300 ease-in-out transition-all  p-3 md:h-[250px] h-[230px] flex flex-col justify-between">
        {/* الجزء العلوي (من تحت الصورة حتى قبل الزر) - قابل للنقر */}
        <div 
          className="flex-1 flex flex-col cursor-pointer" 
          onClick={handleOpenModal}
        >
          <div className="mx-auto text-center mb-2">
            <Link
              href={getStoreInternalLink()}
              className="md:w-[200px] w-[110px] h-[75px] relative flex justify-center items-center mx-auto"
              onClick={(e) => e.stopPropagation()} // لمنع فتح المودال عند الضغط على الصورة
            >
              <Image
                src={getImageSrc()}
                alt={coupon.altText || coupon.title}
                layout="fill"
                objectFit="contain"
                className="rounded-md"
              />
            </Link>
            <div className="flex-1">
              <h3 className="md:text-[16px] font-semibold text-gray-900 mb-1 line-clamp-2 text-[12px]">
                {typeof coupon.title === 'string' ? coupon.title : String(coupon.title || '')}
              </h3>
              <p className="text-center text-gray-500 text-[11px] md:text-[13px] line-clamp-2 overflow-hidden">
                {typeof (coupon.descriptionCoupon || coupon.description) === 'string' ? (coupon.descriptionCoupon || coupon.description) : String(coupon.descriptionCoupon || coupon.description || '')}
              </p>
            </div>
          </div>

          {/* عرض آخر نسخ للكود - يظهر فقط إذا كان showLastUsed = true */}
          {showLastUsed && lastUsedTime && (
            <div className="bg-green-50 border border-green-100 rounded-md px-2 flex items-center justify-center gap-1 text-[11px]  mb-1  font-medium w-fit mx-auto">
              <FiClock className="text-green-500 text-[13px] -mt-[1px]" />
              <span className="text-gray-700">{lastUsedTime.text}:</span>
              <span className="text-green-600 font-bold">
                {lastUsedTime.time}
              </span>
            </div>
          )}
          {showLastUsed && !lastUsedTime && coupon.number === 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-md px-2 flex items-center justify-center gap-1 text-[11px] font-medium w-fit mx-auto">
              <FiClock className="text-blue-500 text-[13px] -mt-[1px]" />
              <span className="text-gray-700">لم يتم نسخ الكود بعد</span>
            </div>
          )}
        </div>

        {/* الزر (غير قابل للنقر على المنطقة المحيطة) */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleOpenModal}
            className="w-full bg-gradient-to-r  cursor-pointer from-teal-500 to-teal-600 text-white font-semibold px-4 py-1 rounded-lg hover:from-teal-600 hover:to-teal-700 transition md:text-sm text-[11px]"
          >
            انسخ الكود
          </button>
        </div>
      </div>

      {/* مودال الكود */}
      {showModal && (
        <div
          onClick={() => {
            setShowModal(false);
            setIsCopied(false);
          }}
          className="fixed inset-0 bg-[#00000079] bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full relative animate-fadeIn mx-4"
          >
            <button
              onClick={() => {
                setShowModal(false);
                setIsCopied(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FiX size={24} />
            </button>

            {/* شعار المتجر */}
            <div className="flex flex-col items-center mb-2">
              <Image
                src={getImageSrc()}
                alt={coupon.altText || coupon.title}
                width={80}
                height={40}
                className="mb-2"
              />
            </div>

            <h2 className="text-xl font-bold text-center mb-2 text-gray-800">
              {typeof coupon.title === 'string' ? coupon.title : String(coupon.title || '')}
            </h2>
            <p className="text-center text-gray-500 mb-4">
              {typeof (coupon.descriptionCoupon || coupon.description) === 'string' ? (coupon.descriptionCoupon || coupon.description) : String(coupon.descriptionCoupon || coupon.description || '')}
            </p>

            {/* معلومات الخصم */}
            <div className="flex justify-between items-center mb-4">
              <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-bold">
                خصم {coupon.discount}%
              </div>
              <div className="text-sm text-gray-500">
                صالح حتى:{" "}
                {new Date(
                  coupon.endDate || coupon.stratDate
                ).toLocaleDateString("ar-EG")}
              </div>
            </div>

            {/* عرض عدد مرات النسخ */}
            {coupon.number > 0 && (
              <div className="bg-purple-50 text-purple-700 rounded-md px-3 py-2 text-center mb-2 font-semibold text-sm">
                تم نسخ هذا الكود {coupon.number} مرة
              </div>
            )}
            {coupon.number === 0 && (
              <div className="bg-blue-50 text-blue-700 rounded-md px-3 py-2 text-center mb-2 font-semibold text-sm">
                لم يتم نسخ هذا الكود بعد
              </div>
            )}

            {/* عرض وقت آخر استخدام */}
            {lastUsedTime && coupon.number > 0 && (
              <div className="bg-green-50 text-green-700 rounded-md px-3 py-2 text-center mb-2 font-semibold text-sm flex items-center justify-center gap-1">
                <FiClock className="text-green-500" />
                <span>
                  {lastUsedTime.text}: {lastUsedTime.time}
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
            <div
              className="bg-gray-50 border border-dashed border-teal-400 rounded-lg flex items-center justify-center px-6 py-4 mb-4 cursor-pointer select-all relative"
              onClick={handleCopy}
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
                {coupon.couponCode}
              </span>
            </div>

            {/* زر النسخ أو الذهاب للمتجر */}
            {!isCopied ? (
              <button
                onClick={() => {
                  handleCopy();
                  window.open(
                    coupon.linkRealStore,
                    "_blank",
                    "noopener,noreferrer"
                  );
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

            {isCopied && (
              <div className="bg-orange-100 text-orange-700 rounded-md px-3 py-2 text-center mt-4 font-semibold text-sm">
                تم نسخ الكود - اذهب الى المتجر
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CouponCard;