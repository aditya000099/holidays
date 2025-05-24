import Image from "next/image";
import { BsStarFill } from "react-icons/bs";
import Navbar from "@/app/components/navbar";
import { notFound } from "next/navigation";
import PackageList from "@/app/components/CountryPagePackageList";

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

export default async function CountryPage({ params }) {
  // Fix the dynamic params warning by properly awaiting params
  const { countryName } = params;

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
