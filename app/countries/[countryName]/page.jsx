"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { BsStarFill } from "react-icons/bs";
import { useParams, useRouter } from "next/navigation";
import { use } from 'react';

export default function CountryPage() {
  const params = useParams();
  const { countryName } = useParams();
  const [country, setCountry] = useState(null);
  const [cities, setCities] = useState([]);
 const router = useRouter()

    useEffect(() => {
    const fetchCountryData = async () => {
        try {
           const response = await fetch(`/api/countries`);

           if (response.ok) {
                const data = await response.json()
              const filteredCountry = data.find((country) => country.name === countryName);
              setCountry(filteredCountry);
            } else {
                console.error('Failed to fetch country', response.status);
            }
        } catch (e) {
              console.error("Error getting country", e)
        }
    }
   fetchCountryData()
 }, [countryName]);


 useEffect(() => {
    const fetchCities = async () => {
         if (country) {
          try {
            const response = await fetch(`/api/cities?countryId=${country?.id}`);
            if (response.ok) {
                const data = await response.json()
               setCities(data);
         } else {
             console.error("Error getting cities", response.status)
         }
      } catch (e) {
          console.error("Error fetching cities", e)
       }
         }
    }
    fetchCities()

  },[country])

  return (
    <div className="container mx-auto p-6 sm:p-20">
      {country ? (
        <>
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
            {country.name}
          </h1>
             {cities.length > 0 ? (
                cities.map((city) => (
                      <section key={city.id} className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                          {city.name}
                       </h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   <PackageList cityId={city.id} cityName={city.name} countryName={countryName} />
                   </div>
                 </section>
              ))
         ) : (
            <p className="text-gray-600">No cities found for {country.name}.</p>
        )}
        </>
      ) : (
         <p className="text-center text-gray-600">Loading...</p>
      )}
     </div>
  );
}

function PackageList({ cityId, cityName, countryName }) {
    const [packages, setPackages] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch(`/api/packages?cityId=${cityId}`);
                if (response.ok) {
                   const data = await response.json();
                   setPackages(data)
                } else {
                    console.error("Error getting packages", response.status)
                }
            } catch (e){
                console.error("Error getting packages:", e)
            }
        }
       fetchPackages()
    },[cityId]);

    const handlePackageClick = (pkg) => {
       router.push(`/countries/${countryName}/${cityName.toLowerCase()}/${pkg.id}`)
    };

  return (
    <>
      {packages.length > 0 ? (
        packages.map((pkg) => (
          <div
            key={pkg.id}
            className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
              onClick={() => handlePackageClick(pkg)}
          >
           <div className="py-4">
           {pkg.images && pkg.images.length > 0 ? (
                   <Image
                      src={pkg.images[0].imageUrl}
                       alt={`Image for ${pkg.title}`}
                        width={400}
                        height={300}
                      className="object-cover w-full h-60"
                      />
                ) : null
              }
                 <h3 className="text-xl font-semibold text-gray-800">
                    {pkg.title}
                </h3>
                  <p className="text-gray-600">From ₹{pkg.price}</p>
            </div>
         </div>
        ))
      ) : (
        <p className="text-gray-600">No Packages found for {cityName}.</p>
      )}
    </>
  );
}