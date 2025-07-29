import { FaAngleDoubleLeft } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const animatedEmails = [
  { size: 60, className: "-rotate-12 animate-bounce", color: "text-yellow-400", style: "-top-5 right-0 z-10", animation: "animate-bounce" },
  // { size: 38, className: "rotate-6 animate-bounce-slow", color: "text-yellow-400", style: "top-16 right-32 z-20", animation: "animate-bounce-slow" },
  // { size: 28, className: "rotate-12 animate-bounce-delay", color: "text-yellow-400", style: "top-32 right-64 z-0", animation: "animate-bounce" },
];

// Custom animations (slow/delay)
// أضف هذه الكلاسات في tailwind.config إذا لم تكن موجودة
// animate-bounce-slow: animation-bounce مع مدة أطول
// animate-bounce-delay: animation-bounce مع تأخير

const SubscribeBox = () => {
  return (
    <div className="relative max-w-4xl mx-auto mt-8">
      {/* الخلفية المائلة */}
      <div className="absolute inset-0 -z-10 bg-teal-400 shadow-lg transform skew-y-8 rounded-md" />
      {/* أيقونات البريد المتحركة موزعة بشكل أبعد */}
      <div className="absolute right-0 top-2 w-full h-40 pointer-events-none select-none">
        {animatedEmails.map((icon, i) => (
          <span
            key={i}
            className={`absolute ${icon.color} ${icon.className} drop-shadow-lg ${icon.style}`}
            style={{ fontSize: icon.size }}
          >
            <MdEmail />
          </span>
        ))}
      </div>
      {/* المحتوى */}
      <div className="relative p-8 flex flex-col items-center text-right rtl">
        <h3 className="text-xl font-bold text-black mb-2">إشترك في قائمة البريدية</h3>
        <p className="text-base text-[#3d3b3ba6] mb-6">احصل على عروض وكوبونات حصرية مباشرة على بريدك الالكتروني</p>
        {/* حقل الإدخال */}
        <form className="w-full flex items-center justify-between bg-white rounded-full shadow-md px-4 py-2 gap-2 max-w-xl">
          <button type="submit" className="text-teal-400 text-2xl">
            <FaAngleDoubleLeft />
          </button>
          <input
            type="email"
            placeholder="ادخل بريدك الالكتروني"
            className="flex-1 bg-transparent outline-none text-right placeholder:text-gray-400 text-base pr-2 rtl"
            dir="rtl"
          />
        </form>
      </div>
    </div>
  );
};

export default SubscribeBox;
