import OfferGrid from "../components/offers/OfferGrid";
 import PromoCard from "../components/home/Coupon/PromoCard";
import CountdownOfferBox from "../components/home/Coupon/CountdownOfferBox";
import BestStores from "../components/home/BestStores";

async function getOffers() {
  const res = await fetch(
    "https://api.eslamoffers.com/api/Offers/GetAllOffers",
    {
      cache: "no-store",
      next: { revalidate: 60 }, // ISR - إعادة التحقق كل دقيقة
    }
  );

  if (!res.ok) {
    throw new Error("فشل في جلب العروض");
  }

  return res.json();
}

export default async function OffersPage() {
  const offers = await getOffers();

  return (
    <div className="min-h-screen  ">
      <div className="max-w-7xl mx-auto     py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            أحدث العروض والخصومات
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            اكتشف أفضل العروض من متاجر مختلفة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-4">
            <OfferGrid offers={offers} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <BestStores />
            <div className="pt-12">
              <CountdownOfferBox />
            </div>
            <PromoCard />
          </div>
        </div>
      </div>
    </div>
  );
}
