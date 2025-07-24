"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards } from "swiper/modules";
import { FaGift, FaArrowLeft, FaShoppingBag, FaPercent, FaTag } from "react-icons/fa";
import { MdStars } from "react-icons/md";

// استيراد ستايلات Swiper
import "swiper/css";
import "swiper/css/effect-cards";

const PromoCard = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // تأثير الخلفية المتحركة
    const interval = setInterval(() => {
      const bubbles = document.querySelectorAll(".bubble");
      bubbles.forEach(bubble => {
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.top = `${Math.random() * 100}%`;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // بيانات العروض
  const offers = [
    {
      id: 1,
      title: "خصم 30% على المنتجات الفاخرة",
      code: "LUXURY30",
      icon: <FaTag />,
      color: "#FF6B6B"
    },
    {
      id: 2,
      title: "شحن مجاني على جميع الطلبات",
      code: "FREESHIP",
      icon: <FaShoppingBag />,
      color: "#4ECDC4"
    },
    {
      id: 3,
      title: "استرداد نقدي 15%",
      code: "CASHBACK15",
      icon: <FaPercent />,
      color: "#FFD166"
    },
    {
      id: 4,
      title: "هدية مجانية مع كل طلب",
      code: "FREEGIFT",
      icon: <FaGift />,
      color: "#6A0572"
    }
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl max-w-4xl mx-auto my-8" dir="rtl">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 bg-[#14b8a6] z-0 overflow-hidden">
        {/* فقاعات متحركة */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="bubble absolute rounded-full bg-white/10 transition-all duration-[3000ms] ease-in-out"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transitionDelay: `${i * 200}ms`
            }}
          />
        ))}
        
        {/* تموجات */}
        <svg className="absolute bottom-0 left-0 w-full opacity-20" viewBox="0 0 1440 320">
          <path fill="#ffffff" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,122.7C384,117,480,139,576,165.3C672,192,768,224,864,213.3C960,203,1056,149,1152,117.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* المحتوى الرئيسي */}
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

        {/* كارت العروض الرئيسي */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="  "
        >
          <div className="   ">
            <div className=" ">
              <div className="text-center  ">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h3 className="text-2xl md:text-2xl font-bold text-white mb-2">اكتشف عالم من العروض الحصرية</h3>
                  <p className="text-[#ffffffc4] mb-4">خصومات وعروض فريدة متجددة يوميًا لتجربة تسوق استثنائية</p>
                </motion.div>
                
     
              </div>
              
              <div className="w-full md:w-auto">
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
                  {offers.map((offer) => (
                    <SwiperSlide key={offer.id} className="rounded-xl overflow-hidden">
                      <div 
                        className="h-full w-full p-6 flex flex-col justify-between"
                        style={{ 
                          background: `linear-gradient(135deg, ${offer.color} 0%, ${offer.color}99 100%)`,
                        }}
                      >
                        <div className="text-white text-4xl">{offer.icon}</div>
                        <div>
                          <h4 className="text-white font-bold text-xl mb-1">{offer.title}</h4>
                          <div className="bg-white/30 backdrop-blur-sm rounded-lg py-1 px-3 inline-block">
                            <p className="text-white font-mono font-bold">{offer.code}</p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
                         <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="   flex justify-center items-center mt-6"
                >
                  <button className="hover:bg-[#347069fd] bg-[#0d9488] text-white font-bold py-3 px-8 rounded-full inline-flex items-center gap-2 transition-all shadow-md  justify-center ">
                    تصفح العروض
                    <FaArrowLeft className="text-sm" />
                  </button>
                </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PromoCard;
