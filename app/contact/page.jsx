"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BsFillStarFill } from "react-icons/bs";

const hotelCategories = ["5 Star", "4 Star", "3 Star", "Heritage"];

export default function ContactForm({ packages, packageId: initialPackageId }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [tripDuration, setTripDuration] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [travelingFrom, setTravelingFrom] = useState("");
  const [hotelCategory, setHotelCategory] = useState("");
  const [guests, setGuests] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [packageId, setPackageId] = useState(initialPackageId || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const { data: session } = useSession();
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/countries");
        if (response.ok) {
          const data = await response.json();
          setCountries(data);
        } else {
          console.error("Failed to fetch countries", response.status);
        }
      } catch (error) {
        console.error("Error fetching countries", error);
      }
    };
    fetchCountries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !mobile) {
      setError("All required fields must be filled");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name,
          mobile,
          email,
          tripDuration,
          arrivalDate,
          travelingFrom,
          hotelCategory,
          guests: Number(guests),
          specialRequirements,
          packageId: packageId ? parseInt(packageId) : undefined,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Successfully created Contact form", { data });
        setName("");
        setMobile("");
        setEmail("");
        setTripDuration("");
        setArrivalDate("");
        setTravelingFrom("");
        setHotelCategory("");
        setGuests("");
        setSpecialRequirements("");
        setPackageId("");
        setError("");
      } else {
        setError(data.message);
      }
    } catch (e) {
      console.error("Error while creating contact form:", e);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Contact Us
      </h2>
      {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="text-gray-700 mb-1 text-sm">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-10"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 mb-1 text-sm">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Your Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-10"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 mb-1 text-sm">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-10"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 mb-1 text-sm">Duration of trip</label>
          <input
            type="text"
            placeholder="Duration of trip"
            value={tripDuration}
            onChange={(e) => setTripDuration(e.target.value)}
            className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-10"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 mb-1 text-sm">Date of Arrival</label>
          <input
            type="date"
            placeholder="Date of arrival"
            value={arrivalDate}
            onChange={(e) => setArrivalDate(e.target.value)}
            className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-10"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 mb-1 text-sm">Traveling From</label>
          <select
            value={travelingFrom}
            onChange={(e) => setTravelingFrom(e.target.value)}
            className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-10"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 mb-1 text-sm">Hotel Category</label>
          <select
            value={hotelCategory}
            onChange={(e) => setHotelCategory(e.target.value)}
            className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-10"
          >
            <option value="">Select a category</option>
            {hotelCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 mb-1 text-sm">Number of Guests</label>
          <input
            type="number"
            placeholder="Number of Guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-10"
          />
        </div>

        {packages && packages.length > 0 && (
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1 text-sm">Select Package</label>
            <select
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-10"
            >
              <option value="">Select Package</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.title}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex flex-col">
          <label className="text-gray-700 mb-1 text-sm">
            Special Requirements
          </label>
          <textarea
            placeholder="Any special requirements"
            value={specialRequirements}
            onChange={(e) => setSpecialRequirements(e.target.value)}
            className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32"
          />
        </div>
        <button
          type="submit"
          className={`bg-indigo-500 text-white p-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-400"
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Form"}
        </button>
      </form>
    </div>
  );
}
