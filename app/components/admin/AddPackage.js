"use client";

import { useState, useEffect } from "react";
import { Client, Storage, ID } from "appwrite";
import { MdAddPhotoAlternate } from "react-icons/md";
import {
  BsFillPlusCircleFill,
  BsFillTrashFill,
  BsPlusCircleFill,
} from "react-icons/bs";
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
  const [itinerary, setItinerary] = useState([
    { day: 1, title: "", description: "", image: "" },
  ]);
  // Add missing fields according to schema
  const [days, setDays] = useState(1);
  const [nights, setNights] = useState(0);

  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  const storage = new Storage(client);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

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
    if (selectedCountry) {
      const countryObject = countries?.find(
        (country) => country.name === selectedCountry
      );
      setFilteredCities(
        cities.filter((city) => city.countryId === countryObject?.id) || []
      );
    } else {
      setFilteredCities([]);
    }
  }, [selectedCountry, countries, cities]);

  const handleAddItineraryItem = () => {
    setItinerary([
      ...itinerary,
      { day: itinerary.length + 1, title: "", description: "", image: "" },
    ]);
  };
  const handleRemoveItineraryItem = (index) => {
    const newItinerary = itinerary.filter((_, i) => i !== index);
    setItinerary(newItinerary);
  };
  const handleItineraryChange = (index, field, value) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[index][field] = value;
    setItinerary(updatedItinerary);
  };

  // Add a new function to handle itinerary image uploads
  const handleItineraryImageUpload = async (index, file) => {
    if (!file) return;

    try {
      // Upload the image using Appwrite
      const uploadedFile = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
        ID.unique(),
        file
      );

      // Get the file preview URL
      const filePreview = await storage.getFileView(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
        uploadedFile.$id
      );

      // Update the itinerary with the image URL
      const updatedItinerary = [...itinerary];
      updatedItinerary[index].image = filePreview.toString();
      setItinerary(updatedItinerary);
    } catch (error) {
      console.error("Error uploading itinerary image:", error);
      setError("Failed to upload itinerary image");
    }
  };

  const handleAddItem = (stateSetter) => {
    stateSetter((prev) => [...prev, ""]);
  };

  const handleRemoveItem = (stateSetter, index) => {
    stateSetter((prev) => prev.filter((_, i) => i !== index));
  };

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
          const filePreview = await storage.getFileView(
            process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
            uploadedFile.$id
          );
          return filePreview;
        });
        imageUrls = await Promise.all(uploadPromises);
      }

      const priceNumber = Number(price);
      const durationDaysNumber = Number(durationDays);
      const daysNumber = Number(days);
      const nightsNumber = Number(nights);

      // Create a sanitized version of the itinerary data
      // that ensures image is always a string URL or null
      const sanitizedItinerary = itinerary.map((item) => ({
        day: item.day,
        title: item.title,
        description: item.description,
        image: typeof item.image === "string" ? item.image : null,
      }));

      const res = await fetch("/api/packages", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          price: priceNumber,
          durationDays: durationDaysNumber,
          days: daysNumber,
          nights: nightsNumber,
          cityName,
          images: imageUrls,
          highlights,
          inclusions,
          exclusions,
          itinerary: sanitizedItinerary,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Successfully created a new package", { data });
        setTitle("");
        setDescription("");
        setPrice("");
        setDurationDays("");
        setCityName("");
        setImage(null);
        setError("");
        setPreviewImages([]);
        setImages([]);
        setHighlights([""]);
        setExclusions([""]);
        setInclusions([""]);
        setItinerary([{ day: 1, title: "", description: "", image: "" }]);
      } else {
        setError(data.message);
      }
    } catch (e) {
      console.error("Error adding new packages", e);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md border border-gray-100">
      <h2 className="text-lg font-medium text-gray-800 mb-4">
        Add New Package
      </h2>
      {error && (
        <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded-md">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full border border-gray-200 p-2 rounded-md text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Country</option>
                {countries?.map((country) => (
                  <option key={country.id} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <select
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className="w-full border border-gray-200 p-2 rounded-md text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedCountry}
                required
              >
                <option value="">Select City</option>
                {filteredCities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Title
              </label>
              <input
                type="text"
                placeholder="Enter package title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-200 p-2 rounded-md text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="Enter package description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border border-gray-200 p-2 rounded-md text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-200 p-2 rounded-md text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (days)
              </label>
              <input
                type="number"
                placeholder="Enter duration in days"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full border border-gray-200 p-2 rounded-md text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {/* Add missing fields for days and nights */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Days
              </label>
              <input
                type="number"
                placeholder="Number of days"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full border border-gray-200 p-2 rounded-md text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nights
              </label>
              <input
                type="number"
                placeholder="Number of nights"
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                className="w-full border border-gray-200 p-2 rounded-md text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Package Images
          </h3>
          <div className="border border-dashed border-gray-300 p-4 rounded-md bg-white">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              multiple
              className="text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              You can select multiple images
            </p>
          </div>

          {previewImages.length > 0 && (
            <div className="mt-3">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {previewImages.map((previewUrl, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-md"
                  >
                    <Image
                      src={previewUrl}
                      alt={`preview-${index}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                      title="Remove image"
                    >
                      <BsFillTrashFill className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Highlights Section */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Highlights</h3>
            <button
              type="button"
              onClick={() => handleAddItem(setHighlights)}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
            >
              <BsPlusCircleFill className="h-4 w-4" /> Add Item
            </button>
          </div>
          <div className="space-y-2">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => {
                    const updatedHighlights = [...highlights];
                    updatedHighlights[index] = e.target.value;
                    setHighlights(updatedHighlights);
                  }}
                  placeholder="Enter highlight point"
                  className="w-full border border-gray-200 p-2 rounded-md text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                {highlights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(setHighlights, index)}
                    className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                  >
                    <BsFillTrashFill className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Inclusions Section */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Inclusions</h3>
            <button
              type="button"
              onClick={() => handleAddItem(setInclusions)}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
            >
              <BsPlusCircleFill className="h-4 w-4" /> Add Item
            </button>
          </div>
          <div className="space-y-2">
            {inclusions.map((inclusion, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inclusion}
                  onChange={(e) => {
                    const updatedInclusions = [...inclusions];
                    updatedInclusions[index] = e.target.value;
                    setInclusions(updatedInclusions);
                  }}
                  placeholder="Enter included service"
                  className="w-full border border-gray-200 p-2 rounded-md text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                {inclusions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(setInclusions, index)}
                    className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                  >
                    <BsFillTrashFill className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Exclusions Section */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Exclusions</h3>
            <button
              type="button"
              onClick={() => handleAddItem(setExclusions)}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
            >
              <BsPlusCircleFill className="h-4 w-4" /> Add Item
            </button>
          </div>
          <div className="space-y-2">
            {exclusions.map((exclusion, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={exclusion}
                  onChange={(e) => {
                    const updatedExclusions = [...exclusions];
                    updatedExclusions[index] = e.target.value;
                    setExclusions(updatedExclusions);
                  }}
                  placeholder="Enter excluded service"
                  className="w-full border border-gray-200 p-2 rounded-md text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                {exclusions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(setExclusions, index)}
                    className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                  >
                    <BsFillTrashFill className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Itinerary Section - updated with proper image handling */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Itinerary</h3>
            <button
              type="button"
              onClick={handleAddItineraryItem}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
            >
              <BsPlusCircleFill className="h-4 w-4" /> Add Day
            </button>
          </div>
          <div className="space-y-4">
            {itinerary.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-md p-3 bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-800">
                    Day {item.day}
                  </h4>
                  {itinerary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItineraryItem(index)}
                      className="p-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                    >
                      <BsFillTrashFill className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Day title"
                    value={item.title}
                    onChange={(e) =>
                      handleItineraryChange(index, "title", e.target.value)
                    }
                    className="w-full border border-gray-200 p-2 rounded-md text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <textarea
                    placeholder="Day description"
                    value={item.description}
                    onChange={(e) =>
                      handleItineraryChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    rows={2}
                    className="w-full border border-gray-200 p-2 rounded-md text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="mt-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Day Image (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleItineraryImageUpload(index, e.target.files[0]);
                        }
                      }}
                      className="text-xs w-full"
                    />
                    {typeof item.image === "string" && item.image && (
                      <div className="mt-2 relative w-20 h-20">
                        <Image
                          src={item.image}
                          alt={`Day ${item.day} image`}
                          fill
                          className="object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedItinerary = [...itinerary];
                            updatedItinerary[index].image = null;
                            setItinerary(updatedItinerary);
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                        >
                          <BsFillTrashFill className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Adding Package..." : "Add Package"}
          </button>
        </div>
      </form>
    </div>
  );
}
