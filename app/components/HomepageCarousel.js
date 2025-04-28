"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; 
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"; 
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion"; 
import SearchBox from "./SearchBox"; 

export default function HomepageCarousel({ cities }) {
  const slides = [
    {
      image: "/tm.jpg",
      country: "thailand",
    },
    {
      image: "/tungnath.jpg",
      country: "india",
    },
    {
      image: "/mun.jpg",
      country: "india",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const intervalRef = useRef(null); 

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    resetInterval(); 
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1
    );
    resetInterval(); 
  };

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 20000);
  };

  useEffect(() => {
    resetInterval(); 
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [slides.length]); 

  const handleCarouselClick = () => {
    const country = slides[currentSlide]?.country || "India"; 
    router.push(`/countries/${country.charAt(0).toUpperCase() + country.slice(1)}`);
  };

  return (
    <section className="relative overflow-hidden mt-14 mb-12 sm:px-28 p-4 h-[60vh] sm:h-[92vh]">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            <Image
              className="w-full h-full object-cover rounded-xl cursor-pointer"
              src={slide.image}
              alt={slide.country || `Slide ${index + 1}`}
              width={1920} 
              height={1080}
              priority={index === 0} 
              onClick={handleCarouselClick}
            />
          </div>
        ))}
      </div>

      {/* Moved Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 sm:px-6 z-20 pointer-events-none">
        <motion.div
          className="text-center w-full max-w-4xl mx-auto pointer-events-auto" // Allow pointer events on content
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-2 sm:mb-4 text-shadow-lg leading-tight">
            Discover <span className="text-yellow-400">Unforgettable</span>{" "}

            Journeys
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-8 max-w-2xl mx-auto text-gray-100">
            Explore curated holiday experiences tailored to your travel dreams
          </p>

          <div className="w-full max-w-3xl mx-auto px-4 sm:px-0">
            {/* Pass cities prop to SearchBox */}
            <SearchBox cities={cities} />
          </div>
        </motion.div>
      </div>

      {/* Navigation Buttons - Ensure higher z-index */}
      <div className="absolute bottom-6 left-6 sm:left-32 z-30 flex space-x-2">
        <button
          onClick={prevSlide}
          className="bg-white rounded-full p-2 shadow hover:bg-gray-200 transition-colors"
          aria-label="Previous Slide"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-800" />
        </button>
        <button
          onClick={nextSlide}
          className="bg-white rounded-full p-2 shadow hover:bg-gray-200 transition-colors"
          aria-label="Next Slide"
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-800" />
        </button>
      </div>
    </section>
  );
}
