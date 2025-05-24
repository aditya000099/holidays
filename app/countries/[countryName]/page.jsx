import Image from "next/image";
import { BsStarFill } from "react-icons/bs";
import Navbar from "@/app/components/navbar";
import { notFound } from "next/navigation";
import PackageList from "@/app/components/CountryPagePackageList";
import { Suspense } from "react";

// Helper function to fetch data with proper URL formatting
async function fetchData(path, options = {}) {
  // Create a valid URL by using the absolute URL format
  const url = new URL(
    path,
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
  );

  console.log(`[fetchData] Fetching from: ${url.toString()}`);

  try {
    const response = await fetch(url.toString(), {
      // Cache data for better performance, revalidate as needed
      next: { revalidate: 3600 }, // Revalidate every hour
      ...options,
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

// Fetch country, cities, and packages data server-side
async function getCountryPageData(countryName) {
  // Normalize the country name for case-insensitive comparison
  const normalizedCountryName = countryName.toLowerCase().trim();
  console.log(
    `[getCountryPageData] Looking for country with normalized name: ${normalizedCountryName}`
  );

  // 1. Fetch all countries
  const countries = await fetchData(`/api/countries`);
  console.log(
    `[getCountryPageData] Fetched ${countries?.length || 0} countries`
  );

  if (!countries || countries.length === 0) {
    console.error("[getCountryPageData] No countries found or API error");
    return null;
  }

  // Case-insensitive country lookup
  const country = countries.find(
    (c) => c.name.toLowerCase().trim() === normalizedCountryName
  );

  console.log(
    `[getCountryPageData] Country match result:`,
    country ? country.name : "No match found"
  );

  if (!country) {
    return null; // Country not found
  }

  // 2. Fetch cities for this country
  const cities = await fetchData(`/api/cities?countryId=${country.id}`);
  console.log(
    `[getCountryPageData] Fetched ${cities?.length || 0} cities for ${
      country.name
    }`
  );

  if (!cities || cities.length === 0) {
    return { country, cities: [], packagesByCity: {} }; // Country found, but no cities
  }

  // 3. Fetch packages for all cities concurrently
  const packagePromises = cities.map((city) =>
    fetchData(`/api/packages?cityId=${city.id}`).then((packages) => ({
      cityId: city.id,
      packages: packages || [], // Ensure packages is an array even if fetch fails/returns null
    }))
  );

  // Wait for all package requests to complete
  const packageResults = await Promise.all(packagePromises);

  // Log package counts for debugging
  console.log(
    `[getCountryPageData] Packages found for cities:`,
    packageResults
      .map((r) => `${r.cityId}: ${r.packages?.length || 0}`)
      .join(", ")
  );

  // Organize packages by city ID for easy lookup
  const packagesByCity = packageResults.reduce((acc, result) => {
    acc[result.cityId] = result.packages;
    return acc;
  }, {});

  return { country, cities, packagesByCity };
}

// Skeleton loader component for country page
function CountryPageSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Country title skeleton */}
      <div className="flex justify-center mb-8">
        <div className="h-10 bg-gray-200 rounded w-1/3 max-w-md"></div>
      </div>

      {/* City sections skeleton - create 3 placeholder cities */}
      {[1, 2, 3].map((idx) => (
        <div key={idx} className="mb-12">
          {/* City title skeleton */}
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>

          {/* Packages grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Generate 3 package skeletons per city */}
            {[1, 2, 3].map((packageIdx) => (
              <div
                key={packageIdx}
                className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                {/* Package image skeleton */}
                <div className="w-full h-48 bg-gray-300"></div>

                {/* Package content skeleton */}
                <div className="p-4">
                  {/* Title */}
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>

                  {/* Description */}
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>

                  {/* Price and rating */}
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function CountryPage({ params }) {
  // Fix the dynamic params warning by properly awaiting params
  const { countryName } = params;

  // Decode and normalize the country name from the URL parameter
  const decodedCountryName = decodeURIComponent(countryName);
  console.log(
    `[CountryPage] Attempting to fetch data for: ${decodedCountryName}`
  );

  return (
    <div>
      <Navbar textColor={"text-gray-800"} blurredTextColor={"text-black"} />
      <div className="container mx-auto p-6 sm:p-20">
        <Suspense fallback={<CountryPageSkeleton />}>
          <CountryContent countryName={decodedCountryName} />
        </Suspense>
      </div>
    </div>
  );
}

// Separate component to fetch and display country content
async function CountryContent({ countryName }) {
  const data = await getCountryPageData(countryName);

  // Enhanced debugging for data fetching result
  if (data) {
    console.log(`[CountryPage] Data found for ${countryName}:`, {
      country: data.country?.name,
      citiesCount: data.cities?.length,
      packagesByCityCount: Object.keys(data.packagesByCity || {}).length,
    });
  } else {
    console.error(`[CountryPage] No data found for ${countryName}`);
  }

  // Handle cases where data fetching failed or country not found
  if (!data || !data.country) {
    console.error(
      `[CountryPage] Country not found or data fetch failed for: ${countryName}. Calling notFound().`
    );
    notFound(); // Use Next.js notFound() for 404 page
  }

  const { country, cities, packagesByCity } = data;
  console.log(`[CountryPage] Rendering page for country: ${country.name}`);

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
        {country.name}
      </h1>
      {cities.length > 0 ? (
        cities
          .filter(
            (city) =>
              packagesByCity[city.id] && packagesByCity[city.id].length > 0
          )
          .map((city) => (
            <section key={city.id} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {city.name}
              </h2>
              {/* Pass pre-fetched packages to the Client Component */}
              <PackageList
                cityId={city.id}
                cityName={city.name}
                countryName={countryName} // Keep countryName for routing
                initialPackages={packagesByCity[city.id] || []} // Pass fetched packages
              />
            </section>
          ))
      ) : (
        <p className="text-center text-gray-600">
          No cities found for {country.name}.
        </p>
      )}
    </>
  );
}
