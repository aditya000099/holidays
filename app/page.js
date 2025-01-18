import Image from "next/image";
import { CiLocationOn, CiCalendar, CiUser } from "react-icons/ci";
import { BsStarFill, BsSearch } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import Auth from "./auth/page";
import CountryPackages from "./components/CountryPackages";
import Navbar from "./components/navbar";
import HomepageCarousel from "./components/HomepageCarousel";
import prisma from "@/prisma/client";

export default async function Home() {
  const countries = await prisma.country.findMany();
  const cities = await prisma.city.findMany();
  let packages = await prisma.package.findMany({
    include: {
      city: true,
      images: true,
      itinerary: true,
    },
  });
  packages = packages.map((pkg) => ({
    ...pkg,
    price: pkg.price.toNumber(),
    itinerary:
      pkg.itinerary?.map((item) => ({
        ...item,
        day: item.day,
      })) || [],
  }));

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Navbar />

      {/* Main Content */}
      <main className="p-0 sm:p-0 pb-20">
        {/* Carousel */}
        <HomepageCarousel />
        {/* Booking Form */}
        <div className="p-6 bg-gray-100 shadow-md relative z-20 rounded-xl mx-2 sm:mx-16 mt-2 sm:-mt-32 ">
          <div className="bg-white  p-4 rounded-xl flex flex-col sm:flex-row justify-center items-center gap-4 items-center">
            <div className="flex items-center w-full sm:w-auto">
              <CiLocationOn className="text-gray-700 text-xl mr-2" />
              <input
                type="text"
                placeholder="Location"
                className="bg-transparent border-none placeholder:text-gray-500 focus:ring-0 focus:outline-none w-full"
              />
            </div>
            <div className="flex items-center w-full sm:w-auto">
              <CiCalendar className="text-gray-700 text-xl mr-2" />
              <input
                type="text"
                placeholder="Check In"
                className="bg-transparent border-none placeholder:text-gray-500 focus:ring-0 focus:outline-none w-full"
              />
            </div>
            <div className="flex items-center w-full sm:w-auto">
              <CiCalendar className="text-gray-700 text-xl mr-2" />
              <input
                type="text"
                placeholder="Check Out"
                className="bg-transparent border-none placeholder:text-gray-500 focus:ring-0 focus:outline-none w-full"
              />
            </div>

            <div className="flex items-center w-full sm:w-auto">
              <CiUser className="text-gray-700 text-xl mr-2" />
              <input
                type="number"
                placeholder="Guests"
                className="bg-transparent border-none placeholder:text-gray-500 focus:ring-0 focus:outline-none w-full"
              />
            </div>

            <button className="bg-blue-500 text-white p-2 rounded-full text-center">
              <BsSearch />
            </button>
          </div>
        </div>

        <section className="mt-16 p-6 sm:p-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 text-center mb-12">
            Explore Destinations
          </h2>
          <div className="flex flex-col gap-8 px-2 sm:px-20">
            {countries.map((country) => (
              <CountryPackages
                key={country.id}
                country={country}
                packages={packages.filter(
                  (pkg) => pkg.city.countryId === country.id
                )}
              />
            ))}
          </div>
        </section>
      </main>
      <footer className="bg-gray-800 p-6 text-white text-center">
        <p>
          © {new Date().getFullYear()} Holiday Planner. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
