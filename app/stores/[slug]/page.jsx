"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import CouponCard from "../../components/coupons/CouponCard";
import PromoCard from "../../components/home/Coupon/PromoCard";
import CountdownOfferBox from "../../components/home/Coupon/CountdownOfferBox";
import BestStores from "../../components/home/BestStores";
import StoreOffersCard from "../../components/StoreOffers/StoreOffersCard";
import Image from "next/image";

const StoreCouponsPage = () => {
  const [store, setStore] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const params = useParams();
  const { slug } = params;

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://api.eslamoffers.com/api/Category/GetAllCategories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  const fetchStoreAndCoupons = useCallback(async () => {
    if (!slug) return;

    setLoading(true);
    setError(null);
    try {
      // جلب بيانات المتجر أولاً
      const storeResponse = await axios.get(
        `https://api.eslamoffers.com/api/Store/GetStoreBySlug/${slug}`,
        {
          validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
          }
        }
      );

      if (storeResponse.status === 404) {
        throw new Error("المتجر غير موجود");
      }

      const storeData = Array.isArray(storeResponse.data)
        ? storeResponse.data[0]
        : storeResponse.data;
      
      if (!storeData) {
        throw new Error("بيانات المتجر غير متوفرة");
      }

      setStore(storeData);

      // جلب الكوبونات الخاصة بالمتجر فقط
      let couponsData = [];
      try {
        const couponsResponse = await axios.get(
          `https://api.eslamoffers.com/api/Coupons/GetCouponsByStore/${slug}`,
          {
            validateStatus: (status) => status < 500
          }
        );
        
        if (couponsResponse.status === 200) {
          couponsData = Array.isArray(couponsResponse.data)
            ? couponsResponse.data
            : [];
        }
      } catch (couponErr) {
        console.log("No coupons found for store:", slug);
      }
      setCoupons(couponsData);

      // جلب العروض وتصفيتها حسب المتجر
      try {
        const offersResponse = await axios.get(
          "https://api.eslamoffers.com/api/StoreOffers/GetAllOffers",
          {
            validateStatus: (status) => status < 500
          }
        );
        
        if (offersResponse.status === 200) {
          const allOffers = offersResponse.data || [];
          
          // تصفية العروض لتعرض فقط عروض المتجر الحالي باستخدام slug
          const storeOffers = allOffers.filter(offer => 
            offer.slugStore?.trim().toLowerCase() === slug?.trim().toLowerCase()
          );
          
          setOffers(storeOffers);
        }
      } catch (offersErr) {
        console.log("Error fetching offers:", offersErr);
        setOffers([]);
      }
    } catch (err) {
      setError(err.message || "فشل تحميل بيانات المتجر. يرجى المحاولة مرة أخرى لاحقًا.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (slug) {
      fetchStoreAndCoupons();
    }
  }, [slug, fetchStoreAndCoupons]);

  const getLogoSrc = useCallback(() => {
    if (!store || !store.logoUrl) return "/logo4.png";
    if (store.logoUrl.startsWith("http") || store.logoUrl.startsWith("https")) {
      return store.logoUrl;
    }
    return `https://api.eslamoffers.com/uploads/${store.logoUrl}`;
  }, [store]);

  const getCategoryName = useCallback(
    (categoryId) => {
      const category = categories.find((cat) => cat.id === categoryId);
      return category ? category.name : categoryId;
    },
    [categories]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المتجر...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center max-w-md mx-auto">
          <svg
            className="w-16 h-16 text-red-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">حدث خطأ</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
            >
              إعادة المحاولة
            </button>
            <Link
              href="/stores"
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              العودة للمتاجر
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center max-w-md mx-auto">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            لم يتم العثور على المتجر
          </h3>
          <p className="text-gray-500 mb-6">
            المتجر الذي تبحث عنه غير موجود أو تم حذفه.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/stores"
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
            >
              تصفح المتاجر
            </Link>
            <Link
              href="/"
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              الصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto md:py-14 px-4 sm:px-6 lg:px-8">
        <div className="lg:col-span-2">
          <div className="bg-white border-b pb-4 border-gray-300 mb-8 md:mb-12 flex flex-col sm:flex-row items-center">
            <div className="relative w-full h-32 sm:w-44 sm:h-24 md:w-44 md:h-24 rounded-lg p-1 mb-4 sm:mb-0 mx-auto sm:mx-0">
              <div className="relative w-full h-full ">
                <Image
                  src={getLogoSrc()}
                  alt={store.altText || store.name}
                  fill
                  className="rounded-lg object-contain"
                  // sizes="(max-width: 640px) 128px, (max-width: 768px) 176px, 176px"
                  onError={(e) => {
                    e.target.src = "/logo4.png";
                  }}
                />
              </div>
            </div>
            <div className="sm:mr-6 flex-1 text-center sm:text-right">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {store.name}
              </h1>
              <h2 className="text-sm sm:text-base font-[400] text-gray-600 mb-4">
                {store.headerDescription ||
                  `جميع الكوبونات والعروض الخاصة بـ ${store.name}`}
              </h2>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">الكوبونات المتاحة:</h3>
            {coupons.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {coupons.map((coupon) => (
                  <CouponCard key={coupon.id} coupon={coupon} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5} 
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mt-4 text-gray-600">لا توجد كوبونات متاحة حالياً لهذا المتجر</p>
              </div>
            )}
          </div>

          <div className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">العروض المتاحة:</h3>
              <span className="text-sm text-gray-500">عروض خاصة بـ {store.name}</span>
            </div>
            {offers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {offers.map((offer) => (
                  <StoreOffersCard key={offer.id} offer={offer} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5} 
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mt-4 text-gray-600">لا توجد عروض متاحة حالياً لهذا المتجر</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
              <div className="flex justify-between items-center">
                <div className="">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-0 text-center sm:text-right">
                    معلومات المتجر
                  </h3>
                </div>

                <div className="text-center sm:text-left mt-4 sm:mt-0 block items-center justify-center gap-10 md:hidden">
                  <div className="pb-2">
                    {store.isBast && (
                      <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          className="w-4 h-4"
                        >
                          <path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 14.77l-4.77 2.51.91-5.33-3.87-3.77 5.34-.78L10 2z" />
                        </svg>
                        متجر مميز
                      </div>
                    )}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg text-center shadow-sm ${
                      coupons.length > 0
                        ? "bg-teal-50 text-teal-700"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    <div className="text-xl sm:text-2xl font-bold">
                      {coupons.length}
                    </div>
                    <div className="text-xs sm:text-sm">
                      {coupons.length > 0 ? "كوبون متاح" : "لا توجد كوبونات"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {store.description && (
              <div className="mb-4 sm:mb-6">
                <p className="text-[#000] font-bold text-xl sm:text-2xl text-center sm:text-right">
                  {store.description}
                </p>
              </div>
            )}

            {store.descriptionStore?.length > 0 && (
              <div className="space-y-4 sm:space-y-6">
                {store.descriptionStore.map((desc, index) => (
                  <div
                    key={desc.id || index}
                    className="border-r-4 sm:border-r-0 sm:border-l-4 border-teal-500 pr-3 sm:pr-0 sm:pl-4 text-right"
                  >
                    {desc.subHeader && (
                      <h5 className="text-sm sm:text-md font-semibold text-gray-800 mb-1 sm:mb-2">
                        {desc.subHeader}
                      </h5>
                    )}
                    {desc.description && (
                      <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">
                        {desc.description}
                      </p>
                    )}
                    {desc.image && (
<div className="relative w-full rounded-lg overflow-hidden shadow-sm flex justify-center">
  <Image
    src={`https://api.eslamoffers.com/uploads/${desc.image}`}
    alt={desc.altText || `صورة توضيحية ${index + 1}`}
    width={0}
    height={0}
    sizes="100vw"
    style={{ width: 'auto', height: 'auto', maxHeight: '300px' }}
    className="object-contain"
    onError={(e) => {
      e.target.src = "/logo4.png";
    }}
  />
</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4 lg:top-8">
            <BestStores />
            <div className="pt-4 sm:pt-6 lg:pt-8">
              <CountdownOfferBox />
            </div>
            <div className="pt-4 sm:pt-6 lg:pt-8">
              <PromoCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCouponsPage;