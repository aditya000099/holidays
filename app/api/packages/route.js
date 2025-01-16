  // app/api/packages/route.js
  import prisma from '@/prisma/client';
  import { NextResponse } from 'next/server';

   export async function POST(req) {
       try {
           const { title, description, price, durationDays, cityName } = await req.json();

           // Find the city ID by name
           const city = await prisma.city.findFirst({
               where: {
               name: cityName,
               }
           })

           if (!city) {
             return NextResponse.json({ message: `City with name '${cityName}' not found` }, {status: 404});
           }
          const newPackage = await prisma.package.create({
            data: {
                title,
                description,
                price,
                durationDays,
                cityId: city.id,
          },
      });
           return NextResponse.json(newPackage, {status: 200});
    } catch (error) {
          if (error) {
           if (error instanceof Error) {
               console.error("Error creating package:", { message: error.message, stack: error.stack });
           } else {
                console.error("Error creating package:", { error });
           }
        } else {
            console.error("Error creating package:", {error})
       }

           return NextResponse.json({ message: "Internal server error" }, { status: 500 });
       }
   }
   export async function GET(req) {
       try {
          const url = new URL(req.url);
        const cityId = url.searchParams.get("cityId");

           if (cityId) {
                const packages = await prisma.package.findMany({
                where: {
                   cityId: parseInt(cityId)
                  }
           });
          return NextResponse.json(packages, {status: 200})
          } else {
             const packages = await prisma.package.findMany();
           return NextResponse.json(packages, { status: 200 });
          }


     } catch (e) {
         console.error("Error getting packages:", { e });
          return NextResponse.json({ message: "Internal server error" }, { status: 500 });
     }
   }