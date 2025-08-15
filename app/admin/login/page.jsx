// app/admin/login/page.tsx (أو pages/admin/login.tsx لو بتستخدم Pages Router)

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://api.eslamoffers.com/api/Authenticate/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = {};
      }

      if (res.ok && data.isAuthenticated && data.token) {
        if (typeof window !== 'undefined') {
          document.cookie = `token=${data.token}; path=/; max-age=86400;`;
          setSuccess("تم تسجيل الدخول بنجاح! سيتم تحويلك الآن...");
          setTimeout(() => {
            window.location.href = "/admin/dashboard";
          }, 300);
        }
      } else if (res.status === 400 || res.status === 401) {
        setError(data.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else {
        setError(data.message || "حدث خطأ غير متوقع. حاول مرة أخرى لاحقًا.");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  const EyeOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639l4.436-7.399a1.012 1.012 0 011.012-.639h7.032a1.012 1.012 0 011.012.639l4.436 7.399a1.012 1.012 0 010 .639l-4.436 7.399a1.012 1.012 0 01-1.012.639h-7.032a1.012 1.012 0 01-1.012-.639L2.036 12.322z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
    </svg>
  );


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="Logo" width={120} height={120} />
        </div> */}
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full">
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
            لوحة تحكم الأدمن
          </h2>
          <p className="text-center text-gray-500 mb-8">
            الرجاء إدخال بياناتك للمتابعة
          </p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                <p>{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-100 border-l-4 border-green-500 text-green-700">
                <p>{success}</p>
              </div>
            )}
            
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700 text-right"
              >
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2.5 text-right"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-700 text-right"
              >
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2.5 pl-10 text-right"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-500"
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeOpenIcon />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#14b8a6] text-white py-3 px-4 rounded-lg hover:bg-[#4a9b91fd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out font-semibold disabled:bg-indigo-300"
              disabled={loading}
            >
              {loading ? "جاري التحقق..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-4">
          <button
            onClick={() => {
              document.cookie = "token=; path=/; max-age=0;";
              window.location.href = "/admin/login";
            }}
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            مشكلة في الدخول؟ تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
}
