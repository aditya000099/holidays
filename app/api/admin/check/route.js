// /app/api/admin/check/route.js
import prisma from '@/prisma/client'
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/route';


export async function GET(req, res) {
   try {
          const session = await getServerSession(authOptions)
          if (session?.user?.email){
              const user = await prisma.user.findUnique({
                  where:{
                      email: session.user.email,
                   },
                })
             return NextResponse.json({isAdmin: user?.isAdmin || false}, {status: 200})
           } else {
             return NextResponse.json({isAdmin: false}, {status: 200});
           }
       } catch (e) {
            console.error("Error validating user", e)
          return NextResponse.json({message: "Something went wrong"}, {status: 500})
      }
  }