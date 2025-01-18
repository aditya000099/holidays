// "use client";

// import { useState, useEffect } from "react";
// import { Client, Storage, ID } from 'appwrite';
// import { MdAddPhotoAlternate } from 'react-icons/md'
// import { BsFillPlusCircleFill, BsFillTrashFill, BsPlusCircleFill } from 'react-icons/bs'
// import Image from "next/image";

// export default function AddPackage({ countries, cities }) {
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [price, setPrice] = useState("");
//     const [durationDays, setDurationDays] = useState(1);
//     const [selectedCountry, setSelectedCountry] = useState("");
//     const [filteredCities, setFilteredCities] = useState([]);
//     const [cityName, setCityName] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [images, setImages] = useState([]);
//      const [previewImages, setPreviewImages] = useState([]);
//     const [highlights, setHighlights] = useState([""]);
//     const [exclusions, setExclusions] = useState([""]);
//    const [inclusions, setInclusions] = useState([""]);
//    const [itinerary, setItinerary] = useState([{ day: 1, title:"", description: "", image:""}])

//     // Initialize Appwrite client
//      const client = new Client()
//     .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
//     .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

//    const storage = new Storage(client);


//     const handleImageChange = (e) => {
//       const files = Array.from(e.target.files);
//         setImages(files)

//         const previewUrls = files.map((file) => URL.createObjectURL(file));
//        setPreviewImages([...previewImages, ...previewUrls]);
//   };
//     const handleRemoveImage = (index) => {
//        const newImages = images.filter((_, i) => i !== index);
//       setImages(newImages);
//        const newPreviewUrls = previewImages.filter((_, i) => i !== index);
//       setPreviewImages(newPreviewUrls);
//   };

//    useEffect(() => {
//         if(selectedCountry) {
//             const countryObject = countries?.find(country => country.name === selectedCountry);
//            setFilteredCities(cities.filter(city => city.countryId === countryObject?.id) || []);
//        } else {
//             setFilteredCities([]);
//         }
//      }, [selectedCountry, countries, cities]);

//     const handleAddItineraryItem = () => {
//         setItinerary([...itinerary, { day: itinerary.length + 1, title: "", description: "", image: ""}]);
//       };
//       const handleRemoveItineraryItem = (index) => {
//          const newItinerary = itinerary.filter((_,i) => i!== index);
//           setItinerary(newItinerary);
//        }
//      const handleItineraryChange = (index, field, value) => {
//          const updatedItinerary = [...itinerary];
//          updatedItinerary[index][field] = value;
//        setItinerary(updatedItinerary);
//     }
//       const handleAddItem = (stateSetter) => {
//           stateSetter(prev => [...prev,""])
//     }

//       const handleRemoveItem = (stateSetter, index) => {
//           stateSetter(prev => prev.filter((_, i) => i !== index));
//     }

//   const handleSubmit = async (e) => {
//        e.preventDefault();
//       setLoading(true);
//         try {
//             let imageUrls = [];
//              if (images && images.length > 0) {
//                 const uploadPromises = images.map(async (image) => {
//                  const uploadedFile = await storage.createFile(
//                       process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID, // Your bucket id
//                      ID.unique(),
//                        image
//                   );
//                  const filePreview = await storage.getFilePreview(
//                     process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
//                        uploadedFile.$id
//                      );
//                      return filePreview.href;
//                 });
//                 imageUrls = await Promise.all(uploadPromises);
//             }

//            const priceNumber = Number(price);
//            const durationDaysNumber = Number(durationDays);

//            const res = await fetch('/api/packages', {
//                 method: "POST",
//                 body: JSON.stringify({ title, description, price: priceNumber, durationDays: durationDaysNumber, cityName, images: imageUrls, highlights, inclusions, exclusions, itinerary }),
//                  headers: {
//                    "Content-Type": "application/json"
//                 }
//            });
//           const data = await res.json()
//            if (res.ok) {
//                 console.log("Successfully created a new package", {data});
//                  setTitle("");
//                  setDescription("");
//                 setPrice("");
//                  setDurationDays("");
//                 setCityName("");
//                setImage(null)
//                 setError("")
//             setPreviewImages([]);
//             setImages([])
//             setHighlights([""]);
//             setExclusions([""]);
//             setInclusions([""]);
//               setItinerary([{ day: 1, title:"", description: "", image:""}]);
//         } else {
//                setError(data.message)
//             }
//     } catch (e) {
//            console.error("Error adding new packages", e);
//           setError("Something went wrong.");
//       } finally {
//         setLoading(false);
//      }
//  };

//   return (
//         <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                Add New Package
//            </h2>
//             {error && <p className="text-red-500 mb-2">{error}</p>}
//           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//              <select
//                 value={selectedCountry}
//                 onChange={(e) => setSelectedCountry(e.target.value)}
//                 className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//              >
//                <option value="">Select Country</option>
//                {countries?.map((country) => (
//                     <option key={country.id} value={country.name}>
//                         {country.name}
//                      </option>
//                   ))}
//              </select>
//             <select
//                 value={cityName}
//                  onChange={(e) => setCityName(e.target.value)}
//                   className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                    disabled={!selectedCountry}
//                  >
//                     <option value="">Select City</option>
//                   {filteredCities.map((city) => (
//                        <option key={city.id} value={city.name}>
//                          {city.name}
//                     </option>
//                 ))}
//              </select>
//             <input
//                 type="text"
//                  placeholder="Package Title"
//                 value={title}
//                  onChange={(e) => setTitle(e.target.value)}
//                 className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                />
//             <textarea
//                 placeholder="Package Description"
//                value={description}
//                onChange={(e) => setDescription(e.target.value)}
//                 className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                  />
//              <input
//                 type="number"
//                   placeholder="Price"
//                    value={price}
//                    onChange={(e) => setPrice(e.target.value)}
//                   className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                    />
//             <input
//                 type="number"
//                 placeholder="Duration Days"
//                   value={durationDays}
//                   onChange={(e) => setDurationDays(e.target.value)}
//                  className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                />
//               <div className="mb-4">
//                      <h3 className="font-semibold text-gray-700">Highlights</h3>
//                       {highlights.map((highlight, index) => (
//                            <div key={index} className="flex gap-2 mb-2">
//                                  <input type="text" value={highlight} onChange={(e) => {
//                                    const updatedHighlights = [...highlights];
//                                     updatedHighlights[index] = e.target.value;
//                                       setHighlights(updatedHighlights);
//                                   }}
//                                   placeholder="Highlight" className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1"/>
//                             {highlights.length > 1 && (
//                               <button type="button" onClick={() => handleRemoveItem(setHighlights, index)} className="bg-red-500 text-white p-2 rounded" >
//                                  <BsFillTrashFill className="h-4 w-4"/>
//                               </button>
//                             )}
//                           </div>
//                       ))}
//                       <button type="button"  onClick={() => handleAddItem(setHighlights)} className="text-blue-500 hover:text-blue-400 flex items-center gap-2">
//                         <BsFillPlusCircleFill className="h-4 w-4"/> Add More
//                       </button>
//               </div>
//                <div className="mb-4">
//                     <h3 className="font-semibold text-gray-700">Inclusions</h3>
//                     {inclusions.map((inclusion, index) => (
//                        <div key={index} className="flex gap-2 mb-2">
//                            <input type="text" value={inclusion} onChange={(e) => {
//                              const updatedInclusions = [...inclusions];
//                               updatedInclusions[index] = e.target.value;
//                             setInclusions(updatedInclusions);
//                              }}
//                            placeholder="Inclusion" className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1"/>
//                           {inclusions.length > 1 && (
//                              <button type="button" onClick={() => handleRemoveItem(setInclusions, index)} className="bg-red-500 text-white p-2 rounded" >
//                                <BsFillTrashFill className="h-4 w-4"/>
//                               </button>
//                            )}
//                       </div>
//                     ))}
//                   <button type="button"  onClick={() => handleAddItem(setInclusions)} className="text-blue-500 hover:text-blue-400 flex items-center gap-2">
//                        <BsPlusCircleFill className="h-4 w-4"/> Add More
//                      </button>
//                 </div>
//                 <div className="mb-4">
//                   <h3 className="font-semibold text-gray-700">Exclusions</h3>
//                       {exclusions.map((exclusion, index) => (
//                             <div key={index} className="flex gap-2 mb-2">
//                                   <input type="text" value={exclusion} onChange={(e) => {
//                                     const updatedExclusions = [...exclusions];
//                                     updatedExclusions[index] = e.target.value;
//                                     setExclusions(updatedExclusions);
//                                   }}
//                                       placeholder="Exclusion" className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1"/>
//                                      {exclusions.length > 1 && (
//                                        <button type="button" onClick={() => handleRemoveItem(setExclusions, index)} className="bg-red-500 text-white p-2 rounded" >
//                                          <BsFillTrashFill className="h-4 w-4"/>
//                                       </button>
//                                     )}
//                              </div>
//                           ))}
//                          <button type="button"  onClick={() => handleAddItem(setExclusions)} className="text-blue-500 hover:text-blue-400 flex items-center gap-2">
//                            <BsPlusCircleFill className="h-4 w-4"/> Add More
//                        </button>
//                    </div>
//                    <div className="mb-4">
//                       <h3 className="font-semibold text-gray-700 mb-2">Itinerary</h3>
//                          {itinerary.map((item, index) => (
//                             <div key={index} className="border rounded p-4 mb-4">
//                                    <h4 className="font-medium text-gray-800 mb-2">Day {item.day}</h4>
//                                       <input
//                                            type="text"
//                                           placeholder="Title"
//                                          value={item.title}
//                                        onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
//                                       className="border p-1 rounded mb-2 w-full"
//                                         />
//                                        <textarea
//                                             placeholder="Description"
//                                            value={item.description}
//                                            onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
//                                             className="border p-1 rounded mb-2 w-full"
//                                           />
//                                       <input
//                                            type="file"
//                                             accept="image/*"
//                                            onChange={(e) => {
//                                                 handleItineraryChange(index, "image", e.target.files[0]);
//                                           }}
//                                          className="border p-1 rounded mb-2 w-full"
//                                          />
//                                     {itinerary.length > 1 && (
//                                     <button type="button" onClick={() => handleRemoveItineraryItem(index)} className="bg-red-500 text-white p-2 rounded" >
//                                      <BsFillTrashFill className="h-4 w-4"/>
//                                      </button>
//                                    )}
//                                </div>
//                         ))}
//                        <button type="button" onClick={handleAddItineraryItem} className="text-blue-500 hover:text-blue-400 flex items-center gap-2">
//                        <BsPlusCircleFill className="h-4 w-4"/> Add More
//                        </button>
//                    </div>


//               <div className="flex items-center gap-2">
//                 <input
//                    type="file"
//                    accept="image/*"
//                     onChange={handleImageChange}
//                      multiple
//                    className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//                   <div className="flex flex-wrap gap-2">
//                       {previewImages.map((previewUrl, index) => (
//                          <div key={index} className="relative overflow-hidden rounded-md">
//                            <Image
//                             src={previewUrl}
//                               alt={`preview-${index}`}
//                                width={80}
//                              height={60}
//                              className="object-cover w-20 h-16 rounded-md"
//                             />
//                             <button
//                               onClick={() => handleRemoveImage(index)}
//                               className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
//                                >
//                              <BsFillTrashFill className="h-4 w-4"/>
//                            </button>
//                           </div>
//                        ))}
//                    </div>
//                  <button
//                      type="submit"
//                     className={`bg-blue-500 text-white p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-400'}`}
//                   disabled={loading}
//                 >
//                   {loading ? 'Adding...' : 'Add Package'}
//                  </button>
//             </form>
//        </div>
//    );
// }



// old code below



// "use client";

// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { BsPencilSquare, BsFillTrashFill, BsPlusCircleFill } from 'react-icons/bs';
// import { Client, Storage, ID } from 'appwrite';
// import {  MdClose } from "react-icons/md";

// export default function PackageList() {
//   const [packages, setPackages] = useState([]);
//   const [editingPackageId, setEditingPackageId] = useState(null);
//     const [editTitle, setEditTitle] = useState("");
//     const [editDescription, setEditDescription] = useState("");
//     const [editPrice, setEditPrice] = useState("");
//     const [editDurationDays, setEditDurationDays] = useState(1);
//     const [editDays, setEditDays] = useState(1);
//      const [editNights, setEditNights] = useState(0);
//     const [loading, setLoading] = useState(false);
//         const [error, setError] = useState("");
//     const [editImages, setEditImages] = useState([]);
//     const [previewImages, setPreviewImages] = useState([]);
//     const [uploadingImages, setUploadingImages] = useState([]);
//     const [showModal, setShowModal] = useState(false);


//   // Initialize Appwrite client
//     const client = new Client()
//     .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
//     .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

//     const storage = new Storage(client);

//    const handleImageChange = (e) => {
//      const newFiles = Array.from(e.target.files);
//         setEditImages(prev => [...prev,...newFiles]);
//         const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
//         setPreviewImages([...previewImages, ...newPreviewUrls]);
//   };
//     const handleRemoveImage = (index) => {
//       const newImages = editImages.filter((_, i) => i !== index);
//       setEditImages(newImages);
//         const newPreviewUrls = previewImages.filter((_, i) => i !== index);
//         setPreviewImages(newPreviewUrls);
//     };
//    useEffect(() => {
//        const fetchPackages = async () => {
//           try {
//              const response = await fetch(`/api/packages`);
//                if(response.ok) {
//                   const data = await response.json()
//                    setPackages(data);
//                } else {
//                    console.log("There was an error", response.status)
//                 }
//            } catch(e){
//               console.error("Error while fetching packages ", e)
//           }
//       }
//        fetchPackages();
//  }, [])


//  const handleEdit = async (pkg) => {
//       setEditingPackageId(pkg.id);
//       setEditTitle(pkg.title);
//       setEditDescription(pkg.description);
//        setEditPrice(pkg.price);
//        setEditDurationDays(pkg.durationDays);
//       setEditDays(pkg.days)
//        setEditNights(pkg.nights)
//       setPreviewImages(pkg.images?.map(image => image.imageUrl) || []);
//         setEditImages([]);

//        setShowModal(true);
//    };

//  const handleCancelEdit = () => {
//     setEditingPackageId(null);
//     setError("");
//     setPreviewImages([]);
//       setEditImages([])
//       setShowModal(false)
//   };

//  const handleSave = async (pkgId) => {
//     setLoading(true);
//     try {
//             let imageUrls = [];
//               if (editImages && editImages.length > 0) {
//                  const uploadPromises = editImages.map(async (image, index) => {
//                       setUploadingImages((prev) => [...prev, { id: index, loading: true }])
//                      const uploadedFile = await storage.createFile(
//                          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
//                        ID.unique(),
//                       image
//                     );
//                        const filePreview = await storage.getFilePreview(
//                          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
//                       uploadedFile.$id
//                     );
//                      setUploadingImages((prev) => prev.filter((img) => img.id !== index));
//                     return filePreview;
//                 });
//                  imageUrls = await Promise.all(uploadPromises);
//             }
//             const res = await fetch(`/api/packages/${pkgId}`, {
//               method: "PUT",
//              headers: {"Content-Type": "application/json"},
//                body: JSON.stringify({title: editTitle, description: editDescription, price: Number(editPrice), durationDays: Number(editDurationDays),  days: Number(editDays), nights: Number(editNights)})
//          });
//            const res2 = await fetch(`/api/packages/${pkgId}/images`, {
//                 method: "PUT",
//              headers: {"Content-Type": "application/json"},
//               body: JSON.stringify({images: imageUrls.length > 0 ? imageUrls : null })
//            });
//            if (res.ok && res2.ok) {
//                  console.log("Succesfully updated the package");
//                   setEditingPackageId(null);
//                    setError("");
//                   setPackages(packages.map(pkg => pkg.id === pkgId ?  {...pkg, title: editTitle, description: editDescription, price: editPrice, durationDays: editDurationDays, days: editDays, nights: editNights, images: imageUrls.map(url => ({imageUrl: url})) } : pkg))
//                    setShowModal(false);
//              } else {
//                 const data = await res.json()
//                  setError(data.message);
//             }
//        } catch (error) {
//            console.error("Error updating the package: ", error);
//              setError("Something went wrong");
//        } finally {
//            setLoading(false);
//       }
//  };
//     const handleDelete = async (pkgId) => {
//         setLoading(true)
//         try {
//             const res = await fetch(`/api/packages/${pkgId}`, {
//                 method: "DELETE",
//               headers: {"Content-Type": "application/json"},
//           });
//            if (res.ok) {
//              setPackages(packages.filter(p => p.id !== pkgId))
//               setError("")
//           } else {
//               const data = await res.json();
//                setError(data.message);
//           }
//        } catch (error) {
//             console.error("Error deleting the package:", error);
//             setError("Something went wrong");
//        } finally {
//           setLoading(false)
//       }
//     }

//   return (
//        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               All Packages
//            </h2>
//          {error && <p className="text-red-500 mb-2">{error}</p>}
//             <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//                <thead className="bg-gray-100">
//                    <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Title
//                        </th>
//                        <th  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Description
//                        </th>
//                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                          Price
//                         </th>
//                         <th  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                          Days
//                        </th>
//                        <th  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Nights
//                        </th>
//                          <th  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Images
//                         </th>
//                        <th  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions
//                          </th>
//                    </tr>
//                 </thead>
//                  <tbody className="bg-white divide-y divide-gray-200">
//                       {packages.map((pkg) => (
//                         <tr key={pkg.id}>
//                            <td className="px-6 py-4 whitespace-nowrap">
//                                  {editingPackageId === pkg.id ? (
//                                     <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="border p-1 rounded"/>
//                                 ) : (
//                                   pkg.title
//                                      )}
//                              </td>
//                              <td className="px-6 py-4 whitespace-nowrap">
//                                     {editingPackageId === pkg.id ? (
//                                       <textarea  value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="border p-1 rounded" />
//                                       ) : (
//                                        pkg.description
//                                         )}
//                              </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                                  {editingPackageId === pkg.id ? (
//                                         <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="border p-1 rounded"/>
//                                        ) : (
//                                         pkg.price
//                                       )}
//                             </td>
//                            <td className="px-6 py-4 whitespace-nowrap">
//                                   {editingPackageId === pkg.id ? (
//                                           <input type="number" value={editDurationDays} onChange={(e) => setEditDurationDays(Number(e.target.value))} className="border p-1 rounded"/>
//                                       ) : (
//                                            pkg.durationDays
//                                        )}
//                            </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                                     {pkg.days ? (
//                                       pkg.days
//                                       ) : (
//                                           <p>Not Set</p>
//                                        )}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                                     {pkg.nights ? (
//                                          pkg.nights
//                                      ) : (
//                                          <p>Not Set</p>
//                                         )}
//                            </td>
//                            <td  className="px-6 py-4 whitespace-nowrap">
//                                {pkg.images && pkg.images.length > 0 ? (
//                                       <div className="flex items-center gap-2">
//                                            {pkg.images.map((img, index) => (
//                                                <div key={index} className="relative overflow-hidden rounded-md">
//                                                    <Image
//                                                        src={img.imageUrl}
//                                                        alt={`Image for ${pkg.title}`}
//                                                      width={40}
//                                                        height={30}
//                                                         className="object-cover rounded-md"
//                                                       />
//                                                   </div>
//                                             ))}

//                                       </div>
//                                      ) : (
//                                        <p>No images</p>
//                                       )}
//                               </td>
//                              <td className="px-6 py-4 whitespace-nowrap flex gap-2">
//                                  {editingPackageId === pkg.id ? (
//                                    <button onClick={handleCancelEdit} className="bg-red-500 hover:bg-red-400 text-white p-2 rounded">
//                                    Cancel
//                                  </button>
//                                ) : (
//                                   <div className="flex gap-2">
//                                      <button onClick={() => handleEdit(pkg)} className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded">
//                                       <BsPencilSquare/>
//                                      </button>
//                                     <button onClick={() => handleDelete(pkg.id)} className="bg-red-700 hover:bg-red-600 text-white p-2 rounded">
//                                       <BsFillTrashFill/>
//                                     </button>
//                                 </div>
//                             )}
//                            </td>
//                         </tr>
//                    ))}
//                 </tbody>
//           </table>
//         </div>
//         {editingPackageId && (
//            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//                  <div className="bg-white rounded-lg p-8 max-w-xl w-full relative">
//                      <button onClick={handleCancelEdit} className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800">
//                          <MdClose className="h-6 w-6"/>
//                       </button>
//                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//                            Edit Package
//                       </h2>
//                         <div className="mb-4">
//                         <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" className="border p-1 rounded w-full mb-2"/>
//                           <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)}  placeholder="Description" className="border p-1 rounded w-full mb-2"/>
//                             <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="Price" className="border p-1 rounded w-full mb-2"/>
//                              <input type="number" value={editDurationDays} onChange={(e) => setEditDurationDays(Number(e.target.value))} placeholder="Duration Days" className="border p-1 rounded w-full mb-2"/>
//                             <input type="number" value={editDays} onChange={(e) => setEditDays(Number(e.target.value))} placeholder="Days" className="border p-1 rounded w-full mb-2"/>
//                                 <input type="number" value={editNights} onChange={(e) => setEditNights(Number(e.target.value))} placeholder="Nights" className="border p-1 rounded w-full mb-2"/>
//                           </div>
//                       <div className="mb-4">
//                            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="border p-1 rounded w-full mb-2"/>
//                              <div className="flex flex-wrap gap-2 mt-2">
//                                {previewImages.map((previewUrl, index) => (
//                                  <div key={index} className="relative overflow-hidden rounded-md">
//                                    <Image
//                                         src={previewUrl}
//                                         alt={`preview-${index}`}
//                                          width={80}
//                                        height={60}
//                                        className="object-cover w-20 h-16 rounded-md"
//                                      />
//                                     <button
//                                         onClick={() => handleRemoveImage(index)}
//                                         className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
//                                    >
//                                        <BsFillTrashFill className="h-4 w-4"/>
//                                       </button>
//                                   </div>
//                               ))}
//                            </div>
//                    </div>
//                    <div className="flex justify-end mt-4">
//                       <button onClick={() => handleSave(editingPackageId)} disabled={loading} className="bg-green-500 hover:bg-green-400 text-white p-2 rounded" >
//                          Save
//                        </button>
//                     </div>
//                </div>
//              </div>
//             )}
//      </div>
//  );
// }