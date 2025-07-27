"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import OfferCard from "../offers/OfferCard";

// خريطة لودنج حسب الكاتيجوري
const LoadingByCategory = ({ category }) => {
  const styles = "w-10 h-10 border-4 border-t-[#14b8a6] rounded-full animate-spin mx-auto";

  switch (category) {
    case "electronics":
      return <div className={styles + " border-gray-300"}></div>;
    case "fashion":
      return (
        <div className="flex justify-center items-center gap-2">
          <div className="w-3 h-3 bg-[#14b8a6] rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-[#14b8a6] rounded-full animate-bounce delay-200" />
          <div className="w-3 h-3 bg-[#14b8a6] rounded-full animate-bounce delay-400" />
        </div>
      );
    case "travel":
      return (
        <div className="flex justify-center items-center">
          <div className="w-6 h-6 animate-ping bg-[#14b8a6] rounded-full"></div>
        </div>
      );
    default:
      return <div className={styles + " border-gray-300"}></div>;
  }
};

const fetchBestOffers = async () => {
  try {
    const res = await fetch("https://api.eslamoffers.com/api/Offers/GetBestOffers/best");
    if (!res.ok) throw new Error("Failed to fetch offers");
    const data = await res.json();
    return data.filter((o) => o.isBast);
  } catch (e) {
    console.error(e);
    return [];
  }
};

const BestOffersSlider = ({ category = "default" }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestOffers().then((fetchedOffers) => {
      setOffers(fetchedOffers);
      setLoading(false);
    });
  }, []);

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#14b8a6]">أفضل العروض</h2>
        <Link
          href="/offers"
          className="text-lg font-medium text-[#14b8a6] hover:text-teal-700 underline flex items-center gap-2"
        >
          <span>كل العروض</span>
          <FiArrowLeft />
        </Link>
      </div>
      <div className="w-40 h-1 bg-gradient-to-l from-[#14b8a6] mt-2 mb-5 rounded-full"></div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">
          <LoadingByCategory category={category} />
          <p className="mt-2">جاري تحميل عروض {category === "default" ? "..." : category}</p>
        </div>
      ) : (
    <Swiper
          spaceBetween={16}
          slidesPerView="auto"
          breakpoints={{
            640: { slidesPerView: "auto" },
            1024: { slidesPerView: "auto" },
          }}
          loop
        >
          {offers.map((offer) => (
            <SwiperSlide key={offer.id} className="my-2 !w-[350px] md:!w-[385px] lg:!w-[385px]">
              <OfferCard offer={offer} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default BestOffersSlider;

