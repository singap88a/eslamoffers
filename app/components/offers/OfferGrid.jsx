'use client';

import { useState } from 'react';
import OfferCard from './OfferCard';

const OfferGrid = ({ offers }) => {
  const [visibleCount, setVisibleCount] = useState(12);

  const showMoreOffers = () => {
    setVisibleCount(prev => prev + 12);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6">
        {offers.slice(0, visibleCount).map(offer => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>

      {visibleCount < offers.length && (
        <div className="text-center mt-6">
          <button
            onClick={showMoreOffers}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition font-medium"
          >
            عرض المزيد من العروض
          </button>
        </div>
      )}
    </div>
  );
};

export default OfferGrid;