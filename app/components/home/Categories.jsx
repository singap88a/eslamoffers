'use client';
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import Image from 'next/image';
import Link from 'next/link';

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://147.93.126.19:8080/api/Category/GetAllCategories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full py-10 md:px-20 px-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">الفئات</h2>
        <Link href="/categories" className="text-teal-500 font-semibold hover:underline">
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
        {categories.map((cat) => (
          <SwiperSlide key={cat.id}>
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="rounded-full bg-gradient-to-tr from-teal-200 via-white to-teal-100 shadow-xl flex items-center justify-center w-24 h-24 mb-2 hover:scale-110 hover:shadow-2xl transition-all border-2 border-teal-200 hover:border-teal-400">
                <Image src={cat.iconUrl} alt={cat.name} width={60} height={60} className="rounded-full" />
              </div>
              <span className="text-sm font-semibold text-gray-700">{cat.name}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
