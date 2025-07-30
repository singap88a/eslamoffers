"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaPinterest,
  FaTelegram,
  FaYoutube,
  FaGooglePlay,
  FaApple,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaChevronDown,
} from "react-icons/fa";

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);
  const [popularStores, setPopularStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularStores = async () => {
      try {
        const response = await fetch(
          "https://api.eslamoffers.com/api/Store/GetBastStores/Bast"
        );
        const data = await response.json();
        setPopularStores(data.slice(0, 7)); // عرض أول 7 متاجر فقط
      } catch (error) {
        console.error("Error fetching popular stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularStores();
  }, []);

  const handleToggle = (idx) => {
    setOpenSection(openSection === idx ? null : idx);
  };

  const siteInfoLinks = [
    { title: "عن إسلام أوفرز", path: "/about" },
    { title: "تواصل معنا", path: "/contact" },
    { title: "الأسئلة الشائعة", path: "/faq" },
    { title: "الشروط والاحكام", path: "/terms" },
    { title: "سياسة الخصوصية", path: "/privacy" },
  ];

  return (
    <footer className="bg-white border-t border-[#0000003b] mt-10 text-gray-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Social & App */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold">لا تفوت أي عرض أبدًا!</h4>
          <p className="text-gray-500">
            تابعنا على مواقع التواصل الاجتماعي، واحصل على أفضل الكوبونات والعروض
          </p>
          <div className="flex flex-wrap gap-3 text-xl text-gray-600">
            {[FaFacebook, FaInstagram, FaTwitter, FaTiktok, FaPinterest, FaTelegram, FaYoutube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="hover:text-[#14b8a6] transition-transform duration-200 hover:scale-110"
              >
                <Icon />
              </a>
            ))}
          </div>
          <h5 className="font-semibold mt-6">حمل التطبيق الآن</h5>
          <div className="flex flex-wrap gap-3">
            <a
              href="#"
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm shadow hover:shadow-md transition"
            >
              <FaGooglePlay /> Google Play
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm shadow hover:shadow-md transition"
            >
              <FaApple /> App Store
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-6 md:space-y-0 md:flex md:gap-8">
          {/* Popular Stores */}
          <div className="w-full md:w-1/3">
            <button
              onClick={() => handleToggle(0)}
              className="flex justify-between items-center w-full text-right font-bold text-base text-gray-800 hover:text-[#14b8a6] md:cursor-default md:pointer-events-none md:hover:text-gray-800"
            >
              أشهر المتاجر
              <FaChevronDown
                className={`transition-transform duration-300 md:hidden ${
                  openSection === 0 ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`overflow-hidden transition-all duration-300 text-gray-600 text-sm pl-4 space-y-1 mt-2 w-[150px] ${
                openSection === 0 ? "max-h-64" : "max-h-0"
              } md:max-h-full md:block`}
            >
              {loading ? (
                <li>جاري التحميل...</li>
              ) : (
                popularStores.map((store, i) => (
                  <li key={i}>
                    <a
                      href={`/store/${store.id}`} // يمكنك تغيير الرابط حسب احتياجاتك
                      className="hover:text-[#14b8a6] transition duration-200 block"
                    >
                      {store.name}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Site Info */}
          <div className="w-full md:w-1/3">
            <button
              onClick={() => handleToggle(1)}
              className="flex justify-between items-center w-full text-right font-bold text-base text-gray-800 hover:text-[#14b8a6] md:cursor-default md:pointer-events-none md:hover:text-gray-800"
            >
              معلومات الموقع
              <FaChevronDown
                className={`transition-transform duration-300 md:hidden ${
                  openSection === 1 ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`overflow-hidden transition-all duration-300 text-gray-600 text-sm pl-4 space-y-1 mt-2 w-[150px] ${
                openSection === 1 ? "max-h-64" : "max-h-0"
              } md:max-h-full md:block`}
            >
              {siteInfoLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.path}
                    className="hover:text-[#14b8a6] transition duration-200 block"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact & Logo */}
        <div className="space-y-4 text-right">
          <div className="flex justify-center md:justify-end">
            <Image
              src="/logo4.png"
              alt="إسلام أوفرز"
              width={150}
              height={150}
              className=""
              loading="lazy"
            />
          </div>
 
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-end items-center gap-2">
              <FaEnvelope className="text-[#14b8a6]" /> support@eslamoffers.com
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 py-3 border-t">
        جميع الحقوق محفوظة © إسلام أوفرز 2025
      </div>
    </footer>
  );
};

export default Footer;