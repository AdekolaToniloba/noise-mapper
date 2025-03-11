import { NextResponse } from "next/server";
import { NoiseReport } from "../../../types";
import { PrismaClient } from "@prisma/client";

// Singleton Prisma client
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function GET() {
  try {
    const reports = await prisma.noiseReport.findMany({
      orderBy: { timestamp: "desc" },
      take: 1000,
    });
    return NextResponse.json(reports);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch noise data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: NoiseReport = await request.json();

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

    const newReport = await prisma.noiseReport.create({
      data: {
        lat: body.lat,
        lng: body.lng,
        decibels: body.decibels,
      },
    });

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to save report" },
      { status: 500 }
    );
  }
}
