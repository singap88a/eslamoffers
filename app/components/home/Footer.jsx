"use client";
import Image from "next/image";
import Link from "next/link";
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
} from "react-icons/fa";

const Footer = () => {
  const [popularStores, setPopularStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularStores = async () => {
      try {
        const response = await fetch(
          "https://api.eslamoffers.com/api/Store/GetBastStores/Bast"
        );
        const data = await response.json();
        setPopularStores(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching popular stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularStores();
  }, []);

  const siteInfoLinks = [
    { title: "عن إسلام أوفرز", path: "/about" },
    { title: "تواصل معنا", path: "/contact" },
    { title: "الأسئلة الشائعة", path: "/faq" },
    { title: "الشروط والاحكام", path: "/terms" },
    { title: "سياسة الخصوصية", path: "/privacy" },
    { title: "خريطة الموقع", path: "/sitemap" },
  ];

  return (
    <footer className="bg-white border-t border-[#0000003b] mt-10 text-gray-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {/* Social & App */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold"> وفر أكتر… بكل سهولة!</h4>
            <p className="text-gray-500">
              تابعنا على مواقع التواصل عشان توصلك أحدث التخفيضات والكوبونات أول
              بأول
            </p>
            <div className="flex flex-wrap gap-3 text-xl">
              {[
                {
                  Icon: FaFacebook,
                  color: "#1877F2",
                  href: "https://www.facebook.com/Eslam.offers",
                },
                {
                  Icon: FaInstagram,
                  color: "#E4405F",
                  href: "https://www.instagram.com/eslam.offers",
                },
                {
                  Icon: FaTwitter,
                  color: "#1DA1F2",
                  href: "https://x.com/Eslam_offers",
                },
                {
                  Icon: FaTiktok,
                  color: "#000000",
                  href: "https://www.tiktok.com/@eslam.offers",
                },
                {
                  Icon: FaTelegram,
                  color: "#0088cc",
                  href: "https://t.me/Saudi_offerss",
                },
                {
                  Icon: FaYoutube,
                  color: "#FF0000",
                  href: "https://youtube.com/@eslamoffers",
                },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="transition-transform duration-200 hover:scale-110"
                  style={{ color: item.color }}
                >
                  <item.Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            {/* Popular Stores */}
            <div className="w-1/2">
              <h4 className="text-right font-bold text-base text-gray-800 mb-2">
                أشهر المتاجر
              </h4>
              <ul className="text-gray-600 text-sm space-y-1">
                {loading ? (
                  <li>جاري التحميل...</li>
                ) : (
                  popularStores.map((store, i) => (
                    <li key={i} className="text-right">
                      <Link
                        href={`/stores/${store.slug}`}
                        className="hover:text-[#14b8a6] transition duration-200 block"
                      >
                        {store.name}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Site Info */}
            <div className="w-1/2">
              <h4 className="text-right font-bold text-base text-gray-800 mb-2">
                معلومات الموقع
              </h4>
              <ul className="text-gray-600 text-sm space-y-1">
                {siteInfoLinks.map((link, i) => (
                  <li key={i} className="text-right">
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
            <div className="flex justify-end">
              <Image
                src="/logo4.png"
                alt="إسلام أوفرز"
                width={150}
                height={150}
                loading="lazy"
              />
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-end items-center gap-2">
                <FaEnvelope className="text-[#14b8a6]" />{" "}
                support@eslamoffers.com
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-8">
          {/* Popular Stores */}
          <div>
            <h4 className="text-right font-bold text-base text-gray-800 mb-2">
              أشهر المتاجر
            </h4>
            <ul className="text-gray-600 text-sm space-y-1">
              {loading ? (
                <li>جاري التحميل...</li>
              ) : (
                popularStores.map((store, i) => (
                  <li key={i} className="text-right">
                    <Link
                      href={`/stores/${store.slug}`}
                      className="hover:text-[#14b8a6] transition duration-200 block"
                    >
                      {store.name}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Site Info */}
          <div>
            <h4 className="text-right font-bold text-base text-gray-800 mb-2">
              معلومات الموقع
            </h4>
            <ul className="text-gray-600 text-sm space-y-1">
              {siteInfoLinks.map((link, i) => (
                <li key={i} className="text-right">
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

          {/* Social & Email & Logo */}
          <div className="flex   justify-between items-center space-y-4 mt-6">
            <div className="">
              <h4 className="text-lg font-bold"> وفر أكتر… بكل سهولة!</h4>
              <p className="text-gray-500  ">
                تابعنا على مواقع التواصل عشان توصلك أحدث التخفيضات والكوبونات
                أول بأول
              </p>
              <div className="flex flex-wrap   gap-3 text-xl py-2">
                {[
                  {
                    Icon: FaFacebook,
                    color: "#1877F2",
                    href: "https://www.facebook.com/Eslam.offers",
                  },
                  {
                    Icon: FaInstagram,
                    color: "#E4405F",
                    href: "https://www.instagram.com/eslam.offers",
                  },
                  {
                    Icon: FaTwitter,
                    color: "#1DA1F2",
                    href: "https://x.com/Eslam_offers",
                  },
                  {
                    Icon: FaTiktok,
                    color: "#000000",
                    href: "https://www.tiktok.com/@eslam.offers",
                  },
                  {
                    Icon: FaTelegram,
                    color: "#0088cc",
                    href: "https://t.me/Saudi_offerss",
                  },
                  {
                    Icon: FaYoutube,
                    color: "#FF0000",
                    href: "https://youtube.com/@eslamoffers",
                  },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    className="transition-transform duration-200 hover:scale-110"
                    style={{ color: item.color }}
                  >
                    <item.Icon />
                  </a>
                ))}
              </div>
              {/* Email under social icons */}
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-[#14b8a6]" />{" "}
                support@eslamoffers.com
              </div>
            </div>

            {/* Logo */}
            <div className="">
              <Image
                src="/logo4.png"
                alt="إسلام أوفرز"
                width={200}
                height={150}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

<div className="text-center text-xs text-gray-400 py-3 border-t">
  جميع الحقوق محفوظة © EslamOffers.com 2025  
  {/* <a 
    href="https://ahmed-singap.netlify.app/" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-[#14b8a6] hover:underline ml-1 px-1 font-bold"
  >
     Ahmed Singap
  </a> */}
</div>

    </footer>
  );
};

export default Footer;
