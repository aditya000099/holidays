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
      cityName,
      images,
      highlights,
      inclusions,
      exclusions,
      itinerary,
    } = await req.json();

    // Find the city ID by name
    const city = await prisma.city.findFirst({
      where: {
        name: cityName,
      },
    });

    if (!city) {
      return NextResponse.json(
        { message: `City with name '${cityName}' not found` },
        { status: 404 }
      );
    }
    const priceNumber = Number(price);
    const durationDaysNumber = Number(durationDays);

    const newPackage = await prisma.package.create({
      data: {
        title,
        description,
        price: priceNumber,
        durationDays: durationDaysNumber,
        cityId: city.id,
        highlights: highlights || [],
        exclusions: exclusions || [],
        inclusions: inclusions || [],
        images: {
          create: images?.map((imageUrl) => ({ imageUrl: imageUrl })) || [],
        },
        itinerary: {
          create: itinerary?.map((item) => ({
            day: item.day,
            title: item.title,
            description: item.description,
            image: item.image,
          })),
        },
      },
    });

    return NextResponse.json(newPackage, { status: 200 });
  } catch (error) {
    if (error) {
      if (error instanceof Error) {
        console.error("Error creating package:", {
          message: error.message,
          stack: error.stack,
        });
      } else {
        console.error("Error creating package:", { error });
      }
    } else {
      console.error("Error creating package:", { error });
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const cityId = url.searchParams.get("cityId");
    const parsedCityId = cityId ? parseInt(cityId, 10) : undefined;

    if (parsedCityId) {
      const packages = await prisma.package.findMany({
        where: {
          cityId: parsedCityId,
        },
        include: {
          city: true,
          images: true,
          itinerary: true,
        },
      });
      return NextResponse.json(packages, { status: 200 });
    } else {
      const packages = await prisma.package.findMany({
        include: {
          city: true,
          images: true,
          itinerary: true,
        },
      });
      return NextResponse.json(packages, { status: 200 });
    }
  } catch (e) {
    console.error("Error getting packages:", { e });
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
