"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CountryPackages({ country, packages }) {
    const router = useRouter();
  const handlePackageClick = (pkg) => {
    router.push(`/countries/${country.name}/${pkg.city.name.toLowerCase()}/${pkg.id}`);
   };

    return (
        <div  className="mb-12">
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
                        className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
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
                                  alt={'package photo'}
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
                                <p className="text-gray-600 text-sm">
                                    {pkg.durationDays} Days
                                  </p>
                             </div>

                        </div>
                   </div>
                  ))
          ) : (
             <p className="text-gray-600 text-center">No Packages found for this city.</p>
        )}
          </div>
        </div>
    );
}