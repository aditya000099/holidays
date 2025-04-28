"use client";

import { ArrowRightEndOnRectangleIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Helper function to generate random rating between 4.0 and 5.0
const getRandomRating = () => (Math.random() + 4).toFixed(1);

export default function CountryPackages({ country, packages }) {
  const router = useRouter();
  const handlePackageClick = (pkg) => {
    router.push(
      `/countries/${country.name}/${pkg.city.name.toLowerCase()}/${pkg.id}`
    );
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800 text-left">
          {country.name}
        </h2>
        <button
          onClick={() => router.push(`/countries/${country.name}`)}
          className="bg-zinc-200 text-zinc-900 text-sm px-1 py-1 rounded-xl hover:bg-zinc-300 transition-colors"
        >
          Show All
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <div
              key={pkg.id}
              className="relative bg-white overflow-hidden rounded-2xl group cursor-pointer hover:shadow-sm transition-shadow duration-300 border border-zinc-200"
              onClick={() => handlePackageClick(pkg)}
            >
              <div className="relative aspect-square overflow-hidden rounded-xl">
                {pkg.images && pkg.images.length > 0 ? (
                  <Image
                    src={pkg.images[0].imageUrl}
                    alt={`Image for ${pkg.title}`}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl"
                  />
                ) : (
                  <Image
                    src={"/default.png"}
                    alt={"package photo"}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
                    className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                {/* Duration Badge - Top Left */}
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  {pkg.durationDays} Days
                </div>
                {/* Rating Badge - Top Right with Glassmorphism */}
                <div className="absolute top-2 right-2 bg-white/30 backdrop-blur-sm text-zinc-900 text-xs font-semibold px-2 py-1 rounded flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {getRandomRating()} 
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-zinc-900 truncate">
                  {pkg.title}
                </h3>
                {/* <p className="text-gray-600 truncate overflow-hidden text-ellipsis whitespace-nowrap mb-2 max-h-[2.8rem]">
                  {pkg.description}
                </p> */}
                <div className="flex justify-between items-center text-zinc-800">
                  <div className="flex items-center">
                    <p className="text-zinc-900 font-bold">₹ {pkg.price}</p>
                    <p className="text-zinc-800">/person</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center">
                      <ArrowRightIcon className="text-white w-5 h-5" />
                    </div>
                  
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">
            No Packages found for this city.
          </p>
        )}
      </div>
    </div>
  );
}
