import Image from "next/image";
import React from "react";

const PromoCard = () => {
  return (
    <div className="bg-white border rounded-2xl p-4 shadow-lg max-w-md mx-auto mt-4" dir="rtl">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">تسوّق كالمحترفين</h2>
      <div className="h-1 w-24 bg-teal-400 mx-auto mb-4 rounded-full" />
      {/* App Promotion Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
        <div className="flex-1 flex flex-col items-center md:items-start">
          <h3 className="text-xl font-bold text-gray-800 mb-1 text-center md:text-right">احصل على تطبيق الموفر!</h3>
          <p className="text-sm text-gray-600 mb-3 text-center md:text-right">
            تقدم في المراحل واكسب الوحدات<br />- استبدل وحدات الموفر بقسائم شرائية مجانية!
          </p>
          <div className="flex gap-2 justify-center md:justify-start">
            <Image src="/abel.png" alt="App Store" width={112} height={40} className="w-28 h-10 object-contain rounded" />
            <Image src="/googel.png" alt="Google Play" width={112} height={40} className="w-28 h-10 object-contain rounded" />
          </div>
        </div>
        <div className="flex-1 flex justify-center md:justify-end">
          {/* Placeholder for phone image */}
          <Image src="/hero.svg" alt="Phone" width={128} height={128} className="w-32 h-32 object-contain" />
        </div>
      </div>
      {/* Divider */}
      <div className="border-t border-gray-200 my-4" />
      {/* Gift Section */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 flex justify-center md:justify-start">
          {/* Placeholder for robot and gift image */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <Image src="/window.svg" alt="Robot" width={128} height={128} className="w-16 h-16 absolute left-0 top-4" />
            <Image src="/file.svg" alt="Gift" width={128} height={128} className="w-12 h-12 absolute right-0 top-0" />
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start">
          <h3 className="text-xl font-bold text-gray-800 mb-1 text-center md:text-right">اكتشف اروع الهدايا مع صياد الهدايا</h3>
          <p className="text-sm text-gray-600 mb-3 text-center md:text-right">
            اكتشف قوة الذكاء الاصطناعي مع هذا البوت الذي تم تصميمه خصيصاً ليجد الهدية المثالية !
          </p>
          <button className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-8 rounded-full text-lg transition-colors duration-200">
            جربه الآن
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoCard; 