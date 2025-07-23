"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

const bannerImages = [
  { src: "/bannar/Adidas_logo.png", alt: "Adidas" },
  { src: "/bannar/alibaba.png", alt: "Alibaba" },
  { src: "/bannar/noon-2.svg", alt: "Noon" },
  { src: "/bannar/noon-food.png", alt: "Noon Food" },
  { src: "/bannar/amazon-logo-amazon-icon-transparent-free-png.webp", alt: "Amazon" },
];

export default function Bannar() {
  return (
    <div className="w-full py-6 px-2">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop={true}
        spaceBetween={20}
        pagination={{ clickable: true }}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        className=" "
      >
        {bannerImages.map((img, idx) => (
          <SwiperSlide key={idx}>
            <div className="w-full h-48 flex items-center justify-center bg-white rounded-lg overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                width={250}
                height={100}
                className="object-contain w-full h-full"
                priority={idx === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 24px;
          height: 6px;
          border-radius: 4px;
          background-color: #e5e7eb;
          transition: background-color 0.3s;
          margin: 0 4px !important;
        }
        .swiper-pagination-bullet-active {
          background-color: #14b8a6;
        }
        .swiper-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          padding-top: 12px;
        }
      `}</style>
    </div>
  );
}
