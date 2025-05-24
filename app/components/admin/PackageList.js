"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  BsPencilSquare,
  BsFillTrashFill,
  BsPlusCircleFill,
  BsSearch,
  BsFilter,
  BsEyeFill,
} from "react-icons/bs";
import { MdClose } from "react-icons/md";

export default function PackageList() {
  const [packages, setPackages] = useState([]);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDurationDays, setEditDurationDays] = useState(1);
  const [editDays, setEditDays] = useState(1);
  const [editNights, setEditNights] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editImages, setEditImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [packagesPerPage] = useState(10); // Increased from 5 to 10 packages per page
  const [viewPackage, setViewPackage] = useState(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setEditImages(files);

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...previewUrls]);
  };

  const handleRemoveImage = (index) => {
    const newImages = editImages.filter((_, i) => i !== index);
    setEditImages(newImages);
    const newPreviewUrls = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newPreviewUrls);
  };
  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/packages`, {
          next: { revalidate: 360 },
        });
        if (response.ok) {
          const data = await response.json();
          setPackages(data);
        } else {
          console.log("There was an error", response.status);
          setError("Failed to load packages");
        }
      } catch (e) {
        console.error("Error while fetching packages ", e);
        setError("Failed to load packages");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Filter packages based on search term
  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = filteredPackages.slice(
    indexOfFirstPackage,
    indexOfLastPackage
  );
  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage);

  const handleEdit = async (pkg) => {
    setEditingPackageId(pkg.id);
    setEditTitle(pkg.title);
    setEditDescription(pkg.description);
    setEditPrice(pkg.price);
    setEditDurationDays(pkg.durationDays);
    setEditDays(pkg.days);
    setEditNights(pkg.nights);
    setPreviewImages(pkg.images?.map((image) => image.imageUrl) || []);
    setEditImages([]);
    setShowModal(true);
  };

  const handleCancelEdit = () => {
    setEditingPackageId(null);
    setError("");
    setPreviewImages([]);
    setEditImages([]);
    setShowModal(false);
  };
  const handleSave = async (pkgId) => {
    setLoading(true);
    try {
      let imageUrls = [];
      if (editImages && editImages.length > 0) {
        const uploadPromises = editImages.map(async (image) => {
          setUploadingImages((prev) => [
            ...prev,
            { id: image.name, loading: true },
          ]);

          const formData = new FormData();
          formData.append("image", image);
          const uploadRes = await fetch("/api/uploadImage", {
            method: "POST",
            body: formData,
          });
          const uploadedData = await uploadRes.json();

          if (uploadedData.success) {
            const filePreview = uploadedData.imageUrl;
            setUploadingImages((prev) =>
              prev.filter((img) => img.id !== image.name)
            );
            return filePreview;
          } else {
            setError(uploadedData.message || "Failed to upload images");
            setUploadingImages((prev) =>
              prev.filter((img) => img.id !== image.name)
            );
            return null;
          }
        });
        imageUrls = (await Promise.all(uploadPromises)).filter(
          (url) => url != null
        );
      }
      const res = await fetch(`/api/packages/${pkgId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          price: Number(editPrice),
          durationDays: Number(editDurationDays),
          days: Number(editDays),
          nights: editNights,
        }),
        next: {
          revalidate: 360, // 6 mins
        },
      });
      const res2 = await fetch(`/api/packages/${pkgId}/images`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: imageUrls }),
        next: {
          revalidate: 360, // 6 mins
        },
      });
      if (res.ok && res2.ok) {
        console.log("Succesfully updated the package");
        setEditingPackageId(null);
        setError("");
        setPackages(
          packages.map((pkg) =>
            pkg.id === pkgId
              ? {
                  ...pkg,
                  title: editTitle,
                  description: editDescription,
                  price: editPrice,
                  durationDays: editDurationDays,
                  days: editDays,
                  nights: editNights,
                  images: imageUrls.map((url) => ({ imageUrl: url })),
                }
              : pkg
          )
        );
        setShowModal(false);
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (error) {
      console.error("Error updating the package: ", error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pkgId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/packages/${pkgId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setPackages(packages.filter((p) => p.id !== pkgId));
        setError("");
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (error) {
      console.error("Error deleting the package:", error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPackage = (pkg) => {
    setViewPackage(pkg);
  };

  const confirmDelete = (pkgId) => {
    setShowConfirmDelete(pkgId);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(null);
  };

  const executeDelete = async (pkgId) => {
    await handleDelete(pkgId);
    setShowConfirmDelete(null);
  };

  return (
    <div className="bg-white p-4 rounded-md border border-gray-100">
      <h2 className="text-lg font-medium text-gray-800 mb-4">All Packages</h2>

      {error && (
        <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded-md">
          {error}
        </p>
      )}

      {/* Search and improved pagination controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <BsSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Improved pagination controls */}
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

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? "No packages match your search" : "No packages found"}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                {/* Description column removed */}
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Images
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    {pkg.title}
                  </td>
                  {/* Description cell removed */}
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    ${pkg.price}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    {pkg.days || "-"} days / {pkg.nights || "-"} nights
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap hidden lg:table-cell">
                    {pkg.images && pkg.images.length > 0 ? (
                      <div className="flex items-center gap-1">
                        {pkg.images.slice(0, 3).map((img, index) => (
                          <div
                            key={index}
                            className="relative overflow-hidden rounded-md"
                          >
                            <Image
                              src={img.imageUrl}
                              alt={`Image for ${pkg.title}`}
                              width={32}
                              height={24}
                              className="object-cover rounded-md"
                            />
                          </div>
                        ))}
                        {pkg.images.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-1">
                            +{pkg.images.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-1">
                        No images
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleViewPackage(pkg)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                        title="View details"
                      >
                        <BsEyeFill size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="p-1.5 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100"
                        title="Edit package"
                      >
                        <BsPencilSquare size={16} />
                      </button>
                      <button
                        onClick={() => confirmDelete(pkg.id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                        title="Delete package"
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

      {/* View Package Modal */}
      {viewPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setViewPackage(null)}
              className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full"
            >
              <MdClose className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {viewPackage.title}
            </h2>

            {viewPackage.images && viewPackage.images.length > 0 && (
              <div className="mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {viewPackage.images.map((img, index) => (
                    <div
                      key={index}
                      className="aspect-video relative overflow-hidden rounded-md"
                    >
                      <Image
                        src={img.imageUrl}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Price</h3>
                <p className="text-lg font-semibold">${viewPackage.price}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                <p className="text-lg">
                  {viewPackage.days || "-"} days / {viewPackage.nights || "-"}{" "}
                  nights
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {viewPackage.description}
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setViewPackage(null);
                  handleEdit(viewPackage);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Edit Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Package Modal */}
      {editingPackageId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={handleCancelEdit}
              className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full"
            >
              <MdClose className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Edit Package
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Package title"
                  className="w-full border border-gray-200 p-2 rounded-md text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Package description"
                  rows={4}
                  className="w-full border border-gray-200 p-2 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="Price"
                  className="w-full border border-gray-200 p-2 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (days)
                </label>
                <input
                  type="number"
                  value={editDurationDays}
                  onChange={(e) => setEditDurationDays(Number(e.target.value))}
                  placeholder="Duration"
                  className="w-full border border-gray-200 p-2 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Days
                </label>
                <input
                  type="number"
                  value={editDays}
                  onChange={(e) => setEditDays(Number(e.target.value))}
                  placeholder="Days"
                  className="w-full border border-gray-200 p-2 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nights
                </label>
                <input
                  type="number"
                  value={editNights}
                  onChange={(e) => setEditNights(Number(e.target.value))}
                  placeholder="Nights"
                  className="w-full border border-gray-200 p-2 rounded-md text-sm"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images
              </label>
              <div className="border border-dashed border-gray-300 p-4 rounded-md">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can select multiple images
                </p>
              </div>

              {uploadingImages.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-blue-600">
                    Uploading {uploadingImages.length} images...
                  </p>
                </div>
              )}

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
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                          title="Remove image"
                        >
                          <MdClose className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(editingPackageId)}
                disabled={loading}
                className={`px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
              >
                {loading ? "Saving..." : "Save Changes"}
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
              Are you sure you want to delete this package? This action cannot
              be undone.
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
