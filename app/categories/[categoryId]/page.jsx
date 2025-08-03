"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import SubscribeBox from "../../components/home/Coupon/SubscribeBox";
import AppPromotionBox from "../../components/home/Coupon/AppPromotionBox";
import PromoCard from "../../components/home/Coupon/PromoCard";
import CountdownOfferBox from "../../components/home/Coupon/CountdownOfferBox";

const CategoryPage = () => {
  const [stores, setStores] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;

      try {
        setLoading(true);
        setError(null);
        
        // جلب بيانات الفئة
        const categoryRes = await fetch(
          `https://api.eslamoffers.com/api/Category/GetCategoryById/${categoryId}`
        );
        
        if (categoryRes.ok) {
          const categoryData = await categoryRes.json();
          setCategoryName(categoryData.name || "تسوق حسب الفئات"); // Default value
        } else {
          setCategoryName("تسوق حسب الفئات");
        }

        // جلب المتاجر الخاصة بالفئة
        const storesRes = await fetch(
          `https://api.eslamoffers.com/api/Store/GetStoresByCategory/${categoryId}`
        );
        
        if (storesRes.ok) {
          const categoryStores = await storesRes.json();
          setStores(Array.isArray(categoryStores) ? categoryStores : []);
        } else {
          setStores([]);
        }

      } catch (error) {
        console.error("حدث خطأ:", error);
        setError("عذراً، حدث خطأ أثناء جلب البيانات");
        setCategoryName("تصفح الفئات");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
        <p className="text-gray-600">جاري تحميل المتاجر...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow max-w-4xl mx-auto my-8">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <Link
          href="/categories"
          className="inline-block px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          العودة لقائمة الفئات
        </Link>
      </div>
    );
  }

  return (
    <div className="  min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            <span className="text-teal-600">{categoryName}</span> - أفضل العروض والخصومات
          </h1>
          <Link
            href="/categories"
            className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1 transition-colors"
          >
            <span>العودة لجميع الفئات</span>
            <span>←</span>
          </Link>
        </div>

        {/* محتوى الصفحة */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* القسم الرئيسي */}
          <main className="lg:col-span-8">
            {stores.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-700">
                    تسوق بأفضل العروض والخصومات الحصرية
                  </h2>
                  <span className="text-sm text-gray-500">
                    {stores.length} متجر متاح
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {stores.map((store) => (
                    <Link
                      key={store.id}
                      href={`/stores/${store.slug || store.id}`}
                      className="group block transition-transform hover:-translate-y-1"
                    >
                      <div className="h-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-300 flex flex-col">
                        {/* صورة المتجر */}
                        <div className="relative aspect-square w-full p-4">
                          <Image
                            src={
                              store.logoUrl
                                ? `https://api.eslamoffers.com/uploads/${store.logoUrl}`
                                : "/logo.png"
                            }
                            alt={store.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100px, 150px"
                          />
                        </div>
                        
                        {/* اسم المتجر */}
                        <div className="p-3 border-t border-gray-100 bg-gray-50 group-hover:bg-teal-50 transition-colors">
                          <h3 className="text-center font-medium text-gray-700 group-hover:text-teal-600 truncate">
                            {store.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-gray-500 mb-4">
                  لا توجد متاجر متاحة حاليًا في هذه الفئة
                </div>
                <Link
                  href="/categories"
                  className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-md hover:bg-teal-200 transition-colors"
                >
                  تصفح الفئات الأخرى
                </Link>
              </div>
            )}
          </main>

          {/* الشريط الجانبي */}
          <aside className="lg:col-span-4 space-y-6">
            <SubscribeBox />
            <CountdownOfferBox />
            <PromoCard />
            <AppPromotionBox />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;