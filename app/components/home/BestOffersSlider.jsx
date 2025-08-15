"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
 import { FiCopy, FiX, FiArrowLeft } from "react-icons/fi";
 import Link from "next/link";
import OfferCard from "../offers/OfferCard";
import OfferCodeModal from "../offers/OfferCodeModal";

const fetchBestOffers = async () => {
  try {
    const res = await fetch(
      "https://api.eslamoffers.com/api/Offers/GetBestOffers/best"
    );
    if (!res.ok) throw new Error("Failed to fetch offers");
    const data = await res.json();
    return data.filter((o) => o.isBast).slice(0, 6);
  } catch (e) {
    console.error(e);
    return [];
  }
};

const BestOffersSlider = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOffer, setModalOffer] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    fetchBestOffers().then((offers) => {
      setOffers(offers);
      setLoading(false);
    });
  }, []);

  const openModal = (offer) => {
    setModalOffer(offer);
    setIsCopied(false);
  };
  const closeModal = () => {
    setModalOffer(null);
    setIsCopied(false);
  };
  const handleCopy = () => {
    if (modalOffer) {
      navigator.clipboard.writeText(modalOffer.couponId);
      setIsCopied(true);
      
      // تحديث آخر استخدام للكود عند النسخ
      fetch(`https://api.eslamoffers.com/api/Offers/UpdateLastUse/${modalOffer.id}`, {
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
        <h2 className="text-2xl font-bold text-[#14b8a6]">أفضل العروض</h2>
        <Link
          href="/offers"
          className="text-lg font-medium text-[#14b8a6] hover:text-teal-700 underline flex items-center gap-2"
        >
          <span>كل العروض</span>
          <FiArrowLeft />
        </Link>
      </div>
      <div className="w-40 h-1 bg-gradient-to-l from-[#14b8a6] mt-2 mb-5 rounded-full"></div>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-t-teal-500 border-r-transparent border-b-teal-300 border-l-transparent animate-spin"></div>
            <p className="mt-4 text-teal-600 font-medium">جاري تحميل أفضل العروض...</p>
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
          {offers.map((offer) => (
            <SwiperSlide
              key={offer.id}
              className="my-2 !w-[300px] md:!w-[320px] lg:!w-[320px]"
            >
              <OfferCard offer={offer} onGetCode={openModal} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {/* مودال مركزي */}
      <OfferCodeModal
        show={!!modalOffer}
        offerCode={modalOffer?.couponId || ""}
        linkPage={modalOffer?.linkPage || ""}
        isCopied={isCopied}
        onCopy={handleCopy}
        onClose={closeModal}
        imageSrc={modalOffer ? (modalOffer.logoUrl?.startsWith('http') ? modalOffer.logoUrl : `https://api.eslamoffers.com/uploads/${modalOffer.logoUrl}`) : null}
        offerTitle={modalOffer?.title || ""}
        offerDescription={modalOffer?.description || ""}
        lastUseAt={modalOffer?.lastUseAt || null}
        price={modalOffer?.price || null}
        discount={modalOffer?.discount || null}
        currencyCodes={modalOffer?.currencyCodes || "USD"}
      />
    </div>
  );
};

export default BestOffersSlider;