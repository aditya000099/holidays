'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { CiCalendar, CiLocationOn, CiUser } from "react-icons/ci";

export default function HomepageCarousel() {
  const slides = [
    {
      image: "/thailand.jpg",
      title: "Explore Thailand's Wonders",
      description:
        "Discover ancient temples, vibrant markets, and stunning beaches. Experience the magic of Thailand.",
      country: "Thailand",
      price: "₹29999",
    },
    {
      image: "/india.jpg",
      title: "Journey Through Incredible India",
      description:
        "Immerse yourself in the rich culture, diverse landscapes, and spiritual heritage of India.",
      country: "India",
      price: "₹89999",
    },
    {
      image: "/sydney.jpg",
      title: "Visit Sydney",
      description:
        "Discover this iconic city, amazing landscapes, and beautiful beaches",
      country: "Australia",
      price: "₹129999",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const router = useRouter();

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const handleCarouselClick = (slide) => {
    router.push(`/countries/${slide.country}`);
  };

  return (
    <>
      <section className="relative overflow-hidden mb-12">
        <div
          ref={carouselRef}
          className="flex rounded transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 relative cursor-pointer"
              onClick={() => handleCarouselClick(slide)}
            >
              <Image
                className="w-full h-full sm:h-[100vh] object-cover"
                src={slide.image}
                alt={slide.title}
                width={1200}
                height={600}
              />
              <div className="absolute top-20 sm:top-16 mx-2 rounded-xl  text-white p-4 w-fit">
                <div className="bg-gradient-to-t from-white/20 rounded-full to-transparent bg-opacity-50 p-4">
                  <h2 className="text-md sm:text-xl font-medium">
                    {slide.title}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Arrows for navigation */}
        <div className="absolute top-1/2 transform -translate-y-1/2 left-4 sm:left-8 text-white flex items-center">
          <button
            onClick={handlePrevSlide}
            className="bg-gray-700 hover:bg-gray-600 rounded-full p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        <div className="absolute top-1/2 transform -translate-y-1/2 right-4 sm:right-8 text-white flex items-center">
          <button
            onClick={handleNextSlide}
            className="bg-gray-700 hover:bg-gray-600 rounded-full p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div className="p-6 bg-gray-100 shadow-md relative z-20 rounded-xl mx-2 sm:mx-16 mt-2 sm:-mt-32 ">
          <div className="bg-white  p-4 rounded-xl flex flex-col sm:flex-row justify-center gap-4 items-center">
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

            <button className="bg-indigo-500 text-white p-2 rounded-full text-center">
              <BsSearch />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
