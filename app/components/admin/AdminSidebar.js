import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AdminSidebar({ currentTab }) {
  const router = useRouter();
  const { data: session } = useSession();

  const menuItems = [
    {
      id: "",
      label: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      id: "add-country",
      label: "Add Country",
      icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      id: "add-city",
      label: "Add City",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
    {
      id: "add-package",
      label: "Add Package",
      icon: "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      id: "package-list",
      label: "Manage Packages",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
    },
    {
      id: "contact-list",
      label: "Contact Requests",
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Brand header with gradient - reduced padding */}
      <div className="px-3 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <h2 className="text-lg font-bold tracking-tight">
          Turbans & Traditions
        </h2>
        <p className="text-blue-100 text-xs">Admin</p>
      </div>

      {/* User profile section - more compact */}
      <div className="px-3 py-2 border-b border-gray-200 flex items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
          {session?.user?.name?.[0] || "A"}
        </div>
        <div className="ml-2">
          <p className="font-medium text-sm text-gray-800">
            {session?.user?.name || "Admin User"}
          </p>
          <p className="text-xs text-gray-500">
            {session?.user?.email || "admin@example.com"}
          </p>
        </div>
      </div>

      {/* Navigation menu - reduced spacing */}
      <nav className="flex-1 py-2 px-2 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
          Main Menu
        </div>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              (item.id === "" && !currentTab) || currentTab === item.id;

            return (
              <li key={item.id} className="px-1">
                <Link href={`/admin${item.id ? `?tab=${item.id}` : ""}`}>
                  <div
                    className={`flex items-center px-2 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-600 shadow-sm border-l-2 border-blue-500"
                        : "text-gray-600 hover:bg-gray-50 hover:translate-x-1"
                    }`}
                  >
                    <div
                      className={`${
                        isActive ? "bg-blue-100" : "bg-gray-100"
                      } p-1.5 rounded-md mr-2`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ${
                          isActive ? "text-blue-600" : "text-gray-500"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={item.icon}
                        />
                      </svg>
                    </div>
                    <span
                      className={`text-sm ${
                        isActive ? "font-semibold" : "font-medium"
                      }`}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mt-4 mb-2">
          System
        </div>
        <ul className="space-y-1">
          <li className="px-1">
            <a
              href="#"
              className="flex items-center px-2 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:translate-x-1 transition-all duration-200"
            >
              <div className="bg-gray-100 p-1.5 rounded-md mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Settings</span>
            </a>
          </li>
          <li className="px-1">
            <a
              href="/api/auth/signout"
              className="flex items-center px-2 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 hover:translate-x-1 transition-all duration-200"
            >
              <div className="bg-gray-100 p-1.5 rounded-md mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Sign Out</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Footer with status - more compact */}
      <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 flex items-center">
            <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
            <span>Online</span>
          </div>
          <div className="text-xs px-1.5 py-0.5 bg-gray-200 rounded-full text-gray-600">
            v1.0
          </div>
        </div>
      </div>
    </div>
  );
}
