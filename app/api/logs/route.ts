// app/api/logs/route.ts - Fixed version
import { NextRequest, NextResponse } from "next/server";
import { getLogs, getLogsCount } from "@/lib/logger";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get("level") as "info" | "warn" | "error" | null;
    const limit = parseInt(searchParams.get("limit") || "50");

    const logs = getLogs(level || undefined, limit);
    const counts = getLogsCount();

    return NextResponse.json({
      logs,
      counts,
      filters: { level, limit },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to retrieve logs",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
