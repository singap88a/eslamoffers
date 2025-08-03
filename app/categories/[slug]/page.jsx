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

        // Fetch stores by category in a single API call
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

        // Get category name from the first store's categories
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">{category.name}</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stores.map((store) => (
          <Link 
            key={store.id} 
            href={`/stores/${store.slug || store.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            prefetch={false}
          >
            <div className="relative h-40">
              <Image
                src={store.logoUrl ? `https://api.eslamoffers.com/uploads/${store.logoUrl}` : '/default-store.png'}
                alt={store.name}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4 border-t">
              <h3 className="font-medium text-center">{store.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}