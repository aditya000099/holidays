import Image from "next/image";
import { BsStarFill } from "react-icons/bs";
import Navbar from "@/app/components/navbar";
import { notFound } from "next/navigation";
import PackageList from "@/app/components/CountryPagePackageList";

// Helper function to fetch data with absolute URL support
async function fetchData(path, options = {}) {
  // Create an absolute URL that works in both environments
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  const url = new URL(path, baseUrl).toString();
  console.log(`[fetchData] Fetching from: ${url}`);

  try {
    const response = await fetch(url, {
      // Cache data for better performance
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

export default async function CountryPage({ params }) {
  // Handle dynamic params properly in Next.js App Router
  if (!params || typeof params.countryName !== "string") {
    console.error("[CountryPage] Invalid params:", params);
    notFound();
  }

  // Use the countryName directly
  const countryName = params.countryName;

  // Decode and normalize the country name from the URL parameter
  const decodedCountryName = decodeURIComponent(countryName);
  console.log(
    `[CountryPage] Attempting to fetch data for: ${decodedCountryName}`
  );

  const data = await getCountryPageData(decodedCountryName);

  // Enhanced debugging for data fetching result
  if (data) {
    console.log(`[CountryPage] Data found for ${decodedCountryName}:`, {
      country: data.country?.name,
      citiesCount: data.cities?.length,
      packagesByCityCount: Object.keys(data.packagesByCity || {}).length,
    });
  } else {
    console.error(`[CountryPage] No data found for ${decodedCountryName}`);
  }

  // Handle cases where data fetching failed or country not found
  if (!data || !data.country) {
    console.error(
      `[CountryPage] Country not found or data fetch failed for: ${decodedCountryName}. Calling notFound().`
    );
    notFound(); // Use Next.js notFound() for 404 page
  }

  const { country, cities, packagesByCity } = data;
  console.log(`[CountryPage] Rendering page for country: ${country.name}`);

  return (
    <div>
      <Navbar textColor={"text-gray-800"} blurredTextColor={"text-black"} />
      <div className="container mx-auto p-6 sm:p-20">
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
                  countryName={decodedCountryName} // Keep countryName for routing
                  initialPackages={packagesByCity[city.id] || []} // Pass fetched packages
                />
              </section>
            ))
        ) : (
          <p className="text-center text-gray-600">
            No cities found for {country.name}.
          </p>
        )}
      </div>
    </div>
  );
}
