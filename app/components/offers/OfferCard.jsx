"use client";

import { useState } from "react";
import Image from "next/image";
import { FiCopy, FiCheck, FiX, FiClock } from "react-icons/fi";
import { toast } from "react-toastify";

const OfferCard = ({ offer, onGetCode }) => {
  const [showModal, setShowModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCardClick = () => {
    if (offer.couponId) {
      if (onGetCode) {
        onGetCode(offer);
      } else {
        setShowModal(true);
        setIsCopied(false);
      }
    } else if (offer.linkPage) {
      window.open(offer.linkPage, "_blank");
    }
  };

  const handleCopy = () => {
    if (offer.couponId) {
      navigator.clipboard.writeText(offer.couponId);
      setIsCopied(true);
      toast.success("تم نسخ الكود بنجاح!");
      
      // تحديث عدد مرات الاستخدام إذا كان هناك API
      if (offer.id) {
        fetch(`https://api.eslamoffers.com/api/Offers/NumberUsed/${offer.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_TOKEN_HERE"
          }
        }).catch(err => console.error("Error updating last use:", err));
      }
    }
  };

  const getImageSrc = (url) => {
    if (!url) return "/default-store.png";
    if (url.startsWith("http")) return url;
    return `https://api.eslamoffers.com/uploads/${url}`;
  };

  const isExpired = offer.endDate && new Date(offer.endDate) < new Date();

  const calculateOriginalPrice = () => {
    if (offer.price && offer.discount) {
      return (offer.price / (1 - offer.discount / 100)).toFixed(2);
    }
    return null;
  };

  const originalPrice = calculateOriginalPrice();

  return (
    <>
      <div 
        className="relative bg-white rounded-lg border-2 border-dashed border-gray-200 p-4 shadow hover:shadow-md hover:border-teal-300 transition-all duration-300 w-full max-w-md h-[180px] mx-auto text-right group cursor-pointer"
        onClick={handleCardClick}
      >
        {offer.discount && (
          <div className="absolute z-40 top-0 right-0 bg-gradient-to-l from-orange-400 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-md rounded-tr-lg">
            {offer.discount}% خصم
          </div>
        )}

        <div className="flex justify-between items-start mb-3 w-full gap-4">
          {/* صورة المنتج */}
          <div className="w-24 h-20 relative border border-gray-200 rounded-md overflow-hidden">
            <Image
              src={getImageSrc(offer.logoUrl)}
              alt={offer.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="w-full">
            {/* عنوان العرض */}
            <h2 className="text-sm font-bold text-gray-800 leading-5 mb-1">
              {offer.title}
            </h2>

            {/* السعر والخصم */}
            <div className="flex items-center gap-2 mt-1">
              {originalPrice && (
                <div className="text-xs text-gray-400 line-through">
                  {originalPrice} {offer.currencyCodes || "USD"}
                </div>
              )}
              {offer.price && (
                <div className="text-sm font-bold text-teal-600">
                  {offer.price} {offer.currencyCodes || "USD"}
                </div>
              )}
            </div>

            {/* صورة المتجر وزر الكوبون */}
            <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-2">
              <div className="w-20 h-12 relative rounded-md overflow-hidden border border-gray-200">
                <Image
                  src={getImageSrc(offer.imageStoreUrl)}
                  alt="store"
                  fill
                  className="object-contain"
                />
              </div>
              
              {offer.couponId && (
                <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white text-sm font-bold px-4 py-1 rounded-md">
                  كوبون
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* مودال الكوبون */}
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
              <div className="w-24 h-16 relative">
                <Image
                  src={getImageSrc(offer.logoUrl)}
                  alt={offer.title}
                  fill
                  className="object-contain rounded-md"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-center mb-2 text-gray-800">
              {offer.title}
            </h2>

            {/* معلومات الخصم والسعر */}
            <div className="flex justify-between items-center mb-4">
              {offer.discount && (
                <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-bold">
                  خصم {offer.discount}%
                </div>
              )}
              <div className="flex items-center gap-2">
                {originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {originalPrice} {offer.currencyCodes || "USD"}
                  </span>
                )}
                <span className="text-sm font-bold text-teal-600">
                  {offer.price} {offer.currencyCodes || "USD"}
                </span>
              </div>
            </div>

            {isCopied && (
              <div className="bg-green-100 text-green-700 rounded-md px-3 py-2 text-center mb-2 font-semibold text-sm">
                تم نسخ الكود بنجاح!
              </div>
            )}

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
                {offer.couponId}
              </span>
            </div>

            <a
              href={offer.linkPage}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg text-lg text-center transition"
            >
              اذهب إلى العرض الآن
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default OfferCard;