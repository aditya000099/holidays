"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { hash } from "bcryptjs";

export default function Auth() {
    const { data: session, status } = useSession();
     const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
     const [isSignup, setIsSignup] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSignup) {
        try {
             const hashedPassword = await hash(password, 12);
              const res = await fetch('/api/auth/signup', {
                  method: "POST",
                  body: JSON.stringify({email, password: hashedPassword, firstName, lastName}),
                    headers: {
                      'Content-Type': 'application/json'
                  }
             })
             const data = await res.json();
             if (res.ok){
                // console.log("Successfully created account", {data})
                const res2 = await signIn("credentials", {email, password, redirect: false})
                //  console.log("Result after login attempt ", {res2})
                 if (res2?.error){
                   setError(res2.error)
                 }
                 else {
                    // console.log("Successfully logged in",{res2})
                     router.push("/");
                 }
                } else {
                setError(data.message)
             }
        } catch (error) {
           console.log("Error during sign up ", {error})
        setError("Something went wrong");
        }
        } else {
           const res = await signIn("credentials", {
              email, password, redirect: false
           });
            // console.log("Result after login attempt ", {res})
           if (res?.error) {
              setError(res.error);
            } else {
                router.push("/");
           }
       }
     };

    if (status === "loading") {
        return <p>Loading ...</p>;
    }

    if (status === "authenticated") {
        return (
            <div className="text-center">
                <p className="mb-4">Signed in as {session?.user?.email}</p>
                <button
                    onClick={() => signOut()}
                    className="bg-red-600 hover:bg-red-500 text-white p-2 rounded"
                >
                    Sign Out
                </button>
            </div>
        );
    }
    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
           {isSignup ? 'Sign Up' : 'Login'}
           </h2>
            {error && (
             <p className="text-red-500 mb-4 text-center">Error: {error}</p>
           )}
           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               {isSignup && (
                  <>
                    <input
                      type="text"
                     placeholder="First Name"
                    value={firstName}
                     onChange={(e) => setFirstName(e.target.value)}
                    className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   />
                    <input
                       type="text"
                        placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                     className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   />
                   </>
               )}

                <input
                 type="email"
                 placeholder="Email"
                  value={email}
                 onChange={(e) => setEmail(e.target.value)}
               className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
               <input
                type="password"
                 placeholder="Password"
                 value={password}
                onChange={(e) => setPassword(e.target.value)}
               className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-400 text-white p-2 rounded"
                 >
                   {isSignup ? "Sign Up" : "Log In"}
                </button>
           </form>
            <button onClick={() => setIsSignup(!isSignup)} className="text-blue-500 hover:text-blue-400 mt-2 block mx-auto" >
             {isSignup ? "Already have an account? Log In" : "Create an Account"}
            </button>
         </div>
    );
}