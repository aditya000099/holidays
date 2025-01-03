'use client'
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Home() {
    const [selectedCountry, setSelectedCountry] = useState("Thailand");
    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselRef = useRef(null);


    const packages = {
        Thailand: ["Bangkok", "Phuket", "Chiang Mai"],
        India: ["Goa", "Kerala", "Rajasthan"],
        "United States": ["New York", "Los Angeles", "Miami"],
        "United Kingdom": ["London", "Edinburgh", "Manchester"],
        "Australia": ["Sydney", "Melbourne", "Brisbane"],
        "France": ["Paris", "Nice", "Lyon"]
        // ...add more countries and cities
    };

    const slides = [
        {
            image: "/thailand.jpg",
            title: "Explore Thailand's Wonders",
            description: "Discover ancient temples, vibrant markets, and stunning beaches. Experience the magic of Thailand.",
            price: "₹29999"
        },
        {
            image: "/india.jpg",
            title: "Journey Through Incredible India",
            description: "Immerse yourself in the rich culture, diverse landscapes, and spiritual heritage of India.",
            price: "₹89999"
        },
        {
            image: "/newyork.jpg",
            title: "Experience the Energy of New York",
            description: "Discover iconic landmarks, world-class dining, and vibrant city life in the Big Apple.",
             price: "₹99999"
        },
         {
             image: "/london.jpg",
            title: "Step into History in London",
            description: "Explore historical sites, museums, and experience the lively atmosphere of this iconic city",
             price: "₹119999"
         },
          {
            image: "/sydney.jpg",
            title: "Visit Sydney",
            description: "Discover this iconic city, amazing landscapes, and beautiful beaches",
              price: "₹129999"
        },
        {
           image: "/paris.jpg",
            title: "Explore Paris",
            description: "Explore the city of Love with the most romantic sites",
               price: "₹139999"
        }
        // Add more slides as you want

    ];


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [slides.length]);

     const handlePrevSlide = () => {
         setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1));
     };

    const handleNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    };


    return (
        <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
            {/* Navbar */}
            <nav className="bg-transparent p-4 text-white flex justify-between items-center fixed top-0 z-50 w-screen">
                <a href="/" className="text-xl font-bold">Holiday Planner</a>
                <div className="space-x-6 mr-4">
                  <a href="#" className="hover:text-gray-300">Destinations</a>
                    <a href="#" className="hover:text-gray-300">Packages</a>
                    <a href="#" className="hover:text-gray-300">About Us</a>
                    <a href="#" className="hover:text-gray-300">Contact</a>

                </div>
            </nav>

            {/* Main Content */}
            <main className="p-0 sm:p-0 pb-20">
                {/* Carousel */}
                <section className="relative overflow-hidden mb-12">
                    <div ref={carouselRef} className="flex rounded transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {slides.map((slide, index) => (
                            <div key={index} className="w-full flex-shrink-0 relative">
                                 <Image className="w-full h-full sm:h-[100vh] object-cover" src={slide.image} alt={slide.title} width={1200} height={600} />
                                 <div className="absolute bottom-0  text-white p-4 bg-gradient-to-t bg-black bg-opacity-70  w-full">
                                  <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
                                    <p className="mb-2">{slide.description}</p>
                                    <p className="text-xl font-bold">Price : {slide.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                     {/* Arrows for navigation */}
                     <div className="absolute top-1/2 transform -translate-y-1/2 left-4 sm:left-8 text-white flex items-center">
                          <button onClick={handlePrevSlide} className="bg-gray-700 hover:bg-gray-600 rounded-full p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                    </div>

                        <div className="absolute top-1/2 transform -translate-y-1/2 right-4 sm:right-8 text-white flex items-center">
                        <button onClick={handleNextSlide} className="bg-gray-700 hover:bg-gray-600 rounded-full p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                            </svg>
                           </button>
                        </div>


                </section>

                <section className="mb-8 p-6 sm:p-20">
                    <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-12">Popular Destinations</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-20">
                        <div className="relative overflow-hidden rounded-lg  transition-shadow duration-300">
                            <Image src="/bangkok.jpg" alt="Bangkok" width={400} height={400} className="object-cover rounded-xl w-64 h-64" />
                            <div className="py-4">
                                <h3 className="text-xl font-extrabold text-gray-800">Bangkok, Thailand</h3>
                                <p className="text-gray-600">From ₹799</p>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-lg">
                            <Image src="/goa.jpg" alt="Goa" width={400} height={400} className="object-cover rounded-xl w-64 h-64" />
                            <div className="py-4">
                                <h3 className="text-xl font-extrabold text-gray-800">Goa, India</h3>
                                <p className="text-gray-600">From ₹899</p>
                            </div>
                        </div>
                          <div className="relative overflow-hidden">
                            <Image src="/newyork.jpg" alt="New York" width={400} height={400} className="object-cover rounded-xl w-64 h-64" />
                            <div className="py-4">
                                <h3 className="text-xl font-extrabold text-gray-800">New York, USA</h3>
                                <p className="text-gray-600">From ₹999</p>
                            </div>
                        </div>
                         <div className="relative overflow-hidden ">
                            <Image src="/london.jpg" alt="London" width={400} height={400} className="object-cover rounded-xl w-64 h-64" />
                            <div className="py-4">
                                <h3 className="text-xl font-extrabold text-gray-800">London, UK</h3>
                                 <p className="text-gray-600">From ₹1199</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filter by Country */}
                <section className="filter-by-country p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter by Country</h2>
                    <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="p-2 border rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {Object.keys(packages).map((country) => (
                            <option key={country} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                    <div className="city-packages grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {packages[selectedCountry].map((city) => (
                            <div key={city} className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                                <Image src={`/${city.toLowerCase()}.jpg`} alt={city} width={400} height={300} className="object-cover w-full h-60" />
                                <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-800">{city}</h3>
                                     <p className="text-gray-600">From ₹799</p>
                                </div>

                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <footer className="bg-gray-800 p-6 text-white text-center">
             <p>© {new Date().getFullYear()} Holiday Planner. All rights reserved.</p>
             </footer>
        </div>
    );
}