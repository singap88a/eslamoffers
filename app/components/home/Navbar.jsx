"use client";
import { useState, useEffect } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { GoTriangleUp } from "react-icons/go";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);

  // جلب بيانات المتاجر مرة واحدة
  useEffect(() => {
    fetch("https://api.eslamoffers.com/api/Store/GetAllStores")
      .then((res) => res.json())
      .then((data) => setStores(data));
  }, []);

  // فلترة النتائج عند الكتابة
  useEffect(() => {
    if (searchValue.trim() !== "") {
      setDropdownOpen(true);
      setFilteredStores(
        stores.filter((store) =>
          store.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    } else {
      setDropdownOpen(false);
      setFilteredStores([]);
    }
  }, [searchValue, stores]);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".search-dropdown-parent")) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "المتاجر", href: "/stores" },
    { name: "الكوبونات", href: "/coupons" },
    { name: "العروض", href: "/offers" },
    { name: "المدونة", href: "/blog" },
   ];

  return (
    <nav
      className={"bg-white w-full py-2 relative z-50 md:static md:shadow-md shadow-none sticky top-0 md:top-auto"}
    >
      {/* خلفية شفافة عند فتح القائمة (موبايل فقط) */}
      {menuOpen && (
        <div className="fixed inset-0 bg-[#00000080] bg-opacity-40 z-40 mt-50"></div>
      )}

      {/* Top Row: Logo + Search + Contact */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-4 gap-4 relative">
        {/* Mobile: Hamburger + Logo */}
        <div className="w-full flex items-center justify-between md:hidden px-4">
          {/* Hamburger Icon - يسار */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="z-50 text-gray-800"
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>

          {/* Logo - يمين */}
          <Link href="/" className="flex items-center ">
            <Image
              src="/logo4.png"
              alt="Logo"
              width={60}
              height={60}
              className="w-[60px] h-auto "
            />
          </Link>
        </div>

        {/* Desktop Logo */}
        <div className="hidden md:flex items-center px-2">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo4.png"
              alt="Logo"
              width={100}
              height={100}
              className="w-[100px] h-auto absolute right-0 top-0"
            />
          </Link>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-auto search-dropdown-parent">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-3">
            <input
              type="text"
              placeholder="إبحث عن الكوبونات والمتاجر"
              className="bg-transparent outline-none text-sm w-full md:w-96 placeholder-gray-400 text-right"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => searchValue && setDropdownOpen(true)}
            />
            <FaSearch className="text-gray-500 ml-2" />
          </div>
          {/* قائمة النتائج */}
          {dropdownOpen && (
            <div className="absolute right-0 left-0 mt-2 bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl border border-[#14b8a6] z-50 animate-slideInDown overflow-hidden">
              {/* سهم صغير للأعلى مع تدرج */}
              {/* <div className="absolute left-1/2 -translate-x-1/2 -top-4 z-[500] flex items-center justify-center">
                <GoTriangleUp className="text-[#14b8a6] text-4xl drop-shadow-lg" />
              </div> */}
              {/* عنوان أو أيقونة البحث */}
              <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-[#14b8a6]/30">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#14b8a6" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/></svg>
                <span className="font-bold text-[#14b8a6]">نتائج البحث</span>
              </div>
              <div className="max-h-80 overflow-y-auto py-2 px-1">
                {filteredStores.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-[#14b8a6] opacity-80">
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path stroke="#14b8a6" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/></svg>
                    <div className="mt-2 font-bold">لا توجد نتائج</div>
                  </div>
                ) : (
                  filteredStores.map((store) => (
                    <div
                      key={store.id}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#14b8a6]/10 cursor-pointer transition group"
                      onClick={() => window.location.assign(`/stores/${store.slug}`)}
                    >
                      <img
                        src={`https://api.eslamoffers.com/uploads/${store.logoUrl}`}
                        alt={store.name}
                        className="w-12 h-12 object-contain rounded-lg transition-transform duration-200 group-hover:scale-110 shadow-sm border border-gray-200"
                      />
                      <span className="font-bold text-right flex-1 text-gray-800 group-hover:text-[#14b8a6] transition-colors duration-200">{store.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Contact Button (desktop only) */}
        <div className="md:block hidden">
          <Link
            href="/contact"
            className="bg-[#14b8a6] hover:bg-[#2e6f68] text-white px-4 py-2 rounded-full text-sm font-bold"
          >
            تواصل معنا
          </Link>
        </div>
      </div>

      {/* Bottom Nav Links (desktop only) */}
      <div className="hidden md:flex justify-center gap-8 py-3 font-bold text-l">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className={`relative px-2 transition-colors duration-200 group ${pathname === link.href ? "text-[#14b8a6]" : "text-gray-800"}`}
          >
            {link.name}
            <span
              className={`absolute right-0 left-0 -bottom-1 h-[3px] rounded transition-all duration-300 bg-[#14b8a6] ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`}
              style={{transitionProperty: 'width'}}
            ></span>
            <style jsx>{`
              .group:hover {
                color: #14b8a6 !important;
              }
            `}</style>
          </Link>
        ))}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 py-3 space-y-3 text-sm font-bold text-right z-50 relative bg-white">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className={`block py-2 relative transition-colors duration-200 group ${pathname === link.href ? "text-[#14b8a6]" : "text-gray-800"}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
              <span
                className={`absolute right-0 left-0 -bottom-1 h-[3px] rounded transition-all duration-300 bg-[#14b8a6] ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`}
                style={{transitionProperty: 'width'}}
              ></span>
              <style jsx>{`
                .group:hover {
                  color: #14b8a6 !important;
                }
              `}</style>
            </Link>
          ))}
          <Link
            href="/contact"
            className={`inline-block bg-[#14b8a6] text-white px-4 py-2 rounded-full mt-4 ${pathname === "/contact" ? "ring-2 ring-[#14b8a6]" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            تواصل معنا
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
