"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Dialog } from "@headlessui/react";
import Select from "react-select";
import countryList from "react-select-country-list";
import Image from "next/image";

const hotelCategories = ["5 Star", "4 Star", "3 Star", "Heritage"];
const countries = countryList().getData();

export default function ContactForm({
  packageId: initialPackageId,
  isOpen,
  onClose,
}) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [tripDuration, setTripDuration] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [travelingFrom, setTravelingFrom] = useState(null);
  const [hotelCategory, setHotelCategory] = useState("");
  const [guests, setGuests] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [packageId, setPackageId] = useState(initialPackageId || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPackage = async () => {
      if (initialPackageId) {
        try {
          const response = await fetch(`/api/packages/${initialPackageId}`);
          if (response.ok) {
            const data = await response.json();
            setSelectedPackage(data);
          } else {
            console.error("Error getting package", response.status);
          }
        } catch (e) {
          console.log("Error while fetching package", e);
        }
      }
    };
    fetchPackage();
  }, [initialPackageId]);

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
          arrivalDate: arrivalDate ? new Date(arrivalDate).toISOString() : "",
          travelingFrom: travelingFrom?.label || "",
          hotelCategory,
          guests: guests,
          specialRequirements,
          packageId: packageId ? parseInt(packageId) : undefined,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setName("");
        setMobile("");
        setEmail("");
        setTripDuration("");
        setArrivalDate("");
        setTravelingFrom(null);
        setHotelCategory("");
        setGuests("");
        setSpecialRequirements("");
        setPackageId("");
        setError("");
        onClose();
      } else {
        setError(data.message);
      }
    } catch (e) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-4 rounded-xl shadow-lg max-w-3xl w-full relative flex">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✖
          </button>

          {/* Form Section */}
          <div className="w-2/3 pr-6">
            <Dialog.Title className="text-2xl font-semibold text-zinc-800 mb-4 text-center">
              Enquire
            </Dialog.Title>

            {error && (
              <p className="text-red-500 mb-2 text-center">Error: {error}</p>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2">
              <div className="col-span-2 flex flex-col">
                <label className="text-gray-700 text-sm mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border p-1 rounded-xl h-9 text-gray-700 :ring-2 :ring-indigo-500 :border-indigo-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 text-sm mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="border p-1 rounded-xl h-9 text-gray-700 :ring-2 :ring-indigo-500 :border-indigo-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 text-sm mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border p-1 rounded-xl h-9 text-gray-700 :ring-2 :ring-indigo-500 :border-indigo-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 text-sm mb-1">
                  Duration of Trip
                </label>
                <input
                  type="number"
                  placeholder="Duration of trip"
                  value={tripDuration}
                  onChange={(e) => setTripDuration(e.target.value)}
                  className="border p-1 rounded-xl h-9 text-gray-700 :ring-2 :ring-indigo-500 :border-indigo-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 text-sm mb-1">
                  Date of Arrival
                </label>
                <input
                  type="date"
                  placeholder="Date of arrival"
                  value={arrivalDate}
                  onChange={(e) => {
                    const today = new Date().toISOString().split("T")[0];
                    if (e.target.value >= today) {
                      setArrivalDate(e.target.value);
                    }
                  }}
                  className="border p-1 rounded-xl h-9 text-gray-700 :ring-2 :ring-indigo-500 :border-indigo-500"
                />
              </div>

              <div className="col-span-2 flex flex-col">
                <label className="text-gray-700 text-sm mb-1">
                  Traveling From
                </label>
                <Select
                  options={countries}
                  value={travelingFrom}
                  onChange={setTravelingFrom}
                  className="border rounded-xl h-9 text-gray-700 :ring-2 :ring-indigo-500 :border-indigo-500"
                />
              </div>
              <div className="col-span-1 flex flex-col">
                <label className="text-gray-700 text-sm mb-1">
                  Hotel Category
                </label>
                <select
                  value={hotelCategory}
                  onChange={(e) => setHotelCategory(e.target.value)}
                  className="border p-1 rounded-xl h-9 text-gray-700 :ring-2 :ring-indigo-500 :border-indigo-500"
                >
                  <option value="">Select a category</option>
                  {hotelCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1 flex flex-col">
                <label className="text-gray-700 text-sm mb-1">
                  Number of Guests
                </label>
                <input
                  type="number"
                  placeholder="Number of Guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="border p-1 rounded-xl h-9 text-gray-700 :ring-2 :ring-indigo-500 :border-indigo-500"
                />
              </div>
              <div className="col-span-2 flex flex-col">
                <label className="text-gray-700 text-sm mb-1">
                  Special Requirements
                </label>
                <textarea
                  placeholder="Any special requirements"
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  className="border p-1 rounded-xl h-24 text-gray-700 :ring-2 :ring-indigo-500 :border-indigo-500"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                className={`col-span-2 bg-indigo-500 text-white p-2 rounded-xl hover:bg-indigo-400 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Enquire now"}
              </button>
            </form>
          </div>

          {/* Package Preview Section */}
          <div className="w-1/3 pr-4">
            {selectedPackage ? (
              <div className="mb-4">
                <div className="relative overflow-hidden rounded-xl aspect-square w-36 h-36 mb-2">
                  {selectedPackage?.images &&
                  selectedPackage.images.length > 0 ? (
                    <Image
                      src={selectedPackage.images[0].imageUrl}
                      alt={`Preview for ${selectedPackage.title}`}
                      fill
                      sizes="100px"
                      className="object-cover rounded-xl"
                    />
                  ) : (
                    <div className="flex justify-center items-center">
                      <Image
                        src={"/default.png"}
                        alt={"package photo"}
                        width={1000}
                        height={1000}
                        className="object-cover rounded-xl"
                      />
                    </div>
                  )}
                </div>
                <h3 className="text-md font-semibold text-gray-700">
                  {selectedPackage?.title}
                </h3>
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <Image
                  src={"/default.png"}
                  alt={"package photo"}
                  width={1000}
                  height={1000}
                  className="object-cover rounded-xl"
                />
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
