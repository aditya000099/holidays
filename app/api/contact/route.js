// /app/api/contact/route.js
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      name,
      mobile,
      email,
      tripDuration,
      arrivalDate,
      travelingFrom,
      hotelCategory,
      guests,
      specialRequirements,
      packageId,
    } = await req.json();
    const newContact = await prisma.contactForm.create({
      data: {
        name,
        mobile,
        email,
        tripDuration,
        arrivalDate,
        travelingFrom,
        hotelCategory,
        guests,
        specialRequirements,
        packageId,
      },
    });
    return NextResponse.json(newContact, { status: 200 });
  } catch (e) {
    console.error("Error while creating contact:", e);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const contactForms = await prisma.contactForm.findMany({
      include: {
        package: {
          include: {
            city: {
              include: {
                country: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(contactForms, { status: 200 });
  } catch (error) {
    console.error("Error getting Contact Forms:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
