import CouponCard from '../components/coupons/CouponCard';
import SubscribeBox from '../components/home/Coupon/SubscribeBox';
 import PromoCard from '../components/home/Coupon/PromoCard';
import CountdownOfferBox from '../components/home/Coupon/CountdownOfferBox';

async function getCoupons() {
  const res = await fetch('http://147.93.126.19:8080/api/Coupons/GetAllCoupons', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch coupons');
  }
  return res.json();
}

export default async function CouponsPage() {
  const coupons = await getCoupons();

  return (
    <div className="  min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-start text-gray-800  mb-3">كل الكوبونات</h1>
                    <div className="w-40 h-1 bg-gradient-to-l text-start from-[#14b8a6]      mb-5 rounded-full"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              <SubscribeBox />
              <CountdownOfferBox />
              <PromoCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
