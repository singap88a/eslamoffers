"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import CouponCard from "../../components/coupons/CouponCard";
import PromoCard from "../../components/home/Coupon/PromoCard";
import CountdownOfferBox from "../../components/home/Coupon/CountdownOfferBox";
import BestStores from "../../components/home/BestStores";

const StoreCouponsPage = () => {
  const [store, setStore] = useState(null);
  const [coupons, setCoupons] = useState([]);
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
        `https://api.eslamoffers.com/api/Store/GetStoreBySlug/${slug}`
      );
      const storeData = Array.isArray(storeResponse.data)
        ? storeResponse.data[0]
        : storeResponse.data;
      setStore(storeData);

      // جلب الكوبونات بشكل منفصل
      let couponsData = [];
      try {
        const couponsResponse = await axios.get(
          `https://api.eslamoffers.com/api/Coupons/GetCouponsByStore/${slug}`
        );
        couponsData = Array.isArray(couponsResponse.data)
          ? couponsResponse.data
          : [];
      } catch (couponErr) {
        // إذا فشل جلب الكوبونات، لا تظهر خطأ، فقط اعتبر لا يوجد كوبونات
        console.log("No coupons found for store:", slug);
        couponsData = [];
      }
      setCoupons(couponsData);
    } catch (err) {
      setError("فشل تحميل بيانات المتجر. يرجى المحاولة مرة أخرى لاحقًا.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchStoreAndCoupons();
  }, [fetchStoreAndCoupons]);

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
    <div className="min-h-screen " dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto md:py-14    px-4 sm:px-6 lg:px-8">
        <div className="lg:col-span-2">
          <div className="bg-white border-b pb-4 border-gray-300 mb-8 md:mb-12 flex flex-col sm:flex-row items-center">
            <img
              src={getLogoSrc()}
              alt={store.altText || store.name}
              className=" md:w-44    h-24 md:h-24  rounded-lg   p-1 shadow-lg mb-4 sm:mb-0"
              loading="lazy"
            />
            <div className="sm:mr-6 flex-1 text-center sm:text-right">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {store.name}
              </h1>
              <h2 className="text-sm sm:text-base font-[400] text-gray-600 mb-4">
                {store.headerDescription ||
                  `جميع الكوبونات والعروض الخاصة بـ ${store.name}`}
              </h2>
            </div>
            <div className="text-center sm:text-left mt-4 sm:mt-0 md:block flex items-center justify-center gap-10 hidden ">
              <div className=" pb-2">
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

          {coupons.length > 0 ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between  ">
                {/* <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0 text-center sm:text-right">
                  كوبونات {store.name}
                </h2> */}
                <div className="text-sm text-gray-500 text-center sm:text-right"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 md:mb-12">
                {coupons.map((coupon) => (
                  <CouponCard key={coupon.id} coupon={coupon}
  />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                {/* <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0 text-center sm:text-right">
                  كوبونات {store.name}
                </h2> */}
                {/* <div className="text-sm text-gray-500 text-center sm:text-right">
                  لا توجد كوبونات
                </div> */}
              </div>
              <div className="text-center py-12 sm:py-20 bg-white rounded-lg shadow-md mb-12">
                <div className="mb-4 sm:mb-6">
                  <svg
                    className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                    لا توجد كوبونات متاحة
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 px-2 sm:px-4">
                    لا توجد كوبونات متاحة حاليًا لـ {store.name}. تحقق مرة أخرى
                    لاحقًا للحصول على أحدث العروض!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Link
                    href="/coupons"
                    className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-teal-500 text-white text-sm sm:text-base rounded-lg hover:bg-teal-600 transition"
                  >
                    <span>تصفح جميع الكوبونات</span>
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                  <Link
                    href="/stores"
                    className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 text-white text-sm sm:text-base rounded-lg hover:bg-gray-600 transition"
                  >
                    <span>تصفح المتاجر الأخرى</span>
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </>
          )}

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
              <div className="flex justify-between items-center">
                <div className="">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-0 text-center sm:text-right">
                    معلومات المتجر
                  </h3>
                </div>

                <div className="text-center sm:text-left mt-4 sm:mt-0  block   items-center justify-center gap-10 md:hidden">
                  <div className=" pb-2">
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

            <div className="mb-6 md:mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                {/* هنا سيتم عرض المتاجر المشابهة */}
              </div>
            </div>

            {/* {store.categorys && store.categorys.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">الفئات</h4>
                  <div className="flex flex-wrap gap-2">
                    {store.categorys.map((categoryId, index) => (
                      <span key={index} className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                        {getCategoryName(categoryId)}
                      </span>
                    ))}
                  </div>
                </div>
              )} */}

            {store.description && (
              <div className="mb-4 sm:mb-6">
                {/* <h4 className="text-lg font-semibold text-gray-800 mb-2">الوصف</h4> */}
                <p className="text-[#000] font-bold text-xl sm:text-2xl text-center sm:text-right">
                  {store.description}
                </p>
              </div>
            )}

            {store.descriptionStore?.length > 0 && (
              <div className="space-y-4 sm:space-y-6">
                {/* <h4 className="text-lg font-semibold text-gray-800">تفاصيل إضافية</h4> */}
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
                      <img
                        src={`https://api.eslamoffers.com/uploads/${desc.image}`}
                        alt={desc.subHeader || `صورة توضيحية ${index + 1}`}
                        className="w-full h-auto rounded-lg shadow-sm"
                        loading="lazy"
                      />
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
