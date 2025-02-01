"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import AddCountry from "../components/admin/AddCountry";
import AddCity from "../components/admin/AddCity";
import AddPackage from "../components/admin/AddPackage";
import PackageList from "../components/admin/PackageList";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/navbar";
import ContactFormList from "../components/admin/ContactFormList";

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "";
  const [isAdmin, setIsAdmin] = useState(null);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const contentRef = useRef(null);
  const [isContentScrolling, setIsContentScrolling] = useState(false);

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
          fetch(`/api/countries`),
          fetch(`/api/cities`),
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
      <div className="min-h-screen font-[family-name:var(--font-geist-sans)] flex">
        <Navbar textColor={"text-gray-800"} blurredTextColor={"text-black"} />
        <AdminSidebar paddingTop="mt-20" />
        <div
          ref={contentRef}
          className={`container mx-auto p-6 sm:p-20 flex-1  ${
            isContentScrolling ? "overflow-y-scroll" : ""
          }`}
        >
          <div className="w-full h-screen flex justify-center items-center text-3xl text-bold fade-in-5">
            Loading...
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
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Welcome to Admin Panel
            </h2>
            <p className="text-gray-700">
              Select an option from the sidebar to start using the admin panel.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] flex">
      <Navbar textColor={"text-gray-800"} blurredTextColor={"text-black"} />
      <AdminSidebar paddingTop="mt-20" />
      <div
        ref={contentRef}
        className={`container mx-auto p-6 sm:p-20 flex-1  ${
          isContentScrolling ? "overflow-y-scroll" : ""
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
}
