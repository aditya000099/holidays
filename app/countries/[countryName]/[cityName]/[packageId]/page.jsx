"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
// Replace FA icons with Lucide
import {
  MapPin,
  Clock,
  IndianRupee,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/app/components/navbar";
import ContactForm from "@/app/components/ContactForm";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomFooter from "@/app/components/CustomFooter";

export default function PackagePage() {
  const { countryName, cityName, packageId } = useParams();
  const [pkg, setPackage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const response = await fetch(`/api/packages?cityId=${cityName}`, {
          next: {
            revalidate: 360, // 6 mins
          },
        });
        if (response.ok) {
          const data = await response.json();
          const filteredPackage = data.find(
            (pack) => pack.id === parseInt(packageId)
          );
          setPackage(filteredPackage);
        } else {
          console.error("There was an error", response.status);
        }
      } catch (e) {
        console.error("Error while fetching the package", e);
      }
    };
    fetchPackageData();
  }, [packageId, cityName]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? pkg.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % pkg.images.length);
  };

  return (
    <div className="font-geist-sans relative">
      <Navbar
        textColor={"text-gray-800"}
        blurredTextColor={"text-black"}
        blurBehavior={"always"}
      />

      {pkg ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative">
          {/* Vertical Lines - Desktop Only */}
          <div className="hidden lg:block">
            <div
              className="fixed top-0 left-0 w-px h-screen bg-gradient-to-b from-transparent via-gray-200 to-transparent opacity-30"
              style={{ left: "15%" }}
            />
            <div
              className="fixed top-0 right-0 w-px h-screen bg-gradient-to-b from-transparent via-gray-200 to-transparent opacity-30"
              style={{ right: "15%" }}
            />
          </div>

          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg mb-8 sm:mt-10 mt-10 max-w-5xl mx-auto">
            {pkg.images && pkg.images.length > 0 ? (
              <>
                <Image
                  src={
                    pkg.images[currentImageIndex]?.imageUrl ||
                    "/placeholder-image.jpg"
                  }
                  alt={`Image for ${pkg.title}`}
                  width={1920}
                  height={1080}
                  className="object-cover w-full h-[40vh] md:h-[80vh]"
                  priority
                />
                {/* Side Fade Effects */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/20 to-transparent" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/20 to-transparent" />

                {/* Bottom Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

                {/* Navigation Buttons */}
                {pkg.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-2 rounded-full transition-all group"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-2 rounded-full transition-all group"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {pkg.images.map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentImageIndex === idx
                          ? "bg-white w-4"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                      onClick={() => setCurrentImageIndex(idx)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-[40vh] md:h-[60vh] bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No images available</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {pkg.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-500" />
                    <span>{pkg.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-500" />
                    <span>{pkg.durationDays} days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-indigo-500" />
                    <span className="font-semibold">{pkg.price}</span>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              {/* Itinerary section with enhanced styling */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-indigo-500" />
                  Day-by-Day Itinerary
                </h2>
                <div className="space-y-4">
                  {pkg.itinerary?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Day {item.day}: {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Enquire Now
                  </button>

                  {/* Highlights */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Highlights
                    </h3>
                    <ul className="space-y-2">
                      {pkg.highlights?.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-600">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Inclusions */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      What's Included
                    </h3>
                    <ul className="space-y-2">
                      {pkg.inclusions?.map((inclusion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="text-indigo-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-600">{inclusion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exclusions */}
                  {pkg.exclusions?.length > 0 && pkg.exclusions != "" && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Not Included
                      </h3>
                      <ul className="space-y-2">
                        {pkg.exclusions?.map((exclusion, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-gray-600"
                          >
                            <span className="block w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                            <span>{exclusion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Booking Button */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg lg:hidden z-50">
            <button
              onClick={() => setIsOpen(true)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Enquire Now
            </button>
          </div>

          <ContactForm
            packageId={packageId}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </div>
      ) : (
        <div className="min-h-screen flex justify-center items-center">
          <div className="animate-pulse text-2xl text-gray-400">Loading...</div>
        </div>
      )}
      <CustomFooter />
    </div>
  );
}
