"use client"
import { useState } from "react";

export default function AddCity({countries}) {
    const [name, setName] = useState("");
    const [countryName, setCountryName] = useState("");
   const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
         setLoading(true)
         try {
         const res = await fetch('/api/cities', {
             method: "POST",
            body: JSON.stringify({name, countryName}),
             headers: {
               "Content-Type": "application/json"
           }
         })
         const data = await res.json();
        if (res.ok) {
           console.log("Successfully created city", {data})
            setName("");
           setCountryName("")
           setError("")
         } else {
            setError(data.message);
        }

       } catch (e) {
            console.error("Error creating cities:", e)
          setError("Something went wrong.");
        } finally {
           setLoading(false)
        }
    };

  return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Add New City
            </h2>
           {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <select
                    value={countryName}
                    onChange={(e) => setCountryName(e.target.value)}
                    className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                 >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.name}>
                            {country.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                     placeholder="City Name"
                    value={name}
                     onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                    type="submit"
                     className={`bg-indigo-500 text-white p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-400'}`}
                    disabled={loading}
                >
                     {loading ? 'Adding...' : 'Add City'}
                </button>
            </form>
        </div>
    );
}