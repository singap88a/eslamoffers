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

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('http://147.93.126.19:8080/api/Store/GetBastStores/Bast');
        const data = await response.json();
        setStores(data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, []);

  const getSafeLogoUrl = (logoUrl) => {
    const baseUrl = 'http://147.93.126.19:8080/uploads/';
    
    if (!logoUrl) {
      return '/logo.png'; // Fallback for null, undefined, or empty string
    }

    if (isValidHttpUrl(logoUrl)) {
      return logoUrl;
    }

    const fullUrl = logoUrl.startsWith('/') ? `${baseUrl}${logoUrl}` : `${baseUrl}/${logoUrl}`;

    if (isValidHttpUrl(fullUrl)) {
      return fullUrl;
    }

    return '/logo.png';
  };

  return (
    <div className=" md:px-4">
      <div className="bg-white  p-4 rounded-2xl shadow-lg w-full max-w-md lg:max-w-full mx-auto border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-right text-[#14b8a6]">أفضل المتاجر</h2>
          <Link href="/stores" className="text-sm text-gray-500 hover:text-[#14b8a6] transition">كل المتاجر</Link>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stores.slice(0, 9).map((store) => (
            <Link
              key={store.id}
              href={`/stores/${store.id}`}
              className="bg-gray-50 p-3 rounded-xl flex items-center justify-center border border-gray-200 hover:shadow-md transition duration-200 ease-in-out hover:border-[#14b8a6]"
            >
              <Image src={getSafeLogoUrl(store.logoUrl)} alt={store.name} width={60} height={30} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestStores;
