"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Navbar from "@/app/components/navbar";

export default function PackagePage() {
  const { countryName, cityName, packageId } = useParams();
  const [pkg, setPackage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const response = await fetch(`/api/packages?cityId= ${cityName} `);
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
    <div>
      <Navbar textColor={"text-gray-800"} blurredTextColor={"text-black"} />
      <div className="container mx-auto p-6 sm:p-20">
        {pkg ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {pkg.title}
            </h2>
            {pkg.images && pkg.images.length > 0 ? (
              pkg.images.length === 1 ? (
                <div className="relative overflow-hidden rounded-lg shadow-md mb-4">
                  <Image
                    src={pkg.images[0].imageUrl}
                    alt={`Image for ${pkg.title}`}
                    width={1200}
                    height={600}
                    className="object-cover w-full h-96"
                  />
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-lg shadow-md mb-4">
                  <div
                    ref={carouselRef}
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${currentImageIndex * 100}%)`,
                    }}
                  >
                    {pkg.images.map((image, index) => (
                      <div
                        key={index}
                        className="w-full flex-shrink-0 relative"
                      >
                        <Image
                          src={image.imageUrl}
                          alt={`Image for ${pkg.title}`}
                          width={1200}
                          height={600}
                          className="object-cover w-full h-96"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-1/2 transform -translate-y-1/2 left-4 sm:left-8 text-white flex items-center">
                    <button
                      onClick={handlePrevImage}
                      className="bg-gray-700 hover:bg-gray-600 rounded-full p-2"
                    >
                      <MdChevronLeft className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="absolute top-1/2 transform -translate-y-1/2 right-4 sm:right-8 text-white flex items-center">
                    <button
                      onClick={handleNextImage}
                      className="bg-gray-700 hover:bg-gray-600 rounded-full p-2"
                    >
                      <MdChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              )
            ) : null}

            <p className="text-gray-600 mb-4">{pkg.description}</p>
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Highlights:
              </h3>
              <ul className="list-disc list-inside text-gray-700">
                {pkg.highlights?.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Inclusions:
              </h3>
              <ul className="list-disc list-inside text-gray-700">
                {pkg.inclusions?.map((inclusion, index) => (
                  <li key={index}>{inclusion}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Exclusions:
              </h3>
              <ul className="list-disc list-inside text-gray-700">
                {pkg.exclusions?.map((exclusion, index) => (
                  <li key={index}>{exclusion}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Itinerary:
              </h3>
              {pkg.itinerary?.map((item) => (
                <div
                  key={item.id}
                  className="mb-4 p-4 border rounded-lg shadow-sm"
                >
                  <h4 className="text-lg font-medium text-gray-700">
                    Day {item.day}: {item.title}
                  </h4>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  {item.image && (
                    <div className="relative overflow-hidden rounded-lg shadow-sm mb-4">
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

            <p className="text-gray-700 font-semibold">Price: ₹{pkg.price}</p>
            <p className="text-gray-700 font-semibold">
              Duration: {pkg.durationDays} days
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
