"use client";
import React, { useState } from 'react';

const faqs = [
  {
    question: 'ما هي كوبونات الخصم وكيفية استخدامها؟',
    answer: 'كوبونات الخصم هي رموز عبارة عن سلسلة أحرف وأرقام تمنحك نسبة خصم أو مبلغ ثابت عند الشراء من المتجر الإلكتروني. لاستخدامها، قم بنسخ رمز الكوبون من موقع EslamOffers، ثم ألصقه في خانة “رمز الخصم” أو “Coupon Code” عند إتمام الدفع في موقع المتجر. تأكد من أن الكوبون صالح وتحقق من شروطه (مثل حد أدنى للشراء أو تاريخ انتهاء الصلاحية).'
  },
  {
    question: 'كيف أجد كوبون خصم صالح لمتجري المفضل؟',
    answer: 'انتقل إلى صفحة المتجر داخل EslamOffers (مثلاً: صفحة “نون”). استخدم مربع البحث داخليًا لكتابة اسم المتجر أو الفئة. استعرض قائمة الكوبونات المتوفرة مع مراجع واضحة لمدى صلاحيتها وشروط الاستخدام. اختر الكوبون الأنسب واضغط “عرض الكوبون” لنسخه أو الانتقال إلى المتجر.'
  },
  {
    question: 'كيف أستخدم كوبون خصم “نون” على منصة نون السعودية؟',
    answer: 'على صفحة “خصم نون” في EslamOffers، اضغط “اعرض الكوبون”. سينقلك الموقع إلى نون مع نسخ الكود تلقائيًا. عند اختيار المنتجات وإتمام طلب الشراء، ألصق الكود في خانة “إدخال كود الخصم”. اضغط “تطبيق” لترى قيمة الخصم تنعكس في المجموع النهائي.'
  },
  {
    question: 'لماذا لا يعمل رمز الخصم لديّ؟',
    answer: 'هناك عدة أسباب محتملة: انتهاء صلاحية الكوبون، شروط الحد الأدنى، استثناءات على المنتجات، أو استخدام متكرر. تحقق من الشروط المدونة بجانب الكوبون.'
  },
  {
    question: 'كيف يتم تحديث الكوبونات على EslamOffers؟',
    answer: 'نقوم بمراجعة يومية للعروض من المتاجر العالمية والمحلية. عند إصدار كوبونات جديدة أو انتهاء صلاحية القديمة، يتم تحديث قاعدة البيانات تلقائيًا. يمكنك أيضًا تفعيل إشعاراتنا لتصلك أحدث الكوبونات فور نشرها.'
  },
  {
    question: 'هل يمكنني استخدام أكثر من كوبون في نفس الطلب؟',
    answer: 'معظم المتاجر الإلكترونية تسمح باستخدام كوبون واحد لكل عملية شراء. إذا كان لديك أكثر من كوبون، ننصح باختيار الأكثر قيمة أو قراءة شروط كل كوبون.'
  },
  {
    question: 'هل كوبونات EslamOffers صالحة لجميع المتاجر المحلية والعالمية؟',
    answer: 'نحن نعرض كوبونات لمجموعة واسعة من المتاجر العالمية مثل أمازون ونون وسوق.كوم، وكذلك لمتاجر محلية سعودية ومصرية. صفحة كل متجر توضّح نطاق صلاحية الكوبون وشروطه بالتفصيل.'
  },
  {
    question: 'كيف أحصل على إشعار عند إضافة كوبونات جديدة أو عروض محدودة؟',
    answer: 'قم بالتسجيل في نشرتنا البريدية من خلال الضغط على “اشترك بالقائمة البريدية”. فعّل إشعارات المتصفح عند ظهور النافذة المنبثقة. تابع صفحاتنا على وسائل التواصل الاجتماعي (إنستاجرام، إكس) للحصول على التحديثات الفورية.'
  },
  {
    question: 'ما هي مدة صلاحية الكوبونات عادةً؟',
    answer: 'تختلف المدة حسب سياسة كل متجر؛ قد تكون صلاحية الكوبون من يوم واحد حتى شهر كامل. يظهر دائمًا تاريخ انتهاء الصلاحية ضمن تفاصيل الكوبون على EslamOffers. يُفضّل استخدام الكوبون فورًا بعد نسخه لضمان الاستفادة قبل انتهائه.'
  },
  {
    question: 'كيف أتواصل في حال واجهت مشكلة في استخدام الكوبون؟',
    answer: 'يرجى التواصل معنا عبر: نموذج الاتصال في صفحة “اتصل بنا” على الموقع. البريد الإلكتروني : Eslamoffers@gmail.com الرسائل المباشرة على حسابنا في إنستاجرام: @EslamOffers سنرد عليك خلال 24 ساعة مع حلٍّ شامل لمشكلتك.'
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4" dir="rtl">
      <h1 className="text-4xl font-bold mb-4 text-center" style={{ color: '#14b8a6' }}>الأسئلة الشائعة</h1>
            <div className="w-40 h-1 bg-gradient-to-r from-[#14b8a6]    mx-auto mb-5 rounded-full"></div>

      <p className="mb-10 text-center text-gray-600 text-lg">كل ما تحتاج معرفته عن كوبونات الخصم واستخدامها على EslamOffers</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-2xl border-2 border-teal-200 shadow-md hover:shadow-2xl hover:border-teal-400 hover:scale-105 hover:bg-teal-50 transition-all duration-300 ease-in-out overflow-hidden">
            <button
              className="w-full flex justify-between items-center px-6 py-5 text-right focus:outline-none focus:bg-gray-50 transition group"
              onClick={() => toggleFAQ(idx)}
            >
              <span className="font-semibold text-xl text-right flex-1 group-hover:underline text-gray-900">{faq.question}</span>
              <svg
                className={`w-6 h-6 ml-2 transform transition-transform duration-200 ${openIndex === idx ? 'rotate-180' : ''}`}
                fill="none"
                stroke="#14b8a6"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === idx && (
              <div className="px-6 pb-5 text-gray-700 animate-fadeIn text-base leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
