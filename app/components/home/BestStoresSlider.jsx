"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import StoreCard from "../stores/StoreCard";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

const fetchBestStores = async () => {
  try {
    const res = await fetch("https://api.eslamoffers.com/api/Store/GetBastStores/Bast");
    if (!res.ok) throw new Error("Failed to fetch stores");
    const data = await res.json();
    return data.filter(s => s.isBast).slice(0, 8); // نعرض فقط 8 متاجر
  } catch (e) {
    console.error(e);
    return [];
  }
};

const BestStoresSlider = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestStores().then(fetchedStores => {
      setStores(fetchedStores);
      setLoading(false);
    });
  }, []);

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#14b8a6]">أفضل المتاجر</h2>
        <Link
          href="/stores"
          className="text-lg font-medium text-[#14b8a6] hover:text-teal-700 underline flex items-center gap-2"
        >
          <span>كل المتاجر</span>
          <FiArrowLeft />
        </Link>
      </div>
      <div className="w-40 h-1 bg-gradient-to-l from-[#14b8a6] mt-2 mb-5 rounded-full"></div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-t-teal-500 border-r-transparent border-b-teal-300 border-l-transparent animate-spin"></div>
            <p className="mt-4 text-teal-600 font-medium">جاري تحميل المتاجر...</p>
          </div>
        </div>
      ) : (
        <Swiper
          spaceBetween={20}
          slidesPerView="auto"
          breakpoints={{
            640: { slidesPerView: "auto" },
            1024: { slidesPerView: "auto" },
          }}
          loop
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
        >
          {stores.map((store) => (
            <SwiperSlide key={store.id} className="my-2 !w-[220px] md:!w-[220px] lg:!w-[220px]">
              <StoreCard store={store} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default BestStoresSlider;
