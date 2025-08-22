"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import Link from "next/link";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://api.eslamoffers.com/api/Category/GetAllCategories"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getSafeIconUrl = (iconUrl) => {
    const baseUrl = "https://api.eslamoffers.com/uploads/";
    if (!iconUrl) return "/logo4.png";
    try {
      const url = new URL(iconUrl);
      if (url.protocol === "http:" || url.protocol === "https:") return iconUrl;
    } catch (_) {}
    const fullUrl = iconUrl.startsWith("/")
      ? `${baseUrl}${iconUrl}`
      : `${baseUrl}/${iconUrl}`;
    try {
      const url = new URL(fullUrl);
      if (url.protocol === "http:" || url.protocol === "https:") return fullUrl;
    } catch (_) {}
    return "/logo4.png";
  };

  return (
    <div className="w-full md:pb-10   pt-10 md:px-20 px-4">
      <div className="flex justify-between items-center mb-4 md:px-10 px-4">
        <h2 className="text-2xl font-bold">الفئات</h2>
        <Link
          href="/categories"
          className="text-teal-500 font-semibold hover:underline"
        >
          عرض الكل
        </Link>
      </div>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={5}
        autoplay={{ delay: 1800, disableOnInteraction: false }}
        loop={true}
        breakpoints={{
          320: { slidesPerView: 3 },
          640: { slidesPerView: 4 },
          1024: { slidesPerView: 7 },
        }}
        className="!px-4"
      >
        {isLoading
          ? Array.from({ length: 7 }).map((_, idx) => (
              <SwiperSlide key={idx}>
                <div className="flex flex-col items-center gap-2 py-2">
                  <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse shadow-md" />
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              </SwiperSlide>
            ))
          : categories.map((cat) => (
              <SwiperSlide key={cat.id}>
                <Link
                  href={`/categories/${cat.slug || cat.id}`}
                  className="flex flex-col items-center gap-2 py-2"
                >
                  <div className="rounded-full bg-gradient-to-tr from-teal-200 via-white to-teal-100 shadow-xl flex items-center justify-center w-24 h-24 mb-2 hover:scale-110 hover:shadow-2xl transition-all border-2 border-teal-200 hover:border-teal-400">
                    {" "}
                    <Image
                      src={getSafeIconUrl(cat.iconUrl)}
                      alt={cat.altText || cat.name}
                      width={55}
                      height={55}
                      className="  p-1"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {cat.name}
                  </span>
                </Link>
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}
