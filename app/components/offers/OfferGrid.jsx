 'use client';

import { useState } from 'react';
import OfferCard from './OfferCard';

const OfferGrid = ({ offers }) => {
  const [visibleCount, setVisibleCount] = useState(12);

  const showMoreOffers = () => {
    setVisibleCount(prevCount => prevCount + 12);
  };

  const visibleOffers = offers.slice(0, visibleCount);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {visibleOffers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
      {visibleCount < offers.length && (
        <div className="text-center mt-8">
          <button
            onClick={showMoreOffers}
            className="bg-teal-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-600 transition-colors"
          >
            عرض المزيد
          </button>
        </div>
      )}
    </>
  );
};

export default OfferGrid; 