"use client";

import { useState, useEffect } from "react";
import { Client, Storage, ID } from 'appwrite';
import { MdAddPhotoAlternate } from 'react-icons/md'
import { BsFillPlusCircleFill, BsFillTrashFill, BsPlusCircleFill } from 'react-icons/bs'
import Image from "next/image";

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
    const [image, setImage] = useState("");
    const [images, setImages] = useState([]);
     const [previewImages, setPreviewImages] = useState([]);
    const [highlights, setHighlights] = useState([""]);
    const [exclusions, setExclusions] = useState([""]);
   const [inclusions, setInclusions] = useState([""]);
   const [itinerary, setItinerary] = useState([{ day: 1, title:"", description: "", image:""}])

    // Initialize Appwrite client
     const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

   const storage = new Storage(client);


    const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
        setImages(files)

        const previewUrls = files.map((file) => URL.createObjectURL(file));
       setPreviewImages([...previewImages, ...previewUrls]);
  };
    const handleRemoveImage = (index) => {
       const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
       const newPreviewUrls = previewImages.filter((_, i) => i !== index);
      setPreviewImages(newPreviewUrls);
  };

   useEffect(() => {
        if(selectedCountry) {
            const countryObject = countries?.find(country => country.name === selectedCountry);
           setFilteredCities(cities.filter(city => city.countryId === countryObject?.id) || []);
       } else {
            setFilteredCities([]);
        }
     }, [selectedCountry, countries, cities]);

    const handleAddItineraryItem = () => {
        setItinerary([...itinerary, { day: itinerary.length + 1, title: "", description: "", image: ""}]);
      };
      const handleRemoveItineraryItem = (index) => {
         const newItinerary = itinerary.filter((_,i) => i!== index);
          setItinerary(newItinerary);
       }
     const handleItineraryChange = (index, field, value) => {
         const updatedItinerary = [...itinerary];
         updatedItinerary[index][field] = value;
       setItinerary(updatedItinerary);
    }
      const handleAddItem = (stateSetter) => {
          stateSetter(prev => [...prev,""])
    }

      const handleRemoveItem = (stateSetter, index) => {
          stateSetter(prev => prev.filter((_, i) => i !== index));
    }

  const handleSubmit = async (e) => {
       e.preventDefault();
      setLoading(true);
        try {
            let imageUrls = [];
             if (images && images.length > 0) {
                const uploadPromises = images.map(async (image) => {
                 const uploadedFile = await storage.createFile(
                      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID, // Your bucket id
                     ID.unique(),
                       image
                  );
                 const filePreview = await storage.getFilePreview(
                    process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
                       uploadedFile.$id
                     );
                     return filePreview;
                });
                imageUrls = await Promise.all(uploadPromises);
            }

           const priceNumber = Number(price);
           const durationDaysNumber = Number(durationDays);

           const res = await fetch('/api/packages', {
                method: "POST",
                body: JSON.stringify({ title, description, price: priceNumber, durationDays: durationDaysNumber, cityName, images: imageUrls, highlights, inclusions, exclusions, itinerary }),
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
               setImage(null)
                setError("")
            setPreviewImages([]);
            setImages([])
            setHighlights([""]);
            setExclusions([""]);
            setInclusions([""]);
              setItinerary([{ day: 1, title:"", description: "", image:""}]);
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
                className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
             >
               <option value="">Select Country</option>
               {countries?.map((country) => (
                    <option key={country.id} value={country.name}>
                        {country.name}
                     </option>
                  ))}
             </select>
            <select
                value={cityName}
                 onChange={(e) => setCityName(e.target.value)}
                  className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
               />
            <textarea
                placeholder="Package Description"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
                className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                 />
             <input
                type="number"
                  placeholder="Price"
                   value={price}
                   onChange={(e) => setPrice(e.target.value)}
                  className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                   />
            <input
                type="number"
                placeholder="Duration Days"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                 className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
               />
              <div className="mb-4">
                     <h3 className="font-semibold text-gray-700">Highlights</h3>
                      {highlights.map((highlight, index) => (
                           <div key={index} className="flex gap-2 mb-2">
                                 <input type="text" value={highlight} onChange={(e) => {
                                   const updatedHighlights = [...highlights];
                                    updatedHighlights[index] = e.target.value;
                                      setHighlights(updatedHighlights);
                                  }}
                                  placeholder="Highlight" className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1"/>
                            {highlights.length > 1 && (
                              <button type="button" onClick={() => handleRemoveItem(setHighlights, index)} className="bg-red-500 text-white p-2 rounded" >
                                 <BsFillTrashFill className="h-4 w-4"/>
                              </button>
                            )}
                          </div>
                      ))}
                      <button type="button"  onClick={() => handleAddItem(setHighlights)} className="text-indigo-500 hover:text-indigo-400 flex items-center gap-2">
                        <BsFillPlusCircleFill className="h-4 w-4"/> Add More
                      </button>
              </div>
               <div className="mb-4">
                    <h3 className="font-semibold text-gray-700">Inclusions</h3>
                    {inclusions.map((inclusion, index) => (
                       <div key={index} className="flex gap-2 mb-2">
                           <input type="text" value={inclusion} onChange={(e) => {
                             const updatedInclusions = [...inclusions];
                              updatedInclusions[index] = e.target.value;
                            setInclusions(updatedInclusions);
                             }}
                           placeholder="Inclusion" className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1"/>
                          {inclusions.length > 1 && (
                             <button type="button" onClick={() => handleRemoveItem(setInclusions, index)} className="bg-red-500 text-white p-2 rounded" >
                               <BsFillTrashFill className="h-4 w-4"/>
                              </button>
                           )}
                      </div>
                    ))}
                  <button type="button"  onClick={() => handleAddItem(setInclusions)} className="text-indigo-500 hover:text-indigo-400 flex items-center gap-2">
                       <BsPlusCircleFill className="h-4 w-4"/> Add More
                     </button>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700">Exclusions</h3>
                      {exclusions.map((exclusion, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                  <input type="text" value={exclusion} onChange={(e) => {
                                    const updatedExclusions = [...exclusions];
                                    updatedExclusions[index] = e.target.value;
                                    setExclusions(updatedExclusions);
                                  }}
                                      placeholder="Exclusion" className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1"/>
                                     {exclusions.length > 1 && (
                                       <button type="button" onClick={() => handleRemoveItem(setExclusions, index)} className="bg-red-500 text-white p-2 rounded" >
                                         <BsFillTrashFill className="h-4 w-4"/>
                                      </button>
                                    )}
                             </div>
                          ))}
                         <button type="button"  onClick={() => handleAddItem(setExclusions)} className="text-indigo-500 hover:text-indigo-400 flex items-center gap-2">
                           <BsPlusCircleFill className="h-4 w-4"/> Add More
                       </button>
                   </div>
                   <div className="mb-4">
                      <h3 className="font-semibold text-gray-700 mb-2">Itinerary</h3>
                         {itinerary.map((item, index) => (
                            <div key={index} className="border rounded p-4 mb-4">
                                   <h4 className="font-medium text-gray-800 mb-2">Day {item.day}</h4>
                                      <input
                                           type="text"
                                          placeholder="Title"
                                         value={item.title}
                                       onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                                      className="border p-1 rounded mb-2 w-full"
                                        />
                                       <textarea
                                            placeholder="Description"
                                           value={item.description}
                                           onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                                            className="border p-1 rounded mb-2 w-full"
                                          />
                                      {/* <input
                                           type="file"
                                            accept="image/*"
                                           onChange={(e) => {
                                                handleItineraryChange(index, "image", e.target.files[0]);
                                          }}
                                         className="border p-1 rounded mb-2 w-full"
                                         /> */}
                                    {itinerary.length > 1 && (
                                    <button type="button" onClick={() => handleRemoveItineraryItem(index)} className="bg-red-500 text-white p-2 rounded" >
                                     <BsFillTrashFill className="h-4 w-4"/>
                                     </button>
                                   )}
                               </div>
                        ))}
                       <button type="button" onClick={handleAddItineraryItem} className="text-indigo-500 hover:text-indigo-400 flex items-center gap-2">
                       <BsPlusCircleFill className="h-4 w-4"/> Add More
                       </button>
                   </div>


              <div className="flex items-center gap-2">
                <input
                   type="file"
                   accept="image/*"
                    onChange={handleImageChange}
                     multiple
                   className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                  <div className="flex flex-wrap gap-2">
                      {previewImages.map((previewUrl, index) => (
                         <div key={index} className="relative overflow-hidden rounded-md">
                           <Image
                            src={previewUrl}
                              alt={`preview-${index}`}
                               width={80}
                             height={60}
                             className="object-cover w-20 h-16 rounded-md"
                            />
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                               >
                             <BsFillTrashFill className="h-4 w-4"/>
                           </button>
                          </div>
                       ))}
                   </div>
                 <button
                     type="submit"
                    className={`bg-indigo-500 text-white p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-400'}`}
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Package'}
                 </button>
            </form>
       </div>
   );
}