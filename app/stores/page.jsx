"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import SubscribeBox from "../components/home/Coupon/SubscribeBox";
 import PromoCard from "../components/home/Coupon/PromoCard";
import Link from "next/link";
import CountdownOfferBox from "../components/home/Coupon/CountdownOfferBox";

const StoreCardSkeleton = () => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden border-2 border-dashed border-gray-200 animate-pulse">
    <div className="relative h-40 bg-gray-200 p-4"></div>
    <div className="p-4 text-center border-t border-gray-100">
      <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
      <div className="flex justify-center items-center gap-2">
        <div className="h-8 bg-gray-300 rounded-full w-20"></div>
        <div className="h-8 bg-gray-300 rounded-full w-20"></div>
      </div>
    </div>
  </div>
);

const StoreCard = ({ store }) => {
  const getLogoSrc = () => {
    if (!store.logoUrl) return '/logo.png';
    if (store.logoUrl.startsWith('http') || store.logoUrl.startsWith('https')) {
      return store.logoUrl;
    }
    return `https://api.eslamoffers.com/uploads/${store.logoUrl}`;
  };
  return (
    <div className="bg-white border-2 border-gray-300 border-dashed hover:border-teal-400 rounded-xl overflow-hidden shadow-sm h-full flex flex-col relative transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
      <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
        {/* شارة الأفضل على الجنب */}
        {store.isBast && (
          <div className="absolute top-4 right-6 flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full border border-yellow-200 text-xs font-bold shadow-sm z-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-3 h-3 text-yellow-500">
              <path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 14.77l-4.77 2.51.91-5.33-3.87-3.77 5.34-.78L10 2z" />
            </svg>
            الأفضل
          </div>
        )}
        {/* صورة المتجر تغطي كامل الهيدر */}
        <img
          src={getLogoSrc()}
          alt={`${store.name} logo`}
          className="w-full h-full object-cover"
        />
      </div>
      {/* اسم المتجر */}
      <div className="p-4 text-center border-t border-gray-100 flex-grow flex flex-col justify-center">
        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
          {store.name}
        </h3>
      </div>
    </div>
  );
};

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(
          "https://api.eslamoffers.com/api/Store/GetAllStores"
        );
        setStores(response.data);
      } catch (err) {
        setError("فشل تحميل المتاجر. يرجى المحاولة مرة أخرى لاحقًا.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // عرض فقط العدد المطلوب
  const visibleStores = filteredStores.slice(0, visibleCount);
  const hasMore = filteredStores.length > visibleCount;

  return (
    <div className="  min-h-screen" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="ابحث عن متجر..."
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-[#14b8a6] transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="text-right mb-12">
              <h1 className="text-3xl  font-bold text-gray-900 mb-4">
                متاجرنا
              </h1>
              <div className="w-40 h-1 bg-gradient-to-l from-[#14b8a6] mb-5 rounded-full"></div>
            </div>

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <StoreCardSkeleton key={i} />
                ))}
              </div>
            )}
            {error && (
              <p className="text-center text-red-500 text-lg">{error}</p>
            )}

            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-3 gap-4">
                  {visibleStores.length > 0 ? (
                    visibleStores.map((store) => (
                      <Link href={`/stores/${store.id}`} key={store.id}>
                        <StoreCard store={store} />
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-xl text-gray-600">
                        لم يتم العثور على متاجر تطابق بحثك.
                      </p>
                    </div>
                  )}
                </div>
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      className="px-8 py-3 rounded-full bg-[#14b8a6] text-white font-bold shadow hover:bg-[#0d9488] transition"
                      onClick={() => setVisibleCount((prev) => prev + 9)}
                    >
                      عرض المزيد
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <SubscribeBox />
              <div className="pt-16">
                <CountdownOfferBox />
              </div>
              <PromoCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoresPage;
