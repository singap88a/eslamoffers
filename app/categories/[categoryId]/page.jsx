"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import SubscribeBox from "../../components/home/Coupon/SubscribeBox";
import AppPromotionBox from "../../components/home/Coupon/AppPromotionBox";
import PromoCard from "../../components/home/Coupon/PromoCard";
import CountdownOfferBox from "../../components/home/Coupon/CountdownOfferBox";
import CouponCard from "../../components/coupons/CouponCard";

const CategoryPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [stores, setStores] = useState([]);
  const [categoryStores, setCategoryStores] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;

      try {
        // Fetch category data first
        const categoryRes = await fetch(
          `https://api.eslamoffers.com/api/Category/GetCategoryById/${categoryId}`
        );
        const categoryData = await categoryRes.json();
        setCategoryName(categoryData.name);

        // Fetch all stores
        const storesRes = await fetch(
          "https://api.eslamoffers.com/api/Store/GetAllStores"
        );
        const allStores = await storesRes.json();
        const filteredStores = allStores.filter(store =>
          store.categorys && store.categorys.includes(categoryId)
        );
        setStores(allStores);
        setCategoryStores(filteredStores);

        // Fetch coupons
        const couponsRes = await fetch(
          "https://api.eslamoffers.com/api/Coupons/GetAllCoupons"
        );
        const allCoupons = await couponsRes.json();
        const filteredCoupons = allCoupons.filter(
          (c) => c.categoryId === categoryId
        );
        setCoupons(filteredCoupons);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const getStoreLogo = (storeId) => {
    const store = stores.find((s) => s.id === storeId);
    if (store && store.logoUrl) {
      return store.logoUrl.startsWith("http")
        ? store.logoUrl
        : `https://api.eslamoffers.com/uploads/${store.logoUrl}`;
    }
    return "/logo.png";
  };

  if (loading) {
    return <div className="text-center py-10">...جاري التحميل</div>;
  }

  return (
    <div className=" " dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">متاجر وكوبونات {categoryName}</h1>
          <Link
            href="/categories"
            className="text-teal-500 hover:text-teal-600 font-semibold mt-2 inline-block"
          >
            &rarr; العودة إلى جميع الفئات
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-8">
            {/* Stores Section */}
            {categoryStores.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">المتاجر في {categoryName}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categoryStores.map((store) => (
                    <Link
                      key={store.id}
                      href={`/stores/${store.slug || store.id}`}
                      className="block p-4 border rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <div className="aspect-square relative mb-2">
                        <Image
                          src={store.logoUrl ? `https://api.eslamoffers.com/uploads/${store.logoUrl}` : "/logo.png"}
                          alt={store.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h3 className="text-center font-semibold">{store.name}</h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Coupons Section */}
            {coupons.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">كوبونات {categoryName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {coupons.map((coupon) => (
                    <CouponCard key={coupon.id} coupon={coupon} />
                  ))}
                </div>
              </div>
            )}

            {categoryStores.length === 0 && coupons.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                لا توجد متاجر أو كوبونات في هذه الفئة حالياً
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="space-y-6">
              <SubscribeBox />
              <div className="pt-10">
                <CountdownOfferBox />
              </div>
              <PromoCard />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
