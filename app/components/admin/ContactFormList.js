"use client";

import { useState, useEffect } from "react";
import { BsFillTrashFill, BsSearch, BsEyeFill } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import Link from "next/link";

export default function ContactFormList() {
  const [contactForms, setContactForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // New states for enhanced features
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formsPerPage] = useState(10);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [viewForm, setViewForm] = useState(null);

  useEffect(() => {
    const fetchContactForms = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/contact`);
        if (response.ok) {
          const data = await response.json();
          setContactForms(data);
        } else {
          console.error("Error fetching contact forms", response.status);
          setError("Failed to load contact requests");
        }
      } catch (error) {
        console.error("Error fetching contact forms:", error);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchContactForms();
  }, []);

  // Filter forms based on search term
  const filteredForms = contactForms.filter(
    (form) =>
      form.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.travelingFrom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.specialRequirements?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const currentForms = filteredForms.slice(indexOfFirstForm, indexOfLastForm);
  const totalPages = Math.ceil(filteredForms.length / formsPerPage);

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
        className="text-blue-600 hover:underline"
      >
        {pkg.title}
      </Link>
    ) : (
      "No Package"
    );
  };

  const confirmDelete = (formId) => {
    setShowConfirmDelete(formId);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(null);
  };

  const executeDelete = async (formId) => {
    await handleDelete(formId);
    setShowConfirmDelete(null);
  };

  const handleViewDetails = (form) => {
    setViewForm(form);
  };

  return (
    <div className="bg-white p-4 rounded-md border border-gray-100">
      <h2 className="text-lg font-medium text-gray-800 mb-4">
        Contact Requests
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded-md">
          {error}
        </p>
      )}

      {/* Search and pagination */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <BsSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by name, email or requirements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {totalPages > 0 && (
          <div className="flex items-center bg-gray-50 rounded-md border border-gray-200 p-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-md ${
                currentPage === 1
                  ? "text-gray-400"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
              title="First page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-md ${
                currentPage === 1
                  ? "text-gray-400"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
              title="Previous page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <span className="px-3 text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
              title="Next page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
              title="Last page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredForms.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm
            ? "No contact requests match your search"
            : "No contact requests found"}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Mobile
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Traveling From
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Guests
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentForms.map((form) => (
                <tr key={form.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    {new Date(form.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    {form.name}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    <a
                      href={`mailto:${form.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {form.email}
                    </a>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                    <a href={`tel:${form.mobile}`} className="hover:underline">
                      {form.mobile}
                    </a>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                    {form.travelingFrom || "-"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                    {form.guests || "-"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleViewDetails(form)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                        title="View details"
                      >
                        <BsEyeFill size={16} />
                      </button>
                      <button
                        onClick={() => confirmDelete(form.id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                        title="Delete request"
                      >
                        <BsFillTrashFill size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Details Modal */}
      {viewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setViewForm(null)}
              className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full"
            >
              <MdClose className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Contact Request Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="text-base">{viewForm.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-base">
                  <a
                    href={`mailto:${viewForm.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {viewForm.email}
                  </a>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Mobile</h3>
                <p className="text-base">
                  <a
                    href={`tel:${viewForm.mobile}`}
                    className="hover:underline"
                  >
                    {viewForm.mobile}
                  </a>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Traveling From
                </h3>
                <p className="text-base">{viewForm.travelingFrom || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Trip Duration
                </h3>
                <p className="text-base">{viewForm.tripDuration || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Arrival Date
                </h3>
                <p className="text-base">
                  {viewForm.arrivalDate
                    ? new Date(viewForm.arrivalDate).toLocaleDateString()
                    : "-"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Hotel Category
                </h3>
                <p className="text-base">{viewForm.hotelCategory || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Guests</h3>
                <p className="text-base">{viewForm.guests || "-"}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Special Requirements
                </h3>
                <p className="text-base whitespace-pre-line bg-gray-50 p-3 rounded-md mt-1">
                  {viewForm.specialRequirements || "None specified"}
                </p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Package</h3>
                <p className="text-base">
                  {getPackageTitle(viewForm.packageId, viewForm.package)}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setViewForm(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewForm(null);
                  confirmDelete(viewForm.id);
                }}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
              >
                Delete Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this contact request? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => executeDelete(showConfirmDelete)}
                disabled={loading}
                className={`px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
                }`}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
