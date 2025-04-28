export const dynamic = "force-dynamic";

import Image from "next/image";
import {
  BsStarFill,
 
} from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import Auth from "./auth/page";
import CountryPackages from "./components/CountryPackages";
import Navbar from "./components/navbar";
import HomepageCarousel from "./components/HomepageCarousel";
import { MotionDiv } from "./components/MotionWrapper";
import SearchBox from "./components/SearchBox";
import prisma from "@/prisma/client";
import BackgroundDots from "./components/background/DotPattern";
import CustomFooter from "./components/CustomFooter";

export default async function Home() {
  const countries = await prisma.country.findMany();
  const cities = await prisma.city.findMany({
    include: {
      country: true, // Include country data for each city
    },
  });
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
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]  relative">
      {/* Decorative background elements */}
      <div className="hidden md:block absolute top-40 left-10 w-40 h-40 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="hidden md:block absolute top-56 right-10 w-60 h-60 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="hidden md:block absolute bottom-40 left-1/3 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <Navbar />

      {/* Hero Section now integrated into Carousel */}
      <section className="relative h-[60vh] sm:h-[90vh]">
        {/* Pass cities prop to the carousel */}
        <HomepageCarousel cities={cities} />
      </section>

      {/* Main Content with improved styling */}
      <main className="p-0 sm:p-0 pb-20 relative z-10">
        <BackgroundDots className={"-z-50"} />
        <section className="mt-16 p-6 sm:p-20">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-800 text-center mb-6 relative">
              <span className="text-zinc-900">
                Explore Destinations
              </span>
              <div className="absolute w-24 h-1 bg-yellow-400 bottom-0 left-1/2 transform -translate-x-1/2 rounded-full"></div>
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
              Find your perfect holiday from our carefully selected destinations
            </p>
          </MotionDiv>

          <div className="flex flex-col gap-12 px-2 sm:px-20">
            {countries.map((country, index) => (
              <MotionDiv
                key={country.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              >
                {/* <div className="relative mb-8">
                  <h3 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-6 inline-block relative">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                      {country.name}
                    </span>
                    <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></div>
                  </h3>
                </div> */}
                <CountryPackages
                  country={country}
                  packages={packages.filter(
                    (pkg) => pkg.city.countryId === country.id
                  )}
                />
              </MotionDiv>
            ))}
          </div>
        </section>

        {/* Features section */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl mx-6 sm:mx-20 my-10">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 relative">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Why Choose Us
              </span>
              <div className="absolute w-20 h-1 bg-yellow-400 bottom-0 left-1/2 transform -translate-x-1/2 rounded-full"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <MotionDiv
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4 mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
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
                <h3 className="text-xl font-semibold text-center mb-2">
                  Handpicked Destinations
                </h3>
                <p className="text-gray-600 text-center">
                  Carefully selected locations to ensure the best experience for
                  your journey.
                </p>
              </MotionDiv>

              <MotionDiv
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  Best Price Guarantee
                </h3>
                <p className="text-gray-600 text-center">
                  We offer competitive prices and value for your dream holidays.
                </p>
              </MotionDiv>

              <MotionDiv
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  24/7 Support
                </h3>
                <p className="text-gray-600 text-center">
                  Our team is always available to assist you throughout your
                  journey.
                </p>
              </MotionDiv>
            </div>
          </div>
        </section>

        {/* Testimonials section could be added here */}
        <section className="py-16 px-6 sm:px-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            What Our Travelers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial cards would go here */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover-card-animation">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <div className="flex text-yellow-400">
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "The trip to Rajasthan was amazing! Every detail was perfectly
                arranged and the cultural experiences were unforgettable."
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer could be added here */}
      <CustomFooter />
    </div>
  );
}
