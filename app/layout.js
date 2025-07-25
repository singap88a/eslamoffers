import { Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "./components/home/Navbar";
import Footer from "./components/home/Footer";
import { ToastContainer } from "react-toastify";

// تحميل خط Cairo
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

// تعريف البيانات الوصفية للموقع
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
      <head>
        <link rel="icon" href="/logo4.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/logo4.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/logo4.png" />
      </head>
      <body className={cairo.className} suppressHydrationWarning>
        <Navbar />
        <ToastContainer />
        {children}
        <Footer />
      </body>
    </html>
  );
}
