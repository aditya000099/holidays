"use client"
import { useState } from "react";

export default function AddCountry({onCountryAdded}) {
    const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
         setLoading(true);
        try {
           const res = await fetch('/api/countries', {
            method: 'POST',
             body: JSON.stringify({name, currency}),
             headers: {
               "Content-Type": "application/json"
           }
         })
           const data = await res.json();
            if (res.ok) {
             console.log("Successfully created the country", {data})
               setName("");
              setCurrency("")
             setError("")
             onCountryAdded(data)
             }
        else {
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
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Add New Country
            </h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Country Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                    type="text"
                     placeholder="Currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                     className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 />
                <button
                    type="submit"
                  className={`bg-blue-500 text-white p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-400'}`}
                  disabled={loading}
                   >
                     {loading ? 'Adding...' : 'Add Country'}
                   </button>
            </form>
        </div>
    );
}