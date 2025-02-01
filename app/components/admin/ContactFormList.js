"use client";

import { useState, useEffect } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import Link from "next/link";

export default function ContactFormList() {
  const [contactForms, setContactForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContactForms = async () => {
      try {
        const response = await fetch(`/api/contact`);
        if (response.ok) {
          const data = await response.json();
          setContactForms(data);
        } else {
          console.error("Error fetching contact forms", response.status);
        }
      } catch (error) {
        console.error("Error fetching contact forms:", error);
        setError("Something went wrong");
      }
    };

    fetchContactForms();
  }, []);

  const handleDelete = async (formId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contact/${formId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setContactForms(contactForms.filter((form) => form.id !== formId));
        setError("");
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (error) {
      console.error("Error deleting the contact:", error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const getPackageTitle = (packageId, pkg) => {
    if (!packageId) {
      return "None";
    }

    return pkg ? (
      <Link
        href={`/countries/${
          pkg.city.country.name
        }/${pkg.city.name.toLowerCase()}/${pkg.id}`}
        target="_blank"
        className="hover:underline"
      >
        {pkg.title}
      </Link>
    ) : (
      "No Package"
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Contact Forms
      </h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trip Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Arrival Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Traveling From
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hotel Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guests
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Special Requirements
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Package
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contactForms.map((form) => (
              <tr key={form.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {form.createdAt.split("T")[0]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{form.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{form.mobile}</td>
                <td className="px-6 py-4 whitespace-nowrap">{form.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {form.tripDuration}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {form.arrivalDate?.split("T")[0]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {form.travelingFrom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {form.hotelCategory}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{form.guests}</td>
                <td className="px-6 py-4  max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {form.specialRequirements}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPackageTitle(form.packageId, form.package)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(form.id)}
                    className="bg-red-700 hover:bg-red-600 text-white p-2 rounded"
                  >
                    <BsFillTrashFill />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
