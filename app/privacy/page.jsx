'use client';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8   duration-300 animate-fade-in">
        <h1 className="text-4xl font-bold text-center text-teal-600 mb-12 animate-fade-in-up">سياسة الخصوصية – Eslamoffers.com</h1>
        
        <div className="text-right text-gray-700 space-y-8">
          <p className="text-lg mb-8 animate-fade-in-up delay-100">
            نحن في Eslamoffers.com نهتم بخصوصية زوارنا، ونوضح هنا كيف يتم جمع واستخدام المعلومات عند زيارتك لموقعنا.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* جمع المعلومات */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up delay-100">
              <h2 className="text-2xl font-semibold text-teal-700 mb-4">1. جمع المعلومات</h2>
              <ul className="space-y-3 text-gray-600">
                <li>• لا نطلب منك إنشاء حساب أو تسجيل دخول لاستخدام الموقع.</li>
                <li>• قد نقوم بجمع البريد الإلكتروني فقط في حالة الاشتراك في القائمة البريدية الخاصة بنا.</li>
                <li>• لا نقوم بجمع أي بيانات شخصية أخرى بدون إذنك.</li>
              </ul>
            </div>

            {/* استخدام المعلومات */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up delay-100">
              <h2 className="text-2xl font-semibold text-teal-700 mb-4">2. استخدام المعلومات</h2>
              <ul className="space-y-3 text-gray-600">
                <li>• نستخدم البريد الإلكتروني لإرسال النشرة البريدية فقط.</li>
                <li>• لن نقوم ببيع أو مشاركة بريدك الإلكتروني مع أي طرف ثالث.</li>
              </ul>
            </div>

            {/* ملفات تعريف الارتباط */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up delay-200">
              <h2 className="text-2xl font-semibold text-teal-700 mb-4">3. ملفات تعريف الارتباط</h2>
              <ul className="space-y-3 text-gray-600">
                <li>• قد يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة الاستخدام.</li>
                <li>• يمكنك إيقاف ملفات تعريف الارتباط من إعدادات المتصفح.</li>
              </ul>
            </div>

            {/* روابط الطرف الثالث */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up delay-200">
              <h2 className="text-2xl font-semibold text-teal-700 mb-4">4. روابط الطرف الثالث</h2>
              <ul className="space-y-3 text-gray-600">
                <li>• يحتوي الموقع على روابط تابعة لمواقع تسوّق إلكترونية.</li>
                <li>• قد نحصل على عمولة عند الشراء، دون أي تكلفة إضافية عليك.</li>
              </ul>
            </div>

            {/* حماية البيانات */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up delay-200">
              <h2 className="text-2xl font-semibold text-teal-700 mb-4">5. حماية البيانات</h2>
              <p className="text-gray-600">
                نحن ملتزمون بحماية معلوماتك وعدم استخدامها في أي شيء غير ما تم توضيحه في هذه السياسة.
              </p>
            </div>

            {/* التعديلات */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up delay-200">
              <h2 className="text-2xl font-semibold text-teal-700 mb-4">6. التعديلات</h2>
              <p className="text-gray-600">
                قد نقوم بتحديث هذه السياسة من وقت لآخر، وسيتم نشر أي تعديل هنا على نفس الصفحة.
              </p>
            </div>
          </div>

          {/* تواصل معنا */}
          <div className="mt-12 text-center animate-fade-in-up delay-200">
            <h2 className="text-2xl font-semibold text-teal-700 mb-4">7. تواصل معنا</h2>
            <p className="text-gray-600">
              لو عندك أي استفسار بخصوص سياسة الخصوصية، يمكنك التواصل معنا من خلال{' '}
              <a href="/contact" className="text-teal-600 hover:text-teal-700 underline transition-colors duration-300">
                صفحة تواصل معنا
              </a>
              {' '}على الموقع.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}