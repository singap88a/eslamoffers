"use client";
import { useState } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "المتاجر", href: "/stores" },
    { name: "الكوبونات", href: "/coupons" },
    { name: "العروض", href: "/offers" },
    { name: "المدونة", href: "/blog" },
    { name: "الأسئلة الشائعة", href: "/faq" },
  ];

  return (
    <nav className="bg-white shadow-md w-full">
      {/* Top Row: Logo + Search + Contact */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-4 gap-4">
        {/* Logo */}
        <div className="flex items-center      px-2">
          {/* Hamburger Menu Icon (Mobile Only) */}
          <div className="flex justify-between md:w-full">
            <div className="md:hidden block">
              <button onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </div>
            <div className="">
                          <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={80}
                height={20}
                className="rounded-full"
              />
 
            </Link>
            </div>

          </div>
        </div>

        {/* Search */}
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="إبحث عن الكوبونات والمتاجر"
            className="bg-transparent outline-none text-sm w-full md:w-96 placeholder-gray-400 text-right"
          />
          <FaSearch className="text-gray-500 ml-2" />
        </div>

        {/* Contact Button */}
        <div className="md:block hidden">
          <Link
            href="/contact"
            className="bg-[#14b8a6] hover:bg-[#2e6f68] text-white px-4 py-2 rounded-full text-sm font-bold"
          >
            تواصل معنا
          </Link>
        </div>
      </div>

      {/* Bottom Nav Links */}
      <div className=" ">
        <div className="hidden md:flex justify-center gap-8 py-3 font-bold text-l">
          {navLinks.map((link, i) => (
            <Link key={i} href={link.href} className="hover:text-[#14b8a6]">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-4 py-3 space-y-3 text-sm font-bold text-right">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="block hover:text-[#14b8a6]"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className="inline-block bg-[#14b8a6] text-white px-4 py-2 rounded-full"
            >
              تواصل معنا
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
