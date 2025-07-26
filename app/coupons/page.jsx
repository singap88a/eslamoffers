'use client';

import { useEffect, useState } from 'react';
import CouponCard from '../components/coupons/CouponCard';
import SubscribeBox from '../components/home/Coupon/SubscribeBox';
import PromoCard from '../components/home/Coupon/PromoCard';
import CountdownOfferBox from '../components/home/Coupon/CountdownOfferBox';
import CategorySkeletonLoader from '../components/coupons/CategorySkeletonLoader';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('default'); // للتبديل بين أنواع اللودنج

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch('https://api.eslamoffers.com/api/Coupons/GetAllCoupons');
        const data = await res.json();
        setCoupons(data);
        setCategory(data[0]?.category || 'default');
      } catch (error) {
        console.error('Failed to fetch coupons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  return (
    <div className="min-h-screen   dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-start mb-3">كل الكوبونات</h1>
        <div className="w-40 h-1 bg-gradient-to-l from-[#14b8a6] mb-5 rounded-full"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {loading ? (
              <CategorySkeletonLoader category={category} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coupons.map((coupon) => (
                  <CouponCard key={coupon.id} coupon={coupon} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <SubscribeBox />
            <CountdownOfferBox />
            <PromoCard />
          </div>
        </div>
      </div>
    </div>
  );
}
