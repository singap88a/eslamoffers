"use client";
import React, { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";

export default function ContactPage() {
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    let timer;
    if (submitStatus === 'success') {
      timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 3000); // الرسالة ستختفي بعد 3 ثوانٍ
    }
    return () => clearTimeout(timer);
  }, [submitStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://api.eslamoffers.com/api/Feedback/AddMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        setSubmitStatus('success');
        setFormData({
          name: "",
          email: "",
          country: "",
          message: ""
        });
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-50 py-16 px-4 flex items-center justify-center overflow-hidden relative"
    >
      {/* خلفيات زخرفية */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-300 opacity-20 rounded-full blur-3xl z-0" />
      <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] bg-teal-400 opacity-10 rounded-full blur-3xl z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-4xl bg-teal-50 opacity-30 rounded-full blur-2xl z-0" />

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row bg-white/80 backdrop-blur-xl rounded-3xl border border-teal-100 shadow-2xl overflow-hidden">
        {/* يمين: معلومات التواصل بالأعلى، الخريطة بالأسفل */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between border-r border-teal-100 bg-gradient-to-b from-white via-teal-50 to-white p-0">
          {/* معلومات التواصل */}
          <div className="p-6 md:p-8 space-y-6 border-b border-teal-100">
            <h2 className="text-2xl font-bold text-teal-700 text-center mb-2">
              معلومات التواصل
            </h2>
            <div className="w-40 h-1 bg-gradient-to-r from-[#14b8a6] mx-auto mb-10 rounded-full"></div>

            {[
              {
                icon: <FaEnvelope />,
                title: "البريد الإلكتروني",
                value: "support@eslamoffers.com",
                link: "support@eslamoffers.com",
              },
 
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-white border border-teal-100 rounded-xl shadow-sm"
              >
                <div className="text-2xl text-white bg-teal-500 rounded-full p-3 shadow-lg">
                  {item.icon}
                </div>
                <div>
                  <div className="font-bold text-teal-700">{item.title}</div>
                  {item.link ? (
                    <a
                      href={item.link}
                      className="text-teal-600 hover:underline text-sm"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <div className="text-gray-600 text-sm">{item.value}</div>
                  )}
                </div>
              </div>
            ))}
            {/* السوشيال ميديا */}
            <div className="flex justify-center gap-4 text-2xl mt-3">
              <a
                href="https://www.facebook.com/Eslam.offers"
                className="text-gray-400 hover:text-teal-500 transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://x.com/Eslam_offers"
                className="text-gray-400 hover:text-teal-500 transition"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.instagram.com/eslam.offers"
                className="text-gray-400 hover:text-teal-500 transition"
              >
                <FaInstagram />
              </a>
            </div>
                      <div className="p-4 pb-6 flex-1 flex items-end">
            <div className="w-full h-56 md:h-64 rounded-2xl overflow-hidden border border-teal-200 shadow-md">
              <iframe
                title="خريطة الموقع"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.3837321235346!2d31.23571181511469!3d30.033333981884797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840cfcdbba165%3A0xb4d1bb2d0cc57b2c!2z2YXYsdmD2LIg2KfZhNiq2KfYsdmK2Kkg2YTZhNin2YTYqSDYp9mE2KPYs9mK2Kkg2YTZhNiv2YbYtNin2YQ!5e0!3m2!1sar!2seg!4v1710940591135!5m2!1sar!2seg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          </div>
          {/* الخريطة */}

        </div>

        {/* يسار: الفرم */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-12 bg-white/90">
          <h2 className="text-3xl md:text-4xl font-extrabold text-teal-700 mb-2 text-center tracking-tight">
            راسلنا الآن
          </h2>
          <div className="w-40 h-1 bg-gradient-to-r from-[#14b8a6] mx-auto mb-2 rounded-full"></div>

          <p className="text-gray-500 text-center mb-8 text-lg">
            املأ النموذج وسنرد عليك في أقرب وقت ممكن.
          </p>
          
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl text-center animate-fade-in">
              تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-center">
              حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.
            </div>
          )}

          <form className="space-y-7 max-w-md" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 font-semibold text-gray-700 text-right">
                الاسم
              </label>
              <input
                type="text"
                name="name"
                placeholder="اسمك الكامل"
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-lg shadow-sm"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700 text-right">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@email.com"
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-lg shadow-sm"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700 text-right">
                الدولة
              </label>
              <input
                type="text"
                name="country"
                placeholder="دولتك"
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-lg shadow-sm"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700 text-right">
                رسالتك
              </label>
              <textarea
                rows={5}
                name="message"
                placeholder="اكتب رسالتك هنا..."
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-lg shadow-sm"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg text-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
            </button>
          </form>
        </div>
      </div>

      {/* زر واتساب عائم */}
 

      {/* أنيميشن مبسطة */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
    </div>
  );
}