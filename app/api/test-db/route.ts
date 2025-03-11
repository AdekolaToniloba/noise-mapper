// app/api/test-db/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    await prisma.$connect();
    return NextResponse.json({ message: "Database connected" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    return NextResponse.json(
      { error: `Database connection failed: ${errorMessage}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
