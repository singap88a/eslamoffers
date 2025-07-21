"use client";
import Image from "next/image";
import { useState } from "react";
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

const sections = [
  {
    title: "أشهر المتاجر",
    items: [
      "كود خصم نون",
      "كود خصم نايك",
      "كود خصم شي إن",
      "كود خصم ماماز وباباز",
      "كود خصم علي إكسبرس",
      "كود خصم اي هيرب",
      "كود خصم دكتور نيوترشن",
    ],
  },
  {
    title: "عروض المناسبات",
    items: [
      "جميع المتاجر",
      "الاعياد والعطلات",
      "عروض الجمعة البيضاء",
      "عروض اليوم الوطني السعودي",
      "عيد الحب",
      "أفضل مواقع حجز الفنادق",
      "اضافة كود مكتشف الأكواد",
    ],
  },
  {
    title: "معلومات الموفر",
    items: [
      "عن الموفر",
      "اعلن مع الموفر",
      "تواصل معنا",
      "افصح المعلن",
      "الشروط والاحكام",
      "سياسة الخصوصية",
      "خريطة الموقع",
    ],
  },
];

export default function Footer() {
  const [openSection, setOpenSection] = useState(null);
  const handleToggle = (idx) => {
    setOpenSection(openSection === idx ? null : idx);
  };

  return (
    <footer className="bg-white border-t mt-10 text-gray-800 text-sm">
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
  {sections.map((section, idx) => (
    <div key={idx} className="w-full md:w-1/3">
      <button
        onClick={() => handleToggle(idx)}
        className="flex justify-between items-center w-full text-right font-bold text-base text-gray-800 hover:text-[#14b8a6] md:cursor-default md:pointer-events-none md:hover:text-gray-800"
      >
        {section.title}
        <FaChevronDown
          className={`transition-transform duration-300 md:hidden ${
            openSection === idx ? "rotate-180" : ""
          }`}
        />
      </button>
      <ul
        className={`overflow-hidden transition-all duration-300 text-gray-600 text-sm pl-4 space-y-1 mt-2   w-[150px]  
          ${openSection === idx ? "max-h-64" : "max-h-0"}
          md:max-h-full md:block`}
      >
        {section.items.map((item, i) => (
          <li
            key={i}
            className="hover:text-[#14b8a6] cursor-pointer transition duration-200"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>


        {/* Contact & Map */}
        <div className="space-y-4 text-right">
          <div className="flex justify-center md:justify-end">
            <Image
              src="/logo.png"
              alt="Map"
              width={150}
              height={150}
              className=""
              loading="lazy"
            />
          </div>
          <div className="flex items-center justify-end gap-2 text-gray-800 font-semibold">
            <FaMapMarkerAlt className="text-[#14b8a6]" />
            <a
              href="https://goo.gl/maps/2Qe4k8Qw1wQ2"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              ALMAS Tower, دبي، الإمارات
            </a>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-end items-center gap-2">
              <FaEnvelope className="text-[#14b8a6]" /> support@almowafir.com
            </div>
            <div className="flex justify-end items-center gap-2">
              <FaPhone className="text-[#14b8a6]" /> 971+ 582399141
            </div>
            <div className="flex justify-end items-center gap-2 relative group">
              <FaWhatsapp className="text-[#14b8a6] text-xl cursor-pointer" />
              <span className="absolute top-0 right-7 bg-white border px-2 py-1 rounded text-xs shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                تواصل على واتساب
              </span>
              971+ 582399141
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 py-3 border-t">
        جميع الحقوق محفوظة © الموفر 2024
      </div>
    </footer>
  );
}
