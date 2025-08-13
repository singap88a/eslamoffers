"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import CouponCard from "../../coupons/CouponCard";
 import { FiCopy, FiX, FiArrowLeft } from "react-icons/fi";
import CouponCodeModal from "./CouponCodeModal";
import Link from "next/link";
import StoreOffersCard from "../../StoreOffers/StoreOffersCard";

const fetchBestCoupons = async () => {
  try {
    const res = await fetch(
      "https://api.eslamoffers.com/api/Coupons/GetBestCoupons/Best"
    );
    if (!res.ok) throw new Error("Failed to fetch coupons");
    const data = await res.json();
    
    if (Array.isArray(data)) {
      return data.filter((c) => c && c.isActive).slice(0, 6);
    } else {
      console.warn('Coupons data is not an array:', data);
      return [];
    }
  } catch (e) {
    console.error('Error fetching coupons:', e);
    return [];
  }
};

const fetchStoreOffers = async () => {
  try {
    const res = await fetch(
      "https://api.eslamoffers.com/api/StoreOffers/GetTheBestOffers"
    );
    if (!res.ok) throw new Error("Failed to fetch store offers");
    const data = await res.json();
    
    if (Array.isArray(data)) {
      return data.slice(0, 6); // Get first 6 offers
    } else {
      console.warn('Store offers data is not an array:', data);
      return [];
    }
  } catch (e) {
    console.error('Error fetching store offers:', e);
    return [];
  }
};

const CombinedSlider = () => {
  const [coupons, setCoupons] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCoupon, setModalCoupon] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [couponsData, offersData] = await Promise.all([
        fetchBestCoupons(),
        fetchStoreOffers()
      ]);
      
      setCoupons(couponsData);
      setOffers(offersData);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  // Combine coupons and offers for display
  const combinedItems = [...coupons, ...offers].sort(() => 0.5 - Math.random());

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
    <div className="">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#14b8a6]"> افضل الكوبونات</h2>
        <div className="flex gap-4">
          <Link
            href="/coupons"
            className="text-lg font-medium text-[#14b8a6] hover:text-teal-700 underline flex items-center gap-2"
          >
            <span>كل الكوبونات</span>
            <FiArrowLeft />
          </Link>
 
        </div>
      </div>
      <div className="w-40 h-1 bg-gradient-to-l from-[#14b8a6] mt-2 mb-5 rounded-full"></div>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-t-teal-500 border-r-transparent border-b-teal-300 border-l-transparent animate-spin"></div>
            <p className="mt-4 text-teal-600 font-medium">جاري تحميل العروض والكوبونات...</p>
          </div>
        </div>
      ) : (
        <Swiper
          spaceBetween={16}
          slidesPerView="auto"
          breakpoints={{
            640: { slidesPerView: "auto" },
            1024: { slidesPerView: "auto" },
          }}
          loop
        >
          {combinedItems.map((item) => (
            <SwiperSlide
              key={item.id}
              className="my-2 !w-[140px] md:!w-[220px] lg:!w-[220px]"
            >
              <div className="h-full">
                {item.couponCode ? (
                  // Render CouponCard if it has couponCode
                  <CouponCard 
                    coupon={item} 
                    onGetCode={openModal} 
                    showLastUsed={false} 
                  />
                ) : (
                  // Render OfferCard for store offers
                  <StoreOffersCard offer={item} />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      
      {/* Modal for coupons (won't show for offers) */}
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
          couponDescription={modalCoupon?.description || ""}
          altText={modalCoupon?.altText || ""}
          className="mx-4"
        />
      )}
    </div>
  );
};

export default CombinedSlider;