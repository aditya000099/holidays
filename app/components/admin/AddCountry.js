"use client";
import { useState, useEffect } from "react";

export default function AddCountry({ onCountryAdded }) {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("/api/countries", {
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const data = await res.json();
          setCountries(data);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/countries", {
        method: "POST",
        body: JSON.stringify({ name, currency }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Successfully created the country", { data });
        setName("");
        setCurrency("");
        setError("");
        onCountryAdded(data);
        // Add the new country to the local state
        setCountries((prev) => [...prev, data]);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error creating country", error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Add Country Form */}
      <div className="bg-white p-4 rounded-md border border-gray-100">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Add New Country
        </h2>
        {error && (
          <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded-md">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="countryName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Country Name
            </label>
            <input
              id="countryName"
              type="text"
              placeholder="Enter country name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 p-2 rounded-md text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Currency
            </label>
            <input
              id="currency"
              type="text"
              placeholder="Enter currency code"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
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
            {loading ? "Adding..." : "Add Country"}
          </button>
        </form>
      </div>

      {/* Countries List */}
      <div className="bg-white p-4 rounded-md border border-gray-100">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Existing Countries
        </h2>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="h-5 w-5 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : countries.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No countries found
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
                    Country
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Currency
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {countries.map((country) => (
                  <tr key={country.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                      {country.name}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                      {country.currency}
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
