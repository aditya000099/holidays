"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import {
  FaMapMarkerAlt,
  FaClock,
  FaRupeeSign,
  FaRegCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import Navbar from "@/app/components/navbar";
import ContactForm from "@/app/components/ContactForm";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PackagePage() {
  const { countryName, cityName, packageId } = useParams();
  const [pkg, setPackage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const response = await fetch(`/api/packages?cityId=${cityName}`);
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
    <div className="font-geist-sans">
      <Navbar
        textColor={"text-gray-800"}
        blurredTextColor={"text-black"}
        blurBehavior={"always"}
      />
      <div className="p-6 sm:mx-60 sm:py-20 border">
        {pkg ? (
          <div className="bg-white rounded-lg   p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {pkg.title}
              </h2>
              {/* Book Package Button with Modal */}

              <button
                className="bg-indigo-500 text-white px-6 py-1 rounded-xl hover:bg-indigo-600 transition-colors"
                onClick={() => setIsOpen(true)}
              >
                Enquire now
              </button>
              <ContactForm
                packageId={packageId}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
              />
            </div>

            {/* Image Carousel */}
            <div className="relative overflow-hidden rounded-lg shadow-md mb-4">
              <Image
                src={pkg.images[currentImageIndex].imageUrl}
                alt={`Image for ${pkg.title}`}
                width={1200}
                height={1200}
                className="object-cover w-full h-[28rem]"
              />
              <button
                onClick={handlePrevImage}
                className="absolute top-1/2 transform -translate-y-1/2 left-4 bg-gray-700 hover:bg-gray-600 rounded-full p-2 text-white"
              >
                <MdChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute top-1/2 transform -translate-y-1/2 right-4 bg-gray-700 hover:bg-gray-600 rounded-full p-2 text-white"
              >
                <MdChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Package Info */}
            <p className="text-gray-600 mb-4">{pkg.description}</p>
            <div className="flex items-center gap-4 text-gray-700 mb-4">
              <FaMapMarkerAlt className="text-xl" /> <span>{pkg.location}</span>
              <FaClock className="text-xl" />{" "}
              <span>{pkg.durationDays} days</span>
              <FaRupeeSign className="text-xl" /> <span>{pkg.price}</span>
            </div>

            {/* Day-wise Itinerary */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Itinerary:
              </h3>
              {pkg.itinerary?.map((item, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border rounded-lg shadow-sm bg-gray-50"
                >
                  <h4 className="text-lg font-medium text-gray-700">
                    Day {item.day}: {item.title}
                  </h4>
                  <p className="text-gray-600">{item.description}</p>
                  {item.image && (
                    <div className="relative overflow-hidden rounded-lg shadow-sm mt-2">
                      <Image
                        src={item.image}
                        alt={`Itinerary Image`}
                        width={300}
                        height={200}
                        className="object-cover w-full h-48"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Highlights:
              </h3>
              <ul className="list-disc list-inside text-gray-700">
                {pkg.highlights?.map((highlight, index) => (
                  <li key={index}>
                    <FaCheckCircle className="inline text-green-500 mr-2" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Inclusions */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Inclusions:
              </h3>
              <ul className="list-disc list-inside text-gray-700">
                {pkg.inclusions?.map((inclusion, index) => (
                  <li key={index}>
                    <FaCheckCircle className="inline text-blue-500 mr-2" />
                    {inclusion}
                  </li>
                ))}
              </ul>
            </div>
            {/* Exclusions */}
            {pkg.exclusions?.length > 0 && pkg.exclusions != "" && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Exclusions:
                </h3>
                <ul className="list-disc list-inside text-gray-700">
                  {pkg.exclusions?.map((exclusion, index) => (
                    <li key={index}>
                      {/* <FaCheckCircle className="inline text-blue-500 mr-2" /> */}
                      {exclusion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
