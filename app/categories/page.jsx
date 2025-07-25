'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Helper to ensure iconUrl is always valid
const getSafeIconUrl = (iconUrl) => {
    const baseUrl = 'https://api.eslamoffers.com/uploads/';
    if (!iconUrl) {
        return '/logo.png'; // fallback
    }
    try {
        // If already a valid http(s) url
        const url = new URL(iconUrl);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
            return iconUrl;
        }
    } catch (_) {
        // Not a full URL, try to construct
    }
    // If it's a path, construct the full URL
    const fullUrl = iconUrl.startsWith('/') ? `${baseUrl}${iconUrl}` : `${baseUrl}/${iconUrl}`;
    try {
        const url = new URL(fullUrl);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
            return fullUrl;
        }
    } catch (_) {}
    // fallback
    return '/logo.png';
};

const AllCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://api.eslamoffers.com/api/Category/GetAllCategories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg font-semibold text-gray-600">جاري تحميل الفئات...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
                        تصفح جميع الفئات
                    </h1>
                    <p className="mt-3 text-lg text-gray-500">ابحث عن أفضل العروض لكوبونات الخصم حسب الفئة</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
                    {categories.map((category) => (
                        <Link key={category.id} href={`/categories/${category.id}`} className="flex flex-col items-center gap-3 group text-center">
                            <div className="rounded-full bg-gradient-to-tr from-teal-100 via-white to-gray-50 shadow-md flex items-center justify-center w-28 h-28 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 ease-in-out border-2 border-white group-hover:border-teal-200">
                                <Image
                                    src={getSafeIconUrl(category.iconUrl)}
                                    alt={category.name}
                                    width={70}
                                    height={70}
                                    className="rounded-full"
                                    objectFit="cover"
                                />
                            </div>
                            <span className="text-md font-semibold text-gray-700 group-hover:text-teal-600 transition-colors">{category.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllCategoriesPage; 