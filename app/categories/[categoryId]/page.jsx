"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import SubscribeBox from "../../components/home/Coupon/SubscribeBox";
import AppPromotionBox from "../../components/home/Coupon/AppPromotionBox";
import PromoCard from "../../components/home/Coupon/PromoCard";
import CountdownOfferBox from "../../components/home/Coupon/CountdownOfferBox";
import CouponCard from "../../components/coupons/CouponCard";

const CategoryPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [stores, setStores] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;

      try {
        const couponsRes = await fetch(
          "https://api.eslamoffers.com/api/Coupons/GetAllCoupons"
        );
        const allCoupons = await couponsRes.json();
        const filteredCoupons = allCoupons.filter(
          (c) => c.categoryId === categoryId
        );
        setCoupons(filteredCoupons);

        const storesRes = await fetch(
          "https://api.eslamoffers.com/api/Store/GetAllStores"
        );
        const allStores = await storesRes.json();
        setStores(allStores);

        if (filteredCoupons.length > 0) {
          const categoryRes = await fetch(
            `https://api.eslamoffers.com/api/Category/GetCategoryById/${categoryId}`
          );
          const categoryData = await categoryRes.json();
          setCategoryName(categoryData.name);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const getStoreLogo = (storeId) => {
    const store = stores.find((s) => s.id === storeId);
    if (store && store.logoUrl) {
      return store.logoUrl.startsWith("http")
        ? store.logoUrl
        : `https://api.eslamoffers.com/uploads/${store.logoUrl}`;
    }
    return "/logo.png";
  };

  if (loading) {
    return <div className="text-center py-10">...جاري التحميل</div>;
  }

  return (
    <div className=" " dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">كوبونات لـ {categoryName}</h1>
          <Link
            href="/categories"
            className="text-teal-500 hover:text-teal-600 font-semibold mt-2 inline-block"
          >
            &rarr; العودة إلى جميع الفئات
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="space-y-6">
              <SubscribeBox />
              <div className="pt-10">
                <CountdownOfferBox />
              </div>
              <PromoCard />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
