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
    const res = await fetch("http://147.93.126.19:8080/api/Coupons/GetAllCoupons");
    if (!res.ok) throw new Error("Failed to fetch coupons");
    const data = await res.json();
    // أفضل الكوبونات: نشطة فقط، وأول 6
    return data.filter(c => c.isActive).slice(0, 6);
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
    fetchBestCoupons().then(coups => {
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
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#14b8a6]">
          أقوى الأكواد الصيفية
        </h2>
        <Link href="/coupons" className="text-lg font-medium text-[#14b8a6] hover:text-teal-700 underline flex items-center gap-2">
          <span>كل الكوبونات</span>
          <FiArrowLeft />
        </Link>
      </div>
      <div className="w-40 h-1 bg-gradient-to-l from-[#14b8a6] mt-2 mb-5 rounded-full"></div>
      {loading ? (
        <div className="text-center py-10 text-gray-400">جاري التحميل...</div>
      ) : (
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          loop
        >
          {coupons.map((coupon) => (
            <SwiperSlide key={coupon.id}           className="my-2"
>
              <CouponCard coupon={coupon} onGetCode={openModal} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {/* مودال مركزي */}
      <CouponCodeModal
        show={!!modalCoupon}
        couponCode={modalCoupon?.couponCode || ''}
        linkRealStore={modalCoupon?.linkRealStore || ''}
        isCopied={isCopied}
        onCopy={handleCopy}
        onClose={closeModal}
      />
    </div>
  );
};

export default CouponSlider;
