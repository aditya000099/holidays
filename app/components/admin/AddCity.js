"use client";
import { useState, useEffect } from "react";

export default function AddCity({ countries }) {
  const [name, setName] = useState("");
  const [countryName, setCountryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("/api/cities", {
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const data = await res.json();

          // Map country information to each city using our countries prop
          const citiesWithCountryInfo = data.map((city) => {
            // Try to find the matching country from our countries prop
            const matchingCountry = countries.find(
              (country) =>
                // Match by ID if available, otherwise try to match by name
                (city.countryId && country.id === city.countryId) ||
                (city.countryName && country.name === city.countryName)
            );

            // Return enhanced city object with country info
            return {
              ...city,
              countryName:
                matchingCountry?.name || city.countryName || "Unknown",
            };
          });

          setCities(citiesWithCountryInfo);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch when countries are available
    if (countries.length > 0) {
      fetchCities();
    }
  }, [countries]); // Add countries as dependency

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/cities", {
        method: "POST",
        body: JSON.stringify({ name, countryName }),
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          revalidate: 360, // 6 mins
        },
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Successfully created city", { data });
        setName("");
        setCountryName("");
        setError("");
        // Add the new city to the local state
        setCities((prev) => [...prev, data]);
      } else {
        setError(data.message);
      }
    } catch (e) {
      console.error("Error creating cities:", e);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Add City Form */}
      <div className="bg-white p-4 rounded-md border border-gray-100">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Add New City</h2>
        {error && (
          <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded-md">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="countrySelect"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Country
            </label>
            <select
              id="countrySelect"
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
              className="w-full border border-gray-200 p-2 rounded-md text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="cityName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City Name
            </label>
            <input
              id="cityName"
              type="text"
              placeholder="Enter city name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 p-2 rounded-md text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add City"}
          </button>
        </form>
      </div>

      {/* Cities List */}
      <div className="bg-white p-4 rounded-md border border-gray-100">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Existing Cities
        </h2>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="h-5 w-5 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : cities.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No cities found
          </p>
        ) : (
          <div className="overflow-auto max-h-[400px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    City
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Country
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cities.map((city) => (
                  <tr key={city.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                      {city.name}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                      {city.country?.name || city.countryName || "Unknown"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
