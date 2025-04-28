import Image from "next/image";
import { BsStarFill } from "react-icons/bs";
import Navbar from "@/app/components/navbar";
import { notFound } from "next/navigation";
import PackageList from "@/app/components/CountryPagePackageList"; // Assuming PackageList moved to components

// Helper function to fetch data (replace with your actual API base URL if needed)
async function fetchData(url, options = {}) {
  // In a real app, use process.env.API_BASE_URL or similar
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"; // Or your actual API base
  try {
    const response = await fetch(`${baseUrl}${url}`, {
      // Cache data for better performance, revalidate as needed
      next: { revalidate: 3600 }, // Revalidate every hour, adjust as needed
      ...options,
    });
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null; // Or throw an error
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null; // Or throw an error
  }
}

// Fetch country, cities, and packages data server-side
async function getCountryPageData(countryName) {
  // 1. Fetch the specific country
  // Assuming an endpoint like /api/countries?name=... or /api/countries/slug/...
  // Using a filter approach for now, but a direct lookup is better.
  const countries = await fetchData(`/api/countries`);
  const country = countries?.find(
    (c) => c.name.toLowerCase() === decodeURIComponent(countryName).toLowerCase()
  );

  if (!country) {
    return null; // Country not found
  }

  // 2. Fetch cities for this country
  const cities = await fetchData(`/api/cities?countryId=${country.id}`);
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

  const packageResults = await Promise.all(packagePromises);

  // Organize packages by city ID for easy lookup
  const packagesByCity = packageResults.reduce((acc, result) => {
    acc[result.cityId] = result.packages;
    return acc;
  }, {});

  return { country, cities, packagesByCity };
}

export default async function CountryPage({ params }) {
  // Decode the country name from the URL parameter
  const decodedCountryName = decodeURIComponent(params.countryName);
  console.log(`[CountryPage] Attempting to fetch data for: ${decodedCountryName}`);

  const data = await getCountryPageData(decodedCountryName);
  console.log(`[CountryPage] Data received for ${decodedCountryName}:`, data ? 'Data found' : 'No data found', data);

  // Handle cases where data fetching failed or country not found
  if (!data || !data.country) {
    console.error(`[CountryPage] Country not found or data fetch failed for: ${decodedCountryName}. Calling notFound().`);
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
            .filter((city) => packagesByCity[city.id] && packagesByCity[city.id].length > 0)
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
