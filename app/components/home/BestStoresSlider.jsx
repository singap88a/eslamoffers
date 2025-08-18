"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import CouponCard from "../coupons/CouponCard";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import CouponCodeModal from "./Coupon/CouponCodeModal";
import StoreOffersCard from "../StoreOffers/StoreOffersCard";

const fetchBestDiscounts = async () => {
  try {
    const res = await fetch("https://api.eslamoffers.com/api/Coupons/GetBestCoupons/BestDiscount");
    if (!res.ok) throw new Error("Failed to fetch discounts");
    const data = await res.json();
    
    // Filter coupons with isBestDiscount = true and clean the data
    return data.filter(coupon => coupon.isBestDiscount === true).slice(0, 8).map(coupon => ({
      ...coupon,
      title: typeof coupon.title === 'string' ? coupon.title : String(coupon.title || ''),
      descriptionCoupon: typeof coupon.descriptionCoupon === 'string' ? coupon.descriptionCoupon : String(coupon.descriptionCoupon || ''),
      couponCode: typeof coupon.couponCode === 'string' ? coupon.couponCode : String(coupon.couponCode || ''),
      linkRealStore: typeof coupon.linkRealStore === 'string' ? coupon.linkRealStore : String(coupon.linkRealStore || ''),
      altText: typeof coupon.altText === 'string' ? coupon.altText : String(coupon.altText || ''),
      imageUrl: typeof coupon.imageUrl === 'string' ? coupon.imageUrl : String(coupon.imageUrl || ''),
      slugStore: typeof coupon.slugStore === 'string' ? coupon.slugStore : String(coupon.slugStore || ''),
      isBestDiscount: coupon.isBestDiscount === true // Ensure this is boolean
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
};

const fetchBestOffers = async () => {
  try {
    const res = await fetch("https://api.eslamoffers.com/api/StoreOffers/GetBestDiscountOffers");
    if (!res.ok) throw new Error("Failed to fetch offers");
    const data = await res.json();
    
    return data.slice(0, 8).map(offer => ({
      ...offer,
      title: typeof offer.title === 'string' ? offer.title : String(offer.title || ''),
      description: typeof offer.description === 'string' ? offer.description : String(offer.description || ''),
      linkPage: typeof offer.linkPage === 'string' ? offer.linkPage : String(offer.linkPage || ''),
      altText: typeof offer.altText === 'string' ? offer.altText : String(offer.altText || ''),
      logoUrl: typeof offer.logoUrl === 'string' ? offer.logoUrl : String(offer.logoUrl || ''),
      slugStore: typeof offer.slugStore === 'string' ? offer.slugStore : String(offer.slugStore || '')
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
};

const BestDiscountsSlider = () => {
  const [discounts, setDiscounts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCoupon, setModalCoupon] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [discountsData, offersData] = await Promise.all([
          fetchBestDiscounts(),
          fetchBestOffers()
        ]);
        
        // Debugging: Log the fetched data
        console.log("Fetched discounts:", discountsData);
        console.log("Fetched offers:", offersData);
        
        setDiscounts(discountsData);
        setOffers(offersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Combine and shuffle discounts and offers
  const combinedItems = [...discounts, ...offers].sort(() => 0.5 - Math.random());

  const openModal = (coupon) => {
    setModalCoupon(coupon);
    setIsCopied(false);
  };
  
  const closeModal = () => {
    setModalCoupon(null);
    setIsCopied(false);
  };
  
  const handleCopy = () => {
    if (modalCoupon && modalCoupon.couponCode) {
      navigator.clipboard.writeText(modalCoupon.couponCode);
      setIsCopied(true);
      
      // Update last use in the backend
      fetch(`https://api.eslamoffers.com/api/Coupons/UpdateLastUse/${modalCoupon.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(err => console.error('Error updating last use:', err));
    }
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#14b8a6]">أفضل الخصومات</h2>
        <div className="flex gap-4">
          <Link
            href="/coupons"
            className="text-lg font-medium text-[#14b8a6] hover:text-teal-700 underline flex items-center gap-2"
          >
            <span>كل الخصومات</span>
            <FiArrowLeft />
          </Link>
        </div>
      </div>
      <div className="w-40 h-1 bg-gradient-to-l from-[#14b8a6] mt-2 mb-5 rounded-full"></div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-t-teal-500 border-r-transparent border-b-teal-300 border-l-transparent animate-spin"></div>
            <p className="mt-4 text-teal-600 font-medium">جاري تحميل العروض...</p>
          </div>
        </div>
      ) : (
        <>
          {discounts.length === 0 && offers.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              لا توجد عروض متاحة حالياً
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
              {combinedItems.map((item) => (
                <SwiperSlide 
                  key={item.id} 
                  className="my-2 !w-[140px] md:!w-[220px] lg:!w-[220px]"
                >
                  {item.couponCode ? (
                    <CouponCard 
                      coupon={item} 
                      onGetCode={openModal} 
                      showLastUsed={false}
                      showBadges={false}  
                    />
                  ) : (
                    <StoreOffersCard offer={item} />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </>
      )}
      
      {/* Modal for coupon code */}
      {modalCoupon && modalCoupon.couponCode && (
        <CouponCodeModal
          show={!!modalCoupon}
          couponCode={modalCoupon.couponCode}
          linkRealStore={modalCoupon.linkRealStore}
          isCopied={isCopied}
          onCopy={handleCopy}
          onClose={closeModal}
          imageSrc={modalCoupon.imageUrl?.startsWith('http') ? 
            modalCoupon.imageUrl : 
            `https://api.eslamoffers.com/uploads/${modalCoupon.imageUrl}`}
          couponTitle={modalCoupon.title}
          couponDescription={modalCoupon.descriptionCoupon}
          lastUseAt={modalCoupon.lastUseAt}
          altText={modalCoupon.altText}
          className="mx-4"
        />
      )}
    </div>
  );
};

export default BestDiscountsSlider;