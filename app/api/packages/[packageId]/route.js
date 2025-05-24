// app/api/packages/[packageId]/route.js
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const { packageId } = params;
    const {
      title,
      description,
      price,
      durationDays,
      days,
      nights,
      highlights,
      inclusions,
      exclusions,
      itinerary,
    } = await req.json();

    // Filter out invalid itinerary items and ensure image is a string or null
    const validItinerary = itinerary
      ?.filter((item) => item.title && item.title.trim() !== "")
      .map((item) => ({
        day: item.day,
        title: item.title,
        description: item.description || null,
        // Ensure image is a string or null, not an object
        image: typeof item.image === "string" ? item.image : null,
      })) || [];

    // Update package with all fields
    const updatedPackage = await prisma.package.update({
      where: {
        id: parseInt(packageId),
      },
      data: {
        title,
        description,
        price,
        durationDays,
        days,
        nights,
        highlights: highlights?.filter((h) => h.trim() !== "") || [],
        inclusions: inclusions?.filter((i) => i.trim() !== "") || [],
        exclusions: exclusions?.filter((e) => e.trim() !== "") || [],
        // Images are handled separately in [packageId]/images/route.js
        // Update itinerary if provided
        ...(itinerary && {
          itinerary: {
            deleteMany: {},
            create: validItinerary,
          },
        }),
      },
    });

    return NextResponse.json(updatedPackage, { status: 200 });
  } catch (error) {
    console.error("Error updating package: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { packageId } = params;

    // Delete package and all related data (images, itinerary) will be deleted due to cascading
    await prisma.package.delete({
      where: {
        id: parseInt(packageId),
      },
    });

    return NextResponse.json(
      { message: "Package deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting package: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    const { packageId } = params;

    // Get package with all related data
    const travelPackage = await prisma.package.findUnique({
      where: {
        id: parseInt(packageId),
      },
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
    });

    if (!travelPackage) {
      return NextResponse.json(
        { message: "Package not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(travelPackage, { status: 200 });
  } catch (error) {
    console.error("Error fetching package: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
