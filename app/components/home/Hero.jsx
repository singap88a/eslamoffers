'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';
import BestStores from './BestStores';

const slides = [
  { id: 1, img: 'https://cdn.almowafir.com/1/noonegy-ar-normal.jpg', alt: 'عرض نون' },
  { id: 2, img: 'https://cdn.almowafir.com/1/noonegy-ar-normal.jpg', alt: 'عرض أمازون' },
];

const Hero = () => {
  return (
    <section className="px-4 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ✅ السلايدر */}
        <div className="lg:col-span-2 order-1">
          <div className="w-full rounded-lg overflow-hidden    shadow-lg">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 2000 }}
              loop={true}
              spaceBetween={20}
              pagination={{ clickable: true }}
            >
              {slides.map((slide) => (
                <SwiperSlide key={slide.id}>
                  <div className="w-full h-full">
                               <Image
                    src={slide.img}
                    alt={slide.alt}
                    width={1000}
                    height={400}
                    className="w-full   h-auto object-cover"
                  />
                  </div>
       
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        {/* ✅ المتاجر */}
        <div className="order-2">
          <BestStores />
        </div>
      </div>

      {/* ✅ استايل مخصص للباجينيشن */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 30px;
          height: 6px;
          border-radius: 4px;
          background-color:rgb(13, 13, 14); /* رمادي فاتح */
          transition: background-color 0.3s;
          margin: 0 4px !important;
        }

        .swiper-pagination-bullet-active {
          background-color: #14b8a6; /* أزرق */
        }

        .swiper-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          padding-top: 12px;
        }
      `}</style>
    </section>
  );
};

export default Hero;
