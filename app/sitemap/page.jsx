'use client';

import { useState, useEffect } from 'react';
import SubscribeBox from '../components/home/Coupon/SubscribeBox';
import CountdownOfferBox from '../components/home/Coupon/CountdownOfferBox';
import PromoCard from '../components/home/Coupon/PromoCard';

const SitemapPage = () => {
  const [sitemapData, setSitemapData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const res = await fetch('https://api.eslamoffers.com/sitemap.xml', {
          next: { revalidate: 3600 }
        });

        if (!res.ok) throw new Error('فشل جلب البيانات');

        const xmlText = await res.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const urls = Array.from(xmlDoc.querySelectorAll('url')).map(url => ({
          loc: url.querySelector('loc')?.textContent || ''
        }));

        setSitemapData(urls);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSitemap();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">جاري تحميل البيانات...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14b8a6] mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-red-50 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-red-600">خطأ في تحميل البيانات</h1>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#14b8a6] text-white rounded-lg shadow hover:bg-[#0d9488] transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto   py-6 md:py-12 px-4">
      <div className="lg:col-span-2">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-[#14b8a6] p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              خريطة موقع Islam Offers
            </h1>
            <p className="text-[#d1fae5] text-center mt-2">
              إجمالي الروابط: {sitemapData.length}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    الرابط
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {sitemapData.map((item, index) => (
                  <tr key={index} className="hover:bg-[#f0fdfa] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#14b8a6] max-w-lg truncate">
                      <a
                        href={item.loc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-[#0d9488] transition-colors"
                        title={item.loc}
                      >
                        {item.loc.replace('https://api.eslamoffers.com', '') || '/'}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 md:top-8 space-y-6">
              <SubscribeBox />
              <div className="pt-6">
     <CountdownOfferBox />

              </div>
              <PromoCard />
            </div>
          </div>
    </div>
  );
};

export default SitemapPage;
