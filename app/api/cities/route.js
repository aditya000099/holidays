// app/api/cities/route.js
import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { name, countryName } = await req.json();

        // Find the country ID by name
        const country = await prisma.country.findUnique({
            where: {
                name: countryName,
            },
        });

        if (!country) {
            return NextResponse.json({ message: `Country with name '${countryName}' not found.` }, { status: 404 });
        }

        // Create the new city
        const newCity = await prisma.city.create({
            data: {
                name,
                countryId: country.id,
            },
        });
        return NextResponse.json(newCity, { status: 200 });
    } catch (error) {
         console.error("Error creating city:", error);
            return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}


export async function GET(req) {
    try {
      const url = new URL(req.url);
     const countryId = url.searchParams.get("countryId");
        if (countryId) {
            const cities = await prisma.city.findMany({
               where: {
                  countryId: parseInt(countryId)
                }
            });
           return NextResponse.json(cities, { status: 200 });
       } else {
         const cities = await prisma.city.findMany();
           return NextResponse.json(cities, { status: 200 });
       }
    } catch (e) {
        console.error("Error getting cities:", { e });
           return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}