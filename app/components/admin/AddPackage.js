"use client";

import { useState, useEffect } from "react";
import { Client, Storage } from 'appwrite';

export default function AddPackage({ countries, cities }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [durationDays, setDurationDays] = useState(1);
     const [selectedCountry, setSelectedCountry] = useState("");
     const [filteredCities, setFilteredCities] = useState([]);
    const [cityName, setCityName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Initialize Appwrite client
     const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

   const storage = new Storage(client);


   useEffect(() => {
       if(selectedCountry) {
           const countryObject = countries?.find(country => country.name === selectedCountry);
            setFilteredCities(cities.filter(city => city.countryId === countryObject?.id) || []);
        } else {
          setFilteredCities([]);
        }
    }, [selectedCountry, countries, cities]);


  const handleSubmit = async (e) => {
       e.preventDefault();
       setLoading(true);
       try {

           const priceNumber = Number(price);
           const durationDaysNumber = Number(durationDays)


         const res = await fetch('/api/packages', {
                method: "POST",
                 body: JSON.stringify({ title, description, price: priceNumber, durationDays: durationDaysNumber, cityName }),
                headers: {
                 "Content-Type": "application/json"
              }
         });
           const data = await res.json()
            if (res.ok) {
               console.log("Successfully created a new package", {data});
                setTitle("");
                setDescription("");
                setPrice("");
                setDurationDays("");
                setCityName("");
                setError("")
          } else {
                setError(data.message)
            }
     } catch (e) {
           console.error("Error adding new packages", e);
           setError("Something went wrong.");
      } finally {
        setLoading(false);
     }
};

  return (
       <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Add New Package
           </h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                 <select
                    value={selectedCountry}
                     onChange={(e) => setSelectedCountry(e.target.value)}
                   className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                       <option key={country.id} value={country.name}>
                           {country.name}
                        </option>
                    ))}
                 </select>
              <select
                 value={cityName}
                 onChange={(e) => setCityName(e.target.value)}
                 className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!selectedCountry}
                >
                   <option value="">Select City</option>
                  {filteredCities.map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                 ))}
             </select>
               <input
                  type="text"
                   placeholder="Package Title"
                   value={title}
                 onChange={(e) => setTitle(e.target.value)}
                   className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                 <textarea
                   placeholder="Package Description"
                    value={description}
                  onChange={(e) => setDescription(e.target.value)}
                   className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   />
               <input
                   type="number"
                    placeholder="Price"
                   value={price}
                  onChange={(e) => setPrice(e.target.value)}
                    className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 />
                <input
                    type="number"
                  placeholder="Duration Days"
                   value={durationDays}
                   onChange={(e) => setDurationDays(e.target.value)}
                   className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    type="submit"
                    className={`bg-blue-500 text-white p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-400'}`}
                    disabled={loading}
               >
                    {loading ? 'Adding...' : 'Add Package'}
                </button>
            </form>
        </div>
    );
}