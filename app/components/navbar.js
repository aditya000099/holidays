"use client";

import { useState, useEffect, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Navbar({ textColor, blurredTextColor }) {
  const [navBlurred, setNavBlurred] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


    const navbarRef = useRef(null);


  useEffect(() => {

    const handleScroll = () => {
      if (window.scrollY > (window.innerHeight / 3.5) ) {
        setNavBlurred(true);
      } else {
        setNavBlurred(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  const defaultTextColor = "text-white";
  const defaultBlurredTextColor = "text-gray-800";

  return (
    <nav
      ref={navbarRef}
      className={`fixed top-0 z-50 w-screen p-4 flex justify-between items-center transition-all duration-300 ${
        navBlurred
          ? 'bg-white/70 backdrop-blur-md ' + (blurredTextColor || defaultBlurredTextColor)
            : 'bg-transparent ' + (textColor || defaultTextColor)
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
  );
}