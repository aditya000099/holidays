// app/api/packages/route.js
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      title,
      description,
      price,
      durationDays,
      days,
      nights,
      cityName,
      images,
      highlights,
      inclusions,
      exclusions,
      itinerary,
    } = await req.json();

    // Find city by name
    const city = await prisma.city.findFirst({
      where: {
        name: cityName,
      },
    });

    if (!city) {
      return NextResponse.json({ message: "City not found" }, { status: 404 });
    }

    // Filter out invalid itinerary items and ensure image is a string or null
    const validItinerary =
      itinerary
        ?.filter((item) => item.title && item.title.trim() !== "")
        .map((item) => ({
          day: item.day,
          title: item.title,
          description: item.description || null,
          // Ensure image is a string or null, not an object
          image: typeof item.image === "string" ? item.image : null,
        })) || [];

    // Create package with all fields from the schema
    const newPackage = await prisma.package.create({
      data: {
        title,
        description,
        price,
        durationDays,
        days,
        nights,
        cityId: city.id,
        highlights: highlights?.filter((h) => h.trim() !== "") || [],
        inclusions: inclusions?.filter((i) => i.trim() !== "") || [],
        exclusions: exclusions?.filter((e) => e.trim() !== "") || [],
        images: {
          create: images?.map((imageUrl) => ({ imageUrl })) || [],
        },
        itinerary: {
          create: validItinerary,
        },
      },
    });

    return NextResponse.json(newPackage, { status: 201 });
  } catch (error) {
    console.error("Error creating package: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      include: {
        city: {
          include: {
            country: true,
          },
        },
        images: true,
        itinerary: {
          orderBy: {
            day: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(packages, { status: 200 });
  } catch (error) {
    console.error("Error fetching packages: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
