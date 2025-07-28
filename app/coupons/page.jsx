"use client";

import { useEffect, useState } from "react";
import CouponCard from "../components/coupons/CouponCard";
import SubscribeBox from "../components/home/Coupon/SubscribeBox";
import PromoCard from "../components/home/Coupon/PromoCard";
import CountdownOfferBox from "../components/home/Coupon/CountdownOfferBox";
import CategorySkeletonLoader from "../components/coupons/CategorySkeletonLoader";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("default");
  const [showAll, setShowAll] = useState(false); // ✅ لإدارة عرض المزيد أو أقل

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch(
          "https://api.eslamoffers.com/api/Coupons/GetAllCoupons"
        );
        const data = await res.json();
        setCoupons(data);
        setCategory(data[0]?.category || "default");
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  // ✅ تحديد العدد المعروض بناءً على حالة showAll
  const visibleCoupons = showAll ? coupons : coupons.slice(0, 15);

  return (
    <div className="min-h-screen text-gray-800 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-start mb-3">كل الكوبونات</h1>
        <div className="w-40 h-1 bg-gradient-to-l from-[#14b8a6] mb-5 rounded-full"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {loading ? (
              <CategorySkeletonLoader category={category} />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6   md:mr-0">
                  {visibleCoupons.map((coupon) => (
                    <CouponCard key={coupon.id} coupon={coupon} />
                  ))}
                </div>

                {/* ✅ زر عرض المزيد أو أقل */}
                {coupons.length > 15 && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setShowAll((prev) => !prev)}
                      className="px-6 py-2 bg-[#14b8a6] text-white font-bold rounded-md hover:bg-[#0d9488] transition duration-300"
                    >
                      {showAll ? "عرض أقل" : "عرض المزيد"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <SubscribeBox />
            <div className=" pt-10">
              <CountdownOfferBox />
            </div>
            <PromoCard />
          </div>
        </div>
      </div>
    </div>
  );
}
