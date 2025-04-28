"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { BsStarFill } from "react-icons/bs"; // Assuming BsStarFill might be used later

export default function PackageList({ cityId, cityName, countryName, initialPackages }) {
  const router = useRouter();
  // No more useState or useEffect for packages

  const handlePackageClick = (pkg) => {
    // Decode countryName just in case it's encoded in the URL params
    const decodedCountryName = decodeURIComponent(countryName);
    router.push(
      `/countries/${decodedCountryName}/${cityName.toLowerCase()}/${pkg.id}`
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {initialPackages && initialPackages.length > 0 ? (
        initialPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
            onClick={() => handlePackageClick(pkg)}
          >
            <div className="relative aspect-square rounded-xl overflow-hidden">
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
                  src={"/default.png"} // Provide a default image path
                  alt={"package photo"}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
                  className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 truncate">
                {pkg.title}
              </h3>
              <p className="text-gray-600 truncate overflow-hidden text-ellipsis whitespace-nowrap mb-2 max-h-[2.8rem]">
                {pkg.description}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">From ₹{pkg.price}</p>
                <p className="text-gray-600 text-sm">{pkg.durationDays} Days</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600 col-span-full">No Packages found for {cityName}.</p> // Use col-span-full if inside grid
      )}
    </div>
  );
}
