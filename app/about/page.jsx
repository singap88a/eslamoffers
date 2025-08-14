// pages/about.js
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import img_1 from "../../public/1.svg";
import img_2 from "../../public/2.svg";
import img_3 from "../../public/3.svg";
import img_4 from "../../public/4.svg";

export default function AboutUs() {
  return (
    <>
      <Head>
        <title>من نحن - Eslamoffers</title>
        <meta name="description" content="تعرف على فريق Eslamoffers.com والخدمات التي نقدمها" />
      </Head>

      <div className="min-h-screen  ">
        
        {/* ✅ Hero Section with Responsive Image */}
        <div className="relative w-full aspect-[7/2]   md:aspect-[7/2]">
          <Image
            src={img_1}
            alt="Eslamoffers Hero Banner"
            fill
            className="  object-center"
            priority
          />
        </div>

        {/* ✅ Main Content */}
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          
          {/* Mission Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
            <div className="md:flex">
              <div className="md:w-1/3 relative aspect-[4/3]">
                <Image 
                  src={img_2}  
                  alt="مهمتنا"
                  fill
                  className="object-contain object-center p-4"
                  priority
                />
              </div>
              <div className="md:w-2/3 p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">مهمتنا</h2>
                <p className="text-lg text-gray-700 mb-6">
                  نساعدك توفّر في كل طلب أونلاين من خلال توفير أحدث كود خصم وعروض حصرية من متاجر مثل:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {['نون', 'أمازون', 'نمشي', 'شي إن', 'سوق', 'علي إكسبريس', 'أخرى'].map((store) => (
                    <div key={store} className="flex items-center bg-gray-50 p-3 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{store}</span>
                    </div>
                  ))}
                </div>
                <p className="text-lg text-gray-700">
                  كل الكوبونات نراجعها يدويًا ونتأكد إنها شغالة قبل نشرها.
                </p>
              </div>
            </div>
          </div>

          {/* Why Us Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
            <div className="md:flex flex-row-reverse">
              <div className="md:w-1/3 relative aspect-[4/3]">
                <Image 
                  src={img_3}  
                  alt="ليه Eslam Offers؟"
                  fill
                  className="object-contain object-center p-4"
                />
              </div>
              <div className="md:w-2/3 p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">ليه Eslam Offers؟</h2>
                <div className="space-y-6">
                  {[
                    "بنوفر أكواد خصم حقيقية ومجانية",
                    "بنحدث الكوبونات بشكل يومي لضمان فعاليتها",
                    "مفيش تسجيل أو اشتراك إجباري",
                    "عروض تسوق لمختلف الفئات: إلكترونيات، أزياء، عناية شخصية، مطاعم"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 bg-teal-100 p-1 rounded-full mr-4 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-lg text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Work Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
            <div className="md:flex">
              <div className="md:w-1/3 relative aspect-[4/3]">
                <Image 
                  src={img_4}  
                  alt="بنشتغل علشانك"
                  fill
                  className="object-contain object-center p-4"
                />
              </div>
              <div className="md:w-2/3 p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">بنشتغل علشانك</h2>
                <p className="text-lg text-gray-700 mb-6">
                  هدفنا نخلي تجربة التسوق أوفر وأسهل من غير ما تضيع وقتك في البحث عن كوبون شغال. تقدر تعتمد علينا في كل مرة تحب تشتري أونلاين.
                </p>
                <div className="bg-teal-50 border-l-4 border-teal-500 p-4">
                  <p className="text-teal-700 font-medium">
                    "نحن نؤمن بأن التوفير حق للجميع، ونسعى جاهدين لتوفير أفضل العروض وأحدث أكواد الخصم لتجعل تجربتك في التسوق أكثر متعة وتوفيرًا"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-400 rounded-xl p-8 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">عندك استفسار أو اقتراح؟</h3>
            <p className="text-lg mb-6">نحن هنا لمساعدتك! تواصل معنا وسنكون سعداء بالرد على استفساراتك</p>
            <Link href="/contact" className="inline-block bg-white text-teal-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300">
              تواصل معنا
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
