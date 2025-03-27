"use client";

import { useState, useEffect, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import ContactForm from "./ContactForm";

export default function Navbar({ textColor, blurredTextColor, blurBehavior }) {
  const [navBlurred, setNavBlurred] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef(null);

  const getScrollThreshold = (behavior) => {
    switch (behavior) {
      case "early":
        return window.innerHeight / 5;
      case "always":
        return -1; // always transparent
      case "mid":
      default:
        return window.innerHeight / 3.5; // current behavior
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const threshold = getScrollThreshold(blurBehavior);
      setNavBlurred(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [blurBehavior]);

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
          ? "bg-white/70 backdrop-blur-lg border-b border-zinc-300 " +
            (blurredTextColor || defaultBlurredTextColor)
          : "bg-transparent " + (textColor || defaultTextColor)
      }
       `}
    >
      <a href="/" className="text-2xl font-extrabold tracking-wide">
        Holidays
      </a>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex space-x-6 text-lg font-medium sm:mr-10">
        <a href="/about" className="hover:text-indigo-500 transition">
          About us
        </a>
        <a href="#" className="hover:text-indigo-500 transition">
          Destinations
        </a>
        <a href="#" className="hover:text-indigo-500 transition">
          Packages
        </a>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-500 text-white px-2 py-1 rounded-xl text-sm hover:bg-indigo-600 transition"
        >
          Get in Touch
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="sm:hidden text-3xl focus:outline-none"
      >
        {mobileMenuOpen ? <IoClose /> : <GiHamburgerMenu />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-xl transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }
           transition-transform duration-300 ease-in-out sm:hidden flex flex-col gap-6 p-6`}
      >
        <a href="/about" className="hover:text-indigo-500 transition">
          About Us
        </a>
        <a href="#" className="hover:text-indigo-500 transition">
          Destinations
        </a>
        <a href="#" className="hover:text-indigo-500 transition">
          Packages
        </a>

        <button
          onClick={() => {
            setIsOpen(true);
            setMobileMenuOpen(false);
          }}
          className="bg-indigo-500 text-white px-2 py-1 rounded-xl text-sm hover:bg-indigo-600 transition"
        >
          Get in Touch
        </button>
      </div>
      {/* Contact Form Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
            >
              <IoClose />
            </button>
            <ContactForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
}
