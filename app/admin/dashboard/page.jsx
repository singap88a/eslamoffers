"use client";
import { useState, useEffect } from "react";
import { 
  FiUsers, 
  FiShoppingBag, 
  FiTag, 
  FiList,
  FiTrendingUp,
  FiActivity,
  FiBarChart2,
  FiPieChart
} from "react-icons/fi";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    stores: 0,
    coupons: 0,
    offers: 0,
    users: 0,
    visits: 0,
    conversion: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // جلب عدد المتاجر
        const storesRes = await fetch('https://api.eslamoffers.com/api/Store/GetAllStores');
        const storesData = await storesRes.json();
        
        // جلب عدد الكوبونات
        const couponsRes = await fetch('https://api.eslamoffers.com/api/Coupons/GetAllCoupons');
        const couponsData = await couponsRes.json();
        
        // جلب عدد العروض
        const offersRes = await fetch('https://api.eslamoffers.com/api/Offers/GetAllOffers');
        const offersData = await offersRes.json();
        
        setStats({
          stores: storesData.length || 0,
          coupons: couponsData.length || 0,
          offers: offersData.length || 0,
          users: 1250, // يمكن استبدالها بAPI عندما يكون متاحاً
          visits: 8540, // يمكن استبدالها بAPI عندما يكون متاحاً
          conversion: 3.2 // يمكن استبدالها بAPI عندما يكون متاحاً
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // بيانات المخططات
  const storesChartData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [
      {
        label: 'المتاجر',
        data: [12, 15, 18, 20, 22, 24],
        backgroundColor: '#14b8a6',
      },
    ],
  };

  const couponsChartData = {
    labels: ['كوبونات نشطة', 'كوبونات منتهية', 'كوبونات قريب انتهاؤها'],
    datasets: [
      {
        data: [120, 25, 11],
        backgroundColor: ['#14b8a6', '#f43f5e', '#f59e0b'],
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">لوحة التحكم</h1>
        <p className="text-gray-500">مرحبًا بك في لوحة تحكم الأدمن، يمكنك إدارة الموقع من هنا</p>
        <div className="h-1 w-24 bg-[#14b8a6] mt-4 rounded-full"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* المتاجر */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-500 mb-1">المتاجر</h3>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? '...' : stats.stores}
              </p>
            </div>
            <div className="p-3 rounded-full bg-[#e6f7f5] text-[#14b8a6]">
              <FiShoppingBag size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 font-medium flex items-center">
              <FiTrendingUp className="mr-1" /> 12%
            </span>
            <span className="text-gray-400 mr-2">منذ الشهر الماضي</span>
          </div>
        </div>

        {/* الكوبونات */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-500 mb-1">الكوبونات</h3>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? '...' : stats.coupons}
              </p>
            </div>
            <div className="p-3 rounded-full bg-[#f0e6f7] text-purple-500">
              <FiTag size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 font-medium flex items-center">
              <FiTrendingUp className="mr-1" /> 8%
            </span>
            <span className="text-gray-400 mr-2">منذ الشهر الماضي</span>
          </div>
        </div>

        {/* العروض */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-500 mb-1">العروض</h3>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? '...' : stats.offers}
              </p>
            </div>
            <div className="p-3 rounded-full bg-[#e6f0f7] text-blue-500">
              <FiList size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 font-medium flex items-center">
              <FiTrendingUp className="mr-1" /> 5%
            </span>
            <span className="text-gray-400 mr-2">منذ الشهر الماضي</span>
          </div>
        </div>

        {/* المستخدمين */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-500 mb-1">المستخدمين</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.users}</p>
            </div>
            <div className="p-3 rounded-full bg-[#f7e6f0] text-pink-500">
              <FiUsers size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 font-medium flex items-center">
              <FiTrendingUp className="mr-1" /> 18%
            </span>
            <span className="text-gray-400 mr-2">منذ الشهر الماضي</span>
          </div>
        </div>

        {/* الزيارات */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-500 mb-1">الزيارات</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.visits}</p>
            </div>
            <div className="p-3 rounded-full bg-[#f7f0e6] text-yellow-500">
              <FiActivity size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 font-medium flex items-center">
              <FiTrendingUp className="mr-1" /> 24%
            </span>
            <span className="text-gray-400 mr-2">منذ الشهر الماضي</span>
          </div>
        </div>

        {/* نسبة التحويل */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-500 mb-1">نسبة التحويل</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.conversion}%</p>
            </div>
            <div className="p-3 rounded-full bg-[#e6f7eb] text-green-500">
              <FiBarChart2 size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 font-medium flex items-center">
              <FiTrendingUp className="mr-1" /> 3%
            </span>
            <span className="text-gray-400 mr-2">منذ الشهر الماضي</span>
          </div>
        </div>
      </div>

 

      {/* Charts Section - Replacing Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart - Stores Growth */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">نمو المتاجر خلال 6 أشهر</h2>
          <div className="h-64">
            <Bar 
              data={storesChartData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    rtl: true
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Pie Chart - Coupons Status */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">حالة الكوبونات</h2>
          <div className="h-64">
            <Pie 
              data={couponsChartData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    rtl: true
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}