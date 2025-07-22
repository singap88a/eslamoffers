import OfferGrid from '../components/offers/OfferGrid';
import SubscribeBox from '../components/home/Coupon/SubscribeBox';
import AppPromotionBox from '../components/home/Coupon/AppPromotionBox';
import PromoCard from '../components/home/Coupon/PromoCard';

async function getOffers() {
  const res = await fetch('http://147.93.126.19:8080/api/Offers/GetAllOffers', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch offers');
  }
  return res.json();
}

export default async function OffersPage() {
  const offers = await getOffers();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-start text-gray-800 mb-3">كل العروض</h1>
        <div className="w-40 h-1 bg-gradient-to-l text-start from-[#14b8a6] mb-5 rounded-full"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <OfferGrid offers={offers} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              <SubscribeBox />
              <AppPromotionBox />
              <PromoCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
