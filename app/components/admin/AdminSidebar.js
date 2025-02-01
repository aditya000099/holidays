"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function AdminSidebar({ paddingTop }) {
  const pathname = usePathname();
  const sidebarRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        const isContentScrolling =
          sidebarRef.current.scrollHeight > sidebarRef.current.clientHeight;
        setIsScrolling(isContentScrolling);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const defaultPadding = paddingTop ? paddingTop : "pt-20";

  return (
    <aside
      ref={sidebarRef}
      className={`bg-gray-100 p-4 rounded-tr-3xl h-full px-6 shadow-md ${defaultPadding}  overflow-y-auto ${
        isScrolling ? "border-r border-gray-200" : ""
      } max-h-[calc(100vh-80px)]`}
    >
      <nav className="flex flex-col gap-2 ">
        {/* <h3 className="mb-4 font-medium text-gray-700">Actions</h3> */}
        <Link
          href="/admin?tab=add-country"
          className={`block p-2 rounded-xl hover:bg-gray-200  ${
            pathname?.includes("add-country")
              ? "bg-gray-200 text-gray-800 font-semibold"
              : "text-gray-700"
          } `}
        >
          Add Country
        </Link>
        <Link
          href="/admin?tab=add-city"
          className={`block p-2 rounded-xl hover:bg-gray-200  ${
            pathname?.includes("add-city")
              ? "bg-gray-200 text-gray-800 font-semibold"
              : "text-gray-700"
          }`}
        >
          Add City
        </Link>
        <Link
          href="/admin?tab=add-package"
          className={`block p-2 rounded-xl hover:bg-gray-200 ${
            pathname?.includes("add-package")
              ? "bg-gray-200 text-gray-800 font-semibold"
              : "text-gray-700"
          }`}
        >
          Add Package
        </Link>
        <Link
          href="/admin?tab=package-list"
          className={`block p-2 rounded-xl hover:bg-gray-200 ${
            pathname?.includes("package-list")
              ? "bg-gray-200 text-gray-800 font-semibold"
              : "text-gray-700"
          }`}
        >
          Package List
        </Link>
        <Link
          href="/admin?tab=contact-list"
          className={`block p-2 rounded-xl hover:bg-gray-200 ${
            pathname?.includes("contact-list")
              ? "bg-gray-200 text-gray-800 font-semibold"
              : "text-gray-700"
          }`}
        >
          Enquiries
        </Link>
      </nav>
    </aside>
  );
}
