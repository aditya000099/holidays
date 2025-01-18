"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";

export default function MyAccount() {
    const { data: session, status } = useSession();
      const router = useRouter();

   if (status === "loading") {
       return <p>Loading...</p>;
   }

   if (status === "unauthenticated") {
        return (
            <div className="container mx-auto p-6 sm:p-20 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                     My Account
                   </h1>
                <p className="text-gray-600">You are not logged in.</p>
               <button
                    onClick={() => router.push('/auth')}
                 className="bg-blue-500 hover:bg-blue-400 text-white p-2 rounded mt-4"
              >
                 Log In
                </button>
         </div>
       );
   }

    return (
        <div>
            <Navbar textColor={"text-gray-800"} blurredTextColor={"text-black"} />
       
         <div className="container mx-auto p-6 sm:p-20">
         
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
              My Account
            </h1>
              <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
                <p className="text-gray-700 mb-2">
                     <span className="font-semibold">Email:</span> {session?.user?.email}
                </p>
                    <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Name:</span> {session?.user?.name}
                    </p>
                <p className="text-gray-700 mb-2">
                     <span className="font-semibold">Id:</span> {session?.user?.id}
                     </p>
                     <button
                        onClick={() => signOut()}
                     className="bg-red-500 hover:bg-red-400 text-white p-2 rounded mt-4"
                  >
                       Sign Out
                   </button>
              </div>
        </div>
        </div>
    );
}