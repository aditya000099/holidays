// app/api/packages/[packageId]/route.js
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const { packageId } = await params;
    const { title, description, price, durationDays, days, nights } =
      await req.json();

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
      },
    });
    return NextResponse.json(updatedPackage, { status: 200 });
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function DELETE(req, { params }) {
  try {
    const { packageId } = await params;
    await prisma.package.delete({
      where: {
        id: parseInt(packageId),
      },
    });
    return NextResponse.json(
      { message: "Package deleted succesfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
export async function GET(req, { params }) {
  try {
    const { packageId } = await params;
    const pkg = await prisma.package.findUnique({
      where: {
        id: parseInt(packageId),
      },
      include: {
        city: true,
        images: true,
        itinerary: true,
      },
    });
    if (!pkg) {
      return NextResponse.json(
        { message: `Package with id '${packageId}' not found` },
        { status: 404 }
      );
    }
    return NextResponse.json(pkg, { status: 200 });
  } catch (error) {
    console.error("Error fetching a specific package:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
