"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import SubscribeBox from "../components/home/Coupon/SubscribeBox";
import PromoCard from "../components/home/Coupon/PromoCard";
import Link from "next/link";
import CountdownOfferBox from "../components/home/Coupon/CountdownOfferBox";
import Image from "next/image"; // ✅ استبدال img بـ Image من next/image

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";

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
    if (!store.logoUrl) return "/logo4.png";
    if (store.logoUrl.startsWith("http")) return store.logoUrl;
    return `https://api.eslamoffers.com/uploads/${store.logoUrl}`;
  };

  return (
    <div className="bg-white border-2 border-gray-300 border-dashed hover:border-teal-400 rounded-xl overflow-hidden shadow-sm h-full flex flex-col relative transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl group">
      <div className="relative w-full aspect-[4/2] flex items-center justify-center overflow-hidden">
        <Image
          src={getLogoSrc()}
          alt={store.altText || `${store.name} logo`}
          fill
          sizes="(max-width: 768px) 100vw, 
                 (max-width: 1200px) 50vw, 
                 20vw"
          className="object-contain group-hover:scale-110 transition-transform duration-300"
          placeholder="blur"
          blurDataURL="/placeholder.png" // صورة صغيرة خفيفة بتظهر الأول
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-1 text-center border-t border-gray-100 flex-grow flex flex-col justify-center">
        <h3 className="text-sm md:text-base text-gray-800 mb-2 truncate group-hover:text-teal-600 transition-colors">
          {store.name}
        </h3>
      </div>
    </div>
  );
};

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(90);

  useEffect(() => {
    const fetchStoresAndCategories = async () => {
      try {
        setLoading(true);

        const [storesRes, categoriesRes] = await Promise.all([
          axios.get("https://api.eslamoffers.com/api/Store/GetAllStores"),
          axios.get("https://api.eslamoffers.com/api/Category/GetAllCategories"),
        ]);

        const sortedStores = storesRes.data.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(a.createdAt) - new Date(b.createdAt);
          }
          return a.id - b.id;
        });

        setStores(sortedStores);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error(err);
        setError("فشل تحميل البيانات. يرجى المحاولة مرة أخرى لاحقًا.");
      } finally {
        setLoading(false);
      }
    };

    fetchStoresAndCategories();
  }, []);

  const filteredStores =
    selectedCategory === "all"
      ? stores
      : stores.filter((store) =>
          store.categorys?.some((catSlug) => catSlug === selectedCategory)
        );

  const visibleStores = filteredStores.slice(0, visibleCount);
  const hasMore = filteredStores.length > visibleCount;

  return (
    <div className="min-h-screen" dir="rtl">
      <div className="container mx-auto px-3 sm:px-4 md:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* المحتوى الرئيسي */}
          <div className="lg:col-span-2">
            <div className="text-right mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                متاجرنا
              </h1>
              <div className="w-40 h-1 bg-gradient-to-l from-[#14b8a6] mb-5 rounded-full"></div>
            </div>

            {/* أزرار التصنيفات */}
            <Swiper
              slidesPerView="auto"
              spaceBetween={8}
              freeMode={true}
              modules={[FreeMode]}
              className="mb-6"
            >
              <SwiperSlide style={{ width: "auto" }}>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-full border whitespace-nowrap ${
                    selectedCategory === "all"
                      ? "bg-teal-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  } transition`}
                >
                  الكل
                </button>
              </SwiperSlide>
              {categories.map((cat) => (
                <SwiperSlide key={cat.id} style={{ width: "auto" }}>
                  <button
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-4 py-2 rounded-full border whitespace-nowrap ${
                      selectedCategory === cat.slug
                        ? "bg-teal-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    } transition`}
                  >
                    {cat.name}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* حالة التحميل */}
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <StoreCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* حالة الخطأ */}
            {error && (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-500 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
                >
                  إعادة المحاولة
                </button>
              </div>
            )}

            {/* عرض المتاجر */}
            {!loading && !error && (
              <>
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
                  {visibleStores.length > 0 ? (
                    visibleStores.map((store) => (
                      <Link href={`/stores/${store.slug}`} key={store.id}>
                        <StoreCard store={store} />
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">
                        لا توجد متاجر في هذا التصنيف.
                      </p>
                    </div>
                  )}
                </div>

                {/* زر عرض المزيد */}
                {hasMore && (
                  <div className="flex justify-center mt-6 md:mt-8">
                    <button
                      onClick={() =>
                        setVisibleCount((prevCount) => prevCount + 40)
                      }
                      className="px-6 md:px-8 py-2 md:py-3 rounded-full bg-[#14b8a6] text-white font-bold shadow hover:bg-[#0d9488] transition flex items-center gap-2"
                    >
                      عرض المزيد
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* الشريط الجانبي */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 md:top-8 space-y-6">
              <SubscribeBox />
              <div className="pt-6">
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
