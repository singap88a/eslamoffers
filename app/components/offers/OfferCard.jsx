'use client';

import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

const OfferCard = ({ offer }) => {

  const getImageSrc = () => {
    if (!offer.logoUrl) return '/logo.png'; // default image
    if (offer.logoUrl.startsWith('http')) {
      return offer.logoUrl;
    }
    return `https://api.eslamoffers.com/uploads/${offer.logoUrl}`;
  };

  return (
    <div className="relative bg-white border-2 border-gray-300 border-dashed hover:border-teal-400 rounded-2xl transform hover:-translate-y-2 duration-300 ease-in-out transition-all p-6 w-full max-w-sm flex flex-col justify-between">
      {/* Best deal badge */}
      {offer.isBast && (
        <span
          className="absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-600 flex items-center gap-1"
        >
          <FaStar />
          <span>الأفضل</span>
        </span>
      )}
      <div className="mx-auto text-center mb-6">
        <a
          href={offer.linkPage}
          target="_blank"
          rel="noopener noreferrer"
          className="w-24 h-16 relative flex justify-center items-center"
        >
          <Image
            src={getImageSrc()}
            alt={offer.title}
            layout="fill"
            objectFit="contain"
            className="rounded-md"
          />
        </a>
        <div className="flex-1 mt-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{offer.title}</h3>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-4">
        <a
          href={offer.linkPage}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold px-4 py-2 rounded-lg hover:from-teal-600 hover:to-teal-700 transition"
        >
          احصل علي العرض
        </a>
      </div>
    </div>
  );
};

export default OfferCard; 