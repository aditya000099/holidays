//  /app/api/login/route.js
import prisma from '@/prisma/client'
import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';

export async function POST(req) {
    try {
        const {email, password} = await req.json();
        console.log("Login API endpoint called", {email, password})
            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            })

        if (!user) {
          console.log("User does not exist")
            return NextResponse.json({message: "User not found"}, {status: 404})
        }
        const isPasswordMatch = await compare(password, user.password)

        if (!isPasswordMatch) {
           console.log("Password does not match")
            return NextResponse.json({message: "Invalid credentials"}, {status: 401})
        }
          console.log("User is valid", {user})
          console.log("Admin hai kya?", user.isAdmin)
         return NextResponse.json({id: user.id, email: user.email, isAdmin: user.isAdmin}, {status: 200})

    } catch (e) {
         console.log("Error while verifying credentials", {e})
       return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}