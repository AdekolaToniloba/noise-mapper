// app/api/noise/route.ts
import { NextResponse } from "next/server";
import { NoiseReport } from "../../../types";
import { v4 as uuidv4 } from "uuid";

// In-memory array for MVP (would be replaced by a database in production)
// Dummy noise reports for Lagos, Nigeria
let noiseReports: NoiseReport[] = [
  {
    id: uuidv4(),
    lat: 6.5244, // Central Lagos (Lagos Island)
    lng: 3.3792,
    decibels: 85, // Busy urban area (e.g., traffic, markets)
    timestamp: new Date("2025-03-08T10:30:00Z"), // Recent timestamp
  },
  {
    id: uuidv4(),
    lat: 6.6018, // Ikeja (near airport)
    lng: 3.3515,
    decibels: 120, // High noise near airport or industrial area
    timestamp: new Date("2025-03-08T12:15:00Z"),
  },
  {
    id: uuidv4(),
    lat: 6.4412, // Victoria Island (commercial hub)
    lng: 3.4179,
    decibels: 113, // Moderate noise in a business district
    timestamp: new Date("2025-03-08T14:00:00Z"),
  },
  {
    id: uuidv4(),
    lat: 6.5833, // Yaba (busy student/tech area)
    lng: 3.3833,
    decibels: 40, // Noise from traffic and activity
    timestamp: new Date("2025-03-08T16:45:00Z"),
  },
  {
    id: uuidv4(),
    lat: 6.4969, // Surulere (residential with some bustle)
    lng: 3.3581,
    decibels: 60, // Quieter residential noise
    timestamp: new Date("2025-03-09T09:00:00Z"),
  },
];

// GET handler to fetch all noise reports
export async function GET() {
  return NextResponse.json(noiseReports);
}

// POST handler to add a new noise report
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.lat || !body.lng || !body.decibels) {
      return NextResponse.json(
        {
          error: "Missing required fields: lat, lng, and decibels are required",
        },
        { status: 400 }
      );
    }

    // Create new noise report
    const newReport: NoiseReport = {
      id: uuidv4(),
      lat: parseFloat(body.lat),
      lng: parseFloat(body.lng),
      decibels: parseFloat(body.decibels),
      timestamp: new Date(),
    };

    // Add to our in-memory array
    noiseReports.push(newReport);

    // For demo purposes, limit the number of reports we keep
    if (noiseReports.length > 100) {
      noiseReports = noiseReports.slice(-100);
    }

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create noise report" },
      { status: 500 }
    );
  }
}
