"use client";

import Image from "next/image";
import Link from "next/link";

const StoreOffersCard = ({ offer }) => {
  const getImageSrc = () => {
    if (!offer.logoUrl) return "/logo4.png";
    if (offer.logoUrl.startsWith("http") || offer.logoUrl.startsWith("https")) {
      return offer.logoUrl;
    }
    return `https://api.eslamoffers.com/uploads/${offer.logoUrl}`;
  };

  const getStoreInternalLink = () => {
    if (!offer.slugStore) return "#";
    return `/stores/${offer.slugStore}`;
  };

  const handleCardClick = (e) => {
    // Prevent navigation if click came from a link that was already handled
    if (e.target.closest('a')) return;
    
    if (offer.linkPage) {
      window.open(offer.linkPage, '_blank');
    }
  };

  return (
    <div className="relative bg-white border-2 border-gray-300 border-dashed hover:border-teal-400 rounded-2xl transform hover:-translate-y-2 duration-300 ease-in-out transition-all p-3 md:h-[250px] h-[230px] flex flex-col justify-between">
      {/* Image still links to internal store page */}
      <Link
        href={getStoreInternalLink()}
        className="w-[110px] h-[75px] relative flex justify-center items-center mx-auto"
      >
        <Image
          src={getImageSrc()}
          alt={offer.altText || offer.title}
          layout="fill"
          objectFit="contain"
          className="rounded-md"
        />
      </Link>

      {/* Clickable area below image */}
      <div 
        className="flex-1 cursor-pointer" 
        onClick={handleCardClick}
      >
        <h3 className="text-[16px] font-semibold text-gray-900 mb-1 line-clamp-2 text-center">
          {typeof offer.title === 'string' ? offer.title : String(offer.title || '')}
        </h3>
        <p className="text-center text-gray-500 text-[13px] line-clamp-2 overflow-hidden">
          {typeof offer.description === 'string' ? offer.description : String(offer.description || '')}
        </p>
      </div>

      {/* "احصل" button */}
      <div className="flex items-center justify-center">
        <Link
          href={offer.linkPage || "#"}
          target="_blank"
          className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold px-4 py-1 rounded-lg hover:from-teal-600 hover:to-teal-700 transition text-sm text-center"
        >
          احصل
        </Link>
      </div>
    </div>
  );
};

export default StoreOffersCard;