// app/admin/login/page.tsx (أو pages/admin/login.tsx لو بتستخدم Pages Router)

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://147.93.126.19:8080/api/Authenticate/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.isAuthenticated) {
        // Store the token in cookies instead of sessionStorage
        if (typeof window !== 'undefined') {
          document.cookie = `token=${data.token}; path=/; max-age=86400;`; // 86400 seconds = 1 day
        }
        router.push("/admin/dashboard");
 
      } else {
        setError(data.message || "فشل تسجيل الدخول");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">تسجيل دخول الأدمن</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <div className="mb-4">
          <label className="block mb-2">البريد الإلكتروني</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2">كلمة المرور</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
        <button
          onClick={() => {
            document.cookie = "token=; path=/; max-age=0;";
            window.location.href = "/admin/login";
          }}
        >
          تسجيل الخروج
        </button>
      </form>
    </div>
  );
}
