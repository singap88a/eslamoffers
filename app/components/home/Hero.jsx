'use client';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';
import Link from 'next/link';
import BestStores from './BestStores';

const Hero = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('https://api.eslamoffers.com/api/Banner/GetAllBanners');
        const data = await response.json();
        // فلترة البانرات التي لها صور فقط
        const validBanners = data.filter(banner => banner.imageUrl);
        // ترتيب البانرات حسب الأولوية
        validBanners.sort((a, b) => b.priority - a.priority);
        setBanners(validBanners);
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const getBannerImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    return `https://api.eslamoffers.com/uploads/${imageUrl}`;
  };

  const renderBannerContent = (banner) => {
    const imageUrl = getBannerImageUrl(banner.imageUrl);
    const altText = banner.altText || `بانر إعلاني ${banner.priority}`;
    
    const content = (
      <div className="w-full md:h-72 h-full object-cover">
        <Image
          src={imageUrl}
          alt={altText}
          width={1000}
          height={200}
          className="w-full h-full"
          title={altText} // إضافة title للتوافق مع بعض المتصفحات
        />
      </div>
    );

    // إذا كان الرابط يبدأ بـ /stores/ فهو رابط داخلي
    if (banner.link && banner.link.startsWith('/stores/')) {
      return (
        <Link href={banner.link} aria-label={altText}>
          {content}
        </Link>
      );
    }
    // إذا كان رابط خارجي
    else if (banner.link) {
      return (
        <a href={banner.link} target="_blank" rel="noopener noreferrer" aria-label={altText}>
          {content}
        </a>
      );
    }
    // إذا لم يكن هناك رابط
    return content;
  };

  return (
    <section className="px-4 md:py-8" dir="rtl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ✅ السلايدر */}
        <div className="lg:col-span-2 order-1">
          <div className="w-full rounded-lg overflow-hidden shadow-lg">
            {isLoading ? (
              <div className="flex justify-center items-center h-64 bg-gray-100">
                <div className="w-8 h-8 border-4 border-t-transparent border-[#14b8a6] rounded-full animate-spin"></div>
              </div>
            ) : banners.length > 0 ? (
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 3000 }}
                loop={true}
                spaceBetween={20}
                pagination={{ clickable: true }}
              >
                {banners.map((banner) => (
                  <SwiperSlide key={banner.id}>
                    {renderBannerContent(banner)}
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="flex justify-center items-center h-64 bg-gray-100">
                <p className="text-gray-500">لا توجد بانرات متاحة</p>
              </div>
            )}
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