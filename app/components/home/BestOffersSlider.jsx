"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import OfferCard from "../offers/OfferCard";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

const fetchBestOffers = async () => {
  try {
    const res = await fetch("http://147.93.126.19:8080/api/Offers/GetBestOffers/best");
    if (!res.ok) throw new Error("Failed to fetch offers");
    const data = await res.json();
    return data.filter(o => o.isBast);
  } catch (e) {
    console.error(e);
    return [];
  }
};

const BestOffersSlider = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestOffers().then(fetchedOffers => {
      setOffers(fetchedOffers);
      setLoading(false);
    });
  }, []);

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#14b8a6]">
          أفضل العروض
        </h2>
        <Link href="/offers" className="text-lg font-medium text-[#14b8a6] hover:text-teal-700 underline flex items-center gap-2">
          <span>كل العروض</span>
          <FiArrowLeft />
        </Link>
      </div>
      <div className="w-40 h-1 bg-gradient-to-l from-[#14b8a6] mt-2 mb-5 rounded-full"></div>
      {loading ? (
        <div className="text-center py-10 text-gray-400">جاري التحميل...</div>
      ) : (
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          loop
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
        >
          {offers.map((offer) => (
            <SwiperSlide key={offer.id} className="my-2">
              <OfferCard offer={offer} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default BestOffersSlider; 