import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="  w-64 bg-white shadow-md flex flex-col p-4 border-l border-gray-200  ">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">لوحة الأدمن</h2>
        <div className="h-px bg-gray-200" />
      </div>
      <nav className="flex flex-col gap-2">
        <Link href="/admin/dashboard" className="py-2 px-4 rounded hover:bg-gray-100 text-right">لوحة التحكم</Link>
        <Link href="/admin/dashboard/stores" className="py-2 px-4 rounded hover:bg-gray-100 text-right">المتاجر</Link>
        <Link href="/admin/dashboard/coupons" className="py-2 px-4 rounded hover:bg-gray-100 text-right">الكوبونات</Link>
        <Link href="/admin/dashboard/offers" className="py-2 px-4 rounded hover:bg-gray-100 text-right">العروض</Link>
        <Link href="/admin/dashboard/category" className="py-2 px-4 rounded hover:bg-gray-100 text-right">الفئات</Link>
      </nav>
    </aside>
  );
};

export default Sidebar; 