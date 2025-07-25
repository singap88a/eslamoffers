"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import CouponCard from "../../components/coupons/CouponCard";
import SubscribeBox from "../../components/home/Coupon/SubscribeBox";
 
import PromoCard from "../../components/home/Coupon/PromoCard";
import CountdownOfferBox from "../../components/home/Coupon/CountdownOfferBox";

const StoreCouponsPage = () => {
  const [store, setStore] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const { storeId } = params;

  useEffect(() => {
    if (!storeId) return;

    const fetchStoreAndCoupons = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch store details
        const storeResponse = await axios.get(
          "https://api.eslamoffers.com/api/Store/GetAllStores"
        );
        const currentStore = storeResponse.data.find((s) => s.id === storeId);
        setStore(currentStore);

        // Fetch coupons
        const couponsResponse = await axios.get(
          "https://api.eslamoffers.com/api/Coupons/GetAllCoupons"
        );
        const storeCoupons = couponsResponse.data.filter(
          (c) => c.storeId === storeId
        );
        setCoupons(storeCoupons);
      } catch (err) {
        setError("فشل تحميل البيانات. يرجى المحاولة مرة أخرى لاحقًا.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreAndCoupons();
  }, [storeId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert("تم نسخ الكود!");
      },
      (err) => {
        alert("فشل نسخ الكود.");
      }
    );
  };

  if (loading) {
    return <div className="text-center py-20">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!store) {
    return <div className="text-center py-20">لم يتم العثور على المتجر.</div>;
  }

  const getLogoSrc = () => {
    if (!store.logoUrl) return "/logo.png";
    if (store.logoUrl.startsWith("http") || store.logoUrl.startsWith("https")) {
      return store.logoUrl;
    }
    return `https://api.eslamoffers.com/uploads/${store.logoUrl}`;
  };

  return (
    <div className="  min-h-screen" dir="rtl">
      <div className=" grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto py-20">
        <div className="lg:col-span-2">
          <div className="bg-white    border-b pb-4 border-gray-300   mb-12 flex items-center">
            <img
              src={getLogoSrc()}
              alt={store.name}
              className="w-24 h-24 object-contain rounded-full border p-1"
            />
            <div className="mr-6">
              <h1 className="text-4xl font-bold text-gray-800">{store.name}</h1>
              <p className="text-gray-600 mt-2">
                جميع الكوبونات والعروض الخاصة بـ {store.name}
              </p>
            </div>
          </div>

          {coupons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-md">
              <p className="text-2xl text-gray-500">
                لا توجد كوبونات متاحة حاليًا لهذا المتجر.
              </p>
            </div>
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
  );
};

export default StoreCouponsPage;
