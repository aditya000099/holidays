"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { CiLocationOn, CiCalendar, CiUser } from "react-icons/ci";
import { BsStarFill, BsSearch } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState("Thailand");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [navBlurred, setNavBlurred] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const carouselRef = useRef(null);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedCountryData, setSelectedCountryData] = useState(null);
    const [selectedCityData, setSelectedCityData] = useState(null);

  const packagesData = {
    Thailand: ["Bangkok", "Phuket", "Chiang Mai"],
    India: ["Goa", "Kerala", "Rajasthan"],
    "United States": ["New York", "Los Angeles", "Miami"],
    "United Kingdom": ["London", "Edinburgh", "Manchester"],
    Australia: ["Sydney", "Melbourne", "Brisbane"],
    France: ["Paris", "Nice", "Lyon"],
    // ...add more countries and cities
  };

  const ratings = {
    Bangkok: 4.5,
    Goa: 4.0,
    "New York": 4.8,
    London: 4.2,
  };

  const slides = [
    {
      image: "/thailand.jpg",
      title: "Explore Thailand's Wonders",
      description:
        "Discover ancient temples, vibrant markets, and stunning beaches. Experience the magic of Thailand.",
      price: "₹29999",
    },
    {
      image: "/india.jpg",
      title: "Journey Through Incredible India",
      description:
        "Immerse yourself in the rich culture, diverse landscapes, and spiritual heritage of India.",
      price: "₹89999",
    },
    {
      image: "/newyork.jpg",
      title: "Experience the Energy of New York",
      description:
        "Discover iconic landmarks, world-class dining, and vibrant city life in the Big Apple.",
      price: "₹99999",
    },
    {
      image: "/london.jpg",
      title: "Step into History in London",
      description:
        "Explore historical sites, museums, and experience the lively atmosphere of this iconic city",
      price: "₹119999",
    },
    {
      image: "/sydney.jpg",
      title: "Visit Sydney",
      description:
        "Discover this iconic city, amazing landscapes, and beautiful beaches",
      price: "₹129999",
    },
    {
      image: "/paris.jpg",
      title: "Explore Paris",
      description: "Explore the city of Love with the most romantic sites",
      price: "₹139999",
    },
    // Add more slides as you want
  ];


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 3.5) {
        setNavBlurred(true);
      } else {
        setNavBlurred(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [slides.length]);


  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries');
        if (response.ok) {
            const data = await response.json();
           setCountries(data);
        } else {
          console.error('Failed to fetch countries', response.status);
        }
      } catch (error) {
         console.error('Error fetching countries', error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/api/cities');
        if (response.ok) {
             const data = await response.json();
            setCities(data);
        } else {
            console.error("Error getting cities", response.status)
        }
       } catch (error) {
            console.error("Error fetching cities:", error);
      }
   }
    fetchCities()
 },[])

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages');
        if (response.ok) {
           const data = await response.json();
           setPackages(data);
        } else {
             console.error("Error fetching packages:", response.status)
        }

      } catch (error) {
         console.error("Error fetching packages:", error)
      }
    };
    fetchPackages();
  }, []);

   const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCountryClick = (country) => {
    setSelectedCountryData(country);
     setSelectedCityData(null);
  };

  const handleCityClick = (city) => {
      setSelectedCityData(city);
  }


  const filteredCities = selectedCountryData ? cities.filter(city => city.countryId === selectedCountryData.id) : []
     const filteredPackages = selectedCityData ? packages.filter(pkg => pkg.cityId === selectedCityData.id) : []

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* Navbar */}
      <nav
        className={`fixed top-0 z-50 w-screen p-4 flex justify-between items-center transition-all duration-300 ${
          navBlurred
            ? "bg-white/70 backdrop-blur-md text-gray-800"
            : "bg-transparent text-white"
        }`}
      >
        <a href="/" className="text-xl font-bold">
          Holiday Planner
        </a>

        <div className="hidden sm:flex space-x-6 mr-4">
          <a href="#" className="hover:text-gray-300">
            Destinations
          </a>
          <a href="#" className="hover:text-gray-300">
            Packages
          </a>
          <a href="#" className="hover:text-gray-300">
            About Us
          </a>
          <a href="#" className="hover:text-gray-300">
            Contact
          </a>
        </div>
        {/* Hamburger menu */}
        <button
          onClick={toggleMobileMenu}
          className="sm:hidden text-2xl focus:outline-none"
        >
          <GiHamburgerMenu />
        </button>

        {/* Mobile menu */}
        <div
          className={`${
            mobileMenuOpen ? "flex" : "hidden"
          } sm:hidden absolute top-full left-0 w-full bg-white/90 backdrop-blur-md mt-1 text-gray-800 flex-col gap-4 p-4 items-center`}
        >
          <a href="#" className="hover:text-gray-600">
            Destinations
          </a>
          <a href="#" className="hover:text-gray-600">
            Packages
          </a>
          <a href="#" className="hover:text-gray-600">
            About Us
          </a>
          <a href="#" className="hover:text-gray-600">
            Contact
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-0 sm:p-0 pb-20">
        {/* Carousel */}
        <section className="relative overflow-hidden mb-12">
          <div
            ref={carouselRef}
            className="flex rounded transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="w-full flex-shrink-0 relative">
                <Image
                  className="w-full h-full sm:h-[90vh] object-cover"
                  src={slide.image}
                  alt={slide.title}
                  width={120000}
                  height={120000}
                />
                <div className="absolute top-20 sm:top-16 mx-2 rounded-xl  text-white p-4 w-fit">
                  <div className="bg-gradient-to-t from-white/20 rounded-full to-transparent bg-opacity-50  p-4">
                    <h2 className="text-md sm:text-xl font-regular">
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
        </section>
        {/* Booking Form */}
        <div className="p-6 bg-gray-100 shadow-md relative z-20 rounded-xl mx-2 sm:mx-16 mt-2 sm:-mt-32">
          <div className="bg-white p-4 rounded-xl flex flex-col sm:flex-row justify-center items-center gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2 sm:px-20">
          {countries.map((country) => (
                <div
                   key={country.id}
                  className="relative overflow-hidden rounded-lg transition-shadow duration-300 group cursor-pointer"
                    onClick={() => handleCountryClick(country)}
                >
                    <div className="py-4">
                     <h3 className="text-xl font-extrabold text-gray-800 text-center">
                       {country.name}
                       </h3>
                   </div>
                  </div>
                ))}
             </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 px-2 sm:px-20">

            {selectedCountryData ? (
          filteredCities.length > 0 ? (
           filteredCities.map((city) => (
                  <div
                    key={city.id}
                     className="relative overflow-hidden rounded-lg transition-shadow duration-300 group cursor-pointer"
                     onClick={() => handleCityClick(city)}
                  >
                    <div className="py-4">
                      <h3 className="text-xl font-semibold text-gray-800 text-center">
                         {city.name}
                       </h3>
                   </div>
                  </div>
             ))
           ) : (
                <p className="text-gray-600 text-center">No cities to show for {selectedCountryData.name}</p>
            )
          ) : (
               <p className="text-gray-600 text-center">Click on a country to show cities</p>
           )}

         </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 px-2 sm:px-20">

           {selectedCityData ? (
               filteredPackages.length > 0 ? (
                   filteredPackages.map((pkg) => (
                     <div
                       key={pkg.id}
                        className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group"
                     >
                       <div className="py-4">
                       <h3 className="text-xl font-semibold text-gray-800">
                          {pkg.title}
                         </h3>
                          <p className="text-gray-600">From ₹{pkg.price}</p>
                     </div>
                    </div>
                ))
             ) : (
              <p className="text-gray-600 text-center">No Packages to show for {selectedCityData.name}</p>
            )
          ) : (
              <p className="text-gray-600 text-center">Click on a city to show packages.</p>
          )}
         </div>
    </section>

        <section className="mb-8 p-6 sm:p-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 text-center mb-12">
            Popular Destinations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2 sm:px-20">
            {/* Here is the card */}
            {Object.keys(ratings).map((city) => (
              <div
                key={city}
                className="relative overflow-hidden rounded-lg transition-shadow duration-300 group"
              >
                <div className="relative aspect-square">
                  <Image
                    src={`/${city.toLowerCase()}.jpg`}
                    alt={city}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
                    className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 rounded-md p-1 flex items-center text-white text-xs">
                  {ratings[city]}
                  <BsStarFill className="ml-1" />
                </div>
                <div className="py-4">
                  <h3 className="text-xl font-extrabold text-gray-800">
                    {city},{" "}
                    {city === "Bangkok"
                      ? "Thailand"
                      : city === "Goa"
                      ? "India"
                      : city === "New York"
                      ? "USA"
                      : "UK"}
                  </h3>
                  <p className="text-gray-600">
                    From ₹
                    {city === "Bangkok"
                      ? "799"
                      : city === "Goa"
                      ? "899"
                      : city === "New York"
                      ? "999"
                      : "1199"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filter by Country */}
        <section className="filter-by-country p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Filter by Country
          </h2>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="p-2 border rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.keys(packagesData).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <div className="city-packages grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {packagesData[selectedCountry].map((city) => (
              <div
                key={city}
                className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <Image
                  src={`/${city.toLowerCase()}.jpg`}
                  alt={city}
                  width={400}
                  height={300}
                  className="object-cover w-full h-60"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {city}
                  </h3>
                  <p className="text-gray-600">From ₹799</p>
                </div>
              </div>
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