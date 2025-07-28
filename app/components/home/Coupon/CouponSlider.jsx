"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import CouponCard from "../../coupons/CouponCard";
import { FiCopy, FiX, FiArrowLeft } from "react-icons/fi";
import CouponCodeModal from "./CouponCodeModal";
import Link from "next/link";

const fetchBestCoupons = async () => {
  try {
    const res = await fetch(
      "https://api.eslamoffers.com/api/Coupons/GetAllCoupons"
    );
    if (!res.ok) throw new Error("Failed to fetch coupons");
    const data = await res.json();
    // أفضل الكوبونات: نشطة فقط، وأول 6
    return data.filter((c) => c.isActive).slice(0, 6);
  } catch (e) {
    return [];
  }
};

const CouponSlider = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCoupon, setModalCoupon] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    fetchBestCoupons().then((coups) => {
      setCoupons(coups);
      setLoading(false);
    });
  }, []);

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
      
      // تحديث آخر استخدام للكود عند النسخ
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
        <h2 className="text-2xl font-bold text-[#14b8a6]">أقوى الأكواد</h2>
        <Link
          href="/coupons"
          className="text-lg font-medium text-[#14b8a6] hover:text-teal-700 underline flex items-center gap-2"
        >
          <span>كل الكوبونات</span>
          <FiArrowLeft />
        </Link>
      </div>
      <div className="w-40 h-1 bg-gradient-to-l from-[#14b8a6] mt-2 mb-5 rounded-full"></div>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-t-teal-500 border-r-transparent border-b-teal-300 border-l-transparent animate-spin"></div>
            <p className="mt-4 text-teal-600 font-medium">جاري تحميل أفضل الكوبونات...</p>
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
          {coupons.map((coupon) => (
            <SwiperSlide
              key={coupon.id}
              className="my-2 !w-[220px] md:!w-[220px] lg:!w-[220px]"
            >
              <CouponCard coupon={coupon} onGetCode={openModal} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {/* مودال مركزي */}
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
        lastUseAt={modalCoupon?.lastUseAt || null}
         className="mx-4"
      />
    </div>
  );
};

export default CouponSlider;
