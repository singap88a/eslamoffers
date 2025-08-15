"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards } from "swiper/modules";
import { FaArrowLeft } from "react-icons/fa";
import { MdStars } from "react-icons/md";
import "swiper/css";
import "swiper/css/effect-cards";
import Link from "next/link";
import Image from "next/image";

const PromoCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Static initial positions for bubbles
  const initialBubbles = [
    { width: 70, height: 70, left: 20, top: 20, delay: 0 },
    { width: 90, height: 90, left: 40, top: 40, delay: 200 },
    { width: 80, height: 80, left: 60, top: 60, delay: 400 },
    { width: 100, height: 100, left: 80, top: 80, delay: 600 },
    { width: 85, height: 85, left: 30, top: 70, delay: 800 },
    { width: 95, height: 95, left: 70, top: 30, delay: 1000 }
  ];

  useEffect(() => {
    setIsClient(true);
    const fetchOffers = async () => {
      try {
        const res = await fetch('https://api.eslamoffers.com/api/Offers/GetAllOffers');
        const data = await res.json();
        const lastFiveOffers = data.slice(0, 5);
        setOffers(lastFiveOffers);
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
        setIsVisible(true);
      }
    };

    fetchOffers();

    if (typeof window !== 'undefined') {
      const interval = setInterval(() => {
        const bubbles = document.querySelectorAll(".bubble");
        bubbles.forEach(bubble => {
          bubble.style.left = `${Math.random() * 100}%`;
          bubble.style.top = `${Math.random() * 100}%`;
        });
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, []);

  const getImageSrc = (url) => {
    if (!url) return '/default-product.png';
    if (url.startsWith('http')) return url;
    return `https://api.eslamoffers.com/uploads/${url}`;
  };

  const calculateOriginalPrice = (price, discount) => {
    if (price && discount) {
      return (price / (1 - discount / 100)).toFixed(2);
    }
    return null;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl max-w-4xl mx-auto my-8" dir="rtl">
      {/* الخلفية المموجة مع الفقاقيع */}
      <div className="absolute inset-0 bg-[#14b8a6] z-0 overflow-hidden">
        {initialBubbles.map((bubble, i) => (
          <div 
            key={i}
            className="bubble absolute rounded-full bg-white/10 transition-all duration-[3000ms] ease-in-out"
            style={{
              width: isClient ? `${Math.random() * 100 + 50}px` : `${bubble.width}px`,
              height: isClient ? `${Math.random() * 100 + 50}px` : `${bubble.height}px`,
              left: isClient ? `${Math.random() * 100}%` : `${bubble.left}%`,
              top: isClient ? `${Math.random() * 100}%` : `${bubble.top}%`,
              transitionDelay: `${bubble.delay}ms`
            }}
          />
        ))}
        
        <svg className="absolute bottom-0 left-0 w-full opacity-20" viewBox="0 0 1440 320">
          <path fill="#ffffff" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,122.7C384,117,480,139,576,165.3C672,192,768,224,864,213.3C960,203,1056,149,1152,117.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* المحتوى */}
      <div className="relative z-10 p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-block bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-md mb-2">
            <h2 className="text-3xl font-bold text-[#14b8a6] inline-flex items-center gap-2">
              <MdStars className="text-yellow-500" />
              عروض حصرية لك
            </h2>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14b8a6]"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-2xl md:text-2xl font-bold text-white mb-2">اكتشف أحدث العروض الحصرية</h3>
                <p className="text-[#ffffffc4] mb-4">خصومات وعروض فريدة متجددة يوميًا</p>
              </motion.div>
              
              <div className="flex justify-center">
                <Swiper
                  effect={"cards"}
                  grabCursor={true}
                  modules={[EffectCards, Autoplay]}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  className="w-full max-w-[280px] h-[180px]"
                >
                  {offers.map((offer) => {
                    const originalPrice = calculateOriginalPrice(offer.price, offer.discount);
                    
                    return (
                      <SwiperSlide key={offer.id} className="rounded-xl overflow-hidden">
                        <div 
                          className="h-full w-full p-4 flex flex-col justify-between"
                          style={{ 
                            backgroundColor: '#ffffff',
                            backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(255,255,255,0.8))',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                          }}
                        >
                          {/* صورة المنتج */}
                          <div className="relative w-full h-24 mx-auto">
                            <Image
                              src={getImageSrc(offer.logoUrl)}
                              alt={offer.title}
                              fill
                              className="object-contain rounded-md"
                            />
                          </div>

                          {/* معلومات المنتج */}
                          <div className="text-center">
                            <h4 className="text-sm font-bold text-gray-800 mb-1 line-clamp-1">
                              {offer.title}
                            </h4>
                            
                            {offer.discount && (
                              <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full inline-block">
                                خصم {offer.discount}%
                              </div>
                            )}
                            
                            {offer.price && (
                              <div className="text-lg font-bold text-teal-600 mt-1">
                                {offer.price} {offer.currencyCodes || "USD"}
                              </div>
                            )}
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex justify-center items-center mt-6"
              >
                <Link href="/offers">
                  <button 
                    className="hover:bg-[#0b8378] cursor-pointer bg-[#0d9488] text-white font-bold py-3 px-8 rounded-full inline-flex items-center gap-2 transition-all shadow-md justify-center border border-white/20"
                  >
                    تصفح جميع العروض
                    <FaArrowLeft className="text-sm" />
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PromoCard;