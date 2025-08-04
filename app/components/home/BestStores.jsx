'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const isValidHttpUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

const BestStores = () => {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // ✅ حالة اللودنج

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('https://api.eslamoffers.com/api/Store/GetBastStores/Bast');
        const data = await response.json();
        setStores(data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      } finally {
        setIsLoading(false); // ✅ إيقاف اللودنج بعد التحميل أو الخطأ
      }
    };

    fetchStores();
  }, []);

  const getSafeLogoUrl = (logoUrl) => {
    const baseUrl = 'https://api.eslamoffers.com/uploads/';
    if (!logoUrl) return '/logo4.png';
    if (isValidHttpUrl(logoUrl)) return logoUrl;
    const fullUrl = logoUrl.startsWith('/') ? `${baseUrl}${logoUrl}` : `${baseUrl}/${logoUrl}`;
    return isValidHttpUrl(fullUrl) ? fullUrl : '/logo4.png';
  };

  return (
    <div className="md:px-4">
      <div className="bg-white p-4 rounded-2xl shadow-lg w-full max-w-md lg:max-w-full mx-auto border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-right text-[#14b8a6]">أفضل المتاجر</h2>
          <Link href="/stores" className="text-sm text-gray-500 hover:text-[#14b8a6] transition">كل المتاجر</Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-t-transparent border-[#14b8a6] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {stores.slice(0, 9).map((store) => (
                             <Link href={`/stores/${store.slug}`} key={store.id}

                className="bg-gray-50 rounded-md flex items-center justify-center border border-gray-200 hover:shadow-md transition duration-200 ease-in-out hover:border-[#14b8a6] w-24 h-[3.7rem] overflow-hidden"
              >
                <div className="w-full h-full relative">
                  <Image 
                    src={getSafeLogoUrl(store.logoUrl)} 
                    alt={store.name} 
                    fill
                    className=" "
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BestStores;
