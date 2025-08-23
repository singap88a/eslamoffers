import { Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "./components/home/Navbar";
import Footer from "./components/home/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // مهم عشان التنسيقات
import ScrollToTop from "./components/ScrollToTop";

// تحميل خط Cairo
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

// تعريف البيانات الوصفية للموقع (Next.js هيتولى تحويلها لـ <meta> tags تلقائيًا)
export const metadata = {
  title: "Eslam Offers",
  description: "أفضل العروض والخصومات على الإنترنت",
  keywords: "عروض, خصومات, تسوق, كوبونات, أفضل العروض",
  icons: {
    icon: [
      { url: "/logo4.png", sizes: "32x32", type: "image/png" },
      { url: "/logo4.png", sizes: "16x16", type: "image/png" },
    ],
    apple: {
      url: "/logo4.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className} suppressHydrationWarning>
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} />
        <ScrollToTop/>
        {children}
        <Footer />
      </body>
    </html>
  );
}
