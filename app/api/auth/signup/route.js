// /app/api/auth/signup/route.js
import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req){
    try {
        const {email, password, firstName, lastName} = await req.json();
         const existingUser = await prisma.user.findUnique({
            where: {
                email
           }
       });

         if(existingUser){
               return NextResponse.json({message: "User already exists"}, {status: 400})
        }

          // const hashedPassword = await hash(password, 12);

          const newUser = await prisma.user.create({
               data: {
                 email,
                  password: password,
                 firstName,
               lastName
           }
        });

        return NextResponse.json({message: "Account created successfully!"}, {status: 200})
    } catch (error) {
      console.log("Error while creating user", {error});
        return NextResponse.json({message: "Something went wrong."}, {status: 500});
    }
};