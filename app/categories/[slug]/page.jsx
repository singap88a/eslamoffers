'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [stores, setStores] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      router.push('/categories');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const storesRes = await fetch(
          `https://api.eslamoffers.com/api/Store/GetStoresByCategory/${slug}`
        );
        
        if (!storesRes.ok) {
          throw new Error('Failed to fetch category data');
        }

        const storesData = await storesRes.json();
        
        if (!Array.isArray(storesData) || storesData.length === 0) {
          throw new Error('No stores found for this category');
        }

        const categoryName = storesData[0]?.categorys?.find(cat => 
          typeof cat === 'string' && cat.toLowerCase() === slug.toLowerCase()
        ) || slug;

        setCategory({ name: categoryName });
        setStores(storesData);

      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        router.push('/categories');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-700">
          {error || 'الفئة غير موجودة'}
        </h2>
        <Link href="/categories" className="text-teal-600 hover:underline mt-4 inline-block">
          العودة إلى قائمة الفئات
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-22 md:py-8 py-3 md:pt-12">
 
      
      {/* شبكة المتاجر المعدلة */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {stores.map((store) => (
          <div 
            key={store.id}
className="bg-white border-2 border-gray-300 border-dashed hover:border-teal-400 rounded-xl overflow-hidden shadow-sm h-full flex flex-col relative transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl group"          >
            <Link href={`/stores/${store.slug || store.id}`} prefetch={false}>
              <div className="relative    h-[80] w-full">
                <Image
                  src={store.logoUrl ? `https://api.eslamoffers.com/uploads/${store.logoUrl}` : '/default-store.png'}
                  alt={store.altText || store.name}
                  fill
          className="   group-hover:scale-110 transition-transform duration-300 w-[200] h-[80px]"
                 />
              </div>
      <div className="p-1 text-center border-t border-gray-100 flex-grow flex flex-col justify-center">
        <h3 className="text-sm md:text-base text-gray-800 mb-2 truncate group-hover:text-teal-600 transition-colors">
          {store.name}
        </h3>
      </div>
            </Link>
          </div>
        ))}
      </div>

      {/* زر العودة */}
      <div className="mt-12 text-center">
        <Link 
          href="/categories" 
          className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-teal-600 hover:text-white rounded-full transition-colors duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          العودة إلى جميع الفئات
        </Link>
      </div>
    </div>
  );
}