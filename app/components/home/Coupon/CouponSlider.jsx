"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import CouponCard from "./CouponCard";

const offers = [
  {
    title: "عرض نون: خصم 40-75% + 10%",
    discount: "على منتجات الجمال",
    img: "/images/noon.png",
    buttonText: "انسخ الكود",
  },
  {
    title: "Amazon: خصم + شحن مجاني",
    discount: "خصم 50% لأول 3 شهور",
    img: "/images/amazon.png",
    buttonText: "احصل",
  },
  {
    title: "عرض نون: خصم 40-75% + 10%",
    discount: "على منتجات الجمال",
    img: "/images/noon.png",
    buttonText: "انسخ الكود",
  },
  {
    title: "Amazon: خصم + شحن مجاني",
    discount: "خصم 50% لأول 3 شهور",
    img: "/images/amazon.png",
    buttonText: "احصل",
  },
  {
    title: "عرض نون: خصم 40-75% + 10%",
    discount: "على منتجات الجمال",
    img: "/images/noon.png",
    buttonText: "انسخ الكود",
  },
  {
    title: "Amazon: خصم + شحن مجاني",
    discount: "خصم 50% لأول 3 شهور",
    img: "/images/amazon.png",
    buttonText: "احصل",
  },
  // أضف باقي العروض هنا...
];

const CouponSlider = () => {
  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6 text-[#14b8a6] text-right">
        أقوى الأكواد الصيفية
      </h2>
      <div className="w-40 h-1 bg-gradient-to-l from-[#14b8a6]      mb-5 rounded-full"></div>
      <Swiper
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        autoplay={{ delay: 2500 }}
        loop
      >
        {offers.map((offer, index) => (
          <SwiperSlide key={index}>
            <CouponCard {...offer} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CouponSlider;
