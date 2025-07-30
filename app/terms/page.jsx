'use client';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden   duration-300">
        <div className="p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-teal-600 mb-12 animate-fade-in">
            الشروط والأحكام
          </h1>
          
          <div className="space-y-8 text-right">
            <div className="text-2xl font-semibold text-teal-600 text-center mb-6 animate-fade-in-up">
              الشروط والأحكام لموقع Eslamoffers.com
            </div>
            
            <p className="text-gray-700 text-xl mb-8 text-center leading-relaxed animate-fade-in-up delay-100">
              مرحبًا بك في موقع Eslamoffers.com
              <br />
              <span className="text-teal-500">(الموقع المتخصص في تقديم كوبونات الخصم والعروض)</span>
            </p>
            
            <p className="text-gray-600 mb-12 text-lg leading-loose animate-fade-in-up delay-200">
              يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدامك للموقع. باستخدامك للموقع، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق، يُرجى عدم استخدام الموقع.
            </p>

            <div className="grid gap-12 md:grid-cols-2">
              <section className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-semibold text-teal-600 mb-4">1. طبيعة الموقع</h2>
                <p className="text-gray-600 leading-relaxed">
                  موقع Eslamoffers.com هو منصة إلكترونية تقدم كوبونات خصم وعروض تسويقية من مواقع تسوق إلكترونية مختلفة مثل نون، أمازون، نمشي، وغيرها.
                  جميع العروض والخصومات المنشورة هي لأغراض توفير القيمة للمستخدم فقط.
                </p>
              </section>

              <section className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-semibold text-teal-600 mb-4">2. عدم وجود حسابات مستخدمين</h2>
                <p className="text-gray-600 leading-relaxed">
                  لا يتطلب الموقع إنشاء حساب أو تسجيل دخول من الزوار. يمكنك تصفّح واستخدام الكوبونات والعروض بحرية تامة دون الحاجة لتقديم أي بيانات شخصية.
                </p>
              </section>

              <section className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-semibold text-teal-600 mb-4">3. روابط الأفلييت</h2>
                <p className="text-gray-600 leading-relaxed">
                  يحتوي الموقع على روابط تابعة (Affiliate Links)، أي أننا قد نحصل على عمولة في حال قمت بشراء منتج من خلال هذه الروابط. ذلك لا يؤثر على السعر الذي تدفعه، ويُستخدم لدعم استمرار تشغيل الموقع.
                </p>
              </section>

              <section className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-semibold text-teal-600 mb-4">4. دقة المحتوى</h2>
                <p className="text-gray-600 leading-relaxed">
                  نحن نسعى لتقديم معلومات دقيقة وحديثة بخصوص العروض والكوبونات، ولكن لا نضمن استمرار صلاحية جميع العروض أو دقتها بنسبة 100%، حيث قد تتغير أو تنتهي صلاحيتها من دون إشعار.
                </p>
              </section>

              <section className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-semibold text-teal-600 mb-4">5. الخصوصية والقائمة البريدية</h2>
                <p className="text-gray-600 leading-relaxed">
                  عند الاشتراك في قائمتنا البريدية، يتم جمع البريد الإلكتروني الخاص بك فقط لغرض إرسال التحديثات والعروض الجديدة. نحن لا نشارك هذه البيانات مع أي طرف ثالث.
                </p>
              </section>

              <section className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-semibold text-teal-600 mb-4">6. التواصل معنا</h2>
                <p className="text-gray-600 leading-relaxed">
                  يمكنك التواصل معنا من خلال صفحة "تواصل معنا" الموجودة على الموقع لأي استفسارات أو ملاحظات.
                </p>
              </section>

              <section className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-semibold text-teal-600 mb-4">7. حقوق الملكية</h2>
                <p className="text-gray-600 leading-relaxed">
                  جميع المحتويات المنشورة على الموقع، بما في ذلك النصوص، التصاميم، الصور، والشعارات، محمية بحقوق الملكية الفكرية. لا يُسمح بإعادة استخدامها أو نسخها دون إذن صريح.
                </p>
              </section>

              <section className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-semibold text-teal-600 mb-4">8. التعديلات</h2>
                <p className="text-gray-600 leading-relaxed">
                  قد نقوم بتعديل هذه الشروط والأحكام في أي وقت. يُرجى مراجعتها بانتظام، حيث يُعتبر استمرار استخدامك للموقع بعد التعديلات بمثابة موافقة عليها.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
