// app/api/noise/route.ts
import { NextResponse } from "next/server";
import { NoiseReport } from "../../../types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all reports
export async function GET() {
  try {
    const reports = await prisma.noiseReport.findMany({
      orderBy: { timestamp: "desc" },
      take: 1000, // Limit to latest 1000 reports
    });

    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch noise data" },
      { status: 500 }
    );
  }
}

// POST new report
export async function POST(request: Request) {
  try {
    const body: NoiseReport = await request.json();

    // Validate the inputs
    if (
      !body.lat ||
      !body.lng ||
      !body.decibels ||
      Math.abs(body.lat) > 90 ||
      Math.abs(body.lng) > 180 ||
      body.decibels < 0 ||
      body.decibels > 150
    ) {
      return NextResponse.json(
        { error: "Invalid report data" },
        { status: 400 }
      );
    }

    // Create report
    const newReport = await prisma.noiseReport.create({
      data: {
        lat: body.lat,
        lng: body.lng,
        decibels: body.decibels,
      },
    });

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save report" },
      { status: 500 }
    );
  }
}
