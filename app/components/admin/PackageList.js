"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BsPencilSquare, BsFillTrashFill, BsPlusCircleFill } from 'react-icons/bs';
import { Client, Storage, ID } from 'appwrite';
import {  MdClose } from "react-icons/md";

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
    const [showModal, setShowModal] = useState(false);


  // Initialize Appwrite client
    const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

    const storage = new Storage(client);

   const handleImageChange = (e) => {
     const newFiles = Array.from(e.target.files);
        setEditImages(prev => [...prev,...newFiles]);
        const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
        setPreviewImages([...previewImages, ...newPreviewUrls]);
  };
    const handleRemoveImage = (index) => {
      const newImages = editImages.filter((_, i) => i !== index);
      setEditImages(newImages);
        const newPreviewUrls = previewImages.filter((_, i) => i !== index);
        setPreviewImages(newPreviewUrls);
    };
   useEffect(() => {
       const fetchPackages = async () => {
          try {
             const response = await fetch(`/api/packages`);
               if(response.ok) {
                  const data = await response.json()
                   setPackages(data);
               } else {
                   console.log("There was an error", response.status)
                }
           } catch(e){
              console.error("Error while fetching packages ", e)
          }
      }
       fetchPackages();
 }, [])


 const handleEdit = async (pkg) => {
      setEditingPackageId(pkg.id);
      setEditTitle(pkg.title);
      setEditDescription(pkg.description);
       setEditPrice(pkg.price);
       setEditDurationDays(pkg.durationDays);
      setEditDays(pkg.days)
       setEditNights(pkg.nights)
      setPreviewImages(pkg.images?.map(image => image.imageUrl) || []);
        setEditImages([]);

       setShowModal(true);
   };

 const handleCancelEdit = () => {
    setEditingPackageId(null);
    setError("");
    setPreviewImages([]);
      setEditImages([])
      setShowModal(false)
  };

 const handleSave = async (pkgId) => {
    setLoading(true);
    try {
            let imageUrls = [];
              if (editImages && editImages.length > 0) {
                 const uploadPromises = editImages.map(async (image, index) => {
                      setUploadingImages((prev) => [...prev, { id: index, loading: true }])
                     const uploadedFile = await storage.createFile(
                         process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
                       ID.unique(),
                      image
                    );
                       const filePreview = await storage.getFilePreview(
                         process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
                      uploadedFile.$id
                    );
                     setUploadingImages((prev) => prev.filter((img) => img.id !== index));
                    return filePreview;
                });
                 imageUrls = await Promise.all(uploadPromises);
            }
            const res = await fetch(`/api/packages/${pkgId}`, {
              method: "PUT",
             headers: {"Content-Type": "application/json"},
               body: JSON.stringify({title: editTitle, description: editDescription, price: Number(editPrice), durationDays: Number(editDurationDays),  days: Number(editDays), nights: Number(editNights)})
         });
           const res2 = await fetch(`/api/packages/${pkgId}/images`, {
                method: "PUT",
             headers: {"Content-Type": "application/json"},
              body: JSON.stringify({images: imageUrls.length > 0 ? imageUrls : null })
           });
           if (res.ok && res2.ok) {
                 console.log("Succesfully updated the package");
                  setEditingPackageId(null);
                   setError("");
                  setPackages(packages.map(pkg => pkg.id === pkgId ?  {...pkg, title: editTitle, description: editDescription, price: editPrice, durationDays: editDurationDays, days: editDays, nights: editNights, images: imageUrls.map(url => ({imageUrl: url})) } : pkg))
                   setShowModal(false);
             } else {
                const data = await res.json()
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
        setLoading(true)
        try {
            const res = await fetch(`/api/packages/${pkgId}`, {
                method: "DELETE",
              headers: {"Content-Type": "application/json"},
          });
           if (res.ok) {
             setPackages(packages.filter(p => p.id !== pkgId))
              setError("")
          } else {
              const data = await res.json();
               setError(data.message);
          }
       } catch (error) {
            console.error("Error deleting the package:", error);
            setError("Something went wrong");
       } finally {
          setLoading(false)
      }
    }

  return (
       <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
              All Packages
           </h2>
         {error && <p className="text-red-500 mb-2">{error}</p>}
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-100">
                   <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                       </th>
                       <th  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                       </th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Price
                        </th>
                        <th  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Days
                       </th>
                       <th  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nights
                       </th>
                         <th  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Images
                        </th>
                       <th  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions
                         </th>
                   </tr>
                </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                      {packages.map((pkg) => (
                        <tr key={pkg.id}>
                           <td className="px-6 py-4 whitespace-nowrap">
                                 {editingPackageId === pkg.id ? (
                                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="border p-1 rounded"/>
                                ) : (
                                  pkg.title
                                     )}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                                    {editingPackageId === pkg.id ? (
                                      <textarea  value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="border p-1 rounded" />
                                      ) : (
                                       pkg.description
                                        )}
                             </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                 {editingPackageId === pkg.id ? (
                                        <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="border p-1 rounded"/>
                                       ) : (
                                        pkg.price
                                      )}
                            </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                                  {editingPackageId === pkg.id ? (
                                          <input type="number" value={editDurationDays} onChange={(e) => setEditDurationDays(Number(e.target.value))} className="border p-1 rounded"/>
                                      ) : (
                                           pkg.durationDays
                                       )}
                           </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                    {pkg.days ? (
                                      pkg.days
                                      ) : (
                                          <p>Not Set</p>
                                       )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                    {pkg.nights ? (
                                         pkg.nights
                                     ) : (
                                         <p>Not Set</p>
                                        )}
                           </td>
                           <td  className="px-6 py-4 whitespace-nowrap">
                               {pkg.images && pkg.images.length > 0 ? (
                                      <div className="flex items-center gap-2">
                                           {pkg.images.map((img, index) => (
                                               <div key={index} className="relative overflow-hidden rounded-md">
                                                   <Image
                                                       src={img.imageUrl}
                                                       alt={`Image for ${pkg.title}`}
                                                     width={40}
                                                       height={30}
                                                        className="object-cover rounded-md"
                                                      />
                                                  </div>
                                            ))}

                                      </div>
                                     ) : (
                                       <p>No images</p>
                                      )}
                              </td>
                             <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                                 {editingPackageId === pkg.id ? (
                                   <button onClick={handleCancelEdit} className="bg-red-500 hover:bg-red-400 text-white p-2 rounded">
                                   Cancel
                                 </button>
                               ) : (
                                  <div className="flex gap-2">
                                     <button onClick={() => handleEdit(pkg)} className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded">
                                      <BsPencilSquare/>
                                     </button>
                                    <button onClick={() => handleDelete(pkg.id)} className="bg-red-700 hover:bg-red-600 text-white p-2 rounded">
                                      <BsFillTrashFill/>
                                    </button>
                                </div>
                            )}
                           </td>
                        </tr>
                   ))}
                </tbody>
          </table>
        </div>
        {editingPackageId && (
           <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                 <div className="bg-white rounded-lg p-8 max-w-xl w-full relative">
                     <button onClick={handleCancelEdit} className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800">
                         <MdClose className="h-6 w-6"/>
                      </button>
                       <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                           Edit Package
                      </h2>
                        <div className="mb-4">
                        <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" className="border p-1 rounded w-full mb-2"/>
                          <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)}  placeholder="Description" className="border p-1 rounded w-full mb-2"/>
                            <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="Price" className="border p-1 rounded w-full mb-2"/>
                             <input type="number" value={editDurationDays} onChange={(e) => setEditDurationDays(Number(e.target.value))} placeholder="Duration Days" className="border p-1 rounded w-full mb-2"/>
                            <input type="number" value={editDays} onChange={(e) => setEditDays(Number(e.target.value))} placeholder="Days" className="border p-1 rounded w-full mb-2"/>
                                <input type="number" value={editNights} onChange={(e) => setEditNights(Number(e.target.value))} placeholder="Nights" className="border p-1 rounded w-full mb-2"/>
                          </div>
                      <div className="mb-4">
                           <input type="file" accept="image/*" multiple onChange={handleImageChange} className="border p-1 rounded w-full mb-2"/>
                             <div className="flex flex-wrap gap-2 mt-2">
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
                   </div>
                   <div className="flex justify-end mt-4">
                      <button onClick={() => handleSave(editingPackageId)} disabled={loading} className="bg-green-500 hover:bg-green-400 text-white p-2 rounded" >
                         Save
                       </button>
                    </div>
               </div>
             </div>
            )}
     </div>
 );
}