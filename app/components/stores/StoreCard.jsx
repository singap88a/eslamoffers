'use client';

import Image from 'next/image';
import Link from 'next/link';

const StoreCard = ({ store }) => {
  const getImageSrc = () => {
    if (!store.logoUrl) return '/logo4.png';
    if (store.logoUrl.startsWith('http') || store.logoUrl.startsWith('https')) {
      return store.logoUrl;
    }
    return `https://api.eslamoffers.com/uploads/${store.logoUrl}`;
  };

  return (
    <div className="relative bg-white border-2 border-gray-300 border-dashed hover:border-teal-400 rounded-2xl transform hover:-translate-y-2 duration-300 ease-in-out transition-all p-6 w-full max-w-sm flex flex-col justify-between">
      <div className="mx-auto text-center mb-6">
        <Link href={`/stores/${store.id}`}>
          <div className="w-[200] h-[80] relative flex justify-center items-center cursor-pointer">
            <Image
              src={getImageSrc()}
              alt={store.altText || store.name}
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
          </div>
        </Link>
        <div className="flex-1 mt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{store.name}</h3>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-4">
        <Link href={`/stores/${store.id}`} className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold px-4 py-2 rounded-lg hover:from-teal-600 hover:to-teal-700 transition text-center">
            عرض أكواد المتجر
        </Link>
      </div>
    </div>
  );
};

export default StoreCard; 