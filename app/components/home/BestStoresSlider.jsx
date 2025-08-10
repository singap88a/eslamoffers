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
    return data.filter(c => c.isBastDiscount).slice(0, 8);
  } catch (e) {
    console.error(e);
    return [];
  }
};

const fetchBestOffers = async () => {
  try {
    const res = await fetch("https://api.eslamoffers.com/api/StoreOffers/GetAllOffers");
    if (!res.ok) throw new Error("Failed to fetch offers");
    const data = await res.json();
    return data.slice(0, 8); // Get first 8 offers
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
      const [discountsData, offersData] = await Promise.all([
        fetchBestDiscounts(),
        fetchBestOffers()
      ]);
      
      setDiscounts(discountsData);
      setOffers(offersData);
      setLoading(false);
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
    if (modalCoupon) {
      navigator.clipboard.writeText(modalCoupon.couponCode);
      setIsCopied(true);
      
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
        <h2 className="text-2xl font-bold text-[#14b8a6]">أفضل العروض والخصومات</h2>
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
      
      {/* Modal will only show for coupon items */}
      {modalCoupon && modalCoupon.couponCode && (
        <CouponCodeModal
          show={!!modalCoupon}
          couponCode={modalCoupon?.couponCode || ""}
          linkRealStore={modalCoupon?.linkRealStore || ""}
          isCopied={isCopied}
          onCopy={handleCopy}
          onClose={closeModal}
          imageSrc={modalCoupon ? (modalCoupon.imageUrl?.startsWith('http') ? modalCoupon.imageUrl : `https://api.eslamoffers.com/uploads/${modalCoupon.imageUrl}`) : null}
          couponTitle={modalCoupon?.title || ""}
          couponDescription={modalCoupon?.descriptionCoupon || ""}
          lastUseAt={modalCoupon?.lastUseAt || null}
          className="mx-4"
        />
      )}
    </div>
  );
};

export default BestDiscountsSlider;