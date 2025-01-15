// app/api/countries/route.js

import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, currency } = await req.json(); // Use req.json() to parse JSON
    const newCountry = await prisma.country.create({
      data: {
        name,
        currency,
      },
    });

    return NextResponse.json(newCountry, { status: 200 }); // Use NextResponse
  } catch (error) {
    console.error("Error creating country", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    ); // Use NextResponse
  }
}
export async function GET() {
  try {
    const countries = await prisma.country.findMany();
    return NextResponse.json(countries, { status: 200 });
  } catch (e) {
    console.log("Error getting countries:", { e });
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
