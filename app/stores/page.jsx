"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import SubscribeBox from "../components/home/Coupon/SubscribeBox";
 import PromoCard from "../components/home/Coupon/PromoCard";
import Link from "next/link";
import CountdownOfferBox from "../components/home/Coupon/CountdownOfferBox";

const StoreCardSkeleton = () => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden border-2 border-dashed border-gray-200 animate-pulse">
    <div className="relative h-48 bg-gray-200"></div>
    <div className="p-4 text-center border-t border-gray-100">
      <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
    </div>
  </div>
);

const StoreCard = ({ store }) => {
  const getLogoSrc = () => {
    if (!store.logoUrl) return '/logo4.png';
    if (store.logoUrl.startsWith('http') || store.logoUrl.startsWith('https')) {
      return store.logoUrl;
    }
    return `https://api.eslamoffers.com/uploads/${store.logoUrl}`;
  };
  return (
    <div className="bg-white border-2 border-gray-300 border-dashed hover:border-teal-400 rounded-xl overflow-hidden shadow-sm h-full flex flex-col relative transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl group">
      <div className="relative w-full h-[120px] bg-gray-100 flex items-center justify-center overflow-hidden">
  
        
        {/* صورة المتجر تغطي كامل الهيدر */}
        <img
          src={getLogoSrc()}
          alt={`${store.name} logo`}
          className="w-full h-full    group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* طبقة التدرج عند التحويم */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* اسم المتجر */}
      <div className="p-4 text-center border-t border-gray-100 flex-grow flex flex-col justify-center">
        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate group-hover:text-teal-600 transition-colors">
          {store.name}
        </h3>
        {store.headerDescription && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {store.headerDescription}
          </p>
        )}
      </div>
    </div>
  );
};

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(15);

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
 

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="text-right mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                متاجرنا
              </h1>
              <div className="w-40 h-1 bg-gradient-to-l from-[#14b8a6] mb-5 rounded-full"></div>
              
 
            </div>

            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <StoreCardSkeleton key={i} />
                ))}
              </div>
            )}
            {error && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">حدث خطأ</h3>
                  <p className="text-gray-500 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {visibleStores.length > 0 ? (
                    visibleStores.map((store) => (
                      <Link href={`/stores/${store.slug}`} key={store.id}>
                        <StoreCard store={store} />
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="max-w-md mx-auto">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">لم يتم العثور على متاجر</h3>
                        <p className="text-gray-500 mb-4">
                          لا توجد متاجر تطابق بحثك "{searchTerm}". جرب كلمات بحث مختلفة.
                        </p>
                        <button
                          onClick={() => setSearchTerm("")}
                          className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
                        >
                          مسح البحث
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      className="px-8 py-3 rounded-full bg-[#14b8a6] text-white font-bold shadow hover:bg-[#0d9488] transition flex items-center gap-2"
                      onClick={() => setVisibleCount((prev) => prev + 9)}
                    >
                      <span>عرض المزيد</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
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
