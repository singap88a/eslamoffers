'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import SubscribeBox from '../../components/home/Coupon/SubscribeBox';
import AppPromotionBox from '../../components/home/Coupon/AppPromotionBox';
import PromoCard from '../../components/home/Coupon/PromoCard';
 
const CategoryPage = () => {
    const [coupons, setCoupons] = useState([]);
    const [stores, setStores] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(true);
    const { categoryId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            if (!categoryId) return;

            try {
                const couponsRes = await fetch('http://147.93.126.19:8080/api/Coupons/GetAllCoupons');
                const allCoupons = await couponsRes.json();
                const filteredCoupons = allCoupons.filter(c => c.categoryId === categoryId);
                setCoupons(filteredCoupons);

                const storesRes = await fetch('http://147.93.126.19:8080/api/Store/GetAllStores');
                const allStores = await storesRes.json();
                setStores(allStores);
                
                if (filteredCoupons.length > 0) {
                    const categoryRes = await fetch(`http://147.93.126.19:8080/api/Category/GetCategoryById/${categoryId}`);
                    const categoryData = await categoryRes.json();
                    setCategoryName(categoryData.name);
                }

            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryId]);

    const getStoreLogo = (storeId) => {
        const store = stores.find(s => s.id === storeId);
        if (store && store.logoUrl) {
            return store.logoUrl.startsWith('http') ? store.logoUrl : `http://147.93.126.19:8080/uploads/${store.logoUrl}`;
        }
        return '/logo.png';
    };

    if (loading) {
        return <div className="text-center py-10">...جاري التحميل</div>;
    }

    return (
        <div className=" " dir="rtl">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold">كوبونات لـ {categoryName}</h1>
                    <Link href="/categories" className="text-teal-500 hover:text-teal-600 font-semibold mt-2 inline-block">
                        &rarr; العودة إلى جميع الفئات
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content */}
                    <main className="lg:col-span-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {coupons.map((coupon) => (
                                <div key={coupon.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                                    <div className="p-4 flex items-center gap-4">
                                        <Image src={getStoreLogo(coupon.storeId)} alt="Store Logo" width={60} height={60} className="rounded-full border p-1" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{coupon.title}</h3>
                                            <p className="text-gray-600">{`خصم: ${coupon.discount}%`}</p>
                                        </div>
                                    </div>
                                    <div className="px-4 pb-4">
                                        <p className="text-sm text-gray-500 mb-4 h-12 overflow-hidden">{coupon.description}</p>
                                        <Link href={coupon.linkRealStore} target="_blank" rel="noopener noreferrer">
                                            <button className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors font-semibold">
                                                احصل على الكوبون
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4">
                        <div className="space-y-6">
                            <SubscribeBox />
                            <div className="pt-10">
                                                          <AppPromotionBox />

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