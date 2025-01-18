"use client";

import { useState, useEffect } from "react";
import AddCountry from "../components/admin/AddCountry";
import AddCity from "../components/admin/AddCity";
import AddPackage from "../components/admin/AddPackage";
import PackageList from "../components/admin/PackageList"; // import the PackageList component
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";

export default function AdminPanel() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(null);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);


    useEffect(() => {
      const checkAdminStatus = async () => {
          if(status === "authenticated") {
             const res = await fetch(`/api/admin/check`, {
               method: "GET",
             });
           if (res.ok){
               const data = await res.json();
               setIsAdmin(data.isAdmin);
              }  else {
                console.error("Error checking the admin status");
            }
         }
       };
      checkAdminStatus();
    }, [status])

    useEffect(() => {
      const fetchCountriesAndCities = async () => {
          try {
             const [countriesRes, citiesRes] = await Promise.all([
                   fetch(`/api/countries`),
                   fetch(`/api/cities`),
               ]);

              if (countriesRes.ok && citiesRes.ok) {
                  const [countriesData, citiesData] = await Promise.all([
                      countriesRes.json(),
                    citiesRes.json()
                   ])
                   setCountries(countriesData);
                   setCities(citiesData);
            } else {
                 console.error("Failed to fetch countries and cities")
             }
       } catch (e) {
            console.error("There was an error while fetching the data", e)
       }
     };
    fetchCountriesAndCities();
  }, []);
    useEffect(() => {
      if (status === "unauthenticated") {
          router.push('/auth')
         } else if (status === "authenticated") {
             if(isAdmin === false){
                 router.push("/")
             }
         }
   },[status, router, isAdmin]);

  if (status === "loading" || isAdmin === null) {
        return <p>Loading...</p>;
  }


  if (status === "unauthenticated" || isAdmin === false ) {
     return null;
  }



  return (
    <div className="container mx-auto p-6 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <Navbar textColor={"text-gray-800"} blurredTextColor={"text-black"} />
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
           Admin Panel
      </h1>
        <AddCountry
         onCountryAdded={(newCountry) => setCountries([...countries, newCountry])}
       />
        <AddCity countries={countries} />
        <AddPackage countries={countries} cities={cities}/>
        <PackageList countries={countries} cities={cities} />
     </div>
   );
}