"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  FiHome, 
  FiShoppingBag, 
  FiTag, 
  FiList, 
  FiMail,
  FiSettings,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiPieChart
} from "react-icons/fi";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  const navItems = [
    { href: "/admin/dashboard", label: "لوحة التحكم", icon: <FiPieChart /> },
    { href: "/admin/dashboard/stores", label: "المتاجر", icon: <FiShoppingBag /> },
    { href: "/admin/dashboard/coupons", label: "الكوبونات", icon: <FiTag /> },
    { href: "/admin/dashboard/offers", label: "العروض", icon: <FiList /> },
    { href: "/admin/dashboard/messages", label: "رسائل العملاء", icon: <FiMail /> },
    { href: "/admin/dashboard/settings", label: "الإعدادات", icon: <FiSettings /> },
    { href: "/admin/dashboard/admins", label: "المشرفين", icon: <FiUsers /> }
  ];

  return (
    <aside className={`
      ${isCollapsed ? "w-16" : "w-56"}
      bg-white
      text-gray-700
      flex flex-col 
      transition-all duration-300 ease-in-out
      h-screen
      sticky top-0
      border-r border-gray-100
      shadow-sm
    `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <span className="p-1 rounded-md bg-gray-100 text-gray-600">
              <FiHome />
            </span>
            لوحة التحكم
          </h2>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-500 hover:bg-gray-100 p-1 rounded-md transition"
        >
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col p-2 space-y-1 mt-4 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center 
              ${isCollapsed ? "justify-center" : "justify-start px-3"}
              p-2 rounded-md
              transition-all duration-200
              ${activeLink === item.href 
                ? "bg-[#f0fdfa] text-[#0d9488] font-medium border-r-2 border-[#0d9488]" 
                : "text-gray-600 hover:bg-gray-50 hover:text-[#0d9488]"}
            `}
            onClick={() => setActiveLink(item.href)}
          >
            <span className={`${!isCollapsed && "ml-2"} text-[#14b8a6]`}>{item.icon}</span>
            {!isCollapsed && <span className="mr-2">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 text-xs text-center text-gray-400">
        {!isCollapsed ? "الإصدار 2.2.0" : "v2.2.0"}
      </div>
    </aside>
  );
};

export default Sidebar;