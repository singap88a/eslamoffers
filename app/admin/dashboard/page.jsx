"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/admin/Sidebar";
 
export default function AdminDashboard() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('token');
      if (!token) {
        router.replace('/admin/login');
 
      }
    }
  }, [router]);
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">لوحة تحكم الأدمن</h1>
          <p className="text-lg">مرحبًا بك في لوحة التحكم!</p>
        </div>
      </main>
    </div>
  );
}
