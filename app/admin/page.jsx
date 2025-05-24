"use client";

import { useState, useEffect, useRef } from "react";
import AddCountry from "../components/admin/AddCountry";
import AddCity from "../components/admin/AddCity";
import AddPackage from "../components/admin/AddPackage";
import PackageList from "../components/admin/PackageList";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useSearchParams } from "next/navigation";
import ContactFormList from "../components/admin/ContactFormList";

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "";
  const [isAdmin, setIsAdmin] = useState(null);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const contentRef = useRef(null);
  const [isContentScrolling, setIsContentScrolling] = useState(false);

  // Toggle sidebar function for responsive design
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Close sidebar on small screens by default
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state based on screen size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const isContentScrollable =
          contentRef.current.scrollHeight > contentRef.current.clientHeight;
        setIsContentScrolling(isContentScrollable);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (status === "authenticated") {
        const res = await fetch(`/api/admin/check`, {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setIsAdmin(data.isAdmin);
        } else {
          console.error("Error checking the admin status");
        }
      }
    };
    checkAdminStatus();
  }, [status]);

  useEffect(() => {
    const fetchCountriesAndCities = async () => {
      try {
        const [countriesRes, citiesRes] = await Promise.all([
          fetch(`/api/countries`, { headers: { "Cache-Control": "no-cache" } }),
          fetch(`/api/cities`, { headers: { "Cache-Control": "no-cache" } }),
        ]);

        if (countriesRes.ok && citiesRes.ok) {
          const [countriesData, citiesData] = await Promise.all([
            countriesRes.json(),
            citiesRes.json(),
          ]);
          setCountries(countriesData);
          setCities(citiesData);
        } else {
          console.error("Failed to fetch countries and cities");
        }
      } catch (e) {
        console.error("There was an error while fetching the data", e);
      }
    };
    fetchCountriesAndCities();
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    } else if (status === "authenticated") {
      if (isAdmin === false) {
        router.push("/");
      }
    }
  }, [status, router, isAdmin]);

  if (status === "loading" || isAdmin === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full border-4 border-t-blue-600 border-blue-100 animate-spin"></div>
            <p className="mt-6 text-lg font-medium text-gray-700">
              Loading admin dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || isAdmin === false) {
    return null;
  }

  const renderContent = () => {
    switch (currentTab) {
      case "add-country":
        return (
          <AddCountry
            onCountryAdded={(newCountry) =>
              setCountries([...countries, newCountry])
            }
          />
        );
      case "add-city":
        return <AddCity countries={countries} />;
      case "add-package":
        return <AddPackage countries={countries} cities={cities} />;
      case "package-list":
        return <PackageList />;
      case "contact-list":
        return <ContactFormList />;
      default:
        return (
          <div>
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
              <p className="text-gray-500 text-sm">Welcome back, admin</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-md p-4 flex items-center border-l-2 border-blue-500 shadow-sm">
                <div className="p-2 rounded-md bg-blue-50 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Countries</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {countries.length}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-md p-4 flex items-center border-l-2 border-green-500 shadow-sm">
                <div className="p-2 rounded-md bg-green-50 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Cities</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {cities.length}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-md p-4 flex items-center border-l-2 border-purple-500 shadow-sm">
                <div className="p-2 rounded-md bg-purple-50 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Actions</p>
                  <p className="text-xl font-semibold text-gray-800">5</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-md p-4 mb-6 shadow-sm">
              <h2 className="text-sm font-medium text-gray-700 mb-3">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  {
                    title: "Add Country",
                    tab: "add-country",
                    icon: "🌍",
                    color: "text-blue-600",
                  },
                  {
                    title: "Add City",
                    tab: "add-city",
                    icon: "🏙️",
                    color: "text-green-600",
                  },
                  {
                    title: "Add Package",
                    tab: "add-package",
                    icon: "📦",
                    color: "text-amber-600",
                  },
                  {
                    title: "Packages",
                    tab: "package-list",
                    icon: "📋",
                    color: "text-purple-600",
                  },
                  {
                    title: "Contacts",
                    tab: "contact-list",
                    icon: "📞",
                    color: "text-rose-600",
                  },
                ].map((item) => (
                  <div
                    key={item.tab}
                    onClick={() => router.push(`/admin?tab=${item.tab}`)}
                    className="border border-gray-100 rounded-md p-3 cursor-pointer transition-all duration-200 hover:shadow-sm hover:border-gray-200 flex items-center"
                  >
                    <span className="text-xl mr-2">{item.icon}</span>
                    <span className={`text-sm ${item.color}`}>
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-md p-4 shadow-sm">
              <h2 className="text-sm font-medium text-gray-700 mb-3">
                Recent Activity
              </h2>
              <div className="space-y-2">
                <div className="border-l-2 border-blue-400 pl-3 py-1">
                  <p className="text-sm font-medium text-gray-700">
                    System Check
                  </p>
                  <p className="text-xs text-gray-500">
                    All systems operational
                  </p>
                </div>
                <div className="border-l-2 border-green-400 pl-3 py-1">
                  <p className="text-sm font-medium text-gray-700">Data Sync</p>
                  <p className="text-xs text-gray-500">
                    Countries and cities loaded
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main dashboard container */}
      <div className="flex h-screen overflow-hidden">
        {/* Mobile sidebar toggle button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed z-50 top-4 left-4 bg-blue-600 text-white p-2 rounded-md"
        >
          {sidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Sidebar - ensure this is the only sidebar rendered */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-80 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AdminSidebar currentTab={currentTab} />
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleSidebar}
          />
        )}

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-0">
          <div className="max-w-7xl mx-auto p-4 md:p-8 pt-8">
            {/* Page header */}
            <div className="bg-white rounded-lg p-4 mb-6 flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">
                {currentTab
                  ? currentTab
                      .replace("-", " ")
                      .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                        letter.toUpperCase()
                      )
                  : "Dashboard"}
              </h1>
              <div className="flex items-center">
                <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                  Admin
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {session?.user?.name?.[0] || "A"}
                </div>
              </div>
            </div>

            {/* Content area */}
            <div ref={contentRef}>{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// no cache of fetched data
