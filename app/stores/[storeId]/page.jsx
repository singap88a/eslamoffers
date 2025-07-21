"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

const StoreCouponsPage = () => {
  const [store, setStore] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const { storeId } = params;

  useEffect(() => {
    if (!storeId) return;

    const fetchStoreAndCoupons = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch store details
        const storeResponse = await axios.get("http://147.93.126.19:8080/api/Store/GetAllStores");
        const currentStore = storeResponse.data.find(s => s.id === storeId);
        setStore(currentStore);

        // Fetch coupons
        const couponsResponse = await axios.get("http://147.93.126.19:8080/api/Coupons/GetAllCoupons");
        const storeCoupons = couponsResponse.data.filter(c => c.storeId === storeId);
        setCoupons(storeCoupons);

      } catch (err) {
        setError("فشل تحميل البيانات. يرجى المحاولة مرة أخرى لاحقًا.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreAndCoupons();
  }, [storeId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("تم نسخ الكود!");
    }, (err) => {
      alert("فشل نسخ الكود.");
    });
  };

  if (loading) {
    return <div className="text-center py-20">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!store) {
    return <div className="text-center py-20">لم يتم العثور على المتجر.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 mb-12 flex items-center">
          <img src={store.logoUrl} alt={store.name} className="w-24 h-24 object-contain rounded-full border p-1" />
          <div className="mr-6">
            <h1 className="text-4xl font-bold text-gray-800">{store.name}</h1>
            <p className="text-gray-600 mt-2">جميع الكوبونات والعروض الخاصة بـ {store.name}</p>
          </div>
        </div>

        {coupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="bg-white border-2 border-dashed border-gray-200 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{coupon.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{coupon.description}</p>
                </div>
                <div className="p-6 bg-gray-50 border-t-2 border-dashed">
                    <div
                      className="w-full bg-teal-100 border-2 border-teal-400 border-dashed rounded-lg text-center py-3 cursor-pointer"
                      onClick={() => copyToClipboard(coupon.couponCode)}
                    >
                      <span className="text-teal-800 font-bold text-lg tracking-widest">{coupon.couponCode}</span>
                    </div>
                    <a 
                      href={coupon.linkRealStore} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-teal-500 text-white font-bold py-3 px-4 rounded-lg mt-4 hover:bg-teal-600 transition-colors"
                    >
                        الذهاب للمتجر
                    </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <p className="text-2xl text-gray-500">لا توجد كوبونات متاحة حاليًا لهذا المتجر.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreCouponsPage; 