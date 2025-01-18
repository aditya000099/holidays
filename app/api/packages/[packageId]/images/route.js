// app/api/packages/[packageId]/images/route.js
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const { packageId } = await params;
    const { images } = await req.json();
    console.log("Images in /api/packages/[packageId]/images:", { images });
    const updatedPackage = await prisma.package.update({
      where: {
        id: parseInt(packageId),
      },
      data: {
        images: {
          deleteMany: {},
          create:
            images
              ?.filter((imageUrl) => imageUrl !== null)
              .map((imageUrl) => ({ imageUrl: imageUrl })) || [],
        },
      },
    });
    return NextResponse.json(updatedPackage, { status: 200 });
  } catch (error) {
    console.error("Error updating package images: ", { error });
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
