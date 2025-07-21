import CouponSlider from "./CouponSlider";
import SubscribeBox from "./SubscribeBox";
import AppPromotionBox from "./AppPromotionBox";
import PromoCard from "./PromoCard";

const OffersSection = () => {
  return (
    <section className="py-10 px-4  " dir="rtl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-12">
        {/* ✅ سلايدر العروض */}
        <div className="lg:col-span-4">
          <CouponSlider />
        </div>
        {/* ✅ العمود الأيسر */}
        <div className="lg:col-span-2 ">
          <SubscribeBox />
          <div className=" py-15  ">
            <AppPromotionBox />
            <PromoCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
